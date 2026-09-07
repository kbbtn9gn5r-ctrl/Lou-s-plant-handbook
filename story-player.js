(function () {
  let currentButton = null;
  let storyVoice = null;
  let playbackToken = 0;
  let activeUtterances = [];

  function availableEnglishVoices() {
    return window.speechSynthesis
      .getVoices()
      .filter((voice) => /^en/i.test(voice.lang));
  }

  function savedVoice() {
    try {
      return window.localStorage.getItem("boomerTrixieVoice") || "";
    } catch (_) {
      return "";
    }
  }

  function saveVoice(value) {
    try {
      if (value) window.localStorage.setItem("boomerTrixieVoice", value);
      else window.localStorage.removeItem("boomerTrixieVoice");
    } catch (_) {}
  }

  function chooseStoryVoice() {
    const selected = savedVoice();
    const voices = availableEnglishVoices();
    storyVoice = selected
      ? voices.find(
          (voice) => voice.voiceURI === selected || voice.name === selected,
        ) || null
      : null;
  }

  function populateStoryVoices() {
    const menu = document.getElementById("story-voice");
    if (!menu) {
      chooseStoryVoice();
      return;
    }

    const voices = availableEnglishVoices();
    const selected = savedVoice();
    menu.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "iPhone Default";
    menu.appendChild(defaultOption);

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.voiceURI;
      option.textContent = `${voice.name} (${voice.lang})`;
      menu.appendChild(option);
    });

    const matchingVoice = voices.find(
      (voice) => voice.voiceURI === selected || voice.name === selected,
    );
    menu.value = matchingVoice ? matchingVoice.voiceURI : "";
    chooseStoryVoice();
  }

  function storyParts(id) {
    let title;
    let paragraphs;

    if (typeof id === "string") {
      const article = document.getElementById(id);
      title = article.querySelector("h2").textContent;
      paragraphs = Array.from(
        article.querySelectorAll(".full-story p"),
        (paragraph) => paragraph.textContent,
      );
    } else {
      title = document.querySelector("h1").textContent;
      paragraphs = Array.from(
        document.querySelectorAll(".story p"),
        (paragraph) => paragraph.textContent,
      );
    }

    return [
      title,
      ...paragraphs.flatMap(
        (text) => text.match(/[^.!?]+(?:[.!?]+|$)/g) || [text],
      ),
    ]
      .map((text) => text.trim())
      .filter(Boolean);
  }

  function delivery(text) {
    let rate = 0.9;
    let pitch = 1.03;

    if (/\?$/.test(text)) {
      rate = 0.88;
      pitch = 1.08;
    }
    if (/!$/.test(text) || /\b(Vroom|WHOOSH|BOOMER)\b/.test(text)) {
      rate = 0.97;
      pitch = 1.1;
    }
    if (/\b(don't|trouble|easy,? Boomer|we don't chase)\b/i.test(text)) {
      rate = 0.84;
      pitch = 0.99;
    }
    if (/\b(asleep|quiet|warm|sighed|smiled|rested|soft)\b/i.test(text)) {
      rate = 0.82;
      pitch = 1;
    }

    return { rate, pitch };
  }

  function finishStory(token, button) {
    if (token !== playbackToken || currentButton !== button) return;
    button.textContent = "▶ Play Story";
    button.setAttribute("aria-pressed", "false");
    currentButton = null;
    activeUtterances = [];
  }

  function stopStory(recheck = true) {
    const button = currentButton;
    currentButton = null;
    playbackToken += 1;
    activeUtterances = [];

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      if (recheck) {
        window.setTimeout(() => {
          if (!currentButton) window.speechSynthesis.cancel();
        }, 60);
      }
    }

    if (button) {
      button.textContent = "▶ Play Story";
      button.setAttribute("aria-pressed", "false");
    }
  }

  window.readStory = function (idOrButton, suppliedButton) {
    if (!("speechSynthesis" in window)) {
      window.alert("Read-aloud is not supported in this browser.");
      return;
    }

    const button = suppliedButton || idOrButton;
    const storyId = suppliedButton ? idOrButton : null;

    if (currentButton === button) {
      stopStory();
      return;
    }

    stopStory(false);
    chooseStoryVoice();
    const token = ++playbackToken;
    const parts = storyParts(storyId);

    currentButton = button;
    button.textContent = "■ Stop Story";
    button.setAttribute("aria-pressed", "true");

    activeUtterances = parts.map((text, index) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const tone = delivery(text);
      if (storyVoice) utterance.voice = storyVoice;
      utterance.rate = tone.rate;
      utterance.pitch = tone.pitch;
      utterance.volume = 1;
      if (index === parts.length - 1) {
        utterance.onend = () => finishStory(token, button);
        utterance.onerror = () => finishStory(token, button);
      }
      return utterance;
    });

    activeUtterances.forEach((utterance) =>
      window.speechSynthesis.speak(utterance),
    );
  };

  window.toggleStory = function (id, button) {
    const story = document.getElementById(id).querySelector(".full-story");
    const opened = story.classList.toggle("open");
    button.textContent = opened ? "📕 Hide Story" : "📖 Read Story";
    if (opened) story.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  window.changeStoryVoice = function (value) {
    stopStory(false);
    saveVoice(value);
    chooseStoryVoice();
  };

  window.previewStoryVoice = function () {
    if (!("speechSynthesis" in window)) return;
    stopStory(false);
    chooseStoryVoice();
    const sample = new SpeechSynthesisUtterance(
      "Hello, Lou. This is how I will tell the Boomer and Trixie stories.",
    );
    if (storyVoice) sample.voice = storyVoice;
    sample.rate = 0.9;
    sample.pitch = 1.03;
    window.speechSynthesis.speak(sample);
  };

  if ("speechSynthesis" in window) {
    populateStoryVoices();
    window.speechSynthesis.onvoiceschanged = populateStoryVoices;
    window.setTimeout(populateStoryVoices, 250);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && currentButton) stopStory();
  });
  window.addEventListener("pagehide", () => {
    if (currentButton) stopStory();
  });
})();

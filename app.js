const plants = [{"name": "Pumpkin", "category": "Vegetables", "icon": "\ud83c\udf83", "summary": "Full sun, steady moisture, and room to spread.", "care": "Feed with Tomato-Tone or another vegetable fertilizer. Watch leaves for cucumber beetles, squash bugs, and eggs."}, {"name": "Hubbard Squash", "category": "Vegetables", "icon": "\ud83c\udf3f", "summary": "Long-season winter squash with vigorous vines.", "care": "Keep evenly watered, mulch the soil, and monitor for squash pests."}, {"name": "Zucchini", "category": "Vegetables", "icon": "\ud83e\udd52", "summary": "Fast-growing summer squash.", "care": "Harvest young and check stems and leaf undersides regularly for pests."}, {"name": "Tomato", "category": "Vegetables", "icon": "\ud83c\udf45", "summary": "Warm-season crop that benefits from consistent feeding.", "care": "Use Tomato-Tone according to the label and water deeply at soil level."}, {"name": "King of the North Pepper", "category": "Vegetables", "icon": "\ud83e\uded1", "summary": "A dependable bell pepper for northern gardens.", "care": "Provide warmth, full sun, and even moisture. Avoid overfeeding with nitrogen."}, {"name": "Potato", "category": "Vegetables", "icon": "\ud83e\udd54", "summary": "Hill soil around stems as plants grow.", "care": "Harvest new potatoes after flowering or wait for mature potatoes after tops die back."}, {"name": "Garlic", "category": "Vegetables", "icon": "\ud83e\uddc4", "summary": "Hardneck garlic suited to Maine gardens.", "care": "Harvest when several lower leaves brown while upper leaves remain green."}, {"name": "Dahlia", "category": "Flowers", "icon": "\ud83c\udf38", "summary": "Bold summer flowers that benefit from staking.", "care": "Use a low-nitrogen bloom fertilizer, deadhead regularly, and dig tubers before hard frost."}, {"name": "Peony", "category": "Flowers", "icon": "\ud83c\udf3a", "summary": "Long-lived perennial with spring blooms.", "care": "Plant eyes shallowly, support heavy flowers, and cut foliage after frost."}, {"name": "Weigela", "category": "Flowers", "icon": "\ud83c\udf37", "summary": "Flowering shrub that blooms on older wood.", "care": "Prune just after flowering so next year's buds have time to develop."}, {"name": "Blueberry", "category": "Fruits & Berries", "icon": "\ud83e\uded0", "summary": "Acid-loving shrub with shallow roots.", "care": "Mulch with acidic organic material and keep soil evenly moist, especially after transplanting."}, {"name": "Honeyberry", "category": "Fruits & Berries", "icon": "\ud83e\uded0", "summary": "Cold-hardy early fruiting shrub.", "care": "Plant compatible varieties for pollination and water young transplants consistently."}, {"name": "Blackberry", "category": "Fruits & Berries", "icon": "\ud83c\udf47", "summary": "Fruit-bearing canes that need annual pruning.", "care": "Remove canes that have fruited and train new canes for the next crop."}, {"name": "Jade Plant", "category": "Indoor Plants", "icon": "\ud83e\udeb4", "summary": "Succulent houseplant that prefers bright light.", "care": "Allow soil to dry between waterings and use a fast-draining potting mix."}];
const grid = document.getElementById('plant-grid');
const search = document.getElementById('search');
const buttons = [...document.querySelectorAll('.categories button')];
let category = 'All';

function render() {
  const q = search.value.trim().toLowerCase();
  const filtered = plants.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.care.toLowerCase().includes(q))
  );
  grid.innerHTML = filtered.map(p => `
    <article class="plant-card">
      <div class="icon">${p.icon}</div>
      <div class="tag">${p.category}</div>
      <h3>${p.name}</h3>
      <p>${p.summary}</p>
      <details><summary>Care notes</summary><p>${p.care}</p></details>
    </article>`).join('') || '<p>No plants found.</p>';
}
search.addEventListener('input', render);
buttons.forEach(b => b.addEventListener('click', () => {
  buttons.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  category = b.dataset.category;
  render();
}));
render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

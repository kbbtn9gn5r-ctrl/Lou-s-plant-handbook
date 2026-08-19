// Lou's Garden Guide — runtime repairs for the 2026 photo journal.
(function () {
  'use strict';
  const data = window.LOUGARDEN_JOURNAL_DATA;
  if (!data || !Array.isArray(data.photoJournal)) return;

  data.version = '4.3';
  data.updated = 'August 19, 2026';

  const repairs = {
    'jade-update-mother-01.jpg': {
      image: 'jade-mother-05.jpg',
      alt: 'Family jade mother plant after pruning',
      caption: 'Family jade mother plant after the June 29 pruning.'
    },
    'jade-update-mother-02.jpg': {
      image: 'jade-mother-06.jpg',
      alt: 'Front view of the jade mother plant after pruning',
      caption: 'Front view of the family jade after the June 29 pruning.'
    },
    'jade-update-mother-03.jpg': {
      image: 'jade-mother-07.jpg',
      alt: 'Side view of the jade mother plant after pruning',
      caption: 'Side view documenting the jade plant structure after pruning.'
    },
    'jade-update-cuttings-01.jpg': {
      image: 'jade-mother-09.jpg',
      alt: 'Jade cuttings saved for propagation',
      caption: 'Healthy jade stems and leaves saved for propagation.'
    },
    'jade-update-cuttings-02.jpg': {
      image: 'jade-plant-2.jpg',
      alt: 'Family jade propagation record',
      caption: 'Family jade propagation record for the 2026 project.'
    }
  };

  data.photoJournal.forEach(section => {
    if (!Array.isArray(section.photos)) return;
    section.photos.forEach(photo => {
      const repair = repairs[photo.image];
      if (!repair) return;
      photo.image = repair.image;
      photo.alt = repair.alt;
      photo.caption = repair.caption;
    });
  });
})();

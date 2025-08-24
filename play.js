/* =========================================================
   LUNCHTIME IN CHINESE — MAIN SCRIPT
   Features:
   1. Vocabulary Flashcards
        a. Matching Game (drag-and-drop)
   2. Sentence Builder
   ========================================================= */


/* =========================================================
   1. VOCABULARY FLASHCARDS & MATCHING GAME
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- DOM ELEMENTS ---------- */
  const cardsContainer = document.querySelector('.cards-container');
  const testButton = document.getElementById('test-button');
  const resetButton = document.getElementById('reset-button');
  const matchingGame = document.getElementById('matching-game');
  const flashcards = document.getElementById('flashcards');
  const completionPopup = document.getElementById('completion-popup');
  const popupBackBtn = document.getElementById('popup-back-btn');
  const sentencesResetBtn = document.getElementById('sentences-reset-button');
  const sentenceTeacher = document.getElementById('sentence-activity');

  /* ---------- VOCABULARY DATA ---------- */
  const vocabulary = [
    { chinese: "吃", english: "to eat", front: 'play-flashcards/vocab-eat-side1.png', back: 'play-flashcards/vocab-eat-side2.png', bilingual: 'play-flashcards/vocab-eat-side1.png' },
    { chinese: "去", english: "to go", front: 'play-flashcards/vocab-go-side1.png', back: 'play-flashcards/vocab-go-side2.png', bilingual: 'play-flashcards/vocab-go-side1.png' },
    { chinese: "有", english: "to have", front: 'play-flashcards/vocab-have-side1.png', back: 'play-flashcards/vocab-have-side2.png', bilingual: 'play-flashcards/vocab-have-side1.png' },
    { chinese: "打", english: "to hit", front: 'play-flashcards/vocab-hit-side1.png', back: 'play-flashcards/vocab-hit-side2.png', bilingual: 'play-flashcards/vocab-hit-side1.png' },
    { chinese: "喜欢", english: "to like", front: 'play-flashcards/vocab-like-side1.png', back: 'play-flashcards/vocab-like-side2.png', bilingual: 'play-flashcards/vocab-like-side1.png' },
    { chinese: "提", english: "to kick", front: 'play-flashcards/vocab-kick-side1.png', back: 'play-flashcards/vocab-kick-side2.png', bilingual: 'play-flashcards/vocab-kick-side1.png' },
    { chinese: "看", english: "to read", front: 'play-flashcards/vocab-read-side1.png', back: 'play-flashcards/vocab-read-side2.png', bilingual: 'play-flashcards/vocab-read-side1.png' },
    { chinese: "跑步", english: "to run", front: 'play-flashcards/vocab-run-side1.png', back: 'play-flashcards/vocab-run-side2.png', bilingual: 'play-flashcards/vocab-run-side1.png' }
  ];

  /* ---------- CREATE FLASHCARDS ---------- */
  vocabulary.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.index = index;

    cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${card.front}" alt="Card Front">
                    <button class="card-audio-btn" data-word="${card.chinese}">🔊</button>
                </div>
                <div class="card-back">
                    <img src="${card.back}" alt="Card Back">
                    <button class="card-audio-btn" data-word="${card.chinese}">🔊</button>
                </div>
            </div>
        `;

    // Flip on click
    cardElement.addEventListener('click', function () {
      this.classList.toggle('flipped');
    });

    cardsContainer.appendChild(cardElement);
  });

  // Play pronunciation when audio button clicked
  document.querySelectorAll('.card-audio-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      speakChinese(this.dataset.word);
    });
  });

  /* ---------- BUTTON EVENT HANDLERS ---------- */
  testButton.addEventListener('click', () => {
    flashcards.style.display = 'none';
    matchingGame.style.display = 'block';
    setupMatchingGame();
  });

  resetButton.addEventListener('click', () => {
    matchingGame.style.display = 'none';
    flashcards.style.display = 'block';
  });

  popupBackBtn.addEventListener('click', () => {
    completionPopup.style.display = 'none';
    matchingGame.style.display = 'none';
    flashcards.style.display = 'block';
  });

  /* ---------- MATCHING GAME SETUP ---------- */
  function setupMatchingGame() {
    document.querySelector('.drag-characters').innerHTML = '';
    document.querySelector('.english-cards-grid').innerHTML = '';

    // Shuffle vocab
    const shuffledVocab = [...vocabulary].sort(() => 0.5 - Math.random());

    // Create draggable characters
    shuffledVocab.forEach(item => {
      const charElement = document.createElement('div');
      charElement.className = 'drag-character';
      charElement.draggable = true;
      charElement.dataset.word = item.chinese;
      charElement.textContent = item.chinese;
      document.querySelector('.drag-characters').appendChild(charElement);
    });

    // Create English cards
    shuffledVocab.forEach(item => {
      const cardElement = document.createElement('div');
      cardElement.className = 'english-card';
      cardElement.dataset.meaning = item.english;
      cardElement.dataset.chinese = item.chinese;
      cardElement.dataset.bilingual = item.bilingual;

      const img = document.createElement('img');
      img.src = item.back;
      img.alt = item.english;
      cardElement.appendChild(img);

      document.querySelector('.english-cards-grid').appendChild(cardElement);
    });

    setupDragAndDrop();
  }

  /* ---------- DRAG & DROP LOGIC ---------- */
  function setupDragAndDrop() {
    const dragChars = document.querySelectorAll('.drag-character');
    const englishCards = document.querySelectorAll('.english-card');

    dragChars.forEach(char => {
      char.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', this.dataset.word);
        this.style.opacity = '0.5';
      });
      char.addEventListener('dragend', function () {
        this.style.opacity = '1';
      });
    });

    englishCards.forEach(card => {
      card.addEventListener('dragover', e => {
        e.preventDefault();
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
      });

      card.addEventListener('dragleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
      });

      card.addEventListener('drop', e => {
        e.preventDefault();
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';

        const chineseWord = e.dataTransfer.getData('text/plain');
        const vocabItem = vocabulary.find(v => v.chinese === chineseWord);

        if (card.dataset.meaning === vocabItem.english) {
          card.classList.add('correct-match');
          setTimeout(() => card.classList.remove('correct-match'), 500);

          // Replace with bilingual card
          const bilingualCard = document.createElement('div');
          bilingualCard.className = 'bilingual-card';
          bilingualCard.innerHTML = `
                        <img src="${vocabItem.bilingual}" alt="${vocabItem.english}">
                        <button class="answer-audio-btn" onclick="speakChinese('${vocabItem.chinese}')">🔊</button>
                    `;
          bilingualCard.style.opacity = '0';
          card.parentNode.replaceChild(bilingualCard, card);
          setTimeout(() => bilingualCard.style.opacity = '1', 10);

          // Hide matched character
          document.querySelector(`.drag-character[data-word="${chineseWord}"]`).style.display = 'none';

          checkGameCompletion();
        } else {
          card.classList.add('incorrect-match');
          setTimeout(() => card.classList.remove('incorrect-match'), 500);
        }
      });
    });
  }

  /* ---------- CHECK GAME COMPLETION ---------- */
  function checkGameCompletion() {
    const remaining = document.querySelectorAll('.drag-character:not([style*="none"])');
    if (remaining.length === 0) {
      setTimeout(() => {
        completionPopup.style.display = 'flex';
      }, 500);
    }
  }
});

/* ---------- TEXT-TO-SPEECH FUNCTION ---------- */
function speakChinese(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech not supported in your browser");
  }
}


/* =========================================================
   SENTENCE BUILDER AND SCRAMBLED SENTENCES (INTEGRATED)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  /* ---------- DOM ELEMENTS ---------- */
  const gameMask = document.querySelector('.game-mask');
  const startSentenceGameBtn = document.getElementById('start-sentence-game');
  const startScrambledGameBtn = document.getElementById('start-scrambled-game-alt');
  const sentenceBuilderArea = document.getElementById('sentence-builder-area');
  const scrambledSentencesArea = document.getElementById('scrambled-sentences-area');
  const resetSentenceBuilderBtn = document.getElementById('reset-sentence-builder-button');
  const resetScrambledBtn = document.getElementById('reset-scrambled-button');
  const closePopupButton = document.getElementById('close-popup');

  /* ---------- SENTENCE DATA ---------- */
  const sentences = [
    { chinese: ["现在", "是", "午饭时间。"], english: "It's lunchtime now." },
    { chinese: ["我", "跑步。"], english: "I run." },
    { chinese: ["我", "喜欢", "跑步。"], english: "I like to run." },
    { chinese: ["我", "想", "跑步。"], english: "I would like to run." },
    { chinese: ["我", "踢足球。"], english: "I play soccer." },
    { chinese: ["我", "喜欢", "踢足球。"], english: "I like to play soccer." },
    { chinese: ["我", "想", "踢足球。"], english: "I would like to play soccer." },
    { chinese: ["我", "去。"], english: "I go." },
    { chinese: ["我", "喜欢", "去", "图书馆。"], english: "I like to go to the library." },
    { chinese: ["我", "想", "去", "涂刷管。"], english: "I would like to go to the library." },
    { chinese: ["我", "打篮球。"], english: "I play basketball." },
    { chinese: ["我", "喜欢", "打篮球。"], english: "I like to play basketball." },
    { chinese: ["我", "想", "打篮球。"], english: "I would like to play basketball." },
    { chinese: ["我", "看书。"], english: "I read books." },
    { chinese: ["我", "喜欢", "看书。"], english: "I like to read books." },
    { chinese: ["我", "想", "看书。"], english: "I would like to read books." },
  ];

  /* ---------- SCRAMBLED SENTENCES DATA ---------- */
const scrambledData = [
    { english: "It's lunchtime now.", chinese: ["现在", "是", "午饭时间"], pinyin: ["xiànzài", "shì", "wǔfàn shíjiān"], englishParts: ["It's", "lunchtime", "now"] },
    { english: "I run.", chinese: ["我", "跑步"], pinyin: ["wǒ", "pǎobù"], englishParts: ["I", "run"] },
    { english: "I like to run.", chinese: ["我", "喜欢", "跑步"], pinyin: ["wǒ", "xǐhuān", "pǎobù"], englishParts: ["I", "like to", "run"] },
    { english: "I would like to run.", chinese: ["我", "想", "跑步"], pinyin: ["wǒ", "xiǎng", "pǎobù"], englishParts: ["I", "would like to", "run"] },
    { english: "I play soccer.", chinese: ["我", "踢足球"], pinyin: ["wǒ", "tī zúqiú."], englishParts: ["I", "play soccer"] },
    { english: "I like to play soccer.", chinese: ["我", "喜欢", "踢足球"], pinyin: ["wǒ", "xǐhuān", "tī zúqiú"], englishParts: ["I", "like to", "play soccer"] },
    { english: "I would like to play soccer.", chinese: ["我", "想", "踢足球"], pinyin: ["wǒ", "xiǎng", "tī zúqiú"], englishParts: ["I", "would like to", "play soccer"] },
    { english: "I go.", chinese: ["我", "去"], pinyin: ["wǒ", "qù"], englishParts: ["I", "go"] },
    { english: "I like to go to the library.", chinese: ["我", "喜欢", "去", "图书馆"], pinyin: ["wǒ", "xǐhuān", "qù", "túshūguǎn"], englishParts: ["I", "like to", "go to", "the library"] },
    { english: "I would like to go to the library.", chinese: ["我", "想", "去", "图书馆"], pinyin: ["wǒ", "xiǎng", "qù", "túshūguǎn"], englishParts: ["I", "would like to", "go to", "the library"] },
    { english: "I play basketball.", chinese: ["我", "打篮球"], pinyin: ["wǒ", "dǎ lánqiú."], englishParts: ["I", "play basketball"] },
    { english: "I like to play basketball.", chinese: ["我", "喜欢", "打篮球"], pinyin: ["wǒ", "xǐhuān", "dǎ lánqiú"], englishParts: ["I", "like to", "play basketball"] },
    { english: "I would like to play basketball.", chinese: ["我", "想", "打篮球"], pinyin: ["wǒ", "xiǎng", "dǎ lánqiú"], englishParts: ["I", "would like to", "play basketball"] },
    { english: "I read books.", chinese: ["我", "看书"], pinyin: ["wǒ", "kànshū"], englishParts: ["I", "read books"] },
    { english: "I like to read books.", chinese: ["我", "喜欢", "看书"], pinyin: ["wǒ", "xǐhuān", "kànshū"], englishParts: ["I", "like to", "read books"] },
    { english: "I would like to read books.", chinese: ["我", "想", "看书"], pinyin: ["wǒ", "xiǎng", "kànshū"], englishParts: ["I", "would like to", "read books"] }
];

  /* ---------- GAME STATE ---------- */
  let currentSentenceIndex = 0;
  let shuffledSentences = [];
  let allWords = [];
  let scrambledRound = [];
  let scrambledIndex = 0;
  let dragged = null;

  /* ---------- EVENT LISTENERS ---------- */
  startSentenceGameBtn.addEventListener('click', startSentenceBuilder);
  startScrambledGameBtn.addEventListener('click', startScrambledSentences);
  resetSentenceBuilderBtn.addEventListener('click', resetGame);
  resetScrambledBtn.addEventListener('click', resetGame);
  closePopupButton.addEventListener('click', resetGame);

  /* ---------- UTILITY FUNCTIONS ---------- */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getDraggableWords(correctWords, allWords, extraCount = 2) {
    const incorrectWords = allWords.filter(w => !correctWords.includes(w));
    const extraWords = shuffleArray(incorrectWords).slice(0, extraCount);
    return shuffleArray([...correctWords, ...extraWords]);
  }

  /* ---------- GAME SELECTION FUNCTIONS ---------- */
  function startSentenceBuilder() {
    gameMask.style.display = 'none';
    sentenceBuilderArea.style.display = 'block';
    scrambledSentencesArea.style.display = 'none';

    currentSentenceIndex = 0;
    shuffledSentences = shuffleArray([...sentences]);
    allWords = [...new Set(sentences.flatMap(s => s.chinese))];

    loadSentence(currentSentenceIndex);
  }

  function startScrambledSentences() {
    gameMask.style.display = 'none';
    sentenceBuilderArea.style.display = 'none';
    scrambledSentencesArea.style.display = 'block';

    startNewScrambledRound();
  }

  function resetGame() {
    document.querySelector('.completion-popup').style.display = 'none';
    sentenceBuilderArea.style.display = 'none';
    scrambledSentencesArea.style.display = 'none';
    gameMask.style.display = 'block';

    // Reset sentence builder
    document.querySelector('.chinese-target').innerHTML = '';
    document.querySelector('.word-pieces').innerHTML = '';

    // Reset scrambled sentences
    document.getElementById('english-sentence').textContent = '';
    document.getElementById('slots').innerHTML = '';
    document.getElementById('word-bank').innerHTML = '';
  }

  /* ---------- SENTENCE BUILDER FUNCTIONS ---------- */
  function loadSentence(index) {
    if (index >= shuffledSentences.length) {
      showCompletion();
      return;
    }

    const sentence = shuffledSentences[index];
    document.querySelector('.english-prompt').textContent = sentence.english;
    document.querySelector('.chinese-target').innerHTML = '';
    document.querySelector('.word-pieces').innerHTML = '';

    // get draggable words with 1 extra distractor
    const draggableWords = getDraggableWords(sentence.chinese, allWords, 1);

    draggableWords.forEach(word => {
      const piece = document.createElement('div');
      piece.className = 'word-piece';
      piece.textContent = word;
      piece.draggable = true;
      piece.addEventListener('dragstart', dragStart);
      document.querySelector('.word-pieces').appendChild(piece);
    });

    document.querySelector('.chinese-target').addEventListener('dragover', dragOver);
    document.querySelector('.chinese-target').addEventListener('drop', drop);
  }

  function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.dataTransfer.setData('index', [...this.parentNode.children].indexOf(this));
    setTimeout(() => {
      this.style.opacity = '0.4';
      this.style.transform = 'scale(0.95)';
    }, 0);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function drop(e) {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    const originalIndex = e.dataTransfer.getData('index');
    const draggedElement = document.querySelector('.word-pieces').children[originalIndex];

    if (draggedElement) {
      draggedElement.style.opacity = '1';
      draggedElement.style.transform = 'scale(1)';
    }

    const currentSentence = shuffledSentences[currentSentenceIndex];
    const currentPosition = document.querySelector('.chinese-target').children.length;
    const correctWord = currentSentence.chinese[currentPosition];

    if (word !== correctWord) {
      if (draggedElement) {
        draggedElement.style.animation = 'shake 0.5s';
        setTimeout(() => draggedElement.style.animation = '', 500);
      }
      return;
    }

    const piece = document.createElement('div');
    piece.className = 'word-piece';
    piece.textContent = word;

    document.querySelector('.chinese-target').appendChild(piece);
    draggedElement.remove();

    checkSentenceCompletion();
  }

  function checkSentenceCompletion() {
    const currentSentence = shuffledSentences[currentSentenceIndex];
    const targetWords = [...document.querySelector('.chinese-target').children].map(el => el.textContent).join('');
    const correctSentence = currentSentence.chinese.join('');

    if (targetWords === correctSentence) {
      document.querySelector('.chinese-target').innerHTML = '';
      const completedSentence = document.createElement('div');
      completedSentence.className = 'word-piece completed completed-sentence';
      completedSentence.textContent = currentSentence.chinese.join(' ');
      document.querySelector('.chinese-target').appendChild(completedSentence);

      setTimeout(() => {
        currentSentenceIndex++;
        loadSentence(currentSentenceIndex);
      }, 2000);
    }
  }

  function showCompletion() {
    sentenceBuilderArea.style.display = 'none';
    document.querySelector('.completion-popup').style.display = 'block';
  }

  /* ---------- SCRAMBLED SENTENCES FUNCTIONS ---------- */
  function startNewScrambledRound() {
    scrambledRound = shuffleArray([...scrambledData]).slice(0, 10);
    scrambledIndex = 0;
    loadScrambledSentence();
  }

  function loadScrambledSentence() {
    if (scrambledIndex >= scrambledRound.length) {
      alert('🎉 Great job! You finished all the sentences!');
      resetGame();
      return;
    }

    const s = scrambledRound[scrambledIndex];
    const englishSentenceEl = document.querySelector('.english-sentence');
    const slotsEl = document.getElementById('slots');
    const wordBankEl = document.getElementById('word-bank');
    const progressEl = document.getElementById('progress');
    const playBtn = document.getElementById('play-audio');

    // Audio: full sentence
    playBtn.onclick = () => speakChinese(s.chinese.join(' '));

    // English top line
    englishSentenceEl.textContent = s.english;

    // Slots with English labels
    slotsEl.innerHTML = '';
    const labels = (s.englishParts && s.englishParts.length === s.chinese.length)
      ? s.englishParts
      : s.english.replace(/[.?!]/g, '').split(/\s+/).slice(0, s.chinese.length);

    s.chinese.forEach((_, i) => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.dataset.index = String(i);
      slot.addEventListener('dragover', e => e.preventDefault());
      slot.addEventListener('drop', handleScrambledDrop);

      const label = document.createElement('div');
      label.className = 'slot-label';
      label.textContent = labels[i] || '';
      slot.appendChild(label);

      slotsEl.appendChild(slot);
    });

    // Word bank: correct blocks + 1 distractor
    wordBankEl.innerHTML = '';

    // Build a mapping for distractors (hanzi -> pinyin)
    const hanziToPinyin = {};
    scrambledData.forEach(s => s.chinese.forEach((h, i) => { hanziToPinyin[h] = s.pinyin[i]; }));

    const blocks = s.chinese.map((hanzi, i) => ({
      hanzi, pinyin: s.pinyin[i], index: i
    }));

    // Add distractor
    const incorrectWords = Object.keys(hanziToPinyin).filter(h => !s.chinese.includes(h));
    if (incorrectWords.length > 0) {
      const distractorHanzi = incorrectWords[Math.floor(Math.random() * incorrectWords.length)];
      blocks.push({
        hanzi: distractorHanzi,
        pinyin: hanziToPinyin[distractorHanzi],
        index: -1
      });
    }

    shuffleArray(blocks).forEach(b => {
      const block = document.createElement('div');
      block.className = 'word-block';
      block.draggable = true;
      block.dataset.index = String(b.index);
      block.innerHTML = `
                <div class="character">${b.hanzi}</div>
                <div class="pinyin">${b.pinyin}</div>
            `;
      block.addEventListener('dragstart', e => { dragged = block; });
      wordBankEl.appendChild(block);
    });

    // Progress
    progressEl.textContent = `Sentence ${scrambledIndex + 1} of ${scrambledRound.length}`;
  }

  function handleScrambledDrop(e) {
    const slot = e.currentTarget;
    const slotIndex = Number(slot.dataset.index);
    if (!dragged) return;

    // Only one block per slot
    if (slot.querySelector('.word-block')) return;

    const wordIndex = Number(dragged.dataset.index);

    // Correct placement when the dragged block's original index matches the slot index
    if (wordIndex === slotIndex) {
      slot.appendChild(dragged);
      dragged.classList.add('locked');
      dragged.draggable = false;
      slot.classList.add('filled');
      dragged = null;
      checkScrambledCompletion();
    } else {
      // shake feedback
      dragged.classList.add('shake');
      setTimeout(() => dragged && dragged.classList.remove('shake'), 350);
    }
  }

  function checkScrambledCompletion() {
    // A sentence is complete when EVERY slot contains a .word-block
    const slots = Array.from(document.getElementById('slots').querySelectorAll('.slot'));
    const allFilled = slots.every(s => s.querySelector('.word-block'));
    if (!allFilled) return;

    // Clear any leftover distractor in the bank
    Array.from(document.getElementById('word-bank').children).forEach(el => el.classList.add('fade-out'));

    // small pause before next sentence
    setTimeout(() => {
      // reset UI for next sentence
      document.getElementById('slots').innerHTML = '';
      scrambledIndex++;
      loadScrambledSentence();
    }, 1100);
  }
});

/* =========================================================
           SOCCER
           ========================================================= */
        const quizSets = [ 
            { 
                gapSentence: "我__篮球。", 
                correct: "打", 
                options: ["书", "吃", "打"],
                englishSentence: "I play basketball."
            },
            { 
                gapSentence: "我__足球。", 
                correct: "踢", 
                options: ["求", "踢", "书"],
                englishSentence: "I play soccer."
            },
            { 
                gapSentence: "我__书。", 
                correct: "看", 
                options: ["看", "求", "跑步"],
                englishSentence: "I read books."
            },
            { 
                gapSentence: "我__图书馆。", 
                correct: "去", 
                options: ["想", "去", "吃"],
                englishSentence: "I go to the library."
            },
            { 
                gapSentence: "我__打篮球。", 
                correct: "想", 
                options: ["书", "吃", "想"],
                englishSentence: "I want to play basketball."
            },
            { 
                gapSentence: "我__看书。", 
                correct: "喜欢", 
                options: ["喜欢", "提", "打"],
                englishSentence: "I like to read books."
            },
            { 
                gapSentence: "我__跑步。", 
                correct: "想", 
                options: ["想", "有", "看"],
                englishSentence: "I want to run."
            },
            { 
                gapSentence: "我__踢足球。", 
                correct: "喜欢", 
                options: ["打", "喜欢", "吃"],
                englishSentence: "I like to play soccer."
            },
            { 
                gapSentence: "我__一个球。", 
                correct: "有", 
                options: ["有", "跑步", "去"],
                englishSentence: "I have a ball."
            },
            { 
                gapSentence: "我__一个篮球。", 
                correct: "有", 
                options: ["求", "跑步", "有"],
                englishSentence: "I have a basketball."
            },
        ];

        let currentQuestion = 0;
        let shuffledQuizSets = shuffleArray([...quizSets]); // Create a copy to shuffle

        const englishSentence = document.querySelector(".soccer-english-sentence");
        const soccerQuestion = document.querySelector(".soccer-question");
        const soccerBallsContainer = document.querySelector(".soccer-balls");
        const goal = document.querySelector(".soccer-goal img");
        const resetButton = document.getElementById("soccer-reset-button");

        function shuffleArray(array) {
            return array
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
        }

        function loadQuestion(index) {
            if (index >= shuffledQuizSets.length) {
                englishSentence.textContent = "";
                soccerQuestion.textContent = "You're making great progress. Ready to keep practising? Click reset and keep up the good work.";
                soccerBallsContainer.innerHTML = "";
                return;
            }

            const current = shuffledQuizSets[index];
            englishSentence.textContent = current.englishSentence;
            soccerQuestion.textContent = current.gapSentence.replace("__", "__");
            soccerBallsContainer.innerHTML = "";

            const shuffled = [...current.options].sort(() => 0.5 - Math.random());

            shuffled.forEach(option => {
                const ball = document.createElement("div");
                ball.className = "soccer-ball";
                ball.dataset.answer = option;
                ball.innerHTML = `<img src="soccer/soccer-ball.png" alt="Soccer Ball"><span>${option}</span>`;
                soccerBallsContainer.appendChild(ball);

                ball.addEventListener("click", () => {
                    if (option === current.correct) {
                        shootBall(ball);
                    } else {
                        wrongBall(ball);
                    }
                });
            });
        }

        // Shake wrong answer
        function wrongBall(ball) {
            ball.classList.add("shake");
            setTimeout(() => ball.classList.remove("shake"), 400);
        }

        // Shoot correct answer - Fixed to aim at center of goal
        function shootBall(ball) {
            // Get positions relative to the game container
            const gameContainer = document.getElementById('soccer-math');
            const containerRect = gameContainer.getBoundingClientRect();
            
            const ballRect = ball.getBoundingClientRect();
            const goalRect = goal.getBoundingClientRect();
            
            // Calculate center positions relative to container
            const ballCenterX = ballRect.left - containerRect.left + ballRect.width / 2;
            const ballCenterY = ballRect.top - containerRect.top + ballRect.height / 2;
            
            const goalCenterX = goalRect.left - containerRect.left + goalRect.width / 2;
            const goalCenterY = goalRect.top - containerRect.top + goalRect.height / 2;
            
            // Calculate the distance to move
            const offsetX = goalCenterX - ballCenterX;
            const offsetY = goalCenterY - ballCenterY;
            
            ball.classList.add("shoot");
            ball.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.5)`;

            setTimeout(() => {
                currentQuestion++;
                loadQuestion(currentQuestion);
            }, 1000);
        }

        // Reset game
        resetButton.addEventListener("click", () => {
            currentQuestion = 0;
            shuffledQuizSets = shuffleArray([...quizSets]); // shuffle questions again
            loadQuestion(currentQuestion);
        });

        // Initialize first question
        loadQuestion(currentQuestion);
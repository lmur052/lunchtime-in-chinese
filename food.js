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
    { chinese: "吃饭", english: "to eat a meal", front: 'food-flashcards/eatmeal-side1.png', back: 'food-flashcards/eatmeal-side2.png', bilingual: 'food-flashcards/eatmeal-side1.png' },
    { chinese: "吃", english: "to eat", front: 'food-flashcards/eat-side1.png', back: 'food-flashcards/eat-side2.png', bilingual: 'food-flashcards/eat-side1.png' },
    { chinese: "一起去", english: "to go together", front: 'food-flashcards/gotogether-side1.png', back: 'food-flashcards/gotogether-side2.png', bilingual: 'food-flashcards/gotogether-side1.png' },
    { chinese: "午饭", english: "lunch", front: 'food-flashcards/lunch-side1.png', back: 'food-flashcards/lunch-side2.png', bilingual: 'food-flashcards/lunch-side1.png' },
    { chinese: "面", english: "noodles", front: 'food-flashcards/noodles-side1.png', back: 'food-flashcards/noodles-side2.png', bilingual: 'food-flashcards/noodles-side1.png' },
    { chinese: "米饭", english: "rice", front: 'food-flashcards/rice-side1.png', back: 'food-flashcards/rice-side2.png', bilingual: 'food-flashcards/rice-side1.png' },
    { chinese: "三明治", english: "sandwich", front: 'food-flashcards/sandwich-side1.png', back: 'food-flashcards/sandwich-side2.png', bilingual: 'food-flashcards/sandwich-side1.png' },
    { chinese: "时间", english: "time", front: 'food-flashcards/time-side1.png', back: 'food-flashcards/time-side2.png', bilingual: 'food-flashcards/time-side1.png' }
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

document.addEventListener("DOMContentLoaded", () => {
  // Game data
  const quizSets = [
    { examples: ["我喜欢吃面。", "我喜欢吃三明治。"], gapSentence: "我____吃米饭。", correct: "喜欢", options: ["喜欢", "米", "有"], fullSentence: "我喜欢米饭。" },
    { examples: ["我喜欢吃面。", "我喜欢吃米饭。"], gapSentence: "____喜欢吃三明治。", correct: "我", options: ["饭", "午", "我"], fullSentence: "我喜欢吃三明治。" },
    { examples: ["我不喜欢吃米饭。", "我不喜欢吃三明治。"], gapSentence: "我____喜欢吃面。", correct: "不", options: ["午", "去", "不"], fullSentence: "我不喜欢吃面。" },
    { examples: ["我喜欢吃米饭。", "我喜欢吃三明治。"], gapSentence: "我喜欢____三明治。", correct: "吃", options: ["吃", "有", "去"], fullSentence: "我喜欢吃三明治。" },
    { examples: ["我喜欢吃面。", "我喜欢吃三米饭。"], gapSentence: "____喜欢吃三明治。", correct: "我", options: ["我", "三", "有"], fullSentence: "我喜欢吃三明治。" },
    { examples: ["我不喜欢吃三明治。", "我不喜欢吃面。"], gapSentence: "我____喜欢吃米饭。", correct: "不", options: ["明", "吃", "不"], fullSentence: "我不喜欢吃米饭。" },
    { examples: ["我吃三明治。", "我吃面。"], gapSentence: "我____米饭。", correct: "吃", options: ["吃", "去", "午"], fullSentence: "我吃米饭。" },
    { examples: ["我吃三明治。", "我吃面。"], gapSentence: "____吃米饭。", correct: "我", options: ["想", "我", "有"], fullSentence: "我吃米饭。" },
    { examples: ["我想吃面。", "我想吃三明治。"], gapSentence: "我____吃米饭。", correct: "想", options: ["有", "饭", "想"], fullSentence: "我想吃米饭。" },
    { examples: ["我想吃米饭。", "我想吃面。"], gapSentence: "____想吃三明治。", correct: "我", options: ["想", "我", "有"], fullSentence: "我想吃三明治。" },
    { examples: ["我不想吃三明治。", "我不想吃面。"], gapSentence: "我____想吃米饭。", correct: "不", options: ["饭", "喜欢", "不"], fullSentence: "我不想吃米饭。" },
    { examples: ["我们去吃面。", "我们去吃米饭。"], gapSentence: "我们____吃三明治。", correct: "去", options: ["午", "饭", "去"], fullSentence: "我们去吃三明治。" },
    { examples: ["我们去吃三明治。", "我们去吃米饭。"], gapSentence: "____去吃面。", correct: "我们", options: ["我们", "我", "你"], fullSentence: "我们去吃面。" },
    { examples: ["我们不去吃面。", "我们不去吃米饭。"], gapSentence: "我们____去吃三明治。", correct: "不", options: ["我", "不", "去"], fullSentence: "我们不去吃三明治。" }
  ];

  // DOM elements
  const examplesContainer = document.getElementById("bento-examples");
  const optionsContainer = document.getElementById("bento-options");
  const gapSentenceContainer = document.getElementById("gap-sentence");
  const completedMessage = document.getElementById("completed-message");
  const scoreElement = document.getElementById("score");
  const resetButton = document.getElementById("reset-btn");

  // Game state
  let currentSetIndex = 0;
  let gameSets = [];
  let score = 0;
  let draggedOption = null;

  // Initialize the game
  function initGame() {
    currentSetIndex = 0;
    score = 0;
    scoreElement.textContent = score;
    completedMessage.textContent = "";
    gameSets = [...quizSets].sort(() => 0.5 - Math.random()).slice(0, 10);
    loadSet(gameSets[currentSetIndex]);
  }

  // Load a question set
  function loadSet(set) {
    // Clear containers
    examplesContainer.innerHTML = "";
    optionsContainer.innerHTML = "";
    completedMessage.textContent = "";

    // Add example sentences
    set.examples.forEach(example => {
      const exampleDiv = document.createElement("div");
      exampleDiv.className = "example-item";
      exampleDiv.innerHTML = `
                        <span class="example-text">${example}</span>
                        <button class="play-btn" onclick="playSentence('${example}')">🔊</button>
                    `;
      examplesContainer.appendChild(exampleDiv);
    });

    // Add option tiles
    const shuffledOptions = [...set.options].sort(() => 0.5 - Math.random());
    shuffledOptions.forEach(option => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option-tile";
      optionDiv.textContent = option;
      optionDiv.setAttribute("draggable", "true");
      optionDiv.addEventListener("dragstart", handleDragStart);
      optionsContainer.appendChild(optionDiv);
    });

    // Add gap sentence
    gapSentenceContainer.innerHTML = set.gapSentence.replace("____", "<span class='gap' data-correct='" + set.correct + "'></span>");

    // Make gap a drop target
    const gapElement = document.querySelector(".gap");
    gapElement.addEventListener("dragover", handleDragOver);
    gapElement.addEventListener("drop", handleDrop);
  }

  // Drag and drop handlers
  function handleDragStart(e) {
    draggedOption = e.target;
    e.dataTransfer.setData("text/plain", e.target.textContent);
    setTimeout(() => e.target.style.opacity = "0.4", 0);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e) {
    e.preventDefault();
    const correctAnswer = e.target.getAttribute("data-correct");
    const droppedWord = draggedOption.textContent;

    if (droppedWord === correctAnswer) {
      // Correct answer
      e.target.textContent = droppedWord;
      e.target.classList.add("filled");
      draggedOption.style.display = "none";
      score += 10;
      scoreElement.textContent = score;

      // Move to next question after a delay
      setTimeout(() => {
        currentSetIndex++;
        if (currentSetIndex < gameSets.length) {
          loadSet(gameSets[currentSetIndex]);
        } else {
          // Game completed
          completedMessage.textContent = "🎉 Awesome work! You completed those sentences so quickly. Ready for a new round? Click Reset to start a new round.";
          gapSentenceContainer.innerHTML = "";
        }
      }, 1000);
    } else {
      // Incorrect answer
      draggedOption.classList.add("shake");
      setTimeout(() => draggedOption.classList.remove("shake"), 400);
    }

    draggedOption.style.opacity = "1";
    draggedOption = null;
  }

  // Text-to-speech function
  window.playSentence = function (sentence) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  }

  // Reset button handler
  resetButton.addEventListener("click", initGame);

  // Start the game
  initGame();
});





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
    { chinese: ["我们", "一起", "吃饭。"], english: "We eat together." },
    { chinese: ["我们", "一起", "去", "吃饭。"], english: "We are going to eat together." },
    { chinese: ["我", "吃", "米饭。"], english: "I eat rice." },
    { chinese: ["我", "喜欢", "吃", "米饭。"], english: "I like to eat rice." },
    { chinese: ["我", "想", "吃", "米饭。"], english: "I would like to eat rice." },
    { chinese: ["我", "有", "一碗", "米饭。"], english: "I have a bowl of rice." },
    { chinese: ["我", "吃", "面。"], english: "I eat noodles." },
    { chinese: ["我", "喜欢", "吃", "面。"], english: "I like to eat noodles." },
    { chinese: ["我", "想", "吃", "面。"], english: "I would like to eat noodles." },
    { chinese: ["我", "有", "一碗", "面。"], english: "I have a bowl of noodles." },
    { chinese: ["我", "吃", "三明治。"], english: "I eat sandwiches." },
    { chinese: ["我", "喜欢", "吃", "三明治。"], english: "I like to eat sandwiches." },
    { chinese: ["我", "想", "吃", "三明治。"], english: "I would like to eat sandwiches." },
    { chinese: ["我", "有", "一个", "三明治。"], english: "I have a sandwich." },
  ];

  /* ---------- SCRAMBLED SENTENCES DATA ---------- */
  const scrambledData = [
    { english: "I like to eat noodles.", chinese: ["我", "喜欢", "吃", "面"], pinyin: ["wǒ", "xǐhuān", "chī", "miàn"], englishParts: ["I", "like", "to eat", "noodles"] },
    { english: "I like to eat sandwiches.", chinese: ["我", "喜欢", "吃", "三明治"], pinyin: ["wǒ", "xǐhuān", "chī", "sānmíngzhì"], englishParts: ["I", "like", "to eat", "sandwiches"] },
    { english: "I don't like to eat noodles.", chinese: ["我", "不", "喜欢", "吃", "面"], pinyin: ["wǒ", "bù", "xǐhuān", "chī", "miàn"], englishParts: ["I", "don't", "like", "to eat", "noodles"] },
    { english: "I don't like to eat sandwiches.", chinese: ["我", "不", "喜欢", "吃", "三明治"], pinyin: ["wǒ", "bù", "xǐhuān", "chī", "sānmíngzhì"], englishParts: ["I", "don't", "like", "to eat", "sandwiches"] },
    { english: "I like to eat rice.", chinese: ["我", "喜欢", "吃", "米饭"], pinyin: ["wǒ", "xǐhuān", "chī", "mǐfàn"], englishParts: ["I", "like", "to eat", "rice"] },
    { english: "I don't like to eat rice.", chinese: ["我", "不", "喜欢", "吃", "米饭"], pinyin: ["wǒ", "bù", "xǐhuān", "chī", "mǐfàn"], englishParts: ["I", "don't", "like", "to eat", "rice"] },
    { english: "I eat sandwiches.", chinese: ["我", "吃", "三明治"], pinyin: ["wǒ", "chī", "sānmíngzhì"], englishParts: ["I", "eat", "sandwiches"] },
    { english: "I eat rice.", chinese: ["我", "吃", "米饭"], pinyin: ["wǒ", "chī", "mǐfàn"], englishParts: ["I", "eat", "rice"] },
    { english: "I eat noodles.", chinese: ["我", "吃", "面"], pinyin: ["wǒ", "chī", "miàn"], englishParts: ["I", "eat", "noodles"] },
    { english: "I would like to eat noodles.", chinese: ["我", "想", "吃", "面"], pinyin: ["wǒ", "xiǎng", "chī", "miàn"], englishParts: ["I", "would like", "to eat", "noodles"] },
    { english: "I would like to eat rice.", chinese: ["我", "想", "吃", "米饭"], pinyin: ["wǒ", "xiǎng", "chī", "mǐfàn"], englishParts: ["I", "would like", "to eat", "rice"] },
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
      alert('🎉 Great job! You zoomed through those sentences! Want to keep going? Click Reset to start a new round.');
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
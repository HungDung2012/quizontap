const letters = ["A", "B", "C", "D", "E", "F"];

const scoreElement = document.querySelector("#score");
const progressText = document.querySelector("#progressText");
const statusText = document.querySelector("#statusText");
const progressBar = document.querySelector("#progressBar");
const questionText = document.querySelector("#questionText");
const optionsElement = document.querySelector("#options");
const feedbackElement = document.querySelector("#feedback");
const nextButton = document.querySelector("#nextButton");
const restartButton = document.querySelector("#restartButton");
const chooseChapterButton = document.querySelector("#chooseChapterButton");
const chapterPicker = document.querySelector("#chapterPicker");
const chapterButtons = document.querySelector("#chapterButtons");

const chapters = window.CHAPTERS || [];
let selectedChapter = null;
let quizState = QuizCore.createQuizState([]);

function getAllQuestions() {
  return chapters.flatMap((chapter) => chapter.questions);
}

function startQuiz(chapter) {
  selectedChapter = chapter;
  const sourceQuestions = chapter ? chapter.questions : getAllQuestions();
  const preparedQuestions = QuizCore.prepareQuestions(sourceQuestions);
  quizState = QuizCore.createQuizState(preparedQuestions);
  renderQuiz();
}

function renderChapterPicker() {
  chapterButtons.innerHTML = "";

  const allButton = createChapterButton({
    title: "Tất cả",
    count: getAllQuestions().length,
    onClick: () => startQuiz(null),
  });
  chapterButtons.appendChild(allButton);

  chapters.forEach((chapter) => {
    chapterButtons.appendChild(
      createChapterButton({
        title: chapter.title,
        count: chapter.questions.length,
        onClick: () => startQuiz(chapter),
      })
    );
  });
}

function createChapterButton({ title, count, onClick }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chapter-button";
  button.innerHTML = `
    <strong></strong>
    <span></span>
  `;
  button.querySelector("strong").textContent = title;
  button.querySelector("span").textContent = `${count} câu hỏi`;
  button.addEventListener("click", onClick);
  return button;
}

function renderQuiz() {
  chapterPicker.hidden = quizState.questions.length > 0;

  if (!quizState.questions.length) {
    scoreElement.textContent = "0";
    progressText.textContent = "Chưa bắt đầu";
    statusText.textContent = "Chọn chương";
    progressBar.style.width = "0";
    questionText.textContent = "Hãy chọn chương để bắt đầu ôn tập";
    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";
    nextButton.disabled = true;
    restartButton.disabled = true;
    chooseChapterButton.disabled = true;
    return;
  }

  restartButton.disabled = false;
  chooseChapterButton.disabled = false;

  if (quizState.isFinished) {
    renderResult();
    return;
  }

  const question = QuizCore.getCurrentQuestion(quizState);
  const questionNumber = quizState.currentIndex + 1;
  const totalQuestions = quizState.questions.length;
  const progressPercent = totalQuestions
    ? (questionNumber / totalQuestions) * 100
    : 0;

  scoreElement.textContent = quizState.score;
  progressText.textContent = `Câu ${questionNumber}/${totalQuestions}`;
  statusText.textContent = quizState.answered ? "Đã trả lời" : getStatusLabel();
  progressBar.style.width = `${progressPercent}%`;
  questionText.textContent = question.question;
  feedbackElement.textContent = "";
  feedbackElement.className = "feedback";
  nextButton.disabled = !quizState.answered;
  nextButton.textContent =
    questionNumber === totalQuestions ? "Xem kết quả" : "Câu tiếp";

  renderOptions(question);
}

function renderOptions(question) {
  optionsElement.innerHTML = "";
  const hasKnownAnswer = Number.isInteger(question.answer);

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.disabled = quizState.answered;

    if (quizState.answered && hasKnownAnswer && index === question.answer) {
      button.classList.add("correct");
    }

    if (
      quizState.answered &&
      hasKnownAnswer &&
      index === quizState.selectedAnswer &&
      index !== question.answer
    ) {
      button.classList.add("wrong");
    }

    button.innerHTML = `
      <span class="option-letter">${letters[index] || index + 1}</span>
      <span class="option-text"></span>
    `;
    button.querySelector(".option-text").textContent = option;
    button.addEventListener("click", () => handleAnswer(index));

    optionsElement.appendChild(button);
  });
}

function handleAnswer(selectedAnswer) {
  const result = QuizCore.answerCurrentQuestion(quizState, selectedAnswer);
  quizState = result.state;

  const feedback = getFeedback(result.isCorrect);

  renderQuiz();

  feedbackElement.textContent = feedback.text;
  feedbackElement.className = feedback.className;
}

function getFeedback(isCorrect) {
  if (isCorrect === true) {
    return {
      text: "Chính xác.",
      className: "feedback good",
    };
  }

  if (isCorrect === false) {
    return {
      text: "Chưa đúng. Đáp án đúng đã được tô màu.",
      className: "feedback bad",
    };
  }

  return {
    text: "Đã ghi nhận lựa chọn. Câu này chưa có đáp án đúng trong dữ liệu.",
    className: "feedback",
  };
}

function renderResult() {
  const totalQuestions = quizState.questions.length;
  const knownAnswerCount = quizState.questions.filter((question) =>
    Number.isInteger(question.answer)
  ).length;
  const percent = knownAnswerCount
    ? Math.round((quizState.score / knownAnswerCount) * 100)
    : null;

  scoreElement.textContent = quizState.score;
  progressText.textContent = "Hoàn thành";
  statusText.textContent = percent === null ? "Ôn tập" : `${percent}%`;
  progressBar.style.width = "100%";
  questionText.textContent = knownAnswerCount
    ? `Bạn đạt ${quizState.score}/${knownAnswerCount} điểm`
    : `Bạn đã ôn tập ${totalQuestions} câu`;
  renderWrongAnswerReview();
  feedbackElement.textContent = "Bạn có thể làm lại hoặc chọn chương khác để ôn tiếp.";
  feedbackElement.className = "feedback";
  nextButton.disabled = true;
  nextButton.textContent = "Đã xong";
}

function renderWrongAnswerReview() {
  const wrongAnswers = QuizCore.getWrongAnswers(quizState);

  optionsElement.innerHTML = "";

  const wrapper = document.createElement("section");
  wrapper.className = "wrong-review";

  const title = document.createElement("h3");
  title.textContent = wrongAnswers.length
    ? `Câu trả lời sai (${wrongAnswers.length})`
    : "Bạn không sai câu nào.";
  wrapper.appendChild(title);

  if (!wrongAnswers.length) {
    optionsElement.appendChild(wrapper);
    return;
  }

  const list = document.createElement("div");
  list.className = "wrong-review-list";

  wrongAnswers.forEach((answer) => {
    const question = quizState.questions[answer.questionIndex];
    const item = document.createElement("article");
    item.className = "wrong-review-item";

    const questionTitle = document.createElement("h4");
    questionTitle.textContent = `Câu ${answer.questionIndex + 1}: ${question.question}`;

    const optionList = document.createElement("div");
    optionList.className = "wrong-option-list";

    question.options.forEach((option, optionIndex) => {
      const isSelected = optionIndex === answer.selectedAnswer;
      const isCorrect = optionIndex === question.answer;
      const optionItem = document.createElement("div");
      optionItem.className = "wrong-option";

      if (isCorrect) {
        optionItem.classList.add("correct");
      }

      if (isSelected && !isCorrect) {
        optionItem.classList.add("selected-wrong");
      }

      const optionLetter = document.createElement("span");
      optionLetter.className = "option-letter";
      optionLetter.textContent = letters[optionIndex] || optionIndex + 1;

      const optionText = document.createElement("span");
      optionText.className = "wrong-option-text";
      optionText.textContent = option;

      const markers = document.createElement("span");
      markers.className = "answer-markers";

      if (isSelected) {
        markers.appendChild(createAnswerMarker("Bạn chọn", "selected"));
      }

      if (isCorrect) {
        markers.appendChild(createAnswerMarker("Đáp án đúng", "correct"));
      }

      optionItem.append(optionLetter, optionText, markers);
      optionList.appendChild(optionItem);
    });

    item.append(questionTitle, optionList);
    list.appendChild(item);
  });

  wrapper.appendChild(list);

  optionsElement.appendChild(wrapper);
}

function createAnswerMarker(text, type) {
  const marker = document.createElement("span");
  marker.className = `answer-marker ${type}`;
  marker.textContent = text;
  return marker;
}

function getStatusLabel() {
  return selectedChapter ? selectedChapter.title : "Tất cả chương";
}

nextButton.addEventListener("click", () => {
  quizState = QuizCore.goToNextQuestion(quizState);
  renderQuiz();
});

restartButton.addEventListener("click", () => {
  startQuiz(selectedChapter);
});

chooseChapterButton.addEventListener("click", () => {
  selectedChapter = null;
  quizState = QuizCore.createQuizState([]);
  renderQuiz();
});

renderChapterPicker();
renderQuiz();

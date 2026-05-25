(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.QuizCore = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function createQuizState(questions) {
    return {
      questions,
      currentIndex: 0,
      score: 0,
      answered: false,
      selectedAnswer: null,
      answers: [],
      isFinished: questions.length === 0,
    };
  }

  function getCurrentQuestion(state) {
    return state.questions[state.currentIndex] || null;
  }

  function answerCurrentQuestion(state, selectedAnswer) {
    if (state.answered || state.isFinished) {
      return {
        state,
        isCorrect: false,
      };
    }

    const currentQuestion = getCurrentQuestion(state);
    const hasKnownAnswer = Number.isInteger(currentQuestion.answer);
    const isCorrect = hasKnownAnswer
      ? currentQuestion.answer === selectedAnswer
      : null;

    return {
      state: {
        ...state,
        score: isCorrect === true ? state.score + 1 : state.score,
        answered: true,
        selectedAnswer,
        answers: [
          ...state.answers,
          {
            questionIndex: state.currentIndex,
            selectedAnswer,
            isCorrect,
          },
        ],
      },
      isCorrect,
    };
  }

  function goToNextQuestion(state) {
    if (state.currentIndex >= state.questions.length - 1) {
      return {
        ...state,
        isFinished: true,
      };
    }

    return {
      ...state,
      currentIndex: state.currentIndex + 1,
      answered: false,
      selectedAnswer: null,
    };
  }

  function shuffleItems(items, random) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const targetIndex = Math.floor(random() * (index + 1));
      const current = shuffled[index];
      shuffled[index] = shuffled[targetIndex];
      shuffled[targetIndex] = current;
    }

    return shuffled;
  }

  function prepareQuestions(questions, random = Math.random) {
    const preparedQuestions = questions.map((question) => {
      const correctOption = Number.isInteger(question.answer)
        ? question.options[question.answer]
        : null;
      const options = shuffleItems(question.options, random);

      return {
        ...question,
        options,
        answer: correctOption === null ? null : options.indexOf(correctOption),
      };
    });

    return shuffleItems(preparedQuestions, random);
  }

  return {
    answerCurrentQuestion,
    createQuizState,
    getCurrentQuestion,
    goToNextQuestion,
    prepareQuestions,
  };
});

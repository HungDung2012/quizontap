const assert = require("assert");

const {
  answerCurrentQuestion,
  createQuizState,
  getWrongAnswers,
  getCurrentQuestion,
  goToNextQuestion,
  prepareQuestions,
} = require("./quiz-core");

const questions = [
  {
    question: "Question 1",
    options: ["A", "B", "C", "D"],
    answer: 1,
  },
  {
    question: "Question 2",
    options: ["A", "B", "C", "D"],
    answer: 2,
  },
];

function testInitialState() {
  const state = createQuizState(questions);

  assert.strictEqual(state.currentIndex, 0);
  assert.strictEqual(state.score, 0);
  assert.strictEqual(state.answered, false);
  assert.strictEqual(state.selectedAnswer, null);
  assert.strictEqual(state.isFinished, false);
  assert.deepStrictEqual(state.answers, []);
  assert.deepStrictEqual(getCurrentQuestion(state), questions[0]);
}

function testCorrectAnswerIncrementsScore() {
  const state = createQuizState(questions);
  const result = answerCurrentQuestion(state, 1);

  assert.strictEqual(result.isCorrect, true);
  assert.strictEqual(result.state.score, 1);
  assert.strictEqual(result.state.answered, true);
  assert.strictEqual(result.state.selectedAnswer, 1);
}

function testWrongAnswerDoesNotIncrementScore() {
  const state = createQuizState(questions);
  const result = answerCurrentQuestion(state, 0);

  assert.strictEqual(result.isCorrect, false);
  assert.strictEqual(result.state.score, 0);
  assert.strictEqual(result.state.answered, true);
  assert.strictEqual(result.state.selectedAnswer, 0);
}

function testUnknownAnswerDoesNotMarkCorrectOrWrong() {
  const state = createQuizState([
    {
      question: "Question without answer",
      options: ["A", "B", "C", "D"],
      answer: null,
    },
  ]);
  const result = answerCurrentQuestion(state, 0);

  assert.strictEqual(result.isCorrect, null);
  assert.strictEqual(result.state.score, 0);
  assert.strictEqual(result.state.answered, true);
  assert.strictEqual(result.state.selectedAnswer, 0);
}

function testNextQuestionAndFinish() {
  const firstAnswered = answerCurrentQuestion(createQuizState(questions), 1).state;
  const secondQuestion = goToNextQuestion(firstAnswered);

  assert.strictEqual(secondQuestion.currentIndex, 1);
  assert.strictEqual(secondQuestion.answered, false);
  assert.strictEqual(secondQuestion.selectedAnswer, null);
  assert.deepStrictEqual(getCurrentQuestion(secondQuestion), questions[1]);

  const secondAnswered = answerCurrentQuestion(secondQuestion, 2).state;
  const finished = goToNextQuestion(secondAnswered);

  assert.strictEqual(finished.isFinished, true);
  assert.strictEqual(finished.score, 2);
}

function testAnswerHistoryTracksAnsweredQuestions() {
  const firstAnswered = answerCurrentQuestion(createQuizState(questions), 0).state;
  const secondQuestion = goToNextQuestion(firstAnswered);
  const secondAnswered = answerCurrentQuestion(secondQuestion, 2).state;

  assert.deepStrictEqual(secondAnswered.answers, [
    {
      questionIndex: 0,
      selectedAnswer: 0,
      isCorrect: false,
    },
    {
      questionIndex: 1,
      selectedAnswer: 2,
      isCorrect: true,
    },
  ]);
}

function testWrongAnswerReviewOnlyIncludesWrongAnswers() {
  const firstAnswered = answerCurrentQuestion(createQuizState(questions), 0).state;
  const secondQuestion = goToNextQuestion(firstAnswered);
  const secondAnswered = answerCurrentQuestion(secondQuestion, 2).state;

  assert.deepStrictEqual(getWrongAnswers(secondAnswered), [
    {
      questionIndex: 0,
      selectedAnswer: 0,
      isCorrect: false,
    },
  ]);
}

function testPrepareQuestionsShufflesAnswersAndKeepsCorrectIndex() {
  const prepared = prepareQuestions(
    [
      {
        question: "Question",
        options: ["Correct", "Wrong 1", "Wrong 2", "Wrong 3"],
        answer: 0,
      },
    ],
    () => 0
  );
  const question = prepared[0];

  assert.deepStrictEqual(question.options, [
    "Wrong 1",
    "Wrong 2",
    "Wrong 3",
    "Correct",
  ]);
  assert.strictEqual(question.answer, 3);
}

function testPrepareQuestionsShufflesQuestionOrder() {
  const prepared = prepareQuestions(
    [
      { question: "First", options: ["A", "B"], answer: 0 },
      { question: "Second", options: ["A", "B"], answer: 0 },
    ],
    () => 0
  );

  assert.deepStrictEqual(
    prepared.map((question) => question.question),
    ["Second", "First"]
  );
}

testInitialState();
testCorrectAnswerIncrementsScore();
testWrongAnswerDoesNotIncrementScore();
testUnknownAnswerDoesNotMarkCorrectOrWrong();
testNextQuestionAndFinish();
testAnswerHistoryTracksAnsweredQuestions();
testWrongAnswerReviewOnlyIncludesWrongAnswers();
testPrepareQuestionsShufflesAnswersAndKeepsCorrectIndex();
testPrepareQuestionsShufflesQuestionOrder();

console.log("All quiz-core tests passed.");

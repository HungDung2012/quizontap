# Lich Su Dang Quiz Design

## Goal

Build a small offline web quiz for reviewing "Lich su Dang" multiple-choice questions. The site runs by opening `index.html` directly in a browser.

## Scope

- Store questions in an editable JavaScript file.
- Show one question at a time with four or more answer choices.
- Let the learner select an answer, check it, see immediate feedback, move to the next question, and restart.
- Show score and progress.
- Include sample questions and a clear format for replacing them with questions copied/exported from LMS.

## Out Of Scope

- Logging into LMS or scraping authenticated content.
- Backend, database, account system, or online sync.
- Advanced import parser in the first version.

## Architecture

- `index.html` contains the page structure.
- `style.css` contains responsive styling.
- `questions.js` contains the editable question bank.
- `quiz-core.js` contains pure quiz state and scoring functions.
- `script.js` connects the UI to `quiz-core.js`.
- `quiz-core.test.js` tests the core behavior with Node.

## Data Format

Each question is represented as:

```js
{
  question: "Question text",
  options: ["A", "B", "C", "D"],
  answer: 0
}
```

`answer` is the zero-based index of the correct option.

## Testing

Core quiz behavior is tested with Node's built-in `assert` module:

- Initial state starts at question 1 with score 0.
- Correct answers increment score.
- Wrong answers do not increment score.
- Moving beyond the final question marks the quiz as finished.

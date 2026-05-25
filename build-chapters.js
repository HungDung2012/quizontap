const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = __dirname;
const questionDir = path.join(rootDir, "question");
const outputFile = path.join(rootDir, "chapters.js");

function loadQuestions(filePath) {
  const sandbox = { window: {} };
  const source = fs.readFileSync(filePath, "utf8");

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: filePath });

  return sandbox.window.QUESTIONS || [];
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeQuestion(item) {
  const sourceOptions = Array.isArray(item.options)
    ? item.options.map(cleanText).filter(Boolean)
    : [];
  const question = cleanText(sourceOptions[0] || item.question);
  const options = removeCombinedOption(sourceOptions.slice(1));

  return {
    question,
    options,
    answer: 0,
  };
}

function removeCombinedOption(options) {
  if (options.length < 3) {
    return options;
  }

  const [firstOption, ...restOptions] = options;
  const firstOptionLower = firstOption.toLowerCase();
  const includesAllRest = restOptions.every((option) =>
    firstOptionLower.includes(option.toLowerCase())
  );

  return includesAllRest ? restOptions : options;
}

function buildChapter(chapterDir) {
  const fullDir = path.join(questionDir, chapterDir);
  const files = fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith(".js"))
    .sort((left, right) =>
      left.localeCompare(right, "vi", { numeric: true, sensitivity: "base" })
    );

  const questions = files
    .flatMap((file) => loadQuestions(path.join(fullDir, file)))
    .map(normalizeQuestion)
    .filter((item) => item.question && item.options.length >= 2);

  return {
    id: chapterDir,
    title: chapterDir.replace("chuong", "Chương "),
    questions,
  };
}

const chapters = fs
  .readdirSync(questionDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((left, right) =>
    left.localeCompare(right, "vi", { numeric: true, sensitivity: "base" })
  )
  .map(buildChapter);

const output = `window.CHAPTERS = ${JSON.stringify(chapters, null, 2)};\n`;

fs.writeFileSync(outputFile, output, "utf8");

chapters.forEach((chapter) => {
  console.log(`${chapter.title}: ${chapter.questions.length} câu`);
});
console.log(`Đã tạo ${path.relative(rootDir, outputFile)}`);

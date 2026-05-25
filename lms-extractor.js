(function () {
  const questionSelector =
    '[class*="lesson-quiz-styles__Question"], [class*="Question-sc"]';
  const optionSelector = [
    'button',
    'label',
    'li',
    '[role="radio"]',
    '[role="checkbox"]',
    '[class*="Answer"]',
    '[class*="Option"]',
    '[class*="Choice"]',
  ].join(",");

  function cleanText(value) {
    return (value || "")
      .replace(/\s+/g, " ")
      .replace(/^[A-F]\s*[.)\]:-]\s*/i, "")
      .replace(/^(A|B|C|D|E|F)\s+/i, "")
      .trim();
  }

  function unique(values) {
    const seen = new Set();
    return values.filter((value) => {
      const key = value.toLowerCase();
      if (!value || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function isCorrectOption(element) {
    const marker = [
      element.className,
      element.getAttribute("aria-label"),
      element.getAttribute("title"),
      element.getAttribute("data-status"),
      element.getAttribute("data-correct"),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return /correct|right|success|true|đúng|dung/.test(marker);
  }

  function extractOptions(block) {
    const optionElements = Array.from(block.querySelectorAll(optionSelector));
    const options = unique(
      optionElements
        .map((element) => cleanText(element.innerText || element.textContent))
        .filter((text) => text.length > 1)
    );

    if (options.length >= 2) {
      const correctElement = optionElements.find(isCorrectOption);
      const correctText = correctElement
        ? cleanText(correctElement.innerText || correctElement.textContent)
        : "";
      return {
        options,
        answer: correctText ? options.indexOf(correctText) : null,
      };
    }

    const lines = unique(
      (block.innerText || block.textContent || "")
        .split(/\n+/)
        .map(cleanText)
        .filter((text) => text.length > 1)
    );

    return {
      options: lines.slice(1),
      answer: null,
    };
  }

  function extractQuestion(block, options) {
    const lines = unique(
      (block.innerText || block.textContent || "")
        .split(/\n+/)
        .map(cleanText)
        .filter((text) => text.length > 1)
    );
    const optionSet = new Set(options.map((option) => option.toLowerCase()));
    return (
      lines.find((line) => !optionSet.has(line.toLowerCase())) ||
      lines[0] ||
      "Câu hỏi chưa rõ nội dung"
    );
  }

  const blocks = Array.from(document.querySelectorAll(questionSelector));
  const questions = blocks
    .map((block) => {
      const extracted = extractOptions(block);
      const question = extractQuestion(block, extracted.options);
      return {
        question,
        options: extracted.options,
        answer:
          Number.isInteger(extracted.answer) && extracted.answer >= 0
            ? extracted.answer
            : null,
      };
    })
    .filter((item) => item.question && item.options.length >= 2);

  const output = `window.QUESTIONS = ${JSON.stringify(questions, null, 2)};\n`;
  const blob = new Blob([output], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "questions.js";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  navigator.clipboard
    ?.writeText(output)
    .catch(() => {});

  console.log(`Đã trích xuất ${questions.length} câu hỏi.`);
  console.log("Nếu trình duyệt không tải file, nội dung đã được in bên dưới:");
  console.log(output);
})();

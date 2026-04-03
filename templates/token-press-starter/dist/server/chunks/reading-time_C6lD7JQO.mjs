globalThis.process ??= {};
globalThis.process.env ??= {};
const WORDS_PER_MINUTE = 200;
const WHITESPACE_REGEX = /\s+/;
function extractText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks.filter(
    (block) => block._type === "block" && Array.isArray(block.children)
  ).map(
    (block) => block.children.filter((child) => child._type === "span" && typeof child.text === "string").map((span) => span.text).join("")
  ).join(" ");
}
function getReadingTime(content) {
  const text = extractText(content);
  const wordCount = text.split(WHITESPACE_REGEX).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(1, minutes);
}
export {
  extractText as e,
  getReadingTime as g
};

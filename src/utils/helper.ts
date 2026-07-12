function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getTextareaRows(textarea: HTMLTextAreaElement) {
  const styles = window.getComputedStyle(textarea);
  const lineHeight = parseFloat(styles.lineHeight);

  return Math.ceil(textarea.scrollHeight / lineHeight);
}

export const Helper = {
  pickRandom,
  getTextareaRows,
};

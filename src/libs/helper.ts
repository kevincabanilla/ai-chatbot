const pickRandom = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const getTextareaRows = (textarea: HTMLTextAreaElement) => {
  const styles = window.getComputedStyle(textarea);
  const lineHeight = parseFloat(styles.lineHeight);

  return Math.ceil(textarea.scrollHeight / lineHeight);
};

const scrollToId = (id: string | number) => {
  const el = document.getElementById(
    typeof id == "string" && id.startsWith("#") ? id.slice(1) : String(id),
  );
  if (!el) return;

  el.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const Helper = {
  pickRandom,
  getTextareaRows,
  scrollToId,
  scrollToTop,
};

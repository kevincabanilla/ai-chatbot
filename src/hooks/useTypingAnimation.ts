import { useEffect, useState } from "react";

export function useTypingAnimation(
  text: string,
  options?: {
    speed?: number;
    random?: number;
    cursor?: boolean;
  },
) {
  const { speed = 30, random = 70, cursor = true } = options ?? {};

  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (!text) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const display = (index: number) => {
      if (cancelled) return;

      setVisibleChars(index);

      if (index < text.length) {
        timeoutId = setTimeout(
          () => {
            display(index + 1);
          },
          speed + Math.random() * random, // Human-like typing speed
        );
      }
    };

    display(0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [text, speed, random]);

  const isTyping = visibleChars < text.length;
  return text.slice(0, visibleChars).concat(cursor && isTyping ? "|" : "");
}

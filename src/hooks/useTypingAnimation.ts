import { useEffect, useState } from "react";

export function useTypingAnimation(text: string) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const display = (index: number) => {
      setVisibleChars(index);

      if (index < text.length) {
        timeoutId = setTimeout(
          () => {
            display(index + 1);
          },
          30 + Math.random() * 70, // Human-like typing speed
        );
      }
    };

    display(0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

  const isTyping = visibleChars < text.length;
  const displayed = text.slice(0, visibleChars).concat(isTyping ? "|" : "");

  return displayed;
}

import { useEffect, useState } from "react";

export function useKeyboardOffset() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (!window.visualViewport) return;

    const updatePosition = () => {
      const viewport = window.visualViewport;

      const keyboardHeight = !viewport
        ? 0
        : window.innerHeight - viewport.height - viewport.offsetTop;

      setKeyboardOffset(Math.max(0, keyboardHeight));
    };

    updatePosition();

    window.visualViewport.addEventListener("resize", updatePosition);
    window.visualViewport.addEventListener("scroll", updatePosition);

    return () => {
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, []);

  return keyboardOffset;
}

"use client";

import { useEffect, useState } from "react";

export default function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let index = 0;
    let length = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      length += deleting ? -1 : 1;
      setText(words[index].slice(0, length));
      let delay = deleting ? 26 : 52;
      if (length === 0) { deleting = false; index = (index + 1) % words.length; delay = 300; }
      else if (length === words[index].length && !deleting) { deleting = true; delay = 1900; }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2400);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <span className="type-line">
      {/* Reserve the height of every phrase without exposing duplicates to readers. */}
      {words.map((word) => <span key={word} className="type-sizer" aria-hidden="true">{word}<span className="caret" /></span>)}
      <span className="sr-only">{words[0]}</span>
      <span className="type-current" aria-hidden="true"><span className="tw" id="tw">{text}</span><span className="caret" /></span>
    </span>
  );
}

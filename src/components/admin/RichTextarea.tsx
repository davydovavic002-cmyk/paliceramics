"use client";

import { useRef, type KeyboardEvent } from "react";
import { Bold, Italic, List, Underline } from "lucide-react";

const MARKS = {
  bold: "**",
  italic: "*",
  underline: "__",
} as const;

type Mark = keyof typeof MARKS;

/** Textarea with a small formatting bar: bold, italic, underline, bullet list. */
export function RichTextarea({
  value,
  onChange,
  rows = 3,
  className = "",
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (next: string, selStart: number, selEnd: number) => {
    onChange(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  };

  const wrap = (mark: Mark) => {
    const el = ref.current;
    if (!el) return;
    const token = MARKS[mark];
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);

    // already wrapped right around the selection → remove the marks
    if (
      start >= token.length &&
      value.slice(start - token.length, start) === token &&
      value.slice(end, end + token.length) === token
    ) {
      apply(
        value.slice(0, start - token.length) + selected + value.slice(end + token.length),
        start - token.length,
        end - token.length
      );
      return;
    }

    apply(
      value.slice(0, start) + token + selected + token + value.slice(end),
      start + token.length,
      end + token.length
    );
  };

  const bullets = () => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const nextBreak = value.indexOf("\n", end);
    const lineEnd = nextBreak === -1 ? value.length : nextBreak;
    const lines = value.slice(lineStart, lineEnd).split("\n");
    const allBullets = lines.every((line) => /^\s*-\s/.test(line));
    const changed = lines
      .map((line) => (allBullets ? line.replace(/^(\s*)-\s/, "$1") : /^\s*-\s/.test(line) ? line : `- ${line}`))
      .join("\n");
    apply(value.slice(0, lineStart) + changed + value.slice(lineEnd), lineStart, lineStart + changed.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      wrap("bold");
    } else if (key === "i") {
      event.preventDefault();
      wrap("italic");
    } else if (key === "u") {
      event.preventDefault();
      wrap("underline");
    }
  };

  const btn =
    "inline-flex h-7 w-7 items-center justify-center rounded-md text-admin-muted transition-colors hover:bg-admin-card-muted hover:text-admin-heading";

  return (
    <div>
      <div className="mb-1 flex items-center gap-0.5" role="toolbar" aria-label="Text formatting">
        <button type="button" className={btn} onClick={() => wrap("bold")} title="Bold (Ctrl/Cmd+B)">
          <Bold className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
        <button type="button" className={btn} onClick={() => wrap("italic")} title="Italic (Ctrl/Cmd+I)">
          <Italic className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => wrap("underline")}
          title="Underline (Ctrl/Cmd+U)"
        >
          <Underline className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <button type="button" className={btn} onClick={bullets} title="Bullet list">
          <List className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <span className="ml-2 text-[10px] text-admin-dim">Enter = new line · blank line = new paragraph</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={rows}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}

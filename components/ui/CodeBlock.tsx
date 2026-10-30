"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
}

const KEYWORDS = new Set([
  "import", "from", "export", "default", "function", "return",
  "const", "let", "var", "if", "else", "for", "while", "do",
  "class", "extends", "new", "typeof", "instanceof",
  "null", "undefined", "true", "false",
  "async", "await", "try", "catch", "throw", "finally",
  "interface", "type", "enum", "as", "in", "of",
  "switch", "case", "break", "continue",
  "void", "never", "any", "string", "number", "boolean",
  "public", "private", "protected", "static", "abstract", "readonly",
]);

const TOKEN_RE = /(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|<\/?\s*[A-Z][a-zA-Z0-9.]*|<\/?\s*[a-z][a-zA-Z0-9-]*|=>|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)/;

const TOKEN_STYLES: Record<string, string> = {
  keyword: "text-violet-600",
  string:  "text-emerald-700",
  comment: "text-neutral-400 italic",
  tag:     "text-sky-700",
  number:  "text-amber-700",
};

function classifyToken(val: string): string {
  if (val.startsWith("//")) return "comment";
  if (val[0] === '"' || val[0] === "'" || val[0] === "`") return "string";
  if (val[0] === "<") return "tag";
  if (val === "=>") return "keyword";
  if (/^\d/.test(val)) return "number";
  if (KEYWORDS.has(val)) return "keyword";
  return "plain";
}

function tokenizeLine(line: string): { type: string; value: string }[] {
  const tokens: { type: string; value: string }[] = [];
  const re = new RegExp(TOKEN_RE.source, "g");
  let lastIndex = 0;
  let match;

  while ((match = re.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "plain", value: line.slice(lastIndex, match.index) });
    }
    tokens.push({ type: classifyToken(match[0]), value: match[0] });
    lastIndex = re.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ type: "plain", value: line.slice(lastIndex) });
  }

  return tokens;
}

const HIGHLIGHTABLE = new Set(["js", "jsx", "ts", "tsx", "javascript", "typescript"]);

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  title,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const highlight = language ? HIGHLIGHTABLE.has(language.toLowerCase()) : false;

  const lines = useMemo(() => code.split("\n"), [code]);
  const tokenized = useMemo(
    () => (highlight ? lines.map((line) => tokenizeLine(line)) : null),
    [lines, highlight],
  );

  return (
    /* The header lives in the bezel and the code sits on the raised face,
       so the filename reads as a label on the object, not part of it.  */
    <figure
      className={["rounded-[18px] p-1.5 pt-0 m-0", className].filter(Boolean).join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <figcaption className="flex items-center justify-between gap-3 pl-3 pr-0.5 h-10">
        <div className="flex items-center gap-2 min-w-0">
          {title && (
            <span className="text-[12px] font-medium text-neutral-700 truncate">{title}</span>
          )}
          {language && (
            <span
              className="text-[11px] font-semibold text-neutral-500 lowercase px-1.5 py-0.5 rounded-[5px]"
              style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
            >
              {language}
            </span>
          )}
        </div>
        {/* Both labels share one grid cell, so the key is always as wide as
            the longer one and never jumps. Swapping rolls the old label up
            and out of a small window while the new one rolls in beneath
            it; the check draws itself as it arrives.                    */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "copied to clipboard" : "copy code"}
          className="inline-flex items-center h-7 px-2.5 rounded-[8px] text-[11.5px] font-medium cursor-pointer transition-[color,transform,scale] duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          style={{
            background: "var(--face-light)",
            boxShadow: "var(--face-light-shadow)",
            color: copied ? "#047857" : undefined,
          }}
        >
          <span className="grid overflow-hidden text-neutral-600" style={{ color: "inherit" }}>
            <span
              aria-hidden
              className="[grid-area:1/1] inline-flex items-center justify-center gap-1.5"
              style={{
                transform: copied ? "translateY(-110%)" : "none",
                opacity: copied ? 0 : 1,
                filter: copied ? "blur(2px)" : "none",
                transition: "transform 320ms var(--ease-out-soft), opacity 220ms ease, filter 220ms ease",
              }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              copy
            </span>
            <span
              aria-hidden
              className="[grid-area:1/1] inline-flex items-center justify-center gap-1.5"
              style={{
                transform: copied ? "none" : "translateY(110%)",
                opacity: copied ? 1 : 0,
                filter: copied ? "none" : "blur(2px)",
                transition: "transform 380ms var(--ease-spring), opacity 220ms ease, filter 220ms ease",
              }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24">
                <path
                  key={String(copied)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  pathLength={15}
                  className={copied ? "animate-draw-check" : ""}
                />
              </svg>
              copied
            </span>
          </span>
        </button>
        <span aria-live="polite" className="sr-only">{copied ? "copied to clipboard" : ""}</span>
      </figcaption>
      <div
        className="bg-white rounded-[13px] overflow-x-auto scroll-thin"
        style={{ boxShadow: "var(--panel-face-shadow)" }}
      >
        <pre className="py-4 px-4 text-[13px] leading-[1.7] font-mono text-neutral-800">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span aria-hidden className="select-none w-8 shrink-0 text-right pr-4 text-neutral-300 tabular-nums">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1">
                  {tokenized && tokenized[i].length
                    ? tokenized[i].map((tok, j) => (
                        <span key={j} className={TOKEN_STYLES[tok.type] || ""}>
                          {tok.value}
                        </span>
                      ))
                    : (line || "\n")}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  );
}

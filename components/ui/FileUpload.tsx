"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Button } from "./Button";
import { CloseButton } from "./CloseButton";
import { FieldLabel, FieldMessage } from "./FieldMessage";

export interface UploadItem {
  id: string;
  file: File;
  /** 0–100 while uploading */
  progress: number;
  status: "ready" | "uploading" | "done" | "error";
  error?: string;
}

interface FileUploadProps {
  /** Same as the input's accept: "image/*", ".pdf,.docx" */
  accept?: string;
  multiple?: boolean;
  /** In bytes; bigger files land with an error instead of uploading */
  maxSize?: number;
  maxFiles?: number;
  /** Upload each file as it lands. Call onProgress with 0–100; throw to fail it */
  upload?: (file: File, onProgress: (pct: number) => void) => Promise<void>;
  /** Every change to the list: added, progressed, finished, removed */
  onChange?: (items: UploadItem[]) => void;
  label?: string;
  hint?: string;
  /** The words in the empty tray */
  prompt?: string;
  disabled?: boolean;
  className?: string;
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} b`;
  const units = ["kb", "mb", "gb"];
  let i = -1;
  do {
    n /= 1024;
    i++;
  } while (n >= 1024 && i < units.length - 1);
  return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
}

/* Matches a file against an accept string the way the browser's picker does */
function accepts(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith(".")) return file.name.toLowerCase().endsWith(r);
    if (r.endsWith("/*")) return file.type.startsWith(r.slice(0, -1));
    return file.type === r;
  });
}

let seq = 0;

/* Something you fill, so it's built as a field: a wide sunken tray. Drag
   files over it and it lifts flush and draws its border, the way an
   Input does when it takes focus. What you drop lands inside it as
   raised chips; each has a groove along its foot that fills while it
   uploads, then fades once it's done.                               */
export function FileUpload({
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  upload,
  onChange,
  label,
  hint,
  prompt,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [over, setOver] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const depth = useRef(0);

  // Report every change to the list, after it renders
  const report = useRef(onChange);
  useEffect(() => {
    report.current = onChange;
  });
  useEffect(() => {
    report.current?.(items);
  }, [items]);

  // Image previews are object URLs; give them back when they're gone
  const urls = useRef(previews);
  useEffect(() => {
    urls.current = previews;
  });
  useEffect(() => () => Object.values(urls.current).forEach(URL.revokeObjectURL), []);

  const patch = (id: string, p: Partial<UploadItem>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...p } : it)));

  const start = (item: UploadItem) => {
    if (!upload) return;
    patch(item.id, { status: "uploading", progress: 0 });
    upload(item.file, (pct) => patch(item.id, { progress: Math.max(0, Math.min(100, pct)) }))
      .then(() => patch(item.id, { status: "done", progress: 100 }))
      .catch((err: unknown) =>
        patch(item.id, { status: "error", error: err instanceof Error ? err.message : "upload failed" }),
      );
  };

  const add = (files: FileList | File[]) => {
    if (disabled) return;
    let list = Array.from(files);
    if (!multiple) list = list.slice(0, 1);
    const room = maxFiles ? Math.max(0, maxFiles - (multiple ? items.length : 0)) : Infinity;
    setNotice(list.length > room ? `only ${maxFiles} file${maxFiles === 1 ? "" : "s"} can go in` : null);
    const next: UploadItem[] = list.slice(0, room).map((file) => {
      const id = `${uid}-${++seq}`;
      if (!accepts(file, accept)) return { id, file, progress: 0, status: "error", error: "not a type this takes" };
      if (maxSize && file.size > maxSize)
        return { id, file, progress: 0, status: "error", error: `over ${formatBytes(maxSize)}` };
      return { id, file, progress: 0, status: "ready" };
    });
    const shots: Record<string, string> = {};
    next.forEach((it) => {
      if (it.file.type.startsWith("image/") && it.status !== "error") shots[it.id] = URL.createObjectURL(it.file);
    });
    if (!multiple) Object.values(previews).forEach(URL.revokeObjectURL);
    setPreviews((p) => (multiple ? { ...p, ...shots } : shots));
    setItems((cur) => (multiple ? [...cur, ...next] : next));
    next.filter((it) => it.status === "ready").forEach(start);
  };

  const remove = (id: string) => {
    if (previews[id]) URL.revokeObjectURL(previews[id]);
    setPreviews((p) => {
      const rest = { ...p };
      delete rest[id];
      return rest;
    });
    setItems((list) => list.filter((it) => it.id !== id));
  };

  const browse = () => !disabled && inputRef.current?.click();
  const full = !!maxFiles && multiple && items.length >= maxFiles;
  const empty = items.length === 0;

  return (
    <div className={["group/field flex w-full flex-col gap-1.5", className].join(" ")}>
      {label && <FieldLabel id={`${uid}-label`}>{label}</FieldLabel>}

      {/* The tray: a field, so data-open gives it Input's focused well */}
      <div
        role="group"
        aria-labelledby={label ? `${uid}-label` : undefined}
        aria-describedby={hint ? `${uid}-hint` : undefined}
        data-open={over || undefined}
        onDragEnter={(e) => {
          e.preventDefault();
          if (disabled) return;
          depth.current++;
          setOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          // dragleave fires for every child crossed; only the last one counts
          if (--depth.current <= 0) setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={[
          "field relative flex flex-col rounded-[18px] p-2",
          disabled ? "pointer-events-none opacity-40" : "",
        ].join(" ")}
      >
        {empty ? (
          <div
            className="flex cursor-pointer flex-col items-center gap-3.5 px-6 py-9 text-center"
            onClick={(e) => e.target === e.currentTarget && browse()}
          >
            <span className="flex flex-col gap-1">
              <span className="text-[14px] font-medium text-ink tracking-[-0.01em]">
                {over ? "let go to drop them in" : prompt ?? (multiple ? "drop files here" : "drop a file here")}
              </span>
              {hint && (
                <span id={`${uid}-hint`} className="text-[12px] text-ink-muted">
                  {hint}
                </span>
              )}
            </span>
            <Button variant="secondary" size="sm" onClick={browse} disabled={disabled}>
              {multiple ? "choose files" : "choose a file"}
            </Button>
          </div>
        ) : (
          <>
            <ul aria-label="files" className="flex flex-col gap-1.5">
              {items.map((it) => (
                <FileChip key={it.id} item={it} preview={previews[it.id]} onRemove={() => remove(it.id)} />
              ))}
            </ul>
            <div className="flex items-center justify-between gap-3 pl-2.5 pr-0.5 pt-2.5 pb-0.5">
              <span id={`${uid}-hint`} className="truncate text-[12px] text-ink-muted">
                {over ? "let go to add them" : hint ?? `${items.length} file${items.length === 1 ? "" : "s"}`}
              </span>
              {!full && (
                <Button variant="secondary" size="sm" onClick={browse} disabled={disabled}>
                  {multiple ? "add more" : "replace"}
                </Button>
              )}
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) add(e.target.files);
            e.target.value = ""; // so picking the same file again still fires
          }}
        />
      </div>

      {notice && <FieldMessage error={notice} />}
    </div>
  );
}

/* A raised chip sitting in the tray. The groove along its foot is a
   Progress track in miniature; it fills, then fades once the file is up. */
function FileChip({ item, preview, onRemove }: { item: UploadItem; preview?: string; onRemove: () => void }) {
  const failed = item.status === "error";
  const meta = failed
    ? item.error
    : item.status === "uploading"
      ? `${formatBytes(item.file.size)} · ${Math.round(item.progress)}%`
      : item.status === "done"
        ? `${formatBytes(item.file.size)} · uploaded`
        : formatBytes(item.file.size);
  return (
    <li
      className="relative flex items-center gap-3 overflow-hidden rounded-[12px] pt-2.5 pb-3.5 pl-2.5 pr-2"
      style={{
        background: "var(--face)",
        boxShadow: "var(--thumb-shadow)",
        animation: "select-option-in 320ms var(--ease-out-soft) both",
      }}
    >
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element -- a local object URL, nothing to optimise
        <img
          src={preview}
          alt=""
          className="h-9 w-9 shrink-0 rounded-[8px] object-cover"
          style={{ boxShadow: "inset 0 0 0 1px var(--hairline), var(--key-shadow)" }}
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[13px] font-medium text-ink">{item.file.name}</span>
        <span
          className={[
            "flex items-center gap-1 truncate text-[11.5px] tabular-nums",
            failed ? "text-danger" : "text-ink-muted",
          ].join(" ")}
        >
          {item.status === "done" && (
            <svg aria-hidden width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.75" viewBox="0 0 24 24" className="text-success">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {meta}
        </span>
      </span>
      <CloseButton size="sm" label={`remove ${item.file.name}`} onClick={onRemove} />

      {/* The groove along the chip's foot */}
      <span
        aria-hidden={item.status !== "uploading"}
        role={item.status === "uploading" ? "progressbar" : undefined}
        aria-label={item.status === "uploading" ? `uploading ${item.file.name}` : undefined}
        aria-valuenow={item.status === "uploading" ? Math.round(item.progress) : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        className="absolute inset-x-2.5 bottom-[6px] h-[3px] rounded-full transition-opacity duration-500"
        style={{
          background: "var(--track)",
          boxShadow: "var(--track-shadow)",
          opacity: item.status === "uploading" ? 1 : 0,
          transitionDelay: item.status === "done" ? "400ms" : "0ms",
        }}
      >
        <span
          className="block h-full rounded-full"
          style={{
            width: `${item.progress}%`,
            background: "var(--face-inverse)",
            transition: "width 300ms var(--ease-out-soft)",
          }}
        />
      </span>
    </li>
  );
}

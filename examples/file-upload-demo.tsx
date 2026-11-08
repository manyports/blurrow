"use client";

import { FileUpload } from "@/components/ui/FileUpload";

/* Stands in for a real upload: ticks up over a second or two */
function fakeUpload(file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    let pct = 0;
    const t = setInterval(() => {
      pct += 8 + Math.random() * 14;
      onProgress(pct);
      if (pct >= 100) {
        clearInterval(t);
        if (file.name.includes("fail")) reject(new Error("server said no"));
        else resolve();
      }
    }, 160);
  });
}

export default function FileUploadDemo() {
  return (
    <div className="w-full max-w-md">
      <FileUpload label="attachments" hint="up to 5 files, 10 mb each" maxFiles={5} maxSize={10 * 1024 * 1024} upload={fakeUpload} />
    </div>
  );
}

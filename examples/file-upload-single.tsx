"use client";

import { FileUpload } from "@/components/ui/FileUpload";

export default function FileUploadSingle() {
  return (
    <div className="w-full max-w-md">
      <FileUpload
        label="cover image"
        accept="image/*"
        multiple={false}
        maxSize={2 * 1024 * 1024}
        prompt="drop an image, or browse"
        hint="png, jpg or webp, up to 2 mb"
      />
    </div>
  );
}

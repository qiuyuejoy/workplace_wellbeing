"use client";

import { useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  minRows?: number;
  images?: File[];
  onImagesChange?: (images: File[]) => void;
}

export default function MessageInput({
  value,
  onChange,
  placeholder = "Type or paste your draft message here...",
  label = "Your Message",
  minRows = 8,
  images = [],
  onImagesChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!onImagesChange) return;
    const added = Array.from(e.target.files ?? []);
    onImagesChange([...images, ...added]);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  function removeImage(index: number) {
    if (!onImagesChange) return;
    onImagesChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </label>
        <div className="flex items-center gap-3">
          {onImagesChange && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              title="Upload screenshot"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload screenshot
            </button>
          )}
          <span className="text-xs text-gray-400">{value.length} chars</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-400"
      />

      {images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((file, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-20 w-auto rounded border border-gray-200 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                title="Remove image"
              >
                ✕
              </button>
              <p className="mt-0.5 max-w-[5rem] truncate text-xs text-gray-400">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

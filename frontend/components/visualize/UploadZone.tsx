"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { ImageUp, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function UploadZone() {
  const [fileName, setFileName] = useState<string>("Living-room-reference.jpg");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setFileName(acceptedFiles[0].name);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  return (
    <Card className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" padding="lg">
      <div
        {...getRootProps()}
        className="flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-navy/25 bg-navy-50/50 p-8 text-center transition hover:border-amber hover:bg-amber-50"
      >
        <input {...getInputProps()} />
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-navy shadow-[var(--shadow-card)]">
          {isDragActive ? <UploadCloud size={30} /> : <ImageUp size={30} />}
        </div>
        <h2 className="text-xl font-bold text-ink">Upload a room photo</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Drop a clear floor-level image here. TileVision will preserve perspective, light, and room geometry.
        </p>
        <p className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy">{fileName}</p>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber">Step 1</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-ink">Start with the space your customer cares about.</h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            The frontend is wired for the upload and floor mapping journey. Backend image generation can be connected
            through the project API route when your CV service is ready.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/visualize/floor-select"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-amber px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(232,160,32,0.35)] transition hover:bg-amber-600"
          >
            Continue to floor mapping
          </Link>
          <Link
            href="/catalog"
            className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-navy px-5 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
          >
            Browse catalog first
          </Link>
        </div>
      </div>
    </Card>
  );
}

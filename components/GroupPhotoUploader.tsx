"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveGroupPhoto } from "@/app/actions";

async function shrink(file: File, max = 1920): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.9));
  } catch {
    return file;
  }
}

export default function GroupPhotoUploader({ caption: initialCaption }: { caption: string | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function upload() {
    const file = input.current?.files?.[0];
    if (!file) return setStatus("Choose a photo first");
    setBusy(true);
    setStatus("Uploading…");
    const supabase = createClient();
    const blob = await shrink(file);
    const path = `group/${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("photos").upload(path, blob, { contentType: "image/jpeg" });
    if (error) {
      setStatus(`Upload failed: ${error.message}`);
      setBusy(false);
      return;
    }
    const res = await saveGroupPhoto(path, caption);
    if ("error" in res && res.error) {
      setStatus(`Saved the file but not the record: ${res.error}`);
      setBusy(false);
      return;
    }
    setStatus("Group photo updated ✓");
    if (input.current) input.current.value = "";
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="uploader">
      <input ref={input} type="file" accept="image/*" />
      <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (handwritten under the polaroid)" maxLength={160} />
      <button className="btn btn-primary btn-sm" onClick={upload} disabled={busy}>
        {busy ? "Uploading…" : "Save group photo"}
      </button>
      {status && <p className="tiny muted">{status}</p>}
    </div>
  );
}

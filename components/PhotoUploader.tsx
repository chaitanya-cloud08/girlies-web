"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { savePhotoRecord } from "@/app/actions";
import YarnSpinner from "./YarnSpinner";
import ECGSpinner from "./ECGSpinner";

async function shrink(file: File, max = 1600): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.86));
  } catch {
    return file;
  }
}

export default function PhotoUploader({
  girlId,
  slug,
  loadingStyle,
}: {
  girlId: string;
  slug: string;
  loadingStyle?: "yarn" | "ecg";
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function upload() {
    const files = Array.from(input.current?.files ?? []);
    if (!files.length) return setStatus("Choose a photo first");
    setBusy(true);
    const supabase = createClient();
    let done = 0;
    for (const file of files) {
      setStatus(`Uploading ${done + 1} of ${files.length}…`);
      const blob = await shrink(file);
      const path = `${girlId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
      const { error } = await supabase.storage.from("photos").upload(path, blob, { contentType: "image/jpeg" });
      if (error) {
        setStatus(`Upload failed: ${error.message}`);
        setBusy(false);
        return;
      }
      const res = await savePhotoRecord({ slug, path, caption: files.length === 1 ? caption : "" });
      if ("error" in res && res.error) {
        setStatus(`Saved the file but not the record: ${res.error}`);
        setBusy(false);
        return;
      }
      done++;
    }
    setStatus(`Added ${done} photo${done > 1 ? "s" : ""} ✓`);
    setCaption("");
    if (input.current) input.current.value = "";
    setBusy(false);
    router.refresh();
  }

  const busyLabel = loadingStyle === "yarn" ? "Winding…" : loadingStyle === "ecg" ? "Checking vitals…" : "Uploading…";

  return (
    <div className="uploader">
      <input ref={input} type="file" accept="image/*" multiple />
      <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (for single uploads)" maxLength={120} />
      <button className="btn btn-primary btn-sm" onClick={upload} disabled={busy}>
        {busy ? busyLabel : "Upload"}
      </button>
      {status &&
        (busy && loadingStyle === "yarn" ? (
          <YarnSpinner label={status} />
        ) : busy && loadingStyle === "ecg" ? (
          <ECGSpinner label={status} />
        ) : (
          <p className="tiny muted">{status}</p>
        ))}
    </div>
  );
}

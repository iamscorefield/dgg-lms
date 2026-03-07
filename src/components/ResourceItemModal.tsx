"use client";

import { useState } from "react";

function toYouTubeEmbed(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    let videoId: string | null = null;

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        videoId = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        videoId = u.pathname.split("/embed/")[1] || null;
      }
    } else if (host === "youtu.be") {
      videoId = u.pathname.slice(1) || null;
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

function toGoogleDrivePreview(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    if (host === "drive.google.com") {
      const parts = u.pathname.split("/");
      const fileIndex = parts.findIndex((p) => p === "d");
      if (fileIndex !== -1 && parts[fileIndex + 1]) {
        const fileId = parts[fileIndex + 1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    const encoded = encodeURIComponent(url);
    return `https://docs.google.com/gview?url=${encoded}&embedded=true`;
  } catch {
    return null;
  }
}

type Item = {
  id: string;
  title: string;
  item_type: string;
  file_url: string | null;
};

export default function ResourceItemModal({ items }: { items: Item[] }) {
  const [openItem, setOpenItem] = useState<Item | null>(null);

  const close = () => setOpenItem(null);

  const renderModal = () => {
    if (!openItem || !openItem.file_url) return null;

    const url = openItem.file_url;
    const youtubeEmbed = toYouTubeEmbed(url);
    const hasYoutube = !!youtubeEmbed;

    const isRawVideo =
      !hasYoutube &&
      (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg"));

    const pdfEmbed = toGoogleDrivePreview(url);
    const isPdf = !!pdfEmbed;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[80vh] mx-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-purple-600 font-semibold truncate">
                {openItem.item_type}
              </p>
              <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                {openItem.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Close ✕
            </button>
          </div>

          <div className="flex-1 bg-gray-50">
            {hasYoutube && (
              <div className="w-full h-full bg-black">
                <iframe
                  src={youtubeEmbed || undefined}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {!hasYoutube && isRawVideo && (
              <div className="w-full h-full bg-black">
                <video src={url} controls className="w-full h-full" />
              </div>
            )}

            {!hasYoutube && !isRawVideo && isPdf && (
              <iframe
                src={pdfEmbed || undefined}
                className="w-full h-full"
              />
            )}

            {!hasYoutube && !isRawVideo && !isPdf && (
              <div className="flex h-full items-center justify-center text-xs text-gray-500 p-4">
                Cannot preview this file type here. Please ask your tutor to
                upload a YouTube link, video file, or PDF/Drive link.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => it.file_url && setOpenItem(it)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-100 hover:border-[#f2b42c] hover:bg-yellow-50/40 transition text-xs text-left"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 text-[10px] font-semibold text-[#512d7c] uppercase">
              {it.item_type.slice(0, 1)}
            </span>
            <span className="font-semibold text-gray-800">
              {it.title}
            </span>
          </div>
          {it.file_url && (
            <span className="text-[10px] text-gray-500 truncate max-w-[160px]">
              {it.file_url}
            </span>
          )}
        </button>
      ))}

      {renderModal()}
    </>
  );
}

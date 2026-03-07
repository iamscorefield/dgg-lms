"use client";

import { useState } from "react";

// Simple helpers copied from learning page-style behavior
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

export default function ResourceMediaModal(props: {
  videoUrl: string | null;
  pdfUrl: string | null;
}) {
  const { videoUrl, pdfUrl } = props;

  const [showVideo, setShowVideo] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  const youtubeEmbed = videoUrl ? toYouTubeEmbed(videoUrl) : null;
  const hasYoutube = !!youtubeEmbed;

  const hasRawVideoFile =
    !!videoUrl &&
    !hasYoutube &&
    (videoUrl.endsWith(".mp4") ||
      videoUrl.endsWith(".webm") ||
      videoUrl.endsWith(".ogg"));

  const pdfEmbed = pdfUrl ? toGoogleDrivePreview(pdfUrl) : null;
  const hasPdf = !!pdfEmbed;

  return (
    <>
      {/* Buttons under resource description */}
      <div className="space-y-3">
        {videoUrl && (
          <div className="pt-2 border-t border-dashed border-gray-200">
            <p className="text-[11px] text-gray-500 mb-1">
              Main link / video from your tutor:
            </p>
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#f2b42c] hover:underline break-all"
            >
              Watch inside this page →
            </button>
          </div>
        )}

        {pdfUrl && (
          <div className="pt-2 border-t border-dashed border-gray-200">
            <p className="text-[11px] text-gray-500 mb-1">
              Main PDF / document from your tutor:
            </p>
            <button
              type="button"
              onClick={() => setShowPdf(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#f2b42c] hover:underline break-all"
            >
              Read inside this page →
            </button>
          </div>
        )}
      </div>

      {/* Video modal */}
      {showVideo && (hasYoutube || hasRawVideoFile) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-[#512d7c]">
                Video from your tutor
              </h2>
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Close ✕
              </button>
            </div>
            <div className="aspect-video bg-black">
              {hasYoutube && (
                <iframe
                  src={youtubeEmbed || undefined}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
              {!hasYoutube && hasRawVideoFile && (
                <video
                  src={videoUrl || undefined}
                  controls
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* PDF modal */}
      {showPdf && hasPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[80vh] mx-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-[#512d7c]">
                PDF from your tutor
              </h2>
              <button
                type="button"
                onClick={() => setShowPdf(false)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1">
              <iframe
                src={pdfEmbed || undefined}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// src/app/dashboard/admin/AdminRequestsClient.tsx
"use client";

type RequestItem = {
  id: string;
  name?: string;
  status?: string;
};

type Props = {
  requests: RequestItem[];
};

export default function AdminRequestsClient({ requests }: Props) {
  async function callApi(url: string, requestId: string) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Operation failed");
        return;
      }

      // simplest: reload the page to see updated data
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="flex items-center justify-between rounded border bg-white px-4 py-2"
        >
          <div>
            <div className="font-medium">
              {req.name || "Request"} (ID: {req.id})
            </div>
            <div className="text-sm text-gray-500">
              Status: {req.status || "unknown"}
            </div>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => callApi("/api/admin/approve", req.id)}
              className="rounded bg-green-600 px-3 py-1 text-sm text-white"
            >
              Approve
            </button>
            <button
              onClick={() => callApi("/api/admin/reject", req.id)}
              className="rounded bg-yellow-600 px-3 py-1 text-sm text-white"
            >
              Reject
            </button>
            <button
              onClick={() => callApi("/api/admin/delete", req.id)}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
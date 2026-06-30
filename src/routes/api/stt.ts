import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof Blob)) return new Response("file required", { status: 400 });

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", file, "recording.webm");

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body: upstream,
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          return new Response(`STT failed: ${res.status} ${text}`, { status: res.status });
        }
        return new Response(res.body, {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

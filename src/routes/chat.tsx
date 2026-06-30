import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowUp, Mic, Square, Trash2, X } from "lucide-react";
import { loadMessages, saveMessages, clearMessages } from "@/lib/chat-storage";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [{ title: "Chat — Yojana Mitra" }],
  }),
  component: ChatPage,
});

const transport = new DefaultChatTransport({ api: "/api/chat" });

function ChatPage() {
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "yojana-mitra-single",
    messages: initialMessages,
    transport,
  });

  // Persist
  useEffect(() => {
    if (status === "ready" || status === "error") saveMessages(messages);
  }, [messages, status]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Focus on mount & after send
  useEffect(() => {
    if (!voiceOpen) textareaRef.current?.focus();
  }, [voiceOpen, status]);

  const submit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "submitted" || status === "streaming") return;
      setInput("");
      await sendMessage({ text: trimmed });
    },
    [sendMessage, status],
  );

  const onClear = () => {
    if (!confirm("Clear this conversation?")) return;
    clearMessages();
    setMessages([]);
  };

  const isBusy = status === "submitted" || status === "streaming";
  const lastAssistantText = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        return messages[i].parts
          .map((p) => (p.type === "text" ? p.text : ""))
          .join("");
      }
    }
    return "";
  }, [messages]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-ink-soft hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-sm font-semibold">य</div>
            <span className="font-display text-base font-semibold">Yojana Mitra</span>
          </div>
          <button
            onClick={onClear}
            disabled={messages.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-ink-soft transition hover:bg-surface-strong disabled:opacity-40"
            title="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.length === 0 ? <EmptyState onPick={submit} /> : (
            <ul className="space-y-6">
              {messages.map((m) => (
                <MessageRow key={m.id} message={m} />
              ))}
              {status === "submitted" && (
                <li className="text-sm text-ink-soft">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3"
        >
          <div className="flex-1 rounded-2xl border border-border bg-card px-4 py-2 focus-within:border-primary/50">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder="Type in any language — Hindi, English, Tamil…"
              className="block max-h-40 w-full resize-none bg-transparent text-[15px] leading-6 outline-none placeholder:text-ink-soft/70"
              style={{ minHeight: 24 }}
            />
          </div>
          <button
            type="button"
            onClick={() => setVoiceOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition hover:bg-surface-strong"
            title="Voice mode"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            title="Send"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </form>
        <p className="pb-3 text-center text-[11px] text-ink-soft">Always verify amounts and eligibility on the official scheme portal.</p>
      </div>

      {voiceOpen && (
        <VoiceMode
          onClose={() => setVoiceOpen(false)}
          onUserMessage={submit}
          lastAssistantText={lastAssistantText}
          assistantBusy={isBusy}
        />
      )}
    </div>
  );
}

function MessageRow({ message }: { message: UIMessage }) {
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <li className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground">
          <p className="whitespace-pre-wrap text-[15px] leading-6">{text}</p>
        </div>
      </li>
    );
  }
  return (
    <li className="flex gap-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent font-display text-sm text-accent-foreground">य</div>
      <div className="prose prose-sm max-w-none text-[15px] leading-7 text-foreground prose-strong:text-foreground prose-p:my-2 prose-ul:my-2">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </li>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  const suggestions = [
    "मुझे घर बनाने के लिए सरकारी मदद चाहिए",
    "I am a farmer in UP. What can I apply for?",
    "Mera ration card doosre state mein use ho sakta hai?",
    "Pension scheme for elderly parents",
  ];
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground font-display text-2xl font-semibold">य</div>
      <h1 className="mt-5 font-display text-3xl font-semibold">Namaste. How can I help today?</h1>
      <p className="mt-3 text-ink-soft">Type or speak in your language. I&apos;ll find what you qualify for and walk you through every step.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition hover:border-primary/40 hover:bg-surface-strong"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Voice Mode -------------------- */

type VoiceState = "idle" | "listening" | "transcribing" | "thinking" | "speaking";

function VoiceMode({
  onClose,
  onUserMessage,
  lastAssistantText,
  assistantBusy,
}: {
  onClose: () => void;
  onUserMessage: (text: string) => Promise<void> | void;
  lastAssistantText: string;
  assistantBusy: boolean;
}) {
  const [state, setState] = useState<VoiceState>("idle");
  const [statusText, setStatusText] = useState("Tap to speak");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spokenRef = useRef<string>(lastAssistantText); // already spoken text

  // When a new assistant message arrives & we're in voice mode, speak it
  useEffect(() => {
    if (!lastAssistantText || assistantBusy) return;
    if (lastAssistantText === spokenRef.current) return;
    spokenRef.current = lastAssistantText;
    void speakText(lastAssistantText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAssistantText, assistantBusy]);

  async function speakText(text: string) {
    try {
      setState("speaking");
      setStatusText("Speaking…");
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text.slice(0, 4000) }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
        setStatusText("Tap to speak");
      };
      await audio.play();
    } catch (e) {
      console.error(e);
      setState("idle");
      setStatusText("Couldn't play voice");
    }
  }

  async function startRecording() {
    if (state === "listening" || state === "transcribing" || state === "thinking") return;
    // Stop any speaking audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size < 1200) {
          setState("idle"); setStatusText("Didn't catch that — tap and try again");
          return;
        }
        setState("transcribing"); setStatusText("Understanding…");
        try {
          const form = new FormData();
          form.append("file", blob, "recording.webm");
          const res = await fetch("/api/stt", { method: "POST", body: form });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          const text: string = data.text ?? "";
          if (!text.trim()) {
            setState("idle"); setStatusText("Didn't catch that — tap and try again");
            return;
          }
          setState("thinking"); setStatusText("Thinking…");
          await onUserMessage(text);
          // speaking is triggered by lastAssistantText effect when reply arrives
        } catch (e) {
          console.error(e);
          setState("idle"); setStatusText("Something went wrong — try again");
        }
      };
      recorderRef.current = rec;
      rec.start();
      setState("listening");
      setStatusText("Listening… tap to stop");
    } catch (e) {
      console.error(e);
      setStatusText("Microphone permission needed");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function onOrbClick() {
    if (state === "listening") stopRecording();
    else if (state === "speaking") {
      audioRef.current?.pause();
      audioRef.current = null;
      setState("idle"); setStatusText("Tap to speak");
    } else if (state === "idle") {
      void startRecording();
    }
  }

  // Reflect parent busy state
  useEffect(() => {
    if (assistantBusy && state !== "listening" && state !== "transcribing") {
      setState("thinking"); setStatusText("Thinking…");
    }
  }, [assistantBusy, state]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-background/95 px-6 py-10 backdrop-blur-md">
      <div className="flex w-full max-w-md justify-between">
        <span className="text-sm font-medium text-ink-soft">Voice mode</span>
        <button onClick={() => { stopRecording(); audioRef.current?.pause(); onClose(); }} className="grid h-9 w-9 place-items-center rounded-full bg-surface-strong text-foreground hover:opacity-90" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-8">
        <button
          onClick={onOrbClick}
          aria-label="voice"
          className="relative grid h-64 w-64 place-items-center rounded-full"
        >
          <span
            className={`relative grid h-56 w-56 place-items-center rounded-full bg-gradient-to-br from-primary via-emerald-400 to-emerald-200 shadow-[0_30px_80px_-20px_rgba(20,150,100,0.5)] transition ${state === "listening" || state === "thinking" ? "orb-listening" : ""} ${state === "speaking" ? "orb-speaking" : ""}`}
          >
            <span className="absolute inset-2 rounded-full bg-gradient-to-br from-white/60 to-transparent" />
            {state === "listening" && <Square className="relative h-10 w-10 text-white" fill="white" />}
            {state !== "listening" && <Mic className="relative h-10 w-10 text-white" />}
          </span>
        </button>
        <p className="font-display text-xl">{statusText}</p>
      </div>

      <p className="max-w-md text-center text-xs text-ink-soft">
        I&apos;ll listen, transcribe, think, and speak back. You can interrupt by tapping the orb again.
      </p>
    </div>
  );
}

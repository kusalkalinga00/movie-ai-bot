"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type ChatApiResponse = {
  message?: string;
  error?: string;
};

const MOVIE_API_BASE_URL =
  process.env.NEXT_PUBLIC_MOVIE_API_URL ?? "http://localhost:3000";

const seedMessages: Message[] = [
  {
    role: "assistant",
    text: "Welcome to CineChat. Tell me your mood, favorite genres, or a movie you liked, and I will suggest what to watch next.",
  },
  {
    role: "assistant",
    text: "Try: 'I want a mind-bending sci-fi movie with great visuals.'",
  },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: Message = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setRequestError(null);

    try {
      const response = await fetch(`${MOVIE_API_BASE_URL}/movie/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;
      const assistantText =
        data.message?.trim() ||
        (data.error
          ? `I could not generate a recommendation: ${data.error}`
          : "I could not generate a recommendation right now. Please try again.");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: assistantText },
      ]);
    } catch (error) {
      const fallbackText =
        "I could not reach the movie API. Make sure the backend is running on http://localhost:3000 and try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: fallbackText },
      ]);
      setRequestError(
        error instanceof Error ? error.message : "Unknown request error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#04090f] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(251,191,36,0.2),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(59,130,246,0.2),transparent_38%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.12),transparent_40%)]" />

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-5 backdrop-blur sm:mb-6 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/90">
            Movie AI
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-zinc-50 sm:text-3xl">
            Dark Chat Recommender
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Message the assistant with your taste, mood, or favorite film. You
            will get instant movie recommendations in this single page app.
          </p>
        </header>

        <section className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {hasMessages ? (
              messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg sm:max-w-[75%] sm:text-base ${
                    message.role === "assistant"
                      ? "border border-amber-300/20 bg-zinc-900 text-zinc-100"
                      : "ml-auto border border-sky-300/20 bg-linear-to-br from-sky-800/80 to-blue-900/80 text-sky-50"
                  }`}
                >
                  <p>{message.text}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-zinc-400">
                No messages yet. Start by describing what kind of movie you
                want.
              </p>
            )}
            {isLoading ? (
              <article className="max-w-[90%] rounded-2xl border border-amber-300/20 bg-zinc-900 px-4 py-3 text-sm leading-relaxed text-zinc-200 shadow-lg sm:max-w-[75%] sm:text-base">
                <p>Thinking of the best recommendation...</p>
              </article>
            ) : null}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-white/10 p-3 sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isLoading}
                placeholder="Example: Recommend an emotional sci-fi movie for tonight"
                className="h-12 flex-1 rounded-xl border border-white/15 bg-zinc-900 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-300/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="h-12 rounded-xl bg-amber-400 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-amber-300/70"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
            {requestError ? (
              <p className="mt-2 text-xs text-rose-300">
                Request error: {requestError}
              </p>
            ) : null}
          </form>
        </section>
      </main>
    </div>
  );
}

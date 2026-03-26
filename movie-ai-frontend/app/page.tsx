"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

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

function recommendMovie(prompt: string) {
  const lower = prompt.toLowerCase();

  if (
    lower.includes("sci") ||
    lower.includes("space") ||
    lower.includes("future")
  ) {
    return "You might love Arrival (2016). Calm, emotional sci-fi with a strong concept and excellent performances.";
  }
  if (
    lower.includes("thriller") ||
    lower.includes("mystery") ||
    lower.includes("twist")
  ) {
    return "Try Prisoners (2013). It's a tense mystery thriller with layered characters and a gripping atmosphere.";
  }
  if (lower.includes("romance") || lower.includes("love")) {
    return "Watch About Time (2013). Warm, romantic, and heartfelt with a unique time-travel angle.";
  }
  if (lower.includes("funny") || lower.includes("comedy")) {
    return "Go with The Nice Guys (2016). Sharp humor, great chemistry, and a stylish detective story.";
  }
  if (lower.includes("animated") || lower.includes("anime")) {
    return "Recommendation: Spider-Man: Into the Spider-Verse (2018). Creative visuals, emotional depth, and nonstop energy.";
  }

  return "Based on your vibe, I recommend Nightcrawler (2014): dark, intense, and highly engaging. Want options in a specific genre too?";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput] = useState("");

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: Message = { role: "user", text: trimmed };
    const assistantMessage: Message = {
      role: "assistant",
      text: recommendMovie(trimmed),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
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
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-white/10 p-3 sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Example: Recommend an emotional sci-fi movie for tonight"
                className="h-12 flex-1 rounded-xl border border-white/15 bg-zinc-900 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-300/80 focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-amber-400 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 focus:outline-none"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

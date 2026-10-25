"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiddenNote } from "@/components/hidden-note";
import { useProgress } from "@/components/progress-provider";
import { CHAPTER_THREE, type MemoryQuestion, type QuizOptionKey } from "@/content/game";
import { pickMemorySet } from "@/lib/quiz";

type Screen = "welcome" | "question" | "reveal" | "album";

export function ChapterThree() {
  const router = useRouter();
  const { ready, isUnlocked, isCompleted, complete } = useProgress();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [deck, setDeck] = useState<MemoryQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<QuizOptionKey | null>(null);
  const [wrong, setWrong] = useState(false);
  const [won, setWon] = useState<MemoryQuestion[]>([]);

  const current = deck[index];
  const last = index === deck.length - 1;

  useEffect(() => {
    if (ready && !isUnlocked(3)) {
      router.replace("/");
    }
  }, [isUnlocked, ready, router]);

  const startQuiz = () => {
    setDeck(pickMemorySet());
    setIndex(0);
    setPicked(null);
    setWrong(false);
    setWon([]);
    setScreen("question");
  };

  const submitAnswer = () => {
    if (!current || !picked) {
      return;
    }

    if (picked !== current.answer) {
      setWrong(true);
      return;
    }

    setWon((items) => (items.some((item) => item.id === current.id) ? items : [...items, current]));
    setScreen("reveal");
  };

  const afterReveal = () => {
    if (last) {
      if (ready && !isCompleted(3)) {
        complete(3);
      }
      setScreen("album");
      return;
    }

    setIndex((value) => value + 1);
    setPicked(null);
    setWrong(false);
    setScreen("question");
  };

  if (!ready || !isUnlocked(3)) {
    return <div className="memory-page" />;
  }

  return (
    <main className="memory-page">
      <span aria-hidden className="memory-glow" />
      <span aria-hidden className="memory-bloom memory-bloom-a" />
      <span aria-hidden className="memory-bloom memory-bloom-b" />
      <HiddenNote id={CHAPTER_THREE.hiddenNoteId} className="memory-secret">
        <span aria-hidden>✦</span>
      </HiddenNote>

      {screen === "welcome" ? <Welcome onStart={startQuiz} /> : null}

      {screen === "question" && current ? (
        <QuestionCard
          question={current}
          step={index}
          total={deck.length}
          picked={picked}
          wrong={wrong}
          onPick={(key) => {
            setPicked(key);
            setWrong(false);
          }}
          onBack={() => {
            if (index === 0) {
              setScreen("welcome");
              return;
            }
            setIndex((value) => value - 1);
            setPicked(null);
            setWrong(false);
          }}
          onNext={submitAnswer}
        />
      ) : null}

      {screen === "reveal" && current ? (
        <RevealCard
          question={current}
          last={last}
          onNext={afterReveal}
        />
      ) : null}

      {screen === "album" ? (
        <AlbumCard
          photos={won}
          onRoad={() => router.push("/")}
          onReplay={startQuiz}
        />
      ) : null}
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="memory-card memory-welcome">
      <p className="memory-kicker">{CHAPTER_THREE.levelLabel}</p>
      <h1>{CHAPTER_THREE.title}</h1>
      <p className="memory-tag">{CHAPTER_THREE.tagline}</p>
      <div className="memory-silhouette" aria-hidden>
        <span />
        <span />
      </div>
      <p className="memory-intro">{CHAPTER_THREE.welcome}</p>
      <button type="button" className="memory-cta" onClick={onStart}>
        Start Quiz
      </button>
    </section>
  );
}

function QuestionCard({
  question,
  step,
  total,
  picked,
  wrong,
  onPick,
  onBack,
  onNext,
}: {
  question: MemoryQuestion;
  step: number;
  total: number;
  picked: QuizOptionKey | null;
  wrong: boolean;
  onPick: (key: QuizOptionKey) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="memory-card">
      <header className="memory-bar">
        <button type="button" className="memory-back" onClick={onBack} aria-label="Go back">
          ‹
        </button>
        <p>{CHAPTER_THREE.title}</p>
      </header>
      <ol className="memory-steps">
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className={i === step ? "is-now" : i < step ? "is-done" : ""}>
            {i + 1}
          </li>
        ))}
      </ol>
      <p className="memory-q-label">Question {step + 1}</p>
      <h2>{question.question}</h2>
      <div className="memory-options">
        {question.options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`memory-option${picked === option.key ? " is-picked" : ""}`}
            onClick={() => onPick(option.key)}
          >
            <span>{option.key.toUpperCase()}</span>
            {option.label}
          </button>
        ))}
      </div>
      {wrong ? <p className="memory-wrong">{CHAPTER_THREE.wrong}</p> : null}
      <button type="button" className="memory-cta" disabled={!picked} onClick={onNext}>
        Next
      </button>
    </section>
  );
}

function RevealCard({
  question,
  last,
  onNext,
}: {
  question: MemoryQuestion;
  last: boolean;
  onNext: () => void;
}) {
  return (
    <section className="memory-card memory-reveal">
      <div className="memory-hearts" aria-hidden>
        <span>♡</span>
        <span>♡</span>
        <span>♡</span>
        <span>♡</span>
      </div>
      <p className="memory-right">{CHAPTER_THREE.rightTitle} ♡</p>
      <figure className="memory-polaroid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={question.photo} alt="" />
        <figcaption>{question.caption}</figcaption>
      </figure>
      <button type="button" className="memory-cta" onClick={onNext}>
        {last ? "Show My Memory" : "Continue"}
      </button>
    </section>
  );
}

function AlbumCard({
  photos,
  onRoad,
  onReplay,
}: {
  photos: MemoryQuestion[];
  onRoad: () => void;
  onReplay: () => void;
}) {
  return (
    <section className="memory-card memory-album">
      <p className="memory-kicker">{CHAPTER_THREE.title}</p>
      <h1>{CHAPTER_THREE.albumTitle}</h1>
      <div className="memory-scrap">
        {photos.map((item) => (
          <figure key={item.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.photo} alt="" />
          </figure>
        ))}
      </div>
      <p className="memory-note">{CHAPTER_THREE.albumNote}</p>
      <button type="button" className="memory-cta" onClick={onRoad}>
        Return to the road
      </button>
      <button type="button" className="memory-text-btn" onClick={onReplay}>
        Play again
      </button>
    </section>
  );
}

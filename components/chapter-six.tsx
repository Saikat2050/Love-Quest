"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { HiddenNote } from "@/components/hidden-note";
import { useProgress } from "@/components/progress-provider";
import {
  CHAPTER_SIX,
  type FutureOption,
  type FutureQuestion,
  type QuizOptionKey,
} from "@/content/game";
import {
  EMPTY_FUTURE,
  readFutureProgress,
  subscribeFuture,
  writeFutureProgress,
  type FutureProgress,
} from "@/lib/future";

const QUESTIONS = CHAPTER_SIX.questions;

export function ChapterSix() {
  const router = useRouter();
  const { ready, isUnlocked, isCompleted, complete } = useProgress();
  const progress = useSyncExternalStore(subscribeFuture, readFutureProgress, () => EMPTY_FUTURE);
  const { index, picked, screen } = progress;
  const question = QUESTIONS[index];
  const choice = question ? picked[question.id] : undefined;
  const option = question?.options.find((item) => item.key === choice);
  const last = index >= QUESTIONS.length - 1;
  const save = (next: FutureProgress) => writeFutureProgress(next);

  useEffect(() => {
    if (ready && !isUnlocked(6)) {
      router.replace("/");
    }
  }, [isUnlocked, ready, router]);

  if (!ready || !isUnlocked(6)) {
    return <div className="future-page" />;
  }

  return (
    <main className="future-page">
      <span aria-hidden className="future-glow" />
      <span aria-hidden className="future-bloom future-bloom-a" />
      <span aria-hidden className="future-bloom future-bloom-b" />
      <HiddenNote id={CHAPTER_SIX.hiddenNoteId} className="future-secret">
        <span aria-hidden>✦</span>
      </HiddenNote>

      {screen === "welcome" ? (
        <Welcome
          onStart={() =>
            save({
              index: 0,
              picked,
              screen: "question",
            })
          }
        />
      ) : null}

      {screen === "question" && question ? (
        <QuestionCard
          question={question}
          step={index}
          selected={choice ?? null}
          onPick={(key) =>
            save({
              index,
              picked: { ...picked, [question.id]: key },
              screen: "question",
            })
          }
          onBack={() => {
            if (index === 0) {
              save({ index, picked, screen: "welcome" });
              return;
            }

            save({ index: index - 1, picked, screen: "question" });
          }}
          onNext={() => {
            if (!choice) {
              return;
            }

            save({ index, picked, screen: "reveal" });
          }}
        />
      ) : null}

      {screen === "reveal" && question && option ? (
        <RevealCard
          option={option}
          last={last}
          onNext={() => {
            if (last) {
              if (ready && !isCompleted(6)) {
                complete(6);
              }
              save({ index, picked, screen: "album" });
              return;
            }

            save({ index: index + 1, picked, screen: "question" });
          }}
        />
      ) : null}

      {screen === "album" ? (
        <AlbumCard
          picked={picked}
          onRoad={() => {
            if (ready && !isCompleted(6)) {
              complete(6);
            }
            router.push("/");
          }}
        />
      ) : null}
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="future-card future-welcome">
      <p className="future-kicker">{CHAPTER_SIX.levelLabel}</p>
      <h1>{CHAPTER_SIX.title}</h1>
      <p className="future-tag">{CHAPTER_SIX.subtitle}</p>
      <div className="future-ledge" aria-hidden>
        <span className="is-him" />
        <span className="is-her" />
      </div>
      <p className="future-intro">{CHAPTER_SIX.welcome} ♥</p>
      <button type="button" className="future-cta" onClick={onStart}>
        {CHAPTER_SIX.start} →
      </button>
    </section>
  );
}

function QuestionCard({
  question,
  step,
  selected,
  onPick,
  onBack,
  onNext,
}: {
  question: FutureQuestion;
  step: number;
  selected: QuizOptionKey | null;
  onPick: (key: QuizOptionKey) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="future-card">
      <header className="future-bar">
        <button type="button" className="future-back" onClick={onBack} aria-label="Go back">
          ‹
        </button>
        <p>{CHAPTER_SIX.title}</p>
      </header>
      <ol className="future-steps" aria-label="Question progress">
        {QUESTIONS.map((item, index) => (
          <li
            key={item.id}
            className={index === step ? "is-now" : index < step ? "is-done" : ""}
          >
            {index + 1}
          </li>
        ))}
      </ol>
      <p className="future-kicker">
        Question {step + 1}
      </p>
      <h2>{question.question}</h2>
      <div className="future-options">
        {question.options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`future-option${selected === option.key ? " is-picked" : ""}`}
            onClick={() => onPick(option.key)}
            aria-pressed={selected === option.key}
          >
            <DreamPhoto src={option.photo} compact />
            <span className="future-option-key">{option.key.toUpperCase()}</span>
            <span className="future-option-label">{option.label}</span>
          </button>
        ))}
      </div>
      <button type="button" className="future-cta" disabled={!selected} onClick={onNext}>
        {CHAPTER_SIX.next} →
      </button>
    </section>
  );
}

function RevealCard({
  option,
  last,
  onNext,
}: {
  option: FutureOption;
  last: boolean;
  onNext: () => void;
}) {
  return (
    <section className="future-card future-reveal">
      <p className="future-kicker">{CHAPTER_SIX.revealTitle} ✦</p>
      <h2>{option.label}</h2>
      <DreamPhoto src={option.photo} />
      <p className="future-message">{option.reveal} ♥</p>
      <button type="button" className="future-cta" onClick={onNext}>
        {last ? `${CHAPTER_SIX.seeBook} →` : `${CHAPTER_SIX.next} →`}
      </button>
    </section>
  );
}

function AlbumCard({
  picked,
  onRoad,
}: {
  picked: FutureProgress["picked"];
  onRoad: () => void;
}) {
  const chosen = QUESTIONS.map((question) => {
    const key = picked[question.id];
    return question.options.find((option) => option.key === key) ?? question.options[0];
  });

  return (
    <section className="future-card future-album">
      <p className="future-kicker">{CHAPTER_SIX.title}</p>
      <h1>{CHAPTER_SIX.albumTitle} ♥</h1>
      <p className="future-tag">{CHAPTER_SIX.albumLead}</p>
      <div className="future-scrap">
        {chosen.map((option, index) => (
          <article key={`${option.key}-${index}`} className="future-scrap-card">
            <DreamPhoto src={option.photo} compact />
            <p>
              {index + 1}. {option.label}
            </p>
          </article>
        ))}
      </div>
      {CHAPTER_SIX.finale.map((paragraph) => (
        <p key={paragraph} className="future-finale">
          {paragraph}
        </p>
      ))}
      <button type="button" className="future-cta" onClick={onRoad}>
        {CHAPTER_SIX.continue} →
      </button>
    </section>
  );
}

function DreamPhoto({ src, compact = false }: { src: string; compact?: boolean }) {
  const [ready, setReady] = useState(false);

  return (
    <figure className={`future-photo${compact ? " is-compact" : ""}${ready ? " is-ready" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </figure>
  );
}

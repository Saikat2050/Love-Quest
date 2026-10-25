"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HiddenNote } from "@/components/hidden-note";
import { useProgress } from "@/components/progress-provider";
import { CHAPTER_TWO } from "@/content/game";
import {
  CELL_H,
  CELL_W,
  makePieces,
  piecePath,
  shuffleIds,
  VIEW,
  type Piece,
} from "@/lib/jigsaw";

const COLS = CHAPTER_TWO.cols;
const ROWS = CHAPTER_TWO.rows;
const TOTAL = COLS * ROWS;

type Drag = {
  id: number;
  x: number;
  y: number;
  grabX: number;
  grabY: number;
};

export function ChapterTwo() {
  const router = useRouter();
  const { ready, isUnlocked, isCompleted, complete } = useProgress();
  const pieces = useMemo(() => makePieces(ROWS, COLS), []);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);

  const [order, setOrder] = useState<number[] | null>(null);
  const [placed, setPlaced] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [nudge, setNudge] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);

  const done = placed.size === TOTAL;

  useEffect(() => {
    if (ready && !isUnlocked(2)) {
      router.replace("/");
    }
  }, [isUnlocked, ready, router]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    setPlaced(new Set());
    setOrder(shuffleIds(pieces.map((piece) => piece.id)));
  }, [pieces, ready]);

  useEffect(() => {
    if (done && ready && !isCompleted(2)) {
      complete(2);
    }
  }, [complete, done, isCompleted, ready]);

  const pieceById = useMemo(() => {
    return new Map(pieces.map((piece) => [piece.id, piece]));
  }, [pieces]);

  const slotFromPoint = (x: number, y: number) => {
    const board = boardRef.current;
    if (!board) {
      return null;
    }

    const box = board.getBoundingClientRect();
    if (x < box.left || x > box.right || y < box.top || y > box.bottom) {
      return null;
    }

    const col = Math.min(COLS - 1, Math.floor(((x - box.left) / box.width) * COLS));
    const row = Math.min(ROWS - 1, Math.floor(((y - box.top) / box.height) * ROWS));
    return row * COLS + col;
  };

  const placeIfMatch = (pieceId: number, slotId: number | null) => {
    if (slotId === pieceId) {
      setPlaced((current) => new Set(current).add(pieceId));
      setSelected(null);
      return true;
    }

    if (slotId !== null) {
      setWrong(pieceId);
      window.setTimeout(() => setWrong((value) => (value === pieceId ? null : value)), 420);
    }

    return false;
  };

  const onPiecePointerDown = (event: React.PointerEvent<HTMLButtonElement>, id: number) => {
    if (placed.has(id)) {
      return;
    }

    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelected(id);
    const next = {
      id,
      x: event.clientX,
      y: event.clientY,
      grabX: event.clientX - box.left,
      grabY: event.clientY - box.top,
    };
    dragRef.current = next;
    setDrag(next);
  };

  const onPiecePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current) {
      return;
    }

    const next = { ...current, x: event.clientX, y: event.clientY };
    dragRef.current = next;
    setDrag(next);
    setHoverSlot(slotFromPoint(event.clientX, event.clientY));
  };

  const onPiecePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current) {
      return;
    }

    const slot = slotFromPoint(event.clientX, event.clientY);
    placeIfMatch(current.id, slot);
    dragRef.current = null;
    setDrag(null);
    setHoverSlot(null);
  };

  const openMessage = () => {
    if (!done) {
      setNudge(true);
      window.setTimeout(() => setNudge(false), 700);
      return;
    }

    setMessageOpen(true);
  };

  if (!ready || !isUnlocked(2) || !order) {
    return <div className="puzzle-page" />;
  }

  const tray = order.filter((id) => !placed.has(id));
  const dragging = drag ? pieceById.get(drag.id) : null;

  return (
    <main className="puzzle-page">
      <header className="puzzle-top">
        <p className="puzzle-level">
          <span aria-hidden>♡</span>
          <span>
            {CHAPTER_TWO.levelLabel}
            <br />
            {CHAPTER_TWO.title}
          </span>
        </p>
        <div className="puzzle-heading">
          <h1>
            <span aria-hidden>♡</span> {CHAPTER_TWO.heading} <span aria-hidden>♡</span>
          </h1>
          <p>{CHAPTER_TWO.tagline}</p>
        </div>
        <HiddenNote id={CHAPTER_TWO.hiddenNoteIds[0]} className="puzzle-lantern">
          <span className="puzzle-lantern-glow" aria-hidden />
          <span className="puzzle-lantern-heart" aria-hidden>
            ♡
          </span>
        </HiddenNote>
      </header>

      <section className="puzzle-stage">
        <div className="puzzle-board-wrap">
          <div ref={boardRef} className={`puzzle-board${done ? " is-complete" : ""}`}>
            <div className="puzzle-slots">
              {pieces.map((piece) => (
                <button
                  key={`slot-${piece.id}`}
                  type="button"
                  className={`puzzle-slot${hoverSlot === piece.id ? " is-hot" : ""}${placed.has(piece.id) ? " is-filled" : ""}`}
                  aria-label={`Puzzle space ${piece.row + 1}, ${piece.col + 1}`}
                  onClick={() => {
                    if (selected !== null) {
                      placeIfMatch(selected, piece.id);
                    }
                  }}
                />
              ))}
            </div>
            <svg className="puzzle-lines" viewBox={`0 0 ${COLS * CELL_W} ${ROWS * CELL_H}`} aria-hidden>
              {pieces.map((piece) => (
                <path
                  key={`line-${piece.id}`}
                  d={piecePath(piece)}
                  transform={`translate(${piece.col * CELL_W} ${piece.row * CELL_H})`}
                />
              ))}
            </svg>
            <div className="puzzle-placed">
              {pieces
                .filter((piece) => placed.has(piece.id))
                .map((piece) => (
                  <div
                    key={`placed-${piece.id}`}
                    className="puzzle-placed-piece"
                    style={pieceBox(piece)}
                  >
                    <PieceFace piece={piece} variant="board" />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <aside className="puzzle-tray-wrap">
          <p>{done ? "Every piece found its place" : "Puzzle Pieces"}</p>
          <div className="puzzle-tray">
            {tray.map((id) => {
              const piece = pieceById.get(id);
              if (!piece) {
                return null;
              }

              return (
                <button
                  key={`tray-${id}`}
                  type="button"
                  className={`puzzle-tray-piece${selected === id ? " is-selected" : ""}${wrong === id ? " is-wrong" : ""}${drag?.id === id ? " is-lifting" : ""}`}
                  aria-label={`Puzzle piece ${id + 1}`}
                  aria-pressed={selected === id}
                  onPointerDown={(event) => onPiecePointerDown(event, id)}
                  onPointerMove={onPiecePointerMove}
                  onPointerUp={onPiecePointerUp}
                  onPointerCancel={() => {
                    dragRef.current = null;
                    setDrag(null);
                    setHoverSlot(null);
                  }}
                >
                  <PieceFace piece={piece} variant="tray" />
                </button>
              );
            })}
          </div>
        </aside>
      </section>

      <footer className="puzzle-foot">
        <p className="puzzle-hint">
          <HiddenNote id={CHAPTER_TWO.hiddenNoteIds[1]} className="puzzle-hint-secret">
            <span aria-hidden>💡</span>
          </HiddenNote>
          <span>
            Hint
            <br />
            {CHAPTER_TWO.hint}
          </span>
        </p>
        <div className="puzzle-meter">
          <p>
            {placed.size} / {TOTAL} pieces placed
          </p>
          <div className="puzzle-bar" aria-hidden>
            <span style={{ width: `${(placed.size / TOTAL) * 100}%` }} />
          </div>
        </div>
        <button
          type="button"
          className={`puzzle-message-btn${nudge ? " is-nudge" : ""}${done ? " is-ready" : ""}`}
          onClick={openMessage}
        >
          <span aria-hidden>♡</span> Show Me the Message
        </button>
      </footer>

      <button type="button" className="puzzle-back" onClick={() => router.push("/")}>
        Return to the road
      </button>

      {dragging && drag ? (
        <div
          className="puzzle-float"
          style={{
            left: drag.x - drag.grabX,
            top: drag.y - drag.grabY,
            width: boardRef.current
              ? (boardRef.current.clientWidth / COLS) * (VIEW.width / CELL_W)
              : 92,
          }}
        >
          <PieceFace piece={dragging} variant="drag" />
        </div>
      ) : null}

      {messageOpen ? (
        <div className="puzzle-veil" onClick={() => setMessageOpen(false)}>
          <article className="puzzle-letter" onClick={(event) => event.stopPropagation()}>
            <p>{CHAPTER_TWO.messageTitle}</p>
            {CHAPTER_TWO.message.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <button type="button" onClick={() => router.push("/")}>
              Return to the road
            </button>
          </article>
        </div>
      ) : null}

    </main>
  );
}

function pieceBox(piece: Piece) {
  const boardW = COLS * CELL_W;
  const boardH = ROWS * CELL_H;

  return {
    left: `${((piece.col * CELL_W + VIEW.minX) / boardW) * 100}%`,
    top: `${((piece.row * CELL_H + VIEW.minY) / boardH) * 100}%`,
    width: `${(VIEW.width / boardW) * 100}%`,
    height: `${(VIEW.height / boardH) * 100}%`,
  };
}

function PieceFace({ piece, variant }: { piece: Piece; variant: string }) {
  const clipId = `jigsaw-${variant}-${piece.id}`;

  return (
    <svg
      className="jigsaw-svg"
      viewBox={`${VIEW.minX} ${VIEW.minY} ${VIEW.width} ${VIEW.height}`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={piecePath(piece)} />
        </clipPath>
      </defs>
      <image
        href={CHAPTER_TWO.image}
        x={-piece.col * CELL_W}
        y={-piece.row * CELL_H}
        width={COLS * CELL_W}
        height={ROWS * CELL_H}
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMid slice"
      />
      <path d={piecePath(piece)} className="jigsaw-stroke" />
    </svg>
  );
}

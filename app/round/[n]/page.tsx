import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ChapterFive } from "@/components/chapter-five";
import { ChapterFour } from "@/components/chapter-four";
import { ChapterOne } from "@/components/chapter-one";
import { ChapterSeven } from "@/components/chapter-seven";
import { ChapterSix } from "@/components/chapter-six";
import { ChapterThree } from "@/components/chapter-three";
import { ChapterTwo } from "@/components/chapter-two";
import { isRoundId, ROUNDS } from "@/content/game";

export function generateStaticParams() {
  return ROUNDS.map((round) => ({ n: String(round.id) }));
}

export default function RoundPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <RoundFromParams params={params} />
    </Suspense>
  );
}

async function RoundFromParams({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const id = Number(n);

  if (!isRoundId(id)) {
    notFound();
  }

  if (id === 1) {
    return <ChapterOne />;
  }

  if (id === 2) {
    return <ChapterTwo />;
  }

  if (id === 3) {
    return <ChapterThree />;
  }

  if (id === 4) {
    return <ChapterFour />;
  }

  if (id === 5) {
    return <ChapterFive />;
  }

  if (id === 6) {
    return <ChapterSix />;
  }

  return <ChapterSeven />;
}

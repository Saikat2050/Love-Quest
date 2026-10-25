import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-[11px] tracking-[0.2em] text-mist uppercase">
        The road does not go here
      </p>
      <h1 className="mt-3 font-display text-3xl text-parchment">A lost turning</h1>
      <Link
        href="/"
        className="brick-btn mt-8 rounded-full px-6 py-3 font-display text-[11px] tracking-[0.22em] uppercase"
      >
        Back to the first brick
      </Link>
    </main>
  );
}

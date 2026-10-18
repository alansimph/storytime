"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  Hammer,
  Home,
  RotateCcw,
  Shield,
  Wind,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type PageId =
  | "start"
  | "meadow-straw"
  | "muddy-repair"
  | "market-trade"
  | "wolf-first-huff"
  | "forest-sticks"
  | "cross-brace"
  | "shortcut-frame"
  | "brickyard"
  | "damp-bricks"
  | "foundation"
  | "mortar-mix"
  | "neighbor-help"
  | "chimney-watch"
  | "hidden-door"
  | "night-watch"
  | "safe-home"
  | "straw-collapse";

type Choice = {
  label: string;
  next: PageId;
  hint: string;
};

type StoryPage = {
  chapter: string;
  title: string;
  paragraphs: string[];
  house: string;
  wolf: string;
  progress: number;
  choices?: Choice[];
  ending?: "safe" | "danger";
};

const storyPages: Record<PageId, StoryPage> = {
  start: {
    chapter: "Page 1",
    title: "Help the pigs build a house",
    paragraphs: [
      "The three little pigs need a safe home before the wolf comes.",
      "Pick what they should build with. A strong house will keep everyone safe.",
    ],
    house: "An empty yard",
    wolf: "Far away",
    progress: 4,
    choices: [
      {
        label: "Build with straw",
        next: "meadow-straw",
        hint: "Straw is fast, but it is not very strong.",
      },
      {
        label: "Build with sticks",
        next: "forest-sticks",
        hint: "Sticks are better, but they need extra work.",
      },
      {
        label: "Build with bricks",
        next: "brickyard",
        hint: "Bricks take longer, but they are strong.",
      },
    ],
  },
  "meadow-straw": {
    chapter: "Page 2",
    title: "A quick straw house",
    paragraphs: [
      "The pigs make a little straw house very quickly.",
      "It looks cozy, but the walls shake when the wind blows.",
    ],
    house: "A straw house",
    wolf: "Getting closer",
    progress: 24,
    choices: [
      {
        label: "Patch the holes with mud",
        next: "muddy-repair",
        hint: "Try to make the straw house stronger.",
      },
      {
        label: "Say the house is done",
        next: "wolf-first-huff",
        hint: "This is quick, but it may not be safe.",
      },
      {
        label: "Trade straw for bricks",
        next: "market-trade",
        hint: "Start over with stronger stuff.",
      },
    ],
  },
  "muddy-repair": {
    chapter: "Page 3",
    title: "Patch the straw house",
    paragraphs: [
      "The pigs push mud into the holes. The house feels a little better.",
      "The oldest pig says, 'Good try! But bricks would be much safer.'",
    ],
    house: "A patched straw house",
    wolf: "Sniffing the air",
    progress: 38,
    choices: [
      {
        label: "Trade the straw for bricks",
        next: "market-trade",
        hint: "Use stronger building pieces.",
      },
      {
        label: "Ask friends to help build",
        next: "neighbor-help",
        hint: "Many helpers can build faster.",
      },
    ],
  },
  "market-trade": {
    chapter: "Page 4",
    title: "A cart of bricks",
    paragraphs: [
      "The pigs trade their straw for red bricks.",
      "A builder tells them, 'Put bricks on flat ground. Then they will stand tall.'",
    ],
    house: "A cart full of bricks",
    wolf: "Following the trail",
    progress: 45,
    choices: [
      {
        label: "Make a flat foundation",
        next: "foundation",
        hint: "A house needs a strong bottom.",
      },
      {
        label: "Start stacking bricks",
        next: "mortar-mix",
        hint: "Build the walls, but remember the base matters too.",
      },
    ],
  },
  "wolf-first-huff": {
    chapter: "Page 5",
    title: "The wolf knocks",
    paragraphs: [
      "Tap, tap, tap! The wolf is at the straw door.",
      "He takes a big breath. The pigs need a smarter plan now.",
    ],
    house: "A weak straw house",
    wolf: "At the door",
    progress: 28,
    choices: [
      {
        label: "Run to the other pigs",
        next: "neighbor-help",
        hint: "Leave the weak house and work together.",
      },
      {
        label: "Hide behind the straw door",
        next: "straw-collapse",
        hint: "The straw door is too weak.",
      },
    ],
  },
  "forest-sticks": {
    chapter: "Page 2",
    title: "A house made of sticks",
    paragraphs: [
      "The pigs pick up sticks in the woods and build a frame.",
      "It is stronger than straw, but it still wobbles when they push it.",
    ],
    house: "A stick frame",
    wolf: "Walking through the woods",
    progress: 30,
    choices: [
      {
        label: "Finish it fast",
        next: "shortcut-frame",
        hint: "Fast work can make a weak house.",
      },
      {
        label: "Add strong cross pieces",
        next: "cross-brace",
        hint: "Extra sticks can stop the walls from shaking.",
      },
      {
        label: "Ask the other pigs to help",
        next: "neighbor-help",
        hint: "Teamwork makes the job easier.",
      },
    ],
  },
  "cross-brace": {
    chapter: "Page 3",
    title: "Make the stick house stronger",
    paragraphs: [
      "The pigs tie extra sticks across the walls. Now the house shakes less.",
      "They still need to close the windows and the chimney before the wolf comes.",
    ],
    house: "A stronger stick house",
    wolf: "Near the trees",
    progress: 52,
    choices: [
      {
        label: "Cover the chimney and windows",
        next: "chimney-watch",
        hint: "Close every opening.",
      },
      {
        label: "Add bricks around the sticks",
        next: "foundation",
        hint: "Make the house much stronger.",
      },
    ],
  },
  "shortcut-frame": {
    chapter: "Ending",
    title: "The stick house falls",
    paragraphs: [
      "The pigs finish too fast. The sticks are not held down well.",
      "The wolf huffs and puffs. The house falls, but the pigs run away safely.",
    ],
    house: "A fallen stick house",
    wolf: "Laughing outside",
    progress: 32,
    ending: "danger",
  },
  brickyard: {
    chapter: "Page 2",
    title: "The best bricks",
    paragraphs: [
      "The pigs pull a cart to the brickyard. The bricks are heavy.",
      "Heavy work takes time, but the pigs know bricks can make a safe house.",
    ],
    house: "A cart of bricks",
    wolf: "Still far away",
    progress: 22,
    choices: [
      {
        label: "Make a flat foundation",
        next: "foundation",
        hint: "Start with the strong bottom of the house.",
      },
      {
        label: "Stack bricks without mortar",
        next: "damp-bricks",
        hint: "Loose bricks can fall over.",
      },
      {
        label: "Learn to mix mortar",
        next: "mortar-mix",
        hint: "Mortar is sticky stuff that holds bricks together.",
      },
    ],
  },
  "damp-bricks": {
    chapter: "Page 3",
    title: "Wobbly bricks",
    paragraphs: [
      "The pigs stack the bricks without mortar. The wall goes up fast.",
      "Then one corner wobbles. That is not safe.",
    ],
    house: "A wobbly brick wall",
    wolf: "Howling closer",
    progress: 40,
    choices: [
      {
        label: "Take it down and add mortar",
        next: "mortar-mix",
        hint: "Fix the wall the right way.",
      },
      {
        label: "Keep rushing",
        next: "shortcut-frame",
        hint: "Rushing can make the house fall.",
      },
    ],
  },
  foundation: {
    chapter: "Page 4",
    title: "A strong bottom",
    paragraphs: [
      "The pigs make the ground flat and put stones in a neat square.",
      "Now the brick walls will have a strong place to stand.",
    ],
    house: "A flat foundation",
    wolf: "Coming faster",
    progress: 62,
    choices: [
      {
        label: "Add mortar and build walls",
        next: "mortar-mix",
        hint: "Stick the bricks together.",
      },
      {
        label: "Make a secret back door",
        next: "hidden-door",
        hint: "A second door can help everyone feel safe.",
      },
    ],
  },
  "mortar-mix": {
    chapter: "Page 5",
    title: "Sticky mortar",
    paragraphs: [
      "The pigs mix sand, lime, and water. The mortar gets thick and sticky.",
      "They put mortar between every brick. The walls grow strong.",
    ],
    house: "Strong brick walls",
    wolf: "Crossing the grass",
    progress: 76,
    choices: [
      {
        label: "Ask everyone to help finish",
        next: "neighbor-help",
        hint: "Finish the roof and door together.",
      },
      {
        label: "Check the chimney and locks",
        next: "chimney-watch",
        hint: "Make sure the wolf cannot sneak in.",
      },
    ],
  },
  "neighbor-help": {
    chapter: "Page 6",
    title: "Everyone helps",
    paragraphs: [
      "All three pigs work together. One carries bricks. One mixes mortar. One checks the door.",
      "Soon the house has a roof, shutters, and a strong front door.",
    ],
    house: "An almost finished house",
    wolf: "At the edge of the yard",
    progress: 86,
    choices: [
      {
        label: "Make a secret back door",
        next: "hidden-door",
        hint: "It is good to have a backup plan.",
      },
      {
        label: "Wait inside together",
        next: "night-watch",
        hint: "Stay calm in the strong house.",
      },
    ],
  },
  "chimney-watch": {
    chapter: "Page 6",
    title: "Check every opening",
    paragraphs: [
      "The pigs lock the shutters and cover the chimney.",
      "Now the wolf has no easy way inside.",
    ],
    house: "A locked brick house",
    wolf: "Looking at the roof",
    progress: 90,
    choices: [
      {
        label: "Wait inside together",
        next: "night-watch",
        hint: "Let the strong house do its job.",
      },
      {
        label: "Add a secret back door",
        next: "hidden-door",
        hint: "One more safe idea before night.",
      },
    ],
  },
  "hidden-door": {
    chapter: "Page 6",
    title: "A secret back door",
    paragraphs: [
      "The pigs make a small door behind the pantry shelf.",
      "They hope they will not need it, but it helps them feel ready.",
    ],
    house: "A brick house with a secret door",
    wolf: "Almost at the gate",
    progress: 92,
    choices: [
      {
        label: "Start the night watch",
        next: "night-watch",
        hint: "The big test is here.",
      },
    ],
  },
  "night-watch": {
    chapter: "Page 7",
    title: "Huff and puff",
    paragraphs: [
      "The wolf stands outside and takes a huge breath.",
      "Inside, the pigs hold hands. Their brick house is ready.",
    ],
    house: "A finished brick house",
    wolf: "Huffing and puffing",
    progress: 98,
    choices: [
      {
        label: "Stay quiet and trust the house",
        next: "safe-home",
        hint: "The strong house can protect the pigs.",
      },
      {
        label: "Open the window and tease the wolf",
        next: "straw-collapse",
        hint: "Teasing is not a safe choice.",
      },
    ],
  },
  "safe-home": {
    chapter: "Ending",
    title: "Safe at home",
    paragraphs: [
      "The wolf huffs. The wolf puffs. The brick house does not fall.",
      "In the morning, the wolf is gone. The pigs cheer and eat warm soup together.",
    ],
    house: "A safe brick home",
    wolf: "Gone",
    progress: 100,
    ending: "safe",
  },
  "straw-collapse": {
    chapter: "Ending",
    title: "Try again",
    paragraphs: [
      "The wolf finds the weak spot. The house breaks apart.",
      "The pigs run away safely. Next time, they will build slowly and use stronger things.",
    ],
    house: "A broken house",
    wolf: "Too close",
    progress: 18,
    ending: "danger",
  },
};

const endingStyles = {
  safe: "border-emerald-200 bg-emerald-50 text-emerald-900",
  danger: "border-amber-200 bg-amber-50 text-amber-950",
};

export default function HomePage() {
  const [pageId, setPageId] = useState<PageId>("start");
  const [history, setHistory] = useState<PageId[]>([]);
  const storyRef = useRef<HTMLElement>(null);
  const skipInitialScroll = useRef(true);
  const page = storyPages[pageId];

  const pagesSeen = useMemo(
    () => new Set<PageId>([...history, pageId]).size,
    [history, pageId],
  );

  function choose(next: PageId) {
    setHistory((current) => [...current, pageId]);
    setPageId(next);
  }

  function goBack() {
    setHistory((current) => {
      const previous = current.at(-1);

      if (!previous) {
        return current;
      }

      setPageId(previous);
      return current.slice(0, -1);
    });
  }

  function restart() {
    setPageId("start");
    setHistory([]);
  }

  useEffect(() => {
    if (skipInitialScroll.current) {
      skipInitialScroll.current = false;
      return;
    }

    storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pageId]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7efe2] text-stone-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.32),_transparent_28rem),radial-gradient(circle_at_bottom_right,_rgba(120,53,15,0.18),_transparent_30rem)]" />
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl min-w-0 flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="mb-4 flex min-w-0 flex-col gap-4 rounded-3xl border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur sm:mb-5 sm:p-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800 sm:text-sm sm:tracking-[0.28em]">
              <BookOpen className="size-4 shrink-0" aria-hidden="true" />
              Storytime Builder
            </div>
            <h1 className="text-balance text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">
              The Three Little Pigs
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-700 sm:mt-3 sm:text-base sm:leading-7">
              Read the story page by page. Pick simple choices and help the
              pigs build a safe brick home before the wolf arrives.
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:min-w-80">
            <StatusTile
              icon={<Home className="size-5" aria-hidden="true" />}
              label="House"
              value={`${page.progress}%`}
            />
            <StatusTile
              icon={<Wind className="size-5" aria-hidden="true" />}
              label="Wolf"
              value={page.ending === "safe" ? "Gone" : "Near"}
            />
            <StatusTile
              icon={<Shield className="size-5" aria-hidden="true" />}
              label="Pages"
              value={`${pagesSeen}`}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </header>

        <div className="grid min-w-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article
            ref={storyRef}
            className="min-w-0 scroll-mt-4 rounded-[2rem] border border-stone-200 bg-white shadow-2xl shadow-amber-950/10"
          >
            <div className="min-w-0 border-b border-stone-200 p-4 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900">
                  {page.chapter}
                </span>
                {page.ending ? (
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-bold ${
                      endingStyles[page.ending]
                    }`}
                  >
                    {page.ending === "safe" ? "Safe ending" : "Try again"}
                  </span>
                ) : (
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-stone-700">
                    Choose the next page
                  </span>
                )}
              </div>
              <h2 className="text-balance text-2xl font-black leading-tight tracking-tight text-stone-950 sm:text-5xl">
                {page.title}
              </h2>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:gap-8 sm:p-8">
              <div className="space-y-5 text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
                {page.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="break-words">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-black text-stone-950">
                  What should the pigs do?
                </h3>
                {page.choices?.map((choice) => (
                  <button
                    key={`${pageId}-${choice.next}-${choice.label}`}
                    type="button"
                    className="block w-full min-w-0 cursor-pointer rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-base leading-6 whitespace-normal text-stone-900 transition hover:bg-amber-100 focus-visible:ring-3 focus-visible:ring-amber-400/50 focus-visible:outline-none active:translate-y-px"
                    onClick={() => choose(choice.next)}
                  >
                    <span className="block font-black break-words">
                      {choice.label}
                    </span>
                    <span className="mt-1 block text-sm leading-5 font-normal break-words text-stone-600">
                      {choice.hint}
                    </span>
                  </button>
                )) ?? (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 break-words text-stone-700">
                    This ending is done. Start over to try another choice.
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-900 sm:text-sm sm:tracking-[0.2em]">
                  <Hammer className="size-4" aria-hidden="true" />
                  Build progress
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-700 transition-all duration-500"
                    style={{ width: `${page.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-auto min-h-12 flex-1 whitespace-normal rounded-full px-4 py-3 text-base leading-5"
                  onClick={goBack}
                  disabled={history.length === 0}
                >
                  <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                  Back a page
                </Button>
                <Button
                  type="button"
                  variant={page.ending ? "default" : "secondary"}
                  size="lg"
                  className="h-auto min-h-12 flex-1 whitespace-normal rounded-full px-4 py-3 text-base leading-5"
                  onClick={restart}
                >
                  <RotateCcw className="mr-2 size-4" aria-hidden="true" />
                  Start over
                </Button>
              </div>
            </div>
          </article>

          <aside className="flex min-w-0 flex-col gap-4">
            <section className="min-w-0 rounded-[2rem] border border-stone-200 bg-stone-950 p-4 text-white shadow-xl shadow-amber-950/10 sm:p-5">
              <h3 className="text-lg font-black">Story state</h3>
              <dl className="mt-4 space-y-4">
                <StateRow label="House" value={page.house} />
                <StateRow label="Wolf" value={page.wolf} />
                <StateRow
                  label="Goal"
                  value="Build a strong brick home and stay safe."
                />
              </dl>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function StatusTile({
  icon,
  label,
  value,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-3 ${className}`}
    >
      <div className="flex min-w-0 items-center gap-2 text-amber-900">
        {icon}
        <span className="min-w-0 break-words text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2 break-words text-xl font-black text-stone-950">
        {value}
      </div>
    </div>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300 sm:tracking-[0.2em]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm leading-6 text-stone-200">
        {value}
      </dd>
    </div>
  );
}

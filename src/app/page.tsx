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
    title: "A clearing, three plans, one hungry problem",
    paragraphs: [
      "The three little pigs have found a sunny clearing at the edge of the woods. The youngest wants a home before lunch. The middle pig wants something clever. The oldest keeps watching the tree line, where the big bad wolf is said to roam.",
      "You are the pig in charge of the build. Choose where to begin, and turn each page carefully: speed helps, but strength keeps the family safe.",
    ],
    house: "An empty patch of grass",
    wolf: "Rumored beyond the pines",
    progress: 4,
    choices: [
      {
        label: "Race to the meadow for armfuls of straw",
        next: "meadow-straw",
        hint: "Fast walls, but they will need help.",
      },
      {
        label: "Gather fallen branches in the pine grove",
        next: "forest-sticks",
        hint: "A useful frame if you build it carefully.",
      },
      {
        label: "Walk the long road to the old brickyard",
        next: "brickyard",
        hint: "Slow work with the best chance to hold.",
      },
    ],
  },
  "meadow-straw": {
    chapter: "Page 2",
    title: "Golden straw in a hurry",
    paragraphs: [
      "By noon the meadow is bright with straw. You stack it high, twist it into ropes, and have a cozy hut before the kettle boils.",
      "It smells sweet and looks cheerful, but every breeze makes the walls whisper. A small snout-shaped shadow passes between the trees.",
    ],
    house: "Warm straw walls, loosely tied",
    wolf: "Sniffing closer",
    progress: 24,
    choices: [
      {
        label: "Patch the gaps with mud and ask your siblings for advice",
        next: "muddy-repair",
        hint: "Slow down and strengthen the weak spots.",
      },
      {
        label: "Call it finished and decorate the door",
        next: "wolf-first-huff",
        hint: "Trust speed and hope the wolf keeps walking.",
      },
      {
        label: "Trade leftover straw for bricks at the market road",
        next: "market-trade",
        hint: "Turn a fragile start into sturdy supplies.",
      },
    ],
  },
  "muddy-repair": {
    chapter: "Page 3",
    title: "Mud on the hooves",
    paragraphs: [
      "Mud fills the cracks, and your siblings admit the hut feels less drafty. Still, the oldest pig presses one hoof against the wall and frowns.",
      "\"This will buy time,\" she says, \"but time is only useful if we spend it building something better.\"",
    ],
    house: "Straw sealed with mud",
    wolf: "Testing the wind",
    progress: 38,
    choices: [
      {
        label: "Trade straw bundles for bricks before sunset",
        next: "market-trade",
        hint: "Convert quick work into better materials.",
      },
      {
        label: "Ask neighbors to help rebuild together",
        next: "neighbor-help",
        hint: "Many hooves can make a safer house.",
      },
    ],
  },
  "market-trade": {
    chapter: "Page 4",
    title: "A cart full of second chances",
    paragraphs: [
      "The market road is dusty, but a mason needs straw for packing jars. You trade every golden bundle for chipped bricks, a scoop of lime, and a warning.",
      "\"Stack them on a true foundation,\" the mason says. \"A wall is only as brave as the ground beneath it.\"",
    ],
    house: "Bricks stacked beside a straw frame",
    wolf: "Following hoofprints",
    progress: 45,
    choices: [
      {
        label: "Dig and level a proper foundation",
        next: "foundation",
        hint: "The careful path to a house that holds.",
      },
      {
        label: "Mix mortar now and build upward quickly",
        next: "mortar-mix",
        hint: "Useful, but the base still matters.",
      },
    ],
  },
  "wolf-first-huff": {
    chapter: "Page 5",
    title: "Knock, knock, little pig",
    paragraphs: [
      "A heavy paw taps the door. The big bad wolf smiles through the reeds. \"Little pig, little pig, let me come in.\"",
      "The straw rustles around you. A clever answer might buy a moment, but the house itself must answer the huff and puff.",
    ],
    house: "Pretty straw hut",
    wolf: "At the doorstep",
    progress: 28,
    choices: [
      {
        label: "Run out the back and rebuild with your siblings",
        next: "neighbor-help",
        hint: "Lose the hut, save the plan.",
      },
      {
        label: "Stand firm behind the straw door",
        next: "straw-collapse",
        hint: "The classic mistake.",
      },
      {
        label: "Weave more straw over the roof",
        next: "straw-collapse",
        hint: "More of the same will not stop the wolf.",
      },
    ],
  },
  "forest-sticks": {
    chapter: "Page 2",
    title: "Branches, twine, and a square corner",
    paragraphs: [
      "The pine grove offers straight sticks, springy branches, and long vines for tying. Your frame rises quickly, taller and sharper than a straw hut.",
      "The middle pig grins at the clever joints. The oldest pig checks the corners and asks the question nobody likes: \"What happens when the wolf leans on it?\"",
    ],
    house: "Stick frame with open seams",
    wolf: "Circling the grove",
    progress: 30,
    choices: [
      {
        label: "Skip the foundation and close the walls before dusk",
        next: "shortcut-frame",
        hint: "A tempting shortcut with weak roots.",
      },
      {
        label: "Lash cross braces into every wall",
        next: "cross-brace",
        hint: "Make the frame resist shaking.",
      },
      {
        label: "Invite both siblings to combine supplies",
        next: "neighbor-help",
        hint: "Teamwork can cover more weaknesses.",
      },
    ],
  },
  "cross-brace": {
    chapter: "Page 3",
    title: "Triangles against trouble",
    paragraphs: [
      "You lash diagonal braces through the frame until every wall is full of triangles. When the wind blows, the house creaks but does not sway.",
      "The chimney is still only a clay pipe, and the wolf is famous for finding the one opening nobody watched.",
    ],
    house: "Braced timber shell",
    wolf: "Listening at the chimney",
    progress: 52,
    choices: [
      {
        label: "Add a chimney watch and shutters",
        next: "chimney-watch",
        hint: "Protect the gaps a wolf might exploit.",
      },
      {
        label: "Skin the frame with brick and clay",
        next: "foundation",
        hint: "Turn the frame into a permanent home.",
      },
    ],
  },
  "shortcut-frame": {
    chapter: "Ending",
    title: "A house that almost held",
    paragraphs: [
      "The stick walls look finished from the path, but the posts only sit on soft dirt. When the wolf huffs, the corners hop. When he puffs, the roof twists.",
      "You and your siblings escape through a window, wiser and muddy. The wolf does not get supper, but this is not yet the safe home you promised.",
    ],
    house: "Collapsed stick frame",
    wolf: "Laughing in the dust",
    progress: 32,
    ending: "danger",
  },
  brickyard: {
    chapter: "Page 2",
    title: "The slow road to strong walls",
    paragraphs: [
      "The old brickyard is farther than the meadow, and the cart squeaks with every load. But each brick feels like a small promise.",
      "A retired mason watches you count them. \"A brick house is not just bricks,\" he says. \"It is level ground, patient mortar, and no loose openings.\"",
    ],
    house: "Heavy cart of red bricks",
    wolf: "Still distant, but hungry",
    progress: 22,
    choices: [
      {
        label: "Lay the foundation before touching the walls",
        next: "foundation",
        hint: "Start with the part nobody sees.",
      },
      {
        label: "Stack bricks dry to save time",
        next: "damp-bricks",
        hint: "Fast brickwork can still fail.",
      },
      {
        label: "Ask the mason for a proper mortar recipe",
        next: "mortar-mix",
        hint: "Learn the craft before racing ahead.",
      },
    ],
  },
  "damp-bricks": {
    chapter: "Page 3",
    title: "A wall with a wobble",
    paragraphs: [
      "The dry bricks climb quickly, but the first corner shivers when you press it. The youngest pig says it looks finished. The oldest says a finished mistake is still a mistake.",
      "A low howl rolls over the field. There is time to fix this, if you are willing to undo your own work.",
    ],
    house: "Dry-stacked brick wall",
    wolf: "Howling nearer",
    progress: 40,
    choices: [
      {
        label: "Take down the wobbly wall and mix mortar",
        next: "mortar-mix",
        hint: "Recover by doing the craft properly.",
      },
      {
        label: "Ignore the wobble and rush the roof",
        next: "shortcut-frame",
        hint: "A weak wall is a hidden trap.",
      },
    ],
  },
  foundation: {
    chapter: "Page 4",
    title: "The strength below the story",
    paragraphs: [
      "You dig until the soft topsoil gives way to packed earth. Flat stones make a level ring, and the first course of bricks sits square on top.",
      "No song is written about foundations, but the house already feels calmer. Even the birds seem to perch with confidence.",
    ],
    house: "Level stone-and-brick foundation",
    wolf: "Picking up speed",
    progress: 62,
    choices: [
      {
        label: "Mix mortar and raise the walls",
        next: "mortar-mix",
        hint: "Bind the bricks into one solid shelter.",
      },
      {
        label: "Plan a hidden back door before the walls close",
        next: "hidden-door",
        hint: "Safety is stronger with a backup route.",
      },
    ],
  },
  "mortar-mix": {
    chapter: "Page 5",
    title: "Sand, lime, water, patience",
    paragraphs: [
      "You stir mortar until it is smooth as porridge and lay each brick with a tap-tap-tap. The walls climb slower than a wish, but straighter than fear.",
      "By sunset the three pigs can stand inside together. The wolf can smell dinner, yet the house smells like rain on stone.",
    ],
    house: "Brick walls bound with mortar",
    wolf: "Crossing the meadow",
    progress: 76,
    choices: [
      {
        label: "Call the siblings in for the roof and shutters",
        next: "neighbor-help",
        hint: "Finish faster without sacrificing strength.",
      },
      {
        label: "Secure the chimney and test every latch",
        next: "chimney-watch",
        hint: "Close the wolf's favorite openings.",
      },
    ],
  },
  "neighbor-help": {
    chapter: "Page 6",
    title: "Three pigs, one house",
    paragraphs: [
      "The youngest hauls water. The middle pig measures rafters. The oldest checks each line before it sets. Together, the work becomes music: scrape, tap, lift, laugh.",
      "The house gains a roof, shutters, and a stout door with a bar across it. Best of all, everyone knows where to stand when trouble arrives.",
    ],
    house: "Nearly complete family house",
    wolf: "Visible between the trees",
    progress: 86,
    choices: [
      {
        label: "Add a hidden back door and pantry latch",
        next: "hidden-door",
        hint: "Prepare for more than one kind of danger.",
      },
      {
        label: "Light the hearth low and wait together",
        next: "night-watch",
        hint: "Face the wolf from inside the finished home.",
      },
    ],
  },
  "chimney-watch": {
    chapter: "Page 6",
    title: "The hole the wolf remembers",
    paragraphs: [
      "You cap the chimney with iron bars, bank the fire safely, and test the shutters until each one thuds shut. A pot of soup simmers just below the flue.",
      "If the wolf tries the old climb-down trick, he will find smoke, soup steam, and three pigs who read the whole story before he arrived.",
    ],
    house: "Brick home with guarded openings",
    wolf: "Studying the roof",
    progress: 90,
    choices: [
      {
        label: "Gather the family for the final night watch",
        next: "night-watch",
        hint: "Stay calm when the huffing begins.",
      },
      {
        label: "Finish the escape latch as one last precaution",
        next: "hidden-door",
        hint: "Redundancy makes courage easier.",
      },
    ],
  },
  "hidden-door": {
    chapter: "Page 6",
    title: "A quiet latch in the pantry",
    paragraphs: [
      "Behind the pantry shelves, you fit a narrow door that opens into the herb garden. It is not for running from the house. It is for choosing your own path if the wolf blocks the front.",
      "With the latch hidden and the shelves back in place, the house feels less like a trap and more like a plan.",
    ],
    house: "Brick home with a secret exit",
    wolf: "Almost at the gate",
    progress: 92,
    choices: [
      {
        label: "Lock in and begin the night watch",
        next: "night-watch",
        hint: "The final test is here.",
      },
    ],
  },
  "night-watch": {
    chapter: "Page 7",
    title: "Huff, puff, and hold",
    paragraphs: [
      "Moonlight turns the clearing silver. The big bad wolf plants his paws outside your new door and fills his chest with air.",
      "\"Little pigs, little pigs, let me come in!\" he growls. Inside, the bricks are cool, the mortar is set, and three brave pigs stand together.",
    ],
    house: "Finished brick house",
    wolf: "At full huff and puff",
    progress: 98,
    choices: [
      {
        label: "Keep the fire low, lock the shutters, and stay quiet",
        next: "safe-home",
        hint: "Let the house answer for you.",
      },
      {
        label: "Boast from the window about how clever you are",
        next: "straw-collapse",
        hint: "Safety can be undone by a careless choice.",
      },
    ],
  },
  "safe-home": {
    chapter: "Ending",
    title: "Safe inside the house you built",
    paragraphs: [
      "The wolf huffs. The wolf puffs. The door shudders, the shutters rattle, and the chimney coughs smoke back into the night. But the bricks hold.",
      "At dawn, the wolf limps away to bother easier stories. The three pigs share soup by the hearth, proud not because the house was fast, but because every choice made it safer.",
    ],
    house: "Complete, warm, wolf-proof home",
    wolf: "Gone before breakfast",
    progress: 100,
    ending: "safe",
  },
  "straw-collapse": {
    chapter: "Ending",
    title: "A lesson in loose ends",
    paragraphs: [
      "The wolf huffs, puffs, and finds the weak place you left behind. Straw flies, shutters bang, and your plan scatters across the clearing.",
      "The pigs escape with muddy hooves and racing hearts. Next time, they will build with patience, teamwork, and something stronger than hope.",
    ],
    house: "Blown open by the wolf",
    wolf: "Too close for comfort",
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
              Turn the story page by page, choose how to build, and guide the
              pigs toward a finished home that can outlast the big bad wolf.
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
                  What happens next?
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
                    This path has reached its ending. Start over to try a new
                    set of choices.
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
                  value="Complete a strong home and stay safe through the night."
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

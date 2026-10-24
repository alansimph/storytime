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
  | "storm-warning"
  | "leaky-roof"
  | "roof-secured"
  | "water-plan"
  | "water-trap"
  | "water-secured"
  | "kitchen-plan"
  | "kitchen-fire"
  | "settled-home"
  | "hooded-knock"
  | "basket-question"
  | "voice-question"
  | "ears-question"
  | "paws-question"
  | "shadow-question"
  | "disguise-revealed"
  | "wolf-disguise-pounce"
  | "wolf-outsmarted"
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

type ComicMood = "sunny" | "market" | "forest" | "night" | "storm" | "cozy";

type ComicHouse =
  | "empty"
  | "straw"
  | "muddy-straw"
  | "stick"
  | "broken-stick"
  | "brick-supplies"
  | "foundation"
  | "brick"
  | "finished"
  | "leaky"
  | "kitchen"
  | "smoky";

type ComicDetail =
  | "straw"
  | "sticks"
  | "bricks"
  | "mud"
  | "cart"
  | "mortar"
  | "braces"
  | "chimney"
  | "shutters"
  | "secret-door"
  | "rain"
  | "leak"
  | "ladder"
  | "barrel"
  | "pump"
  | "stream"
  | "fire"
  | "bucket"
  | "smoke"
  | "soup";

type ComicScene = {
  caption: string;
  mood: ComicMood;
  house: ComicHouse;
  details: ComicDetail[];
  wolf?: "distant" | "near" | "huff" | "disguised" | "gone";
  sound?: string;
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
    chapter: "Page 8",
    title: "Safe from the wolf, not done with the woods",
    paragraphs: [
      "The wolf huffs. The wolf puffs. The door shudders, the shutters rattle, and the chimney coughs smoke back into the night. But the bricks hold.",
      "At dawn, the wolf limps away to bother easier stories. The three pigs share soup by the hearth, proud not because the house was fast, but because every choice made it safer.",
      "Then thunder mutters over the hills, the empty water pail clanks by the door, and breakfast smoke curls too close to the rafters. Surviving one attack has taught the pigs a bigger lesson: a safe home must also handle tomorrow.",
    ],
    house: "Wolf-proof brick home with new chores waiting",
    wolf: "Retreating beyond the trees",
    progress: 90,
    choices: [
      {
        label: "Inspect the roof before the heavy rain arrives",
        next: "storm-warning",
        hint: "A strong wall still needs a dry ceiling.",
      },
      {
        label: "Ignore the clouds and celebrate all morning",
        next: "leaky-roof",
        hint: "Rain finds every lazy seam.",
      },
    ],
  },
  "storm-warning": {
    chapter: "Page 9",
    title: "Clouds over the brick roof",
    paragraphs: [
      "By midday the sky turns the color of an old iron pot. The roof tiles click in the wind, and a cold drop lands right on the oldest pig's blueprint.",
      "The youngest wants to throw straw over the hole. The middle pig suggests climbing up with a rope. The oldest pig points to the ladder hooks, spare tiles, and a bucket of pitch kept under the eaves.",
    ],
    house: "Brick home with a worried roofline",
    wolf: "Somewhere in the wet woods",
    progress: 91,
    choices: [
      {
        label: "Hook the ladder, replace cracked tiles, and seal the seams",
        next: "roof-secured",
        hint: "Careful roof work keeps the storm outside.",
      },
      {
        label: "Pile loose straw over the damp patch from inside",
        next: "leaky-roof",
        hint: "A quick cover can become a soggy problem.",
      },
      {
        label: "Send one pig outside in the rain to hold a board over it",
        next: "water-trap",
        hint: "Leaving the safe house alone gives the wolf a chance.",
      },
    ],
  },
  "leaky-roof": {
    chapter: "Ending",
    title: "The drip that became a drumbeat",
    paragraphs: [
      "The first leak is only a plink in a mixing bowl. Then the ceiling darkens, the straw patch sags, and water runs down the pantry wall.",
      "The pigs save the soup and stay out of the wolf's jaws, but the house is cold, damp, and miserable by nightfall. A brave home still needs maintenance before the weather turns.",
    ],
    house: "Safe walls under a leaking roof",
    wolf: "Waiting for a mistake",
    progress: 72,
    ending: "danger",
  },
  "roof-secured": {
    chapter: "Page 10",
    title: "Dry rafters, steady hearts",
    paragraphs: [
      "The pigs work from the hooked ladder while one keeps watch at the shutter. Cracked tiles come off, fresh tiles overlap like scales, and pitch seals the seams before the rain breaks open.",
      "When the storm finally drums on the roof, every drop rolls into the gutter instead of the beds. The youngest pig cheers until the water pail answers with a hollow clonk.",
    ],
    house: "Rain-tight brick home",
    wolf: "Hidden by the storm",
    progress: 94,
    choices: [
      {
        label: "Build a water system so no one must visit the far stream",
        next: "water-plan",
        hint: "The wolf cannot ambush a pig who stays near home.",
      },
      {
        label: "Wait until morning and fetch water from the stream",
        next: "water-trap",
        hint: "The old chore is the wolf's favorite opportunity.",
      },
    ],
  },
  "water-plan": {
    chapter: "Page 11",
    title: "Water without the dangerous walk",
    paragraphs: [
      "The stream is clear, but it bends through the dark pines where yellow eyes can hide. The pigs need washing water, soup water, and mortar water without wandering far from the door.",
      "They sketch a system: gutters to catch rain, a covered barrel beside the kitchen wall, and a hand pump over the shallow well inside the fenced yard.",
    ],
    house: "Dry home ready for better water",
    wolf: "Sniffing around the stream path",
    progress: 95,
    choices: [
      {
        label: "Fit gutters, cover the rain barrel, and prime the yard pump",
        next: "water-secured",
        hint: "Bring water close and keep it clean.",
      },
      {
        label: "Carry buckets from the stream before sunrise",
        next: "water-trap",
        hint: "Fast feet are still outside the walls.",
      },
      {
        label: "Leave an open barrel under the roof and hope it fills",
        next: "water-trap",
        hint: "Uncovered water attracts mud, bugs, and trouble.",
      },
    ],
  },
  "water-trap": {
    chapter: "Ending",
    title: "Too far from the door",
    paragraphs: [
      "The pail feels light on the way out and terribly heavy on the way back. Halfway from the stream, a wet branch snaps behind you.",
      "The pigs sprint home and slam the bar just before the wolf reaches the step. They are safe for now, but the spilled bucket proves the lesson: a house is safer when daily needs do not pull anyone into danger.",
    ],
    house: "Strong house with unsafe chores",
    wolf: "Prowling the water path",
    progress: 78,
    ending: "danger",
  },
  "water-secured": {
    chapter: "Page 12",
    title: "A barrel, a pump, and no lonely footsteps",
    paragraphs: [
      "Rainwater rattles through the gutters into a covered barrel, and the little hand pump squeaks up clear well water inside the fence. The pigs mark one bucket for drinking, one for washing, and one for emergencies.",
      "Now no one has to cross the wolf's path for a drink. The middle pig looks at the emergency bucket, then at the hearth, and realizes the next danger could start inside the house.",
    ],
    house: "Rain-tight home with close, covered water",
    wolf: "Frustrated near the stream",
    progress: 97,
    choices: [
      {
        label: "Set up a small kitchen that can cook safely with fire",
        next: "kitchen-plan",
        hint: "Warm meals need a hearth that respects sparks.",
      },
      {
        label: "Cook over an open flame on the wooden table",
        next: "kitchen-fire",
        hint: "The wolf is not the only thing that can burn a home down.",
      },
    ],
  },
  "kitchen-plan": {
    chapter: "Page 13",
    title: "A little kitchen for careful fire",
    paragraphs: [
      "The pigs choose the corner nearest the chimney and clear it down to stone. They set flat bricks for a hearth, hang the soup pot from an iron hook, and stack firewood in a lidded box away from sparks.",
      "A bucket of pump water waits beside the door, a small vent carries smoke upward, and a sand tray catches embers before they can roll under the cupboards.",
    ],
    house: "Brick home with a planned kitchen corner",
    wolf: "Hungry, wet, and outside",
    progress: 99,
    choices: [
      {
        label: "Keep the flame low, cook supper, and bank the coals",
        next: "settled-home",
        hint: "A careful kitchen makes the house livable.",
      },
      {
        label: "Pile on extra logs to make the soup boil faster",
        next: "kitchen-fire",
        hint: "Too much fire turns comfort into danger.",
      },
    ],
  },
  "kitchen-fire": {
    chapter: "Ending",
    title: "Smoke before supper",
    paragraphs: [
      "The flame leaps higher than the pot. Sparks spit toward the cupboard, smoke crawls under the rafters, and the pigs cough while scrambling for the water bucket.",
      "They put the fire out before the house is lost, but supper is ruined and everyone is shaking. A safe kitchen needs stone, distance, water, and patience.",
    ],
    house: "Smoke-stained home with a hard lesson",
    wolf: "Watching the chimney smoke",
    progress: 82,
    ending: "danger",
  },
  "settled-home": {
    chapter: "Page 14",
    title: "A home ready for more than wolves",
    paragraphs: [
      "Rain falls all night, but the roof stays quiet. The barrel fills, the pump stands ready, and supper bubbles over a small steady flame in the brick hearth.",
      "The wolf prowls once around the fence, hears three pigs laughing over warm bowls, and slinks away. The house is not just strong now. It is dry, supplied, careful with fire, and truly lived in.",
      "Just as the pigs begin to clear the bowls, three soft knocks tap the door. A bent old lady in a deep hood stands outside with a basket on her arm.",
    ],
    house: "Dry, supplied, fire-safe family home",
    wolf: "Possibly gone, possibly clever",
    progress: 99,
    choices: [
      {
        label: "Keep the bar down and ask who is knocking",
        next: "hooded-knock",
        hint: "A safe door lets you be polite and careful.",
      },
      {
        label: "Open the door for the poor old lady",
        next: "wolf-disguise-pounce",
        hint: "Kindness without caution can invite danger inside.",
      },
    ],
  },
  "hooded-knock": {
    chapter: "Page 15",
    title: "The old lady under the hood",
    paragraphs: [
      "\"Good evening, little dears,\" croaks the visitor. Her hood hangs low over her face, and her basket smells of pepper, rain, and something wild.",
      "The youngest pig reaches for the latch, but the oldest pig raises one hoof. \"We can ask questions through a locked door,\" she whispers. \"Anyone honest can answer.\"",
    ],
    house: "Warm house with the front door barred",
    wolf: "Hidden under a hood",
    progress: 99,
    choices: [
      {
        label: "Ask, \"What is in your basket, Granny?\"",
        next: "basket-question",
        hint: "A basket can tell a story too.",
      },
      {
        label: "Ask, \"Why is your voice so low and growly?\"",
        next: "voice-question",
        hint: "Listen before opening.",
      },
      {
        label: "Unbar the door because she sounds lonely",
        next: "wolf-disguise-pounce",
        hint: "The hood is hiding more than wrinkles.",
      },
    ],
  },
  "basket-question": {
    chapter: "Page 16",
    title: "The basket that smelled wrong",
    paragraphs: [
      "\"Herbs and biscuits,\" says the old lady. But when she lifts the basket, the pigs hear bones click, and a tuft of gray fur sticks to the handle.",
      "The middle pig points at the peephole. \"Biscuits do not usually scratch baskets with claws,\" he whispers.",
    ],
    house: "Barred door with a watchful peephole",
    wolf: "Pretending to be patient",
    progress: 99,
    choices: [
      {
        label: "Ask, \"Why are your ears so pointy under that hood?\"",
        next: "ears-question",
        hint: "The hood cannot hide everything.",
      },
      {
        label: "Ask, \"Why is your voice so low and growly?\"",
        next: "voice-question",
        hint: "Check another clue before deciding.",
      },
      {
        label: "Open the door because she mentioned biscuits",
        next: "wolf-disguise-pounce",
        hint: "A tasty story can still be a trap.",
      },
    ],
  },
  "voice-question": {
    chapter: "Page 16",
    title: "A cough that sounded like a howl",
    paragraphs: [
      "\"A chill in my throat,\" the old lady says. Then she coughs so hard the chimney soot trembles, and the last note curls into a hungry little howl.",
      "The youngest pig backs away from the latch. The oldest pig nods. \"A second clue,\" she says. \"Ask for proof we can see.\"",
    ],
    house: "Quiet house listening at the door",
    wolf: "Growling behind a sweet voice",
    progress: 99,
    choices: [
      {
        label: "Ask, \"Please show your hands before we open.\"",
        next: "paws-question",
        hint: "Hands are hard to fake when they are paws.",
      },
      {
        label: "Ask, \"What is in your basket, Granny?\"",
        next: "basket-question",
        hint: "One clue is useful; two clues are better.",
      },
      {
        label: "Open the door before she coughs again",
        next: "wolf-disguise-pounce",
        hint: "A growl is a warning, not an invitation.",
      },
    ],
  },
  "ears-question": {
    chapter: "Page 17",
    title: "Two ears too sharp",
    paragraphs: [
      "\"All the better to hear you with,\" says the old lady, and she tugs the hood lower. But one gray ear pokes out, sharp as a roof tile.",
      "The pigs trade a look. The story is becoming familiar, but they keep asking from behind the safe, locked door.",
    ],
    house: "Door still locked while clues pile up",
    wolf: "Losing the disguise one clue at a time",
    progress: 99,
    choices: [
      {
        label: "Ask, \"Please show your hands before we open.\"",
        next: "paws-question",
        hint: "The next clue is right below the sleeves.",
      },
      {
        label: "Ask her to step into the lantern light",
        next: "shadow-question",
        hint: "A shadow can tell the truth.",
      },
      {
        label: "Open the door because she answered the question",
        next: "wolf-disguise-pounce",
        hint: "An answer is not the same as proof.",
      },
    ],
  },
  "paws-question": {
    chapter: "Page 18",
    title: "Hands with claws",
    paragraphs: [
      "\"My hands are shy,\" says the old lady. But when she reaches to adjust the basket, five long claws flash from one sleeve.",
      "The middle pig whispers, \"Those are not knitting hands.\" The oldest pig points to the lantern by the window. \"One final question.\"",
    ],
    house: "Safe house with every latch still shut",
    wolf: "Almost revealed",
    progress: 99,
    choices: [
      {
        label: "Ask her to step into the lantern light",
        next: "shadow-question",
        hint: "Let the light check the disguise.",
      },
      {
        label: "Tell her you know she is the wolf",
        next: "disguise-revealed",
        hint: "The clues already point one way.",
      },
      {
        label: "Open the door to inspect the claws closely",
        next: "wolf-disguise-pounce",
        hint: "Never inspect claws from inside their reach.",
      },
    ],
  },
  "shadow-question": {
    chapter: "Page 19",
    title: "The shadow on the path",
    paragraphs: [
      "The old lady shuffles into the lantern light. On the door curtain, her shadow grows tall: pointed ears, long snout, and a tail twitching under the cloak.",
      "\"That is not Granny,\" says the youngest pig. \"That is a wolf wearing a story costume.\"",
    ],
    house: "Bright doorway with the bar still firm",
    wolf: "Caught by his own shadow",
    progress: 99,
    choices: [
      {
        label: "Call out every clue and keep the door barred",
        next: "disguise-revealed",
        hint: "Naming the trick takes away its power.",
      },
      {
        label: "Open the door to prove you are not afraid",
        next: "wolf-disguise-pounce",
        hint: "Bravery still needs a locked door.",
      },
    ],
  },
  "disguise-revealed": {
    chapter: "Page 20",
    title: "Not an old lady at all",
    paragraphs: [
      "\"Basket of bones, growly voice, pointed ears, clawed hands, wolf-shaped shadow,\" the pigs chant together. \"You are the big bad wolf!\"",
      "The hood flies back. The wolf snarls, embarrassed and hungry, but the door is still barred, the water bucket is full, and three clever pigs are ready.",
    ],
    house: "Prepared home with the trick exposed",
    wolf: "Revealed at the doorstep",
    progress: 100,
    choices: [
      {
        label: "Bang the soup pot, spray pump water, and shout for neighbors",
        next: "wolf-outsmarted",
        hint: "Use the safe house systems together.",
      },
      {
        label: "Slip outside through the secret door to scare him",
        next: "wolf-disguise-pounce",
        hint: "Leaving safety gives the wolf what he wants.",
      },
    ],
  },
  "wolf-disguise-pounce": {
    chapter: "Ending",
    title: "The hood falls, the wolf pounces",
    paragraphs: [
      "The latch clicks. The old lady straightens, the hood drops, and the big bad wolf springs forward with a grin full of teeth.",
      "The pigs tumble backward and slam the inner pantry door just in time. They survive, but the lesson is loud: when danger wears a disguise, questions belong before kindness opens the door.",
    ],
    house: "Strong home with one careless opening",
    wolf: "Inside the first doorway",
    progress: 84,
    ending: "danger",
  },
  "wolf-outsmarted": {
    chapter: "Ending",
    title: "Questions beat the costume",
    paragraphs: [
      "The pigs bang the soup pot like a bell, spray a cold stream of pump water through the door slot, and shout the wolf's trick so every neighbor hears.",
      "Wet, exposed, and outnumbered, the wolf flees into the trees with his hood flapping behind him. The pigs lock up, laugh softly, and add one more rule to the house: a safe door can be kind, curious, and closed.",
    ],
    house: "Dry, supplied, fire-safe, and trick-proof home",
    wolf: "Running away in a soggy hood",
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

const comicScenes: Record<PageId, ComicScene> = {
  start: {
    caption: "Three pigs choose straw, sticks, or bricks while the wolf hides far away.",
    mood: "sunny",
    house: "empty",
    details: ["straw", "sticks", "bricks"],
    wolf: "distant",
    sound: "Pick!",
  },
  "meadow-straw": {
    caption: "A quick straw hut rises in the meadow as the wolf sniffs closer.",
    mood: "sunny",
    house: "straw",
    details: ["straw"],
    wolf: "distant",
    sound: "Rustle!",
  },
  "muddy-repair": {
    caption: "The pigs smear mud into the straw gaps to slow down the wind.",
    mood: "sunny",
    house: "muddy-straw",
    details: ["mud", "straw"],
    wolf: "distant",
    sound: "Splat!",
  },
  "market-trade": {
    caption: "A cart carries traded bricks and mortar supplies away from the market road.",
    mood: "market",
    house: "brick-supplies",
    details: ["cart", "bricks", "straw"],
    wolf: "near",
    sound: "Trade!",
  },
  "wolf-first-huff": {
    caption: "The wolf huffs at the pretty straw door.",
    mood: "storm",
    house: "straw",
    details: ["straw"],
    wolf: "huff",
    sound: "Huff!",
  },
  "forest-sticks": {
    caption: "The pigs tie branches into a clever stick frame in the pine grove.",
    mood: "forest",
    house: "stick",
    details: ["sticks"],
    wolf: "near",
    sound: "Tie!",
  },
  "cross-brace": {
    caption: "Diagonal braces turn the stick walls into strong triangles.",
    mood: "forest",
    house: "stick",
    details: ["sticks", "braces"],
    wolf: "near",
    sound: "Brace!",
  },
  "shortcut-frame": {
    caption: "The shortcut frame twists apart when the wolf's wind hits it.",
    mood: "storm",
    house: "broken-stick",
    details: ["sticks", "smoke"],
    wolf: "huff",
    sound: "Crash!",
  },
  brickyard: {
    caption: "At the brickyard, every red brick feels like a promise.",
    mood: "market",
    house: "brick-supplies",
    details: ["cart", "bricks"],
    wolf: "distant",
    sound: "Clack!",
  },
  "damp-bricks": {
    caption: "Dry-stacked bricks wobble before the pigs fix their mistake.",
    mood: "storm",
    house: "brick-supplies",
    details: ["bricks"],
    wolf: "near",
    sound: "Wobble!",
  },
  foundation: {
    caption: "A level stone foundation gives the future brick house a strong start.",
    mood: "sunny",
    house: "foundation",
    details: ["bricks", "mortar"],
    wolf: "near",
    sound: "Level!",
  },
  "mortar-mix": {
    caption: "Smooth mortar binds the brick walls together.",
    mood: "sunny",
    house: "brick",
    details: ["bricks", "mortar"],
    wolf: "near",
    sound: "Tap!",
  },
  "neighbor-help": {
    caption: "All three pigs lift, measure, and finish the family house together.",
    mood: "sunny",
    house: "finished",
    details: ["bricks", "shutters"],
    wolf: "near",
    sound: "Team!",
  },
  "chimney-watch": {
    caption: "Bars, shutters, and a watched chimney block the wolf's favorite tricks.",
    mood: "cozy",
    house: "finished",
    details: ["chimney", "shutters", "soup"],
    wolf: "near",
    sound: "Clang!",
  },
  "hidden-door": {
    caption: "A secret pantry door gives the pigs a backup plan.",
    mood: "cozy",
    house: "finished",
    details: ["secret-door", "shutters"],
    wolf: "near",
    sound: "Click!",
  },
  "night-watch": {
    caption: "Under moonlight, the pigs wait inside while the wolf gathers one huge breath.",
    mood: "night",
    house: "finished",
    details: ["chimney", "shutters", "fire"],
    wolf: "huff",
    sound: "Puff!",
  },
  "safe-home": {
    caption: "The brick house survives, but rain clouds and chores gather after breakfast.",
    mood: "storm",
    house: "finished",
    details: ["rain", "bucket", "smoke"],
    wolf: "gone",
    sound: "Safe!",
  },
  "storm-warning": {
    caption: "Dark clouds warn the pigs to repair the roof before the downpour.",
    mood: "storm",
    house: "finished",
    details: ["rain", "ladder", "leak"],
    wolf: "distant",
    sound: "Drip!",
  },
  "leaky-roof": {
    caption: "Water sneaks through a lazy roof patch and drums into a bowl.",
    mood: "storm",
    house: "leaky",
    details: ["rain", "leak", "bucket"],
    wolf: "near",
    sound: "Plink!",
  },
  "roof-secured": {
    caption: "Fresh tiles and sealed seams send every raindrop into the gutter.",
    mood: "storm",
    house: "finished",
    details: ["rain", "ladder", "bucket"],
    wolf: "distant",
    sound: "Fixed!",
  },
  "water-plan": {
    caption: "Gutters, a covered barrel, and a pump keep water close to home.",
    mood: "sunny",
    house: "finished",
    details: ["barrel", "pump", "stream"],
    wolf: "near",
    sound: "Plan!",
  },
  "water-trap": {
    caption: "A trip to the far stream gives the wolf a chance to pounce.",
    mood: "forest",
    house: "finished",
    details: ["stream", "bucket"],
    wolf: "huff",
    sound: "Run!",
  },
  "water-secured": {
    caption: "Covered water storage and a yard pump keep the pigs safely supplied.",
    mood: "sunny",
    house: "finished",
    details: ["barrel", "pump", "bucket"],
    wolf: "near",
    sound: "Splash!",
  },
  "kitchen-plan": {
    caption: "A stone hearth, water bucket, and tidy wood box make a safe kitchen.",
    mood: "cozy",
    house: "kitchen",
    details: ["fire", "bucket", "soup"],
    wolf: "near",
    sound: "Simmer!",
  },
  "kitchen-fire": {
    caption: "Too many logs make smoke and sparks leap toward the cupboards.",
    mood: "storm",
    house: "smoky",
    details: ["fire", "bucket", "smoke"],
    wolf: "near",
    sound: "Sizzle!",
  },
  "settled-home": {
    caption: "The home is dry, supplied with water, safe for warm meals, and suddenly interrupted by a knock.",
    mood: "cozy",
    house: "kitchen",
    details: ["rain", "barrel", "pump", "fire", "soup"],
    wolf: "disguised",
    sound: "Knock!",
  },
  "hooded-knock": {
    caption: "A hooded old lady waits outside while the pigs keep the door locked.",
    mood: "night",
    house: "finished",
    details: ["shutters", "fire"],
    wolf: "disguised",
    sound: "Who?",
  },
  "basket-question": {
    caption: "The basket clue reveals bones, scratches, and a suspicious tuft of gray fur.",
    mood: "night",
    house: "finished",
    details: ["shutters", "bucket"],
    wolf: "disguised",
    sound: "Clue!",
  },
  "voice-question": {
    caption: "The old lady's cough curls into a growly little howl.",
    mood: "night",
    house: "finished",
    details: ["chimney", "smoke"],
    wolf: "disguised",
    sound: "Growl!",
  },
  "ears-question": {
    caption: "A sharp gray ear pokes out from under the hood.",
    mood: "night",
    house: "finished",
    details: ["shutters"],
    wolf: "disguised",
    sound: "Ears!",
  },
  "paws-question": {
    caption: "Clawed paws flash from the sleeves when the visitor lifts the basket.",
    mood: "night",
    house: "finished",
    details: ["bucket"],
    wolf: "disguised",
    sound: "Claws!",
  },
  "shadow-question": {
    caption: "Lantern light throws a wolf-shaped shadow across the curtain.",
    mood: "night",
    house: "finished",
    details: ["fire", "shutters"],
    wolf: "disguised",
    sound: "Shadow!",
  },
  "disguise-revealed": {
    caption: "The pigs list the clues and reveal the big bad wolf under the hood.",
    mood: "night",
    house: "finished",
    details: ["bucket", "soup"],
    wolf: "huff",
    sound: "Aha!",
  },
  "wolf-disguise-pounce": {
    caption: "Opening the door too soon lets the disguised wolf pounce inside.",
    mood: "storm",
    house: "finished",
    details: ["secret-door", "smoke"],
    wolf: "huff",
    sound: "Pounce!",
  },
  "wolf-outsmarted": {
    caption: "Questions, a locked door, pump water, and noisy neighbors send the wolf running.",
    mood: "cozy",
    house: "kitchen",
    details: ["pump", "bucket", "soup"],
    wolf: "gone",
    sound: "Smart!",
  },
  "straw-collapse": {
    caption: "Loose straw explodes into the air when the wolf finds the weak spot.",
    mood: "storm",
    house: "straw",
    details: ["straw", "smoke"],
    wolf: "huff",
    sound: "Whoosh!",
  },
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
              <ComicPanel
                pageId={pageId}
                page={page}
                scene={comicScenes[pageId]}
              />

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

const comicPalettes: Record<
  ComicMood,
  { sky: string; ground: string; hill: string; glow: string }
> = {
  sunny: {
    sky: "#bfdbfe",
    ground: "#86efac",
    hill: "#bbf7d0",
    glow: "#facc15",
  },
  market: {
    sky: "#fde68a",
    ground: "#d9a35f",
    hill: "#fcd34d",
    glow: "#fb923c",
  },
  forest: {
    sky: "#bbf7d0",
    ground: "#65a30d",
    hill: "#4ade80",
    glow: "#84cc16",
  },
  night: {
    sky: "#1e293b",
    ground: "#365314",
    hill: "#334155",
    glow: "#fde68a",
  },
  storm: {
    sky: "#94a3b8",
    ground: "#65a30d",
    hill: "#64748b",
    glow: "#fef3c7",
  },
  cozy: {
    sky: "#fed7aa",
    ground: "#84cc16",
    hill: "#fdba74",
    glow: "#fb923c",
  },
};

function ComicPanel({
  pageId,
  page,
  scene,
}: {
  pageId: PageId;
  page: StoryPage;
  scene: ComicScene;
}) {
  const palette = comicPalettes[scene.mood];
  const titleId = `comic-panel-title-${pageId}`;

  return (
    <figure className="overflow-hidden rounded-[1.75rem] border-4 border-stone-950 bg-white shadow-[8px_8px_0_rgba(28,25,23,0.18)]">
      <div className="relative bg-amber-100 p-2 sm:p-3">
        <svg
          role="img"
          aria-labelledby={titleId}
          viewBox="0 0 640 390"
          className="h-auto w-full rounded-[1.25rem] border-2 border-stone-950 bg-white"
        >
          <title id={titleId}>{scene.caption}</title>
          <defs>
            <pattern
              id={`comic-dots-${pageId}`}
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.6" fill="#292524" opacity="0.22" />
            </pattern>
            <linearGradient
              id={`comic-shine-${pageId}`}
              x1="0"
              x2="1"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.46" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#292524" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <rect width="640" height="390" fill={palette.sky} />
          <rect
            width="640"
            height="390"
            fill={`url(#comic-dots-${pageId})`}
            opacity="0.16"
          />
          <circle cx="96" cy="70" r="34" fill={palette.glow} opacity="0.95" />
          {scene.mood === "night" ? (
            <>
              <circle cx="102" cy="68" r="30" fill="#fef9c3" />
              <circle cx="116" cy="58" r="28" fill={palette.sky} />
            </>
          ) : null}
          {scene.mood === "storm" ? <StormClouds /> : null}
          <path
            d="M0 245 C90 212 160 242 238 218 C335 188 414 225 512 202 C575 188 612 202 640 190 L640 360 L0 360 Z"
            fill={palette.hill}
            opacity="0.82"
          />
          <rect y="260" width="640" height="100" fill={palette.ground} />
          <BackgroundTrees mood={scene.mood} />
          {scene.details.includes("stream") ? <StreamDetail /> : null}
          <ComicHouseDrawing house={scene.house} details={scene.details} />
          <SceneSpotlight scene={scene} />
          <ComicDetails details={scene.details} />
          <ComicPig x={132} y={286} color="#f9a8d4" />
          <ComicPig x={178} y={292} color="#fda4af" scale={0.9} />
          <ComicPig x={218} y={286} color="#fbcfe8" scale={1.08} />
          {scene.wolf ? <ComicWolf variant={scene.wolf} /> : null}
          {scene.sound ? <SoundBubble label={scene.sound} /> : null}
          {scene.details.includes("rain") ? <RainDrops /> : null}
          <StoryRibbon title={page.title} />
          <rect
            width="640"
            height="390"
            fill={`url(#comic-shine-${pageId})`}
            pointerEvents="none"
          />
        </svg>
      </div>
      <figcaption className="border-t-4 border-stone-950 bg-white px-4 py-3 text-sm font-black text-stone-800 sm:text-base">
        Comic picture: {scene.caption}
      </figcaption>
      <ChoicePreviewStrip choices={page.choices} ending={page.ending} />
    </figure>
  );
}

function StoryRibbon({ title }: { title: string }) {
  const label = title.length > 42 ? `${title.slice(0, 39)}...` : title;

  return (
    <g>
      <path
        d="M250 18 H598 Q616 18 616 36 V72 Q616 90 598 90 H272 L250 110 V90 H240 Q222 90 222 72 V36 Q222 18 240 18 Z"
        fill="#fff7ed"
        stroke="#292524"
        strokeWidth="5"
      />
      <text
        x="420"
        y="52"
        textAnchor="middle"
        className="fill-stone-950 text-[18px] font-black"
      >
        {label}
      </text>
      <text
        x="420"
        y="76"
        textAnchor="middle"
        className="fill-amber-800 text-[13px] font-black uppercase tracking-wider"
      >
        story scene
      </text>
    </g>
  );
}

function SceneSpotlight({ scene }: { scene: ComicScene }) {
  const hasWater =
    scene.details.includes("barrel") ||
    scene.details.includes("pump") ||
    scene.details.includes("stream");
  const hasKitchen =
    scene.details.includes("fire") ||
    scene.details.includes("soup") ||
    scene.house === "kitchen" ||
    scene.house === "smoky";
  const hasBuild =
    scene.details.includes("bricks") ||
    scene.details.includes("mortar") ||
    scene.house === "foundation" ||
    scene.house === "brick-supplies";
  const hasFragile =
    scene.house === "straw" ||
    scene.house === "muddy-straw" ||
    scene.house === "stick" ||
    scene.house === "broken-stick";

  if (scene.wolf === "disguised") {
    return <DisguiseSpotlight clue={scene.sound ?? "Clue!"} />;
  }

  if (scene.details.includes("leak") || scene.details.includes("ladder")) {
    return <RoofSpotlight />;
  }

  if (hasWater) {
    return <WaterSpotlight />;
  }

  if (hasKitchen) {
    return <KitchenSpotlight smoky={scene.house === "smoky"} />;
  }

  if (hasBuild) {
    return <BuildSpotlight />;
  }

  if (hasFragile || scene.wolf === "huff") {
    return <FragileSpotlight danger={scene.wolf === "huff"} />;
  }

  return <FamilySpotlight />;
}

function SpotlightShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <g>
      <rect
        x="24"
        y="146"
        width="190"
        height="138"
        rx="18"
        fill="#fef3c7"
        stroke="#292524"
        strokeWidth="5"
      />
      <rect x="36" y="158" width="166" height="82" rx="12" fill="#fff7ed" />
      {children}
      <rect x="36" y="246" width="166" height="28" rx="10" fill="#292524" />
      <text
        x="119"
        y="266"
        textAnchor="middle"
        className="fill-amber-100 text-[14px] font-black uppercase"
      >
        {title}
      </text>
    </g>
  );
}

function DisguiseSpotlight({ clue }: { clue: string }) {
  return (
    <SpotlightShell title="spot the trick">
      <path d="M88 172 L68 228 H154 L134 172 Z" fill="#6d28d9" stroke="#292524" strokeWidth="4" />
      <circle cx="111" cy="190" r="28" fill="#71717a" stroke="#292524" strokeWidth="4" />
      <path d="M94 168 L84 140 L112 160 Z" fill="#71717a" stroke="#292524" strokeWidth="4" />
      <path d="M126 166 L146 140 L142 174 Z" fill="#71717a" stroke="#292524" strokeWidth="4" />
      <ellipse cx="106" cy="200" rx="23" ry="13" fill="#f8fafc" stroke="#292524" strokeWidth="4" />
      <circle cx="101" cy="187" r="4" fill="#fef08a" />
      <circle cx="120" cy="187" r="4" fill="#fef08a" />
      <path d="M144 220 C164 208 176 226 154 238" fill="none" stroke="#57534e" strokeLinecap="round" strokeWidth="8" />
      <text x="111" y="235" textAnchor="middle" className="fill-stone-950 text-[15px] font-black">
        {clue}
      </text>
    </SpotlightShell>
  );
}

function RoofSpotlight() {
  return (
    <SpotlightShell title="roof close-up">
      <path d="M62 214 L116 166 L170 214 Z" fill="#991b1b" stroke="#292524" strokeWidth="4" />
      <path d="M76 212 H158" stroke="#fecaca" strokeWidth="5" strokeLinecap="round" />
      <path d="M92 190 H142" stroke="#fecaca" strokeWidth="5" strokeLinecap="round" />
      <path d="M118 170 C126 188 134 202 118 214 C102 202 110 188 118 170 Z" fill="#2563eb" />
      <g stroke="#78350f" strokeLinecap="round" strokeWidth="5">
        <line x1="166" y1="232" x2="190" y2="174" />
        <line x1="148" y1="232" x2="172" y2="174" />
        <line x1="156" y1="212" x2="180" y2="212" />
        <line x1="164" y1="192" x2="188" y2="192" />
      </g>
    </SpotlightShell>
  );
}

function WaterSpotlight() {
  return (
    <SpotlightShell title="safe water">
      <path d="M48 214 C88 196 120 236 190 206 L190 240 H48 Z" fill="#38bdf8" opacity="0.8" />
      <rect x="68" y="178" width="48" height="58" rx="14" fill="#92400e" stroke="#292524" strokeWidth="4" />
      <line x1="72" y1="198" x2="112" y2="198" stroke="#fde68a" strokeWidth="4" />
      <g stroke="#292524" strokeLinecap="round" strokeWidth="4">
        <rect x="138" y="172" width="20" height="64" rx="7" fill="#94a3b8" />
        <path d="M148 172 C168 160 184 168 188 184" fill="none" />
        <path d="M188 184 C194 194 186 204 176 202" fill="none" />
      </g>
      <path d="M184 204 C176 220 166 230 184 238 C202 230 192 220 184 204 Z" fill="#2563eb" />
    </SpotlightShell>
  );
}

function KitchenSpotlight({ smoky }: { smoky: boolean }) {
  return (
    <SpotlightShell title={smoky ? "too much fire" : "safe kitchen"}>
      <rect x="60" y="220" width="118" height="14" rx="7" fill="#57534e" />
      <path d="M116 222 C88 194 114 182 104 152 C138 174 150 196 132 222 Z" fill="#f97316" stroke="#292524" strokeWidth="4" />
      <path d="M118 216 C104 202 120 192 120 176 C136 192 138 204 128 216 Z" fill="#fde047" />
      <path d="M74 196 H122 L114 228 H82 Z" fill="#44403c" stroke="#292524" strokeWidth="4" />
      <path d="M78 196 C88 184 108 184 118 196" fill="#fb923c" stroke="#292524" strokeWidth="3" />
      {smoky ? (
        <g fill="#57534e" opacity="0.72">
          <ellipse cx="146" cy="158" rx="22" ry="12" />
          <ellipse cx="164" cy="132" rx="28" ry="15" />
        </g>
      ) : (
        <path d="M156 182 H188 L182 228 H162 Z" fill="#60a5fa" stroke="#292524" strokeWidth="4" />
      )}
    </SpotlightShell>
  );
}

function BuildSpotlight() {
  return (
    <SpotlightShell title="build details">
      <BrickStack x={60} y={174} />
      <path d="M130 174 H174 L166 228 H138 Z" fill="#d6d3d1" stroke="#292524" strokeWidth="4" />
      <line x1="142" y1="186" x2="174" y2="160" stroke="#78350f" strokeLinecap="round" strokeWidth="5" />
      <rect x="66" y="232" width="112" height="10" rx="5" fill="#78716c" />
      <path d="M58 154 H180" stroke="#292524" strokeLinecap="round" strokeWidth="5" />
    </SpotlightShell>
  );
}

function FragileSpotlight({ danger }: { danger: boolean }) {
  return (
    <SpotlightShell title={danger ? "wolf pressure" : "weak spots"}>
      <g stroke="#78350f" strokeLinecap="round" strokeWidth="7">
        <line x1="64" y1="226" x2="150" y2="166" />
        <line x1="88" y1="232" x2="166" y2="180" />
        <line x1="64" y1="184" x2="164" y2="224" />
      </g>
      {danger ? (
        <g stroke="#e0f2fe" strokeLinecap="round" strokeWidth="7">
          <path d="M180 172 C142 162 118 164 82 174" />
          <path d="M184 200 C142 206 118 206 82 220" />
        </g>
      ) : (
        <path d="M82 166 C108 140 136 140 162 166" fill="none" stroke="#ca8a04" strokeWidth="5" />
      )}
    </SpotlightShell>
  );
}

function FamilySpotlight() {
  return (
    <SpotlightShell title="three pigs plan">
      <ComicPig x={78} y={210} color="#f9a8d4" scale={0.82} />
      <ComicPig x={118} y={214} color="#fda4af" scale={0.76} />
      <ComicPig x={154} y={208} color="#fbcfe8" scale={0.9} />
      <path d="M72 158 H168 Q184 158 184 174 V190 Q184 206 168 206 H72 Q56 206 56 190 V174 Q56 158 72 158 Z" fill="#ffffff" stroke="#292524" strokeWidth="4" />
      <text x="120" y="188" textAnchor="middle" className="fill-stone-950 text-[15px] font-black">
        PLAN
      </text>
    </SpotlightShell>
  );
}

function ChoicePreviewStrip({
  choices,
  ending,
}: {
  choices?: Choice[];
  ending?: StoryPage["ending"];
}) {
  if (!choices?.length) {
    return (
      <div className="border-t-4 border-stone-950 bg-stone-950 p-3 text-sm font-black text-white">
        {ending === "safe"
          ? "Comic ending: the pigs made the safe choice."
          : "Comic ending: this choice became a lesson."}
      </div>
    );
  }

  return (
    <div className="grid gap-2 border-t-4 border-stone-950 bg-[#fff7ed] p-3 sm:grid-cols-3">
      {choices.slice(0, 3).map((choice, index) => {
        const badge = getChoiceBadge(choice);

        return (
          <div
            key={`${choice.next}-${choice.label}`}
            className={`rounded-2xl border-2 border-stone-950 p-3 shadow-[4px_4px_0_rgba(28,25,23,0.16)] ${badge.className}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-stone-950 bg-white text-xs font-black text-stone-950">
                {index + 1}
              </span>
              <span className="rounded-full border-2 border-stone-950 bg-white px-2 py-1 text-xs font-black uppercase text-stone-950">
                {badge.label}
              </span>
            </div>
            <p className="text-sm leading-5 font-black text-stone-950">
              {choice.label}
            </p>
            <p className="mt-1 text-xs leading-4 font-semibold text-stone-700">
              {choice.hint}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function getChoiceBadge(choice: Choice) {
  const text = `${choice.label} ${choice.hint}`.toLowerCase();

  if (
    text.includes("ask") ||
    text.includes("question") ||
    text.includes("proof") ||
    text.includes("clue")
  ) {
    return {
      label: "ask",
      className: "bg-sky-100",
    };
  }

  if (
    text.includes("open") ||
    text.includes("ignore") ||
    text.includes("rush") ||
    text.includes("boast") ||
    text.includes("too much")
  ) {
    return {
      label: "risk",
      className: "bg-red-100",
    };
  }

  if (
    text.includes("build") ||
    text.includes("seal") ||
    text.includes("secure") ||
    text.includes("fit") ||
    text.includes("repair")
  ) {
    return {
      label: "fix",
      className: "bg-emerald-100",
    };
  }

  if (
    text.includes("water") ||
    text.includes("pump") ||
    text.includes("barrel")
  ) {
    return {
      label: "supply",
      className: "bg-cyan-100",
    };
  }

  if (
    text.includes("fire") ||
    text.includes("cook") ||
    text.includes("kitchen") ||
    text.includes("flame")
  ) {
    return {
      label: "hearth",
      className: "bg-orange-100",
    };
  }

  return {
    label: "choice",
    className: "bg-amber-100",
  };
}

function BackgroundTrees({ mood }: { mood: ComicMood }) {
  const trunk = mood === "night" ? "#422006" : "#78350f";
  const leaves = mood === "night" ? "#14532d" : "#166534";

  return (
    <g opacity="0.9">
      {[510, 555, 600].map((x, index) => (
        <g key={x} transform={`translate(${x} ${160 + index * 10})`}>
          <rect x="14" y="46" width="16" height="76" rx="6" fill={trunk} />
          <path d="M22 0 L62 74 H-18 Z" fill={leaves} />
          <path d="M22 32 L54 92 H-10 Z" fill={leaves} opacity="0.9" />
        </g>
      ))}
    </g>
  );
}

function StormClouds() {
  return (
    <g fill="#475569" opacity="0.9">
      <ellipse cx="390" cy="70" rx="58" ry="27" />
      <ellipse cx="438" cy="74" rx="48" ry="25" />
      <ellipse cx="345" cy="80" rx="42" ry="22" />
      <ellipse cx="500" cy="106" rx="60" ry="26" />
      <ellipse cx="548" cy="111" rx="42" ry="23" />
    </g>
  );
}

function RainDrops() {
  return (
    <g stroke="#dbeafe" strokeLinecap="round" strokeWidth="5" opacity="0.9">
      {[340, 378, 416, 454, 492, 530, 568, 606].map((x, index) => (
        <line
          key={x}
          x1={x}
          x2={x - 14}
          y1={118 + (index % 2) * 18}
          y2={154 + (index % 2) * 18}
        />
      ))}
    </g>
  );
}

function ComicHouseDrawing({
  house,
  details,
}: {
  house: ComicHouse;
  details: ComicDetail[];
}) {
  if (house === "empty") {
    return (
      <g>
        <rect x="300" y="206" width="16" height="68" rx="4" fill="#92400e" />
        <path d="M278 198 H374 L356 236 H260 Z" fill="#fde68a" stroke="#292524" strokeWidth="5" />
        <text
          x="317"
          y="222"
          textAnchor="middle"
          className="fill-stone-950 text-[18px] font-black"
        >
          BUILD?
        </text>
      </g>
    );
  }

  if (house === "broken-stick") {
    return (
      <g stroke="#292524" strokeLinecap="round" strokeWidth="9">
        <line x1="286" y1="177" x2="392" y2="268" stroke="#92400e" />
        <line x1="398" y1="177" x2="306" y2="268" stroke="#92400e" />
        <line x1="294" y1="220" x2="408" y2="220" stroke="#92400e" />
        <path d="M266 276 H426" stroke="#7c2d12" />
      </g>
    );
  }

  if (house === "straw" || house === "muddy-straw") {
    return (
      <g>
        <path
          d="M278 166 L352 102 L426 166 Z"
          fill="#facc15"
          stroke="#292524"
          strokeWidth="5"
        />
        <rect
          x="292"
          y="166"
          width="120"
          height="100"
          rx="12"
          fill={house === "muddy-straw" ? "#d6a85f" : "#fef08a"}
          stroke="#292524"
          strokeWidth="5"
        />
        <path
          d="M304 184 C326 170 340 200 362 184 C382 170 392 198 404 188"
          fill="none"
          stroke={house === "muddy-straw" ? "#854d0e" : "#ca8a04"}
          strokeWidth="5"
        />
        <rect x="338" y="212" width="32" height="54" rx="8" fill="#92400e" stroke="#292524" strokeWidth="4" />
      </g>
    );
  }

  if (house === "stick") {
    return (
      <g stroke="#292524" strokeLinecap="round" strokeWidth="5">
        <path d="M282 166 L352 102 L422 166 Z" fill="#a16207" />
        <rect x="292" y="166" width="120" height="100" rx="8" fill="#b45309" />
        {[306, 330, 354, 378, 402].map((x) => (
          <line key={x} x1={x} y1="168" x2={x - 10} y2="264" stroke="#78350f" />
        ))}
        {details.includes("braces") ? (
          <>
            <line x1="298" y1="172" x2="406" y2="264" stroke="#fef3c7" strokeWidth="8" />
            <line x1="406" y1="172" x2="298" y2="264" stroke="#fef3c7" strokeWidth="8" />
          </>
        ) : null}
        <rect x="338" y="214" width="32" height="52" rx="6" fill="#78350f" />
      </g>
    );
  }

  if (house === "brick-supplies") {
    return (
      <g>
        <BrickStack x={295} y={188} />
        <BrickStack x={352} y={204} />
        <rect x="300" y="254" width="130" height="12" rx="6" fill="#78350f" />
      </g>
    );
  }

  if (house === "foundation") {
    return (
      <g>
        <rect x="268" y="244" width="176" height="24" rx="6" fill="#78716c" stroke="#292524" strokeWidth="5" />
        <BrickStack x={304} y={204} />
        <rect x="284" y="226" width="144" height="18" fill="#a8a29e" stroke="#292524" strokeWidth="4" />
      </g>
    );
  }

  const wallFill =
    house === "leaky" ? "#f87171" : house === "smoky" ? "#fb923c" : "#ef4444";

  return (
    <g>
      <rect x="310" y="114" width="26" height="52" fill="#a16207" stroke="#292524" strokeWidth="5" />
      <path d="M264 166 L352 88 L440 166 Z" fill="#991b1b" stroke="#292524" strokeWidth="5" />
      <rect x="286" y="166" width="132" height="102" rx="8" fill={wallFill} stroke="#292524" strokeWidth="5" />
      {[184, 210, 236].map((y) => (
        <line key={y} x1="290" y1={y} x2="414" y2={y} stroke="#fecaca" strokeWidth="3" />
      ))}
      {[312, 346, 380].map((x) => (
        <line key={x} x1={x} y1="168" x2={x} y2="266" stroke="#fecaca" strokeWidth="3" />
      ))}
      {details.includes("shutters") ? (
        <>
          <rect x="300" y="190" width="32" height="28" rx="4" fill="#38bdf8" stroke="#292524" strokeWidth="4" />
          <rect x="372" y="190" width="32" height="28" rx="4" fill="#38bdf8" stroke="#292524" strokeWidth="4" />
        </>
      ) : null}
      {details.includes("chimney") ? (
        <rect x="313" y="118" width="20" height="24" fill="#44403c" stroke="#292524" strokeWidth="3" />
      ) : null}
      {details.includes("secret-door") ? (
        <rect x="294" y="220" width="34" height="48" rx="6" fill="#166534" stroke="#292524" strokeWidth="4" />
      ) : null}
      <rect x="340" y="214" width="34" height="54" rx="7" fill="#78350f" stroke="#292524" strokeWidth="4" />
      {house === "leaky" ? (
        <g stroke="#1d4ed8" strokeLinecap="round" strokeWidth="5">
          <line x1="354" y1="144" x2="348" y2="180" />
          <line x1="374" y1="150" x2="368" y2="190" />
          <line x1="386" y1="160" x2="382" y2="202" />
        </g>
      ) : null}
      {house === "smoky" ? (
        <g fill="#44403c" opacity="0.75">
          <ellipse cx="330" cy="94" rx="20" ry="12" />
          <ellipse cx="354" cy="76" rx="24" ry="14" />
          <ellipse cx="384" cy="58" rx="28" ry="15" />
        </g>
      ) : null}
    </g>
  );
}

function ComicDetails({ details }: { details: ComicDetail[] }) {
  return (
    <g>
      {details.includes("cart") ? <CartDetail /> : null}
      {details.includes("straw") ? <StrawDetail /> : null}
      {details.includes("sticks") ? <SticksDetail /> : null}
      {details.includes("bricks") ? <BrickStack x={72} y={226} /> : null}
      {details.includes("mud") ? <MudDetail /> : null}
      {details.includes("mortar") ? <MortarDetail /> : null}
      {details.includes("ladder") ? <LadderDetail /> : null}
      {details.includes("leak") ? <LeakDetail /> : null}
      {details.includes("barrel") ? <BarrelDetail /> : null}
      {details.includes("pump") ? <PumpDetail /> : null}
      {details.includes("fire") ? <FireDetail large={details.includes("smoke")} /> : null}
      {details.includes("bucket") ? <BucketDetail /> : null}
      {details.includes("smoke") ? <SmokeDetail /> : null}
      {details.includes("soup") ? <SoupDetail /> : null}
    </g>
  );
}

function BrickStack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#292524" strokeWidth="3">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((column) => (
          <rect
            key={`${row}-${column}`}
            x={column * 28 + (row % 2) * 14}
            y={row * 16}
            width="28"
            height="16"
            fill="#dc2626"
          />
        )),
      )}
    </g>
  );
}

function StrawDetail() {
  return (
    <g stroke="#854d0e" strokeLinecap="round" strokeWidth="4">
      <path d="M78 286 C104 254 122 266 144 238" />
      <path d="M92 292 C118 258 132 272 154 246" />
      <path d="M62 294 C94 266 112 274 134 250" />
    </g>
  );
}

function SticksDetail() {
  return (
    <g stroke="#78350f" strokeLinecap="round" strokeWidth="7">
      <line x1="70" y1="284" x2="152" y2="240" />
      <line x1="92" y1="292" x2="164" y2="250" />
      <line x1="58" y1="276" x2="142" y2="268" />
    </g>
  );
}

function CartDetail() {
  return (
    <g>
      <rect x="70" y="238" width="100" height="42" rx="10" fill="#b45309" stroke="#292524" strokeWidth="5" />
      <line x1="168" y1="244" x2="208" y2="226" stroke="#292524" strokeLinecap="round" strokeWidth="6" />
      <circle cx="92" cy="286" r="15" fill="#44403c" />
      <circle cx="148" cy="286" r="15" fill="#44403c" />
    </g>
  );
}

function MudDetail() {
  return (
    <g>
      <ellipse cx="122" cy="302" rx="54" ry="15" fill="#854d0e" opacity="0.75" />
      <circle cx="102" cy="292" r="7" fill="#a16207" />
      <circle cx="142" cy="296" r="9" fill="#a16207" />
    </g>
  );
}

function MortarDetail() {
  return (
    <g>
      <path d="M106 238 H152 L144 294 H114 Z" fill="#d6d3d1" stroke="#292524" strokeWidth="5" />
      <line x1="118" y1="250" x2="154" y2="224" stroke="#78350f" strokeLinecap="round" strokeWidth="6" />
    </g>
  );
}

function LadderDetail() {
  return (
    <g stroke="#78350f" strokeLinecap="round" strokeWidth="6">
      <line x1="440" y1="278" x2="492" y2="156" />
      <line x1="464" y1="278" x2="516" y2="156" />
      {[0, 1, 2, 3].map((step) => (
        <line
          key={step}
          x1={452 + step * 13}
          y1={250 - step * 30}
          x2={476 + step * 13}
          y2={250 - step * 30}
        />
      ))}
    </g>
  );
}

function LeakDetail() {
  return (
    <g fill="#2563eb">
      <path d="M470 236 C480 254 490 266 470 278 C450 266 460 254 470 236 Z" />
      <ellipse cx="470" cy="286" rx="28" ry="8" opacity="0.45" />
    </g>
  );
}

function StreamDetail() {
  return (
    <path
      d="M460 310 C508 284 540 338 640 298 L640 360 L448 360 Z"
      fill="#38bdf8"
      opacity="0.78"
    />
  );
}

function BarrelDetail() {
  return (
    <g>
      <rect x="464" y="228" width="56" height="68" rx="16" fill="#92400e" stroke="#292524" strokeWidth="5" />
      <line x1="468" y1="250" x2="516" y2="250" stroke="#fde68a" strokeWidth="5" />
      <line x1="468" y1="276" x2="516" y2="276" stroke="#fde68a" strokeWidth="5" />
      <path d="M454 218 H530" stroke="#292524" strokeLinecap="round" strokeWidth="6" />
    </g>
  );
}

function PumpDetail() {
  return (
    <g stroke="#292524" strokeLinecap="round" strokeWidth="5">
      <rect x="540" y="218" width="24" height="76" rx="8" fill="#94a3b8" />
      <path d="M552 218 C574 204 594 212 602 230" fill="none" />
      <line x1="552" y1="210" x2="586" y2="188" />
      <path d="M602 230 C608 242 600 252 588 250" fill="none" />
    </g>
  );
}

function FireDetail({ large }: { large: boolean }) {
  return (
    <g transform={large ? "translate(418 254) scale(1.25)" : "translate(424 262)"}>
      <rect x="-34" y="28" width="78" height="12" rx="6" fill="#57534e" />
      <path d="M0 32 C-24 8 -2 -2 -8 -30 C20 -8 28 10 14 32 Z" fill="#f97316" stroke="#292524" strokeWidth="3" />
      <path d="M4 28 C-8 14 6 6 6 -10 C20 6 20 18 12 28 Z" fill="#fde047" />
    </g>
  );
}

function BucketDetail() {
  return (
    <g>
      <path d="M514 274 H558 L550 316 H522 Z" fill="#60a5fa" stroke="#292524" strokeWidth="5" />
      <path d="M520 276 C526 252 546 252 552 276" fill="none" stroke="#292524" strokeWidth="4" />
    </g>
  );
}

function SmokeDetail() {
  return (
    <g fill="#57534e" opacity="0.75">
      <ellipse cx="476" cy="180" rx="21" ry="13" />
      <ellipse cx="504" cy="152" rx="27" ry="16" />
      <ellipse cx="538" cy="122" rx="33" ry="18" />
    </g>
  );
}

function SoupDetail() {
  return (
    <g>
      <path d="M452 250 H504 L496 284 H460 Z" fill="#44403c" stroke="#292524" strokeWidth="5" />
      <path d="M456 250 C466 240 490 240 500 250" fill="#f97316" stroke="#292524" strokeWidth="4" />
      <path d="M468 230 C460 218 480 214 472 202" fill="none" stroke="#fef3c7" strokeLinecap="round" strokeWidth="4" />
      <path d="M488 230 C480 218 500 214 492 202" fill="none" stroke="#fef3c7" strokeLinecap="round" strokeWidth="4" />
    </g>
  );
}

function ComicPig({
  x,
  y,
  color,
  scale = 1,
}: {
  x: number;
  y: number;
  color: string;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="18" rx="26" ry="20" fill={color} stroke="#292524" strokeWidth="4" />
      <circle cx="4" cy="-4" r="22" fill={color} stroke="#292524" strokeWidth="4" />
      <path d="M-12 -22 L-24 -40 L-4 -30 Z" fill={color} stroke="#292524" strokeWidth="4" />
      <path d="M20 -18 L32 -34 L28 -10 Z" fill={color} stroke="#292524" strokeWidth="4" />
      <ellipse cx="10" cy="4" rx="14" ry="9" fill="#fda4af" stroke="#292524" strokeWidth="3" />
      <circle cx="5" cy="3" r="2" fill="#292524" />
      <circle cx="15" cy="3" r="2" fill="#292524" />
      <circle cx="-5" cy="-9" r="3" fill="#292524" />
      <circle cx="14" cy="-11" r="3" fill="#292524" />
    </g>
  );
}

function ComicWolf({ variant }: { variant: NonNullable<ComicScene["wolf"]> }) {
  if (variant === "disguised") {
    return (
      <g transform="translate(526 232)">
        <ellipse cx="44" cy="80" rx="40" ry="52" fill="#6d28d9" stroke="#292524" strokeWidth="5" />
        <path
          d="M10 58 C10 8 78 8 78 58 C66 44 22 44 10 58 Z"
          fill="#7c3aed"
          stroke="#292524"
          strokeWidth="5"
        />
        <path d="M28 26 L16 -10 L44 14 Z" fill="#71717a" stroke="#292524" strokeWidth="4" />
        <path d="M58 26 L76 -8 L78 28 Z" fill="#71717a" stroke="#292524" strokeWidth="4" />
        <ellipse cx="42" cy="45" rx="25" ry="21" fill="#71717a" stroke="#292524" strokeWidth="4" />
        <path
          d="M20 56 C4 58 0 70 18 76 L42 76 C50 68 44 58 20 56 Z"
          fill="#f8fafc"
          stroke="#292524"
          strokeWidth="4"
        />
        <circle cx="34" cy="40" r="4" fill="#fef08a" />
        <circle cx="52" cy="40" r="4" fill="#fef08a" />
        <circle cx="14" cy="66" r="4" fill="#292524" />
        <path d="M74 76 C104 60 112 82 88 98" fill="none" stroke="#57534e" strokeLinecap="round" strokeWidth="9" />
        <path d="M-18 100 H36 L28 134 H-10 Z" fill="#92400e" stroke="#292524" strokeWidth="5" />
        <path d="M-12 102 C-4 80 22 80 30 102" fill="none" stroke="#292524" strokeWidth="4" />
        <path d="M18 116 L2 124 M20 116 L36 124" stroke="#fef3c7" strokeLinecap="round" strokeWidth="5" />
      </g>
    );
  }

  if (variant === "gone") {
    return (
      <g opacity="0.7">
        <path d="M560 300 C586 286 604 286 626 298" fill="none" stroke="#57534e" strokeLinecap="round" strokeWidth="7" />
        <circle cx="542" cy="304" r="4" fill="#57534e" />
        <circle cx="572" cy="316" r="4" fill="#57534e" />
        <circle cx="604" cy="306" r="4" fill="#57534e" />
      </g>
    );
  }

  const scale = variant === "distant" ? 0.72 : variant === "huff" ? 1.12 : 0.9;
  const x = variant === "distant" ? 545 : 530;
  const y = variant === "distant" ? 235 : 248;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {variant === "huff" ? (
        <g stroke="#e0f2fe" strokeLinecap="round" strokeWidth="7" opacity="0.9">
          <path d="M-26 6 C-70 -12 -92 -8 -126 0" />
          <path d="M-24 22 C-68 28 -92 24 -122 42" />
        </g>
      ) : null}
      <ellipse cx="38" cy="36" rx="42" ry="24" fill="#57534e" stroke="#292524" strokeWidth="4" />
      <circle cx="4" cy="10" r="28" fill="#71717a" stroke="#292524" strokeWidth="4" />
      <path d="M-10 -12 L-18 -42 L10 -24 Z" fill="#71717a" stroke="#292524" strokeWidth="4" />
      <path d="M22 -8 L36 -34 L42 -2 Z" fill="#71717a" stroke="#292524" strokeWidth="4" />
      <path d="M-26 16 C-44 18 -48 30 -30 34 L-4 34 C4 28 0 18 -26 16 Z" fill="#f8fafc" stroke="#292524" strokeWidth="4" />
      <circle cx="-4" cy="4" r="4" fill="#fef08a" />
      <circle cx="18" cy="4" r="4" fill="#fef08a" />
      <circle cx="-34" cy="24" r="4" fill="#292524" />
      <path d="M78 30 C104 12 114 30 92 48" fill="none" stroke="#57534e" strokeLinecap="round" strokeWidth="10" />
    </g>
  );
}

function SoundBubble({ label }: { label: string }) {
  return (
    <g>
      <path
        d="M42 36 H190 Q210 36 210 56 V100 Q210 120 190 120 H112 L86 148 L90 120 H42 Q22 120 22 100 V56 Q22 36 42 36 Z"
        fill="#fef3c7"
        stroke="#292524"
        strokeWidth="5"
      />
      <text
        x="116"
        y="88"
        textAnchor="middle"
        className="fill-stone-950 text-[30px] font-black uppercase"
      >
        {label}
      </text>
    </g>
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

export interface Character {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

export const CHARACTERS: Character[] = [
  { id: "detective", name: "Detective", emoji: "🕵️", desc: "Clever investigator" },
  { id: "princess", name: "Princess", emoji: "👑", desc: "Royal hero" },
  { id: "robot", name: "Robot", emoji: "🤖", desc: "Mechanical friend" },
  { id: "warrior", name: "Warrior", emoji: "⚔️", desc: "Brave fighter" },
  { id: "chef", name: "Chef", emoji: "👨‍🍳", desc: "Culinary master" },
  { id: "alien", name: "Alien", emoji: "👽", desc: "Space visitor" },
  { id: "wizard", name: "Wizard", emoji: "🧙‍♂️", desc: "Magic wielder" },
  { id: "pirate", name: "Pirate", emoji: "🏴‍☠️", desc: "Sea adventurer" },
  { id: "scientist", name: "Scientist", emoji: "🔬", desc: "Genius inventor" },
  { id: "astronaut", name: "Astronaut", emoji: "🧑‍🚀", desc: "Space explorer" },
  { id: "ninja", name: "Ninja", emoji: "🥷", desc: "Silent warrior" },
  { id: "dragon", name: "Dragon", emoji: "🐉", desc: "Mythical beast" },
];

export const KIDS_CHARACTERS: Character[] = [
  { id: "bunny", name: "Bunny", emoji: "🐰", desc: "Cute rabbit" },
  { id: "puppy", name: "Puppy", emoji: "🐶", desc: "Friendly dog" },
  { id: "fairy", name: "Fairy", emoji: "🧚", desc: "Magic friend" },
  { id: "superhero", name: "Superhero", emoji: "🦸", desc: "Super kid" },
  { id: "dinosaur", name: "Dinosaur", emoji: "🦕", desc: "Friendly dino" },
  { id: "unicorn", name: "Unicorn", emoji: "🦄", desc: "Rainbow horse" },
];

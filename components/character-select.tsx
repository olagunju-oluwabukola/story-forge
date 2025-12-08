import { Card, CardContent } from '@/components/ui/card';

const CHARACTERS = [
  { id: 'detective', name: 'Detective', emoji: '🕵️', desc: 'Clever investigator' },
  { id: 'princess', name: 'Princess', emoji: '👑', desc: 'Royal hero' },
  { id: 'robot', name: 'Robot', emoji: '🤖', desc: 'Mechanical friend' },
  { id: 'warrior', name: 'Warrior', emoji: '⚔️', desc: 'Brave fighter' },
  { id: 'chef', name: 'Chef', emoji: '👨‍🍳', desc: 'Culinary master' },
  { id: 'alien', name: 'Alien', emoji: '👽', desc: 'Space visitor' },
  { id: 'wizard', name: 'Wizard', emoji: '🧙‍♂️', desc: 'Magic wielder' },
  { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', desc: 'Sea adventurer' },
  { id: 'scientist', name: 'Scientist', emoji: '🔬', desc: 'Genius inventor' },
  { id: 'astronaut', name: 'Astronaut', emoji: '🧑‍🚀', desc: 'Space explorer' },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', desc: 'Silent warrior' },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', desc: 'Mythical beast' },
];

const KIDS_CHARACTERS = [
  { id: 'bunny', name: 'Bunny', emoji: '🐰', desc: 'Cute rabbit' },
  { id: 'puppy', name: 'Puppy', emoji: '🐶', desc: 'Friendly dog' },
  { id: 'fairy', name: 'Fairy', emoji: '🧚', desc: 'Magic friend' },
  { id: 'superhero', name: 'Superhero', emoji: '🦸', desc: 'Super kid' },
  { id: 'dinosaur', name: 'Dinosaur', emoji: '🦕', desc: 'Friendly dino' },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', desc: 'Rainbow horse' },
];

interface CharacterSelectProps {
  value: string;
  onChange: (value: string) => void;
  kidsMode?: boolean;
}

export default function CharacterSelect({ value, onChange, kidsMode = false }: CharacterSelectProps) {
  const characters = kidsMode ? KIDS_CHARACTERS : CHARACTERS;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Choose Your Character {kidsMode && '(Kid Friendly)'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((char) => (
          <Card
            key={char.id}
            onClick={() => onChange(char.id)}
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              value === char.id ? 'ring-2 ring-purple-500 border-purple-500' : ''
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">{char.emoji}</div>
              <p className="font-semibold text-gray-800">{char.name}</p>
              <p className="text-xs text-gray-500 mt-1">{char.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
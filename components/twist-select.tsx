import { Card, CardContent } from '@/components/ui/card';

const TWISTS = [
  { id: 'villain', name: "The villain is the hero's past self", emoji: '🪞' },
  { id: 'simulation', name: 'The world is a simulation', emoji: '💻' },
  { id: 'memory', name: 'The hero loses all memories', emoji: '🧠' },
  { id: 'alive', name: 'The planet is alive', emoji: '🌍' },
  { id: 'repeat', name: 'Time repeats every day', emoji: '⏰' },
  { id: 'dream', name: 'Everything was a dream within a dream', emoji: '💤' },
  { id: 'imposter', name: 'Someone is an imposter', emoji: '🎭' },
  { id: 'power', name: 'Powers come from emotions', emoji: '⚡' },
  { id: 'parallel', name: 'Two parallel worlds collide', emoji: '🌌' },
  { id: 'prophecy', name: 'An ancient prophecy was misread', emoji: '📜' },
  { id: 'betrayal', name: 'A trusted friend betrays them', emoji: '💔' },
  { id: 'sacrifice', name: 'A sacrifice is required', emoji: '🕯️' },
];

const KIDS_TWISTS = [
  { id: 'friendship', name: 'Friendship saves the day', emoji: '🤝' },
  { id: 'magic', name: 'Magic appears when needed most', emoji: '✨' },
  { id: 'helper', name: 'A tiny helper solves everything', emoji: '🐞' },
  { id: 'surprise', name: 'A happy surprise ending', emoji: '🎉' },
  { id: 'team', name: 'Working together wins', emoji: '👥' },
  { id: 'brave', name: 'Being brave makes them strong', emoji: '💪' },
];

interface TwistSelectProps {
  value: string;
  onChange: (value: string) => void;
  kidsMode?: boolean;
}

export default function TwistSelect({ value, onChange, kidsMode = false }: TwistSelectProps) {
  const twists = kidsMode ? KIDS_TWISTS : TWISTS;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Choose Your Plot Twist {kidsMode && '(Kid Friendly)'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {twists.map((twist) => (
          <Card
            key={twist.id}
            onClick={() => onChange(twist.id)}
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              value === twist.id ? 'ring-2 ring-pink-500 border-pink-500' : ''
            }`}
          >
            <CardContent className="p-5 flex items-start gap-3">
              <div className="text-3xl">{twist.emoji}</div>
              <p className="font-medium text-sm text-gray-800 flex-1">{twist.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { Card, CardContent } from '@/components/ui/card';

const SETTINGS = [
  { id: 'forest', name: 'Enchanted Forest', emoji: '🌳', desc: 'Magical woods' },
  { id: 'future', name: 'Future City', emoji: '🌆', desc: 'High-tech metropolis' },
  { id: 'space', name: 'Deep Space', emoji: '🚀', desc: 'Among the stars' },
  { id: 'school', name: 'Magic School', emoji: '🏫', desc: 'Learning place' },
  { id: 'desert', name: 'Desert Planet', emoji: '🏜️', desc: 'Sandy wilderness' },
  { id: 'kingdom', name: 'Royal Kingdom', emoji: '🏰', desc: 'Medieval realm' },
  { id: 'ocean', name: 'Underwater World', emoji: '🌊', desc: 'Deep sea realm' },
  { id: 'mountain', name: 'Snowy Mountains', emoji: '⛰️', desc: 'Peaks and valleys' },
  { id: 'jungle', name: 'Ancient Jungle', emoji: '🌴', desc: 'Wild rainforest' },
  { id: 'laboratory', name: 'Secret Lab', emoji: '🔬', desc: 'Science facility' },
  { id: 'haunted', name: 'Haunted Mansion', emoji: '🏚️', desc: 'Spooky house' },
  { id: 'island', name: 'Tropical Island', emoji: '🏝️', desc: 'Paradise beach' },
];

const KIDS_SETTINGS = [
  { id: 'playground', name: 'Playground', emoji: '🎠', desc: 'Fun park' },
  { id: 'garden', name: 'Magical Garden', emoji: '🌺', desc: 'Flower world' },
  { id: 'treehouse', name: 'Treehouse', emoji: '🏡', desc: 'Tree home' },
  { id: 'beach', name: 'Sunny Beach', emoji: '🏖️', desc: 'Sand and waves' },
  { id: 'candyland', name: 'Candy Land', emoji: '🍭', desc: 'Sweet world' },
  { id: 'toyshop', name: 'Toy Shop', emoji: '🧸', desc: 'Toy paradise' },
];

interface SettingSelectProps {
  value: string;
  onChange: (value: string) => void;
  kidsMode?: boolean;
}

export default function SettingSelect({ value, onChange, kidsMode = false }: SettingSelectProps) {
  const settings = kidsMode ? KIDS_SETTINGS : SETTINGS;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Choose Your Setting {kidsMode && '(Kid Friendly)'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {settings.map((setting) => (
          <Card
            key={setting.id}
            onClick={() => onChange(setting.id)}
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              value === setting.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">{setting.emoji}</div>
              <p className="font-semibold text-gray-800">{setting.name}</p>
              <p className="text-xs text-gray-500 mt-1">{setting.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
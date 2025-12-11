"use client";

import { Card, CardContent } from '@/components/ui/card';
import {
  TreesIcon,
  Home,
  Rocket,
  Building,
  Mountain,
  Globe,
  FlaskRound,
  Skull,
  Palmtree,
  Sun,
  Candy,
  Gift
} from 'lucide-react';

const SETTINGS = [
  { id: 'forest', name: 'Enchanted Forest', Icon: TreesIcon},
  { id: 'future', name: 'Future City', Icon: Building },
  { id: 'space', name: 'Deep Space', Icon: Rocket },
  { id: 'school', name: 'Magic School', Icon: Home },
  { id: 'desert', name: 'Desert Planet', Icon: Mountain },
  { id: 'kingdom', name: 'Royal Kingdom', Icon: Globe },
  { id: 'laboratory', name: 'Secret Lab', Icon: FlaskRound },
  { id: 'haunted', name: 'Haunted Mansion', Icon: Skull },

];

const KIDS_SETTINGS = [
  { id: 'playground', name: 'Playground', Icon: Sun },
  { id: 'garden', name: 'Magical Garden', Icon: TreesIcon },
  { id: 'treehouse', name: 'Treehouse', Icon: Home },
  { id: 'beach', name: 'Sunny Beach', Icon: Palmtree },
  { id: 'candyland', name: 'Candy Land', Icon: Candy },
  { id: 'toyshop', name: 'Toy Shop', Icon: Gift },
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
      <h2 className=" text-xl md:text-3xl  font-semibold mb-4 my-10 md:my-16">
        Choose Your Setting {kidsMode && '(Kid Friendly)'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {settings.map(({ id, name, Icon }) => (
          <Card
            key={id}
            onClick={() => onChange(id)}
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              value === id ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
          >
            <CardContent className="p-6 text-center">
              <Icon size={48} className="mx-auto mb-2" />
              <p className="font-semibold text-gray-800">{name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

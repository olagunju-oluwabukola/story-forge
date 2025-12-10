"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CharacterSelect from '@/components/character-select';
import SettingSelect from '@/components/setting-select';
import TwistSelect from '@/components/twist-select';
import GenerateButton from '@/components/generate-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Baby } from 'lucide-react';
import Link from 'next/link';

const TEMPLATES = [
  {
    id: 'fantasy',
    name: 'Fantasy',
    emoji: '🧙‍♂️',
    color: 'from-purple-500 to-pink-500',
    desc: 'A magical world full of wizards and quests'
  },
  {
    id: 'horror',
    name: 'Horror',
    emoji: '👻',
    color: 'from-gray-700 to-black',
    desc: 'Spooky tales that send shivers down your spine'
  },
  {
    id: 'comedy',
    name: 'Comedy',
    emoji: '😂',
    color: 'from-yellow-500 to-orange-500',
    desc: 'Funny stories guaranteed to make you laugh'
  },
  {
    id: 'scifi',
    name: 'Sci-Fi',
    emoji: '🚀',
    color: 'from-blue-500 to-purple-600',
    desc: 'Futuristic adventures and space explorations'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    emoji: '⛰️',
    color: 'from-green-500 to-teal-600',
    desc: 'Exciting journeys full of action and discovery'
  },
  {
    id: 'mystery',
    name: 'Mystery',
    emoji: '🔍',
    color: 'from-indigo-600 to-purple-700',
    desc: 'Intriguing tales with twists and secrets'
  },
  {
    id: 'romance',
    name: 'Romance',
    emoji: '💖',
    color: 'from-pink-400 to-red-500',
    desc: 'Heartwarming stories of love and connection'
  },
  {
    id: 'historical',
    name: 'Historical',
    emoji: '🏰',
    color: 'from-yellow-800 to-red-900',
    desc: 'Tales set in the past, full of intrigue and legacy'
  },
];



export default function CreatePage() {
  const router = useRouter();
  const [character, setCharacter] = useState('');
  const [setting, setSetting] = useState('');
  const [twist, setTwist] = useState('');
  const [template, setTemplate] = useState('fantasy');
  const [kidsMode, setKidsMode] = useState(false);

  const handleGenerate = () => {
    const params = new URLSearchParams({
      character,
      setting,
      twist,
      template,
      kidsMode: kidsMode.toString()
    });
    router.push(`/story?${params.toString()}`);
  };

  const isComplete = character && setting && twist;

  return (
    <div className=" py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8 ">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <Button
            variant={kidsMode ? "default" : "outline"}
            size="sm"
            onClick={() => setKidsMode(!kidsMode)}
            className={kidsMode ? "bg-transparent text-blue-700 border-2 border-blue-700 hover:bg-blue-700 hover:text-white " : "bg-blue-700 text-white hover:bg-transparent border-2 border-blue-700 hover:text-blue-700 animate-pulse"}
          >
            <Baby className="mr-2 h-4 w-4" />
            Kids Mode
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">
            Build Your Story
          </h1>
          <p className="text-gray-600 mt-4 md:mt-6">
            Select your story elements and let's craft a fable magic✨
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-3xl font-semibold mb-4  my-10 md:my-16">
            Choose Story Template
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 space-y-4 ">
  {TEMPLATES.map((temp) => (
    <div
      key={temp.id}
      className={`md:w-48 md: h-32 w-40 perspective cursor-pointer`}
      onClick={() => setTemplate(temp.id)}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500
          transform-style-3d
          hover:rotate-y-180
        `}
      >

        <Card
          className={`absolute w-full h-full backface-hidden transition-all hover:shadow-lg ${
            template === temp.id ? 'ring-2 ring-blue-500' : ''
          }`}
          style={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(59,130,246,0.15)',
            borderRadius: '1.5rem',
          }}
        >
          <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
            <div className={`text-3xl bg-gradient-to-br ${temp.color} bg-clip-text text-transparent`}>
              {temp.emoji}
            </div>
            <p className="font-semibold text-gray-800">{temp.name}</p>
          </CardContent>
        </Card>


        <Card
          className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center"
          style={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(59,130,246,0.2)',
            borderRadius: '1.5rem',
          }}
        >
          <CardContent className="text-center p-4">
            <p className="text-sm text-gray-800 font-medium">{temp.desc || 'Short description'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ))}
</div>
        </div>

        <CharacterSelect
          value={character}
          onChange={setCharacter}
          kidsMode={kidsMode}
        />

        <SettingSelect
          value={setting}
          onChange={setSetting}
          kidsMode={kidsMode}
        />
        <TwistSelect
          value={twist}
          onChange={setTwist}
          kidsMode={kidsMode}
        />

{isComplete && (
  <GenerateButton
    onClick={handleGenerate}
  />
)}


<style jsx>{`
  .perspective {
    perspective: 1000px;
  }
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`}</style>

        {!isComplete && (
          <div className="text-center text-sm text-gray-500">
            {!character && "→ Pick a character"}
            {character && !setting && "→ Choose a setting"}
            {character && setting && !twist && "→ Select a plot twist"}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { Card, CardContent } from "@/components/ui/card";
import  { useState, useEffect } from "react";

interface Character {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

interface CharacterSelectProps {
  value?: string;
  onChange: (value: string) => void;
  kidsMode?: boolean;
}

export default function CharacterSelect({
  value,
  onChange,
  kidsMode = false,
}: CharacterSelectProps) {
  const [selected, setSelected] = useState<string>(value || "");
  const [pauseTop, setPauseTop] = useState(false);
  const [pauseBottom, setPauseBottom] = useState(false);

  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const CHARACTERS: Character[] = [
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

  const KIDS_CHARACTERS: Character[] = [
    { id: "bunny", name: "Bunny", emoji: "🐰", desc: "Cute rabbit" },
    { id: "puppy", name: "Puppy", emoji: "🐶", desc: "Friendly dog" },
    { id: "fairy", name: "Fairy", emoji: "🧚", desc: "Magic friend" },
    { id: "superhero", name: "Superhero", emoji: "🦸", desc: "Super kid" },
    { id: "dinosaur", name: "Dinosaur", emoji: "🦕", desc: "Friendly dino" },
    { id: "unicorn", name: "Unicorn", emoji: "🦄", desc: "Rainbow horse" },
  ];

  const characters = kidsMode ? KIDS_CHARACTERS : CHARACTERS;

  const mid = Math.ceil(characters.length / 2);
  const firstRow = characters.slice(0, mid);
  const secondRow = characters.slice(mid);

  const rowStyle = (direction: "left" | "right", paused: boolean) => ({
    display: "flex",
    gap: "16px",
    width: "max-content",
    animation: `${direction}-scroll 20s linear infinite`,
    animationPlayState: paused ? "paused" : "running",
  });

  const handleClick = (charId: string, row: "top" | "bottom") => {
    setSelected(charId);
    onChange(charId);
    if (row === "top") setPauseTop(true);
    if (row === "bottom") setPauseBottom(true);
  };

  return (
    <section style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 className="text-xl md:text-3xl font-semibold my-10 md:my-16">
        Choose Your Character {kidsMode && "(Kid Friendly)"}
      </h2>


      <div style={{ overflow: "hidden" }}>
        <div style={rowStyle("left", pauseTop)}>
          {[...firstRow, ...firstRow].map((char, idx) => (
            <Card
              key={`${char.id}-${idx}`}
              onClick={() => handleClick(char.id, "top")}
              style={{
                flexShrink: 0,
                width: 180,
                cursor: "pointer",
                transition: "transform 0.3s",
                border: selected === char.id ? "3px solid blue" : undefined,
              }}
            >
              <CardContent style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{char.emoji}</div>
                <p style={{ fontWeight: 600 }}>{char.name}</p>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{char.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


      <div style={{ overflow: "hidden" }}>
        <div style={rowStyle("right", pauseBottom)}>
          {[...secondRow, ...secondRow].map((char, idx) => (
            <Card
              key={`${char.id}-${idx}`}
              onClick={() => handleClick(char.id, "bottom")}
              style={{
                flexShrink: 0,
                width: 180,
                cursor: "pointer",
                transition: "transform 0.3s",
                border: selected === char.id ? "2px solid purple" : undefined,
              }}
            >
              <CardContent style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{char.emoji}</div>
                <p style={{ fontWeight: 600 }}>{char.name}</p>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{char.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


      <style>
        {`
          @keyframes left-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes right-scroll {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </section>
  );
}

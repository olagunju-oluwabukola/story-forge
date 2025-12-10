"use client";

import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
import {
  UserCheck,
  Star,
  Bug,
  Gift,
  Users,
  Shield,
  Zap,
  Globe,
  BookOpen,
  Heart,
  Clock,
  VenetianMaskIcon
} from 'lucide-react';

interface Twist {
  id: string;
  name: string;
  Icon: React.ComponentType<{ size?: number }>;
}

interface TwistSelectProps {
  value: string;
  onChange: (value: string) => void;
  kidsMode?: boolean;
}

export default function TwistSelect({ value, onChange, kidsMode = false }: TwistSelectProps) {
  const TWISTS: Twist[] = [
    { id: 'villain', name: "The villain is the hero's past self", Icon: Clock },
    { id: 'simulation', name: 'The world is a simulation', Icon: BookOpen },
    { id: 'memory', name: 'The hero loses all memories', Icon: VenetianMaskIcon },
    { id: 'alive', name: 'The planet is alive', Icon: Globe },
    { id: 'repeat', name: 'Time repeats every day', Icon: Clock },
    { id: 'dream', name: 'Everything was a dream within a dream', Icon: Star },
    { id: 'imposter', name: 'Someone is an imposter', Icon: VenetianMaskIcon },
    { id: 'power', name: 'Powers come from emotions', Icon: Zap },
    { id: 'parallel', name: 'Two parallel worlds collide', Icon: Globe },
    { id: 'prophecy', name: 'An ancient prophecy was misread', Icon: BookOpen },
    { id: 'betrayal', name: 'A trusted friend betrays them', Icon: Heart },
    { id: 'sacrifice', name: 'A sacrifice is required', Icon: Shield },
  ];

  const KIDS_TWISTS: Twist[] = [
    { id: 'friendship', name: 'Friendship saves the day', Icon: UserCheck },
    { id: 'magic', name: 'Magic appears when needed most', Icon: Star },
    { id: 'helper', name: 'A tiny helper solves everything', Icon: Bug },
    { id: 'surprise', name: 'A happy surprise ending', Icon: Gift },
    { id: 'team', name: 'Working together wins', Icon: Users },
    { id: 'brave', name: 'Being brave makes them strong', Icon: Shield },
  ];

  const twists = kidsMode ? KIDS_TWISTS : TWISTS;

  const rowSize = Math.ceil(twists.length / 3);
  const rows = [
    twists.slice(0, rowSize),
    twists.slice(rowSize, rowSize * 2),
    twists.slice(rowSize * 2),
  ];

  const [pausedRows, setPausedRows] = useState([false, false, false]);
  const [selected, setSelected] = useState<string>('');

  const handleClick = (id: string, rowIndex: number) => {
    setSelected(id);
    const newPaused = [...pausedRows];
    newPaused[rowIndex] = true;
    setPausedRows(newPaused);
    onChange(id);
  };

  const rowStyle = (direction: 'left' | 'right', paused: boolean) => ({
    display: 'flex',
    gap: '16px',
    flexWrap: 'nowrap',
    animation: `${direction}-scroll 25s linear infinite`,
    animationPlayState: paused ? 'paused' : 'running',
  });

  return (
    <div>
      <h2 className='text-xl md:text-3xl font-semibold my-10 md:my-16'>
        Choose Your Plot Twist {kidsMode && '(Kid Friendly)'}
      </h2>

      {rows.map((row, index) => {
        const direction = index % 2 === 0 ? 'left' : 'right';
        const seamlessRow = [...row, ...row];

        return (
          <div key={index} style={{ overflow: 'hidden', marginBottom: 24 }}>
      <div style={rowStyle(direction, pausedRows[index]) as React.CSSProperties}>
              {seamlessRow.map((twist, idx) => (
                <Card
                  key={`${twist.id}-${idx}`}
                  onClick={() => handleClick(twist.id, index)}
                  style={{
                    flexShrink: 0,
                    minWidth: 180,
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    borderRadius: 24,
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: selected === twist.id
                      ? 'rgba(59,130,246,0.25)'
                      : 'rgba(59,130,246,0.1)',
                    backdropFilter: 'blur(8px)',
                    border: selected === twist.id ? '2px solid #3b82f6' : 'none',
                  }}
                >
                  <div className='flex justify-between items-center gap-2'>
<twist.Icon size={24} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1f2937', display: 'flex', flex: 1 }}>
                    {twist.name}
                  </span>
                  </div>

                </Card>
              ))}
            </div>
          </div>
        );
      })}

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
    </div>
  );
}

"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface StoryAudioProps {
  story: string;
}

export default function StoryAudio({ story }: StoryAudioProps) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const checkSupport = () => {
      if (typeof window !== 'undefined') {
        setSupported(!!window.speechSynthesis);
      }
    };

    checkSupport();

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!supported) return;

    if (paused) {
      // Resume
      window.speechSynthesis.resume();
      setPaused(false);
      setSpeaking(true);
    } else if (speaking) {
      // Pause
      window.speechSynthesis.pause();
      setPaused(true);
    } else {
      // Start new
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };

      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setPaused(false);
    }
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  if (!supported) {
    return (
      <Button variant="outline" size="sm" disabled>
        <VolumeX className="mr-2 h-4 w-4" />
        Not Supported
      </Button>
    );
  }

  if (speaking && !paused) {
    return (
      <div className="flex gap-2">
        <Button onClick={handlePlay} variant="outline" size="sm">
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
        <Button onClick={handleStop} variant="outline" size="sm">
          <VolumeX className="mr-2 h-4 w-4" />
          Stop
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handlePlay}
      variant="outline"
      size="sm"
      className={paused ? 'bg-green-50 border-green-500' : ''}
    >
      {paused ? (
        <>
          <Play className="mr-2 h-4 w-4" />
          Resume
        </>
      ) : (
        <>
          <Volume2 className="mr-2 h-4 w-4" />
          Read Aloud
        </>
      )}
    </Button>
  );
}
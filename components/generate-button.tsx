import { Button } from '@/components/ui/button';
import { Sparkles, Wand2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function GenerateButton({ onClick, disabled }: GenerateButtonProps) {
  return (
    <div className="sticky bottom-6 z-10">
      <Button
        size="lg"
        onClick={onClick}
        disabled={disabled}
        className="w-full  bg-blue-700 text-lg py-7 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 hover:bg-blue-700"
      >
        <Wand2 className="mr-2 h-6 w-6 animate-pulse" />
        Generate My Story
        <Sparkles className="ml-2 h-6 w-6" />
      </Button>
    </div>
  );
}
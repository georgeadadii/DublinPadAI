'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useFormState } from 'react-dom';

interface WizardNavProps {
  backPath?: string;
  nextPath?: string;
  onNextClick?: () => void | Promise<void>;
  isNextLoading?: boolean;
  nextButtonText?: string;
  isFormValid?: boolean;
}

export function WizardNav({ backPath, nextPath, onNextClick, isNextLoading, nextButtonText = "Next", isFormValid = true }: WizardNavProps) {
  const router = useRouter();

  const handleNext = async () => {
    if (onNextClick) {
      await onNextClick();
    }
    if (nextPath) {
      router.push(nextPath);
    }
  };

  const isFinalStep = nextButtonText?.includes("Suggestions");

  return (
    <div className="flex items-center justify-between mt-8">
      {backPath ? (
        <Button variant="outline" onClick={() => router.push(backPath)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      ) : (
        <div /> 
      )}
      <Button 
        onClick={handleNext} 
        disabled={isNextLoading || !isFormValid} 
        size="lg"
        className={isFinalStep ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
      >
        {isNextLoading ? 'Loading...' : nextButtonText}
        {!isNextLoading && (isFinalStep ? <Sparkles className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />)}
      </Button>
    </div>
  );
}

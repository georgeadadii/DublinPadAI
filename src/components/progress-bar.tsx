'use client';
import { Progress } from "@/components/ui/progress";
import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({ progress }) => {
  const [currentProgress, setCurrentProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setCurrentProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <div className="w-full">
        <h2 className="text-xl font-bold text-center mb-2 text-primary">DublinPad AI</h2>
      <Progress value={currentProgress} className="w-full h-2 bg-primary/20" />
      <p className="text-center text-xs text-muted-foreground mt-2 font-medium tracking-wider">
        {Math.round(currentProgress)}% COMPLETE
      </p>
    </div>
  );
};
export default ProgressBarComponent;

'use client';
import { usePathname } from 'next/navigation';
import ProgressBar from '@/components/progress-bar';

const steps = [
  '/',
  '/location-preferences',
  '/amenities-preferences',
  '/style-special-needs',
  '/recommendations',
];

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => step === pathname || (step === '/' && pathname === '/start'));
  
  // Progress calculation based on proposal: 0%, 25%, 50%, 75%, 100%
  const progress = currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ProgressBar progress={progress} />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        DublinPad AI &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

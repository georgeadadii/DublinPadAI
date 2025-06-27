'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { AccommodationCard } from '@/components/accommodation-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

export default function RecommendationsPage() {
  const { suggestions, isLoading } = useAppContext();
  const router = useRouter();

  const Summary = () => {
    // In a real app, this would be a more detailed summary
    // from the context's formData.
    return (
        <div className="mb-8 p-4 bg-muted rounded-lg">
            <p className="text-center text-muted-foreground">
                Based on your preferences, here are our top recommendations for your stay in Dublin.
            </p>
        </div>
    )
  };

  const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-4 p-4 border rounded-lg">
        <div className="flex justify-between items-start">
            <div className='w-2/3 space-y-2'>
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-10 w-1/4" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
        <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-1/4" />
        </div>
      </div>
    ))
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Your Personalized Suggestions</h1>
        <p className="mt-4 text-xl text-muted-foreground">Here’s what we’ve found for you.</p>
      </div>

      <Summary />

      <div className="space-y-8">
        {isLoading && suggestions.length === 0 ? renderSkeletons() :
          suggestions.length > 0 ? suggestions.map(suggestion => (
            <AccommodationCard key={suggestion.id} suggestion={suggestion} />
          )) : (
            <Alert variant="destructive" className="text-center">
                <Frown className="h-5 w-5 mx-auto mb-2" />
              <AlertTitle>No Suggestions Found</AlertTitle>
              <AlertDescription>
                We couldn't find any accommodations matching your criteria. You might want to try adjusting your preferences.
              </AlertDescription>
            </Alert>
          )}
      </div>

      <div className="mt-12 text-center space-y-4">
        <p className="text-lg">Not quite right?</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => router.push('/style-special-needs')}>
            Refine Your Search
          </Button>
          {/* In a real app, this would trigger a new AI call */}
          <Button size="lg" disabled={isLoading}>
            Show More Suggestions
          </Button>
        </div>
      </div>
    </div>
  );
}

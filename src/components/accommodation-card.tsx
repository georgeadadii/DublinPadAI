'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Map } from '@/components/map';
import { ContactModal } from '@/components/contact-modal';
import type { AccommodationSuggestion } from '@/lib/types';
import { CheckCircle, MapPin, DollarSign, Sparkles, MessageSquareQuote } from 'lucide-react';
import { generateAccommodationImage } from '@/ai/flows/generate-accommodation-image';
import { Skeleton } from '@/components/ui/skeleton';

interface AccommodationCardProps {
  suggestion: AccommodationSuggestion;
}

export function AccommodationCard({ suggestion }: AccommodationCardProps) {
  const [viewMode, setViewMode] = useState<'images' | 'map'>('images');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(true);

  useEffect(() => {
    const generateImage = async () => {
      try {
        setIsGeneratingImage(true);
        const result = await generateAccommodationImage({
          name: suggestion.name,
          type: suggestion.type,
          description: suggestion.whyThisSuggestion,
        });
        setGeneratedImageUrl(result.imageUrl);
      } catch (error) {
        console.error('Failed to generate image:', error);
      } finally {
        setIsGeneratingImage(false);
      }
    };

    if (suggestion.name && suggestion.type && suggestion.whyThisSuggestion) {
      generateImage();
    } else {
      setIsGeneratingImage(false);
    }
  }, [suggestion.name, suggestion.type, suggestion.whyThisSuggestion]);

  return (
    <>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="secondary" className="mb-2">{suggestion.type}</Badge>
              <CardTitle className="text-2xl font-bold">{suggestion.name}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor={`view-mode-${suggestion.id}`} className="text-sm">Images</Label>
              <Switch
                id={`view-mode-${suggestion.id}`}
                checked={viewMode === 'map'}
                onCheckedChange={(checked) => setViewMode(checked ? 'map' : 'images')}
              />
              <Label htmlFor={`view-mode-${suggestion.id}`} className="text-sm">Map</Label>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground pt-2">
            <MapPin className="h-4 w-4" />
            <span>{suggestion.locationSnapshot}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-video rounded-lg overflow-hidden border">
              {viewMode === 'images' ? (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    <CarouselItem>
                      {isGeneratingImage ? (
                        <Skeleton className="w-full h-full" />
                      ) : (
                        <Image
                          src={generatedImageUrl || 'https://placehold.co/600x400.png'}
                          alt={suggestion.name}
                          width={600}
                          height={400}
                          className="object-cover w-full h-full"
                          data-ai-hint="apartment interior"
                        />
                      )}
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <Map center={suggestion.mapCoordinates} />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="text-accent h-5 w-5" /> Why we suggest this</h3>
                <p className="text-muted-foreground italic bg-muted/50 p-3 rounded-md mt-1">
                  <MessageSquareQuote className="h-4 w-4 inline mr-1 opacity-50"/>
                  {suggestion.whyThisSuggestion}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5"/> Key Features</h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  {suggestion.keyFeatures.slice(0, 4).map((feature, i) => <li key={i}>{feature}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
          <div className="font-semibold text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5"/>
            <span>{suggestion.estimatedPriceRange}</span>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Check Availability & Contact</Button>
        </CardFooter>
      </Card>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} property={suggestion} />
    </>
  );
}

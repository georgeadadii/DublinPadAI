'use client';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WizardNav } from '@/components/wizard-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { generateAccommodationSuggestions } from '@/ai/flows/generate-accommodation-suggestions';

const styleOptions = ["Modern/Contemporary", "Cozy/Homely", "Boutique/Unique", "Traditional Irish Charm", "Minimalist", "Luxury/Upscale"];
const soundOptions = ["Very Quiet (essential)", "Lively Atmosphere (enjoyable)", "Don't Mind (flexible)"];

export default function StyleSpecialNeedsPage() {
    const { formData, updateFormData, prompts, isLoading, setIsLoading, setSuggestions } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();

    const handleGetSuggestions = async () => {
        setIsLoading(true);
        try {
            const refinedPreferences_JSON_String = JSON.stringify(formData);
            const suggestions = await generateAccommodationSuggestions({ refinedPreferences_JSON_String });
            setSuggestions(suggestions);
            router.push('/recommendations');
        } catch (error) {
            console.error("Failed to get suggestions:", error);
            toast({
                title: "Error",
                description: "Could not fetch accommodation suggestions. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight text-center">Style & Special Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-center text-lg mb-8 p-4 bg-muted rounded-lg">
                        {isLoading && !prompts.style ? <Skeleton className="h-6 w-3/4 mx-auto" /> : (prompts.style || "Finally, what's your preferred style?")}
                    </CardDescription>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Label className="font-semibold text-lg">What style of accommodation do you prefer?</Label>
                            <RadioGroup
                                value={formData.accommodationStyle}
                                onValueChange={(value) => updateFormData({ accommodationStyle: value })}
                                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                            >
                                {styleOptions.map(option => (
                                    <div key={option}>
                                        <RadioGroupItem value={option} id={option} className="sr-only" />
                                        <Label htmlFor={option} className="flex flex-col items-center text-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent [&:has([data-state=checked])]:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        
                        <div className="space-y-4">
                            <Label className="font-semibold text-lg">How important is noise level?</Label>
                            <RadioGroup
                                value={formData.soundPreference}
                                onValueChange={(value) => updateFormData({ soundPreference: value })}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                {soundOptions.map(option => (
                                    <div key={option} className="flex-1">
                                        <RadioGroupItem value={option} id={option} className="sr-only" />
                                        <Label htmlFor={option} className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent [&:has([data-state=checked])]:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additional-notes" className="font-semibold text-lg">
                                Is there anything else unique or important you'd like us to consider?
                            </Label>
                            <Textarea
                                id="additional-notes"
                                placeholder="e.g., 'I enjoy morning runs, so proximity to a park is a plus...'"
                                value={formData.additionalNotes}
                                onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>

                    <WizardNav
                        backPath="/amenities-preferences"
                        onNextClick={handleGetSuggestions}
                        isNextLoading={isLoading}
                        nextButtonText="Review & Get Suggestions!"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

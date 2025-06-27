'use client';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WizardNav } from '@/components/wizard-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const locationOptions = [
    "Heart of the City / Tourist Hub",
    "Quiet & Residential Neighborhood",
    "Lively & Social Area (e.g., nightlife, pubs)",
    "Excellent Public Transport Access"
];

export default function LocationPreferencesPage() {
    const { formData, updateFormData, prompts, isLoading } = useAppContext();

    const handleCheckboxChange = (option: string, checked: boolean) => {
        const currentSelection = formData.preferredLocation || [];
        const newSelection = checked
            ? [...currentSelection, option]
            : currentSelection.filter(item => item !== option);
        updateFormData({ preferredLocation: newSelection });
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight text-center">Let's Talk Location & Vibe</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-center text-lg mb-8 p-4 bg-muted rounded-lg">
                        {isLoading ? <Skeleton className="h-6 w-3/4 mx-auto" /> : (prompts.location || "What kind of neighborhood are you looking for?")}
                    </CardDescription>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            {locationOptions.map(option => (
                                <div key={option} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={option}
                                        checked={formData.preferredLocation?.includes(option)}
                                        onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
                                    />
                                    <Label htmlFor={option} className="text-base font-normal cursor-pointer">{option}</Label>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specific-landmarks" className="font-semibold text-lg">
                                Is there a specific landmark, company office, or area you need to be close to?
                            </Label>
                            <Input
                                id="specific-landmarks"
                                placeholder="e.g., Trinity College, Grand Canal Dock..."
                                value={formData.specificLandmarks}
                                onChange={(e) => updateFormData({ specificLandmarks: e.target.value })}
                            />
                        </div>
                    </div>

                    <WizardNav
                        backPath="/"
                        nextPath="/amenities-preferences"
                        nextButtonText="Next: Amenities"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

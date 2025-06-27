'use client';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WizardNav } from '@/components/wizard-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const amenityGroups = {
    'Connectivity & Work': ["High-speed Wi-Fi", "Dedicated Workspace/Desk"],
    'Living & Convenience': ["Full Kitchen/Kitchenette", "In-unit Laundry", "Parking (on-site/nearby)", "Pet-Friendly"],
    'Wellness & Recreation': ["Gym/Fitness Center", "Swimming Pool", "Outdoor Space/Garden"],
    'Accessibility': ["Wheelchair Accessible", "Elevator Access"],
    'Services': ["Daily Housekeeping", "24/7 Front Desk/Concierge", "Breakfast Included"],
    'Student Specific': ["Study Lounge/Area", "Social/Common Room", "Bike Storage"],
    'Tourist Specific': ["Concierge Services", "Luggage Storage", "Tour Desk"],
    'Family Specific': ["Child-friendly Facilities/Play Area", "Crib/Cot Available"],
};

type AmenityCategory = keyof typeof amenityGroups;

export default function AmenitiesPreferencesPage() {
    const { formData, updateFormData, prompts, isLoading } = useAppContext();
    
    const handleCheckboxChange = (amenity: string, checked: boolean) => {
        const currentAmenities = formData.amenities || [];
        const newAmenities = checked
            ? [...currentAmenities, amenity]
            : currentAmenities.filter(item => item !== amenity);
        updateFormData({ amenities: newAmenities });
    };

    const isCategoryVisible = (category: AmenityCategory) => {
        if (category === 'Student Specific') return formData.userPrimaryType === 'Student';
        if (category === 'Tourist Specific') return formData.userPrimaryType === 'Tourist';
        if (category === 'Family Specific') return formData.children > 0;
        return true;
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight text-center">What's Important for Your Comfort?</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-center text-lg mb-8 p-4 bg-muted rounded-lg">
                        {isLoading ? <Skeleton className="h-6 w-3/4 mx-auto" /> : (prompts.amenities || "What amenities are essential for your stay?")}
                    </CardDescription>

                    <div className="space-y-8">
                        {Object.entries(amenityGroups).filter(([category]) => isCategoryVisible(category as AmenityCategory)).map(([category, amenities]) => (
                            <div key={category} className="space-y-4">
                                <h3 className="text-xl font-semibold">{category}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {amenities.map(amenity => (
                                        <div key={amenity} className="flex items-center space-x-3">
                                            <Checkbox
                                                id={amenity}
                                                checked={formData.amenities?.includes(amenity)}
                                                onCheckedChange={(checked) => handleCheckboxChange(amenity, !!checked)}
                                            />
                                            <Label htmlFor={amenity} className="text-base font-normal cursor-pointer">{amenity}</Label>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="mt-6"/>
                            </div>
                        ))}
                    </div>

                    <WizardNav
                        backPath="/location-preferences"
                        nextPath="/style-special-needs"
                        nextButtonText="Next: Style & Needs"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

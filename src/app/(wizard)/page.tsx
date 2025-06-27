'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { WizardNav } from '@/components/wizard-nav';
import type { UserPrimaryType, StudentType, WorkerType, TouristType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const studentOptions: StudentType[] = ['Undergraduate', 'Postgraduate', 'Intern', 'Erasmus Student', 'Other Student'];
const workerOptions: WorkerType[] = ['Full-time Employee', 'Intern', 'Contractor', 'Remote Worker', 'Business Traveler', 'Other Professional'];
const touristOptions: TouristType[] = ['Short Stay', 'Longer Visit'];

export default function WelcomePage() {
  const router = useRouter();
  const { formData, updateFormData, generatePrompts, isLoading } = useAppContext();
  const { toast } = useToast();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Basic validation
    const { userPrimaryType, userSpecificType } = formData;
    if (!userPrimaryType) {
      setIsFormValid(false);
      return;
    }
    if (userPrimaryType === 'Tourist' && (!formData.inboundDate || !formData.outboundDate)) {
        setIsFormValid(false);
        return;
    }
    if ((userPrimaryType === 'Student' || userPrimaryType === 'Working Individual') && !formData.movingInDate) {
        setIsFormValid(false);
        return;
    }
    setIsFormValid(true);
  }, [formData]);


  const handleNextClick = async () => {
    if (!isFormValid) {
        toast({
            title: "Incomplete Form",
            description: "Please fill out all required fields before proceeding.",
            variant: "destructive",
        })
        return;
    }
    await generatePrompts();
    router.push('/location-preferences');
  };

  const budgetUnitText = formData.budgetUnit === 'per_month' ? 'per month' : 'per night';
  const maxBudget = formData.budgetUnit === 'per_month' ? 10000 : 1000;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Find Your Perfect Stay in Dublin!</CardTitle>
          <CardDescription className="text-center">
            To help us find your ideal accommodation, please tell us a little about your stay.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <Label className="font-semibold text-lg">Who are you?</Label>
            <RadioGroup
              value={formData.userPrimaryType}
              onValueChange={(value: UserPrimaryType) => {
                updateFormData({ userPrimaryType: value, userSpecificType: '', budgetUnit: value === 'Tourist' ? 'per_night' : 'per_month' });
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {(['Student', 'Working Individual', 'Tourist'] as UserPrimaryType[]).map((type) => (
                <div key={type} className="flex-1">
                  <RadioGroupItem value={type} id={type} className="sr-only" />
                  <Label htmlFor={type} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent [&:has([data-state=checked])]:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {formData.userPrimaryType && (
            <div className="space-y-2">
              <Label htmlFor="specific-situation" className="font-semibold text-lg">Could you tell us more about your specific situation?</Label>
              <Select value={formData.userSpecificType} onValueChange={(value) => updateFormData({ userSpecificType: value })}>
                <SelectTrigger id="specific-situation">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {formData.userPrimaryType === 'Student' && studentOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  {formData.userPrimaryType === 'Working Individual' && workerOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  {formData.userPrimaryType === 'Tourist' && touristOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="font-semibold text-lg">When are you staying?</Label>
              {formData.userPrimaryType === 'Tourist' ? (
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.inboundDate ? format(new Date(formData.inboundDate), 'PPP') : <span>Arrival Date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.inboundDate ? new Date(formData.inboundDate) : undefined} onSelect={(d) => d && updateFormData({ inboundDate: format(d, 'yyyy-MM-dd') })} initialFocus /></PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.outboundDate ? format(new Date(formData.outboundDate), 'PPP') : <span>Departure Date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.outboundDate ? new Date(formData.outboundDate) : undefined} onSelect={(d) => d && updateFormData({ outboundDate: format(d, 'yyyy-MM-dd') })} initialFocus /></PopoverContent>
                    </Popover>
                </div>
              ) : (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.movingInDate ? format(new Date(formData.movingInDate), 'PPP') : <span>Move-in Date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.movingInDate ? new Date(formData.movingInDate) : undefined} onSelect={(d) => d && updateFormData({ movingInDate: format(d, 'yyyy-MM-dd') })} initialFocus /></PopoverContent>
                </Popover>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-lg">How many people?</Label>
              <div className="flex gap-2">
                <Input type="number" min="1" placeholder="Adults" value={formData.adults} onChange={e => updateFormData({ adults: parseInt(e.target.value) || 1 })} />
                <Input type="number" min="0" placeholder="Children" value={formData.children} onChange={e => updateFormData({ children: parseInt(e.target.value) || 0 })}/>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
              <Label className="font-semibold text-lg">What's your estimated budget? ({budgetUnitText})</Label>
              <Slider
                defaultValue={[formData.minBudget, formData.maxBudget]}
                max={maxBudget}
                min={0}
                step={formData.budgetUnit === 'per_month' ? 100 : 10}
                onValueChange={([min, max]) => updateFormData({ minBudget: min, maxBudget: max })}
              />
              <div className="text-center text-muted-foreground">Min: €{formData.minBudget} - Max: €{formData.maxBudget} {budgetUnitText}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra-info" className="font-semibold text-lg">Tell us anything else that's important for your stay.</Label>
            <Textarea
              id="extra-info"
              placeholder="e.g., 'Looking for a dog-friendly flat near a park', 'Need a quiet place close to public transport'."
              value={formData.initialFreeformQuery}
              onChange={e => updateFormData({ initialFreeformQuery: e.target.value })}
            />
          </div>

          <WizardNav
            nextButtonText="Start Personalized Search"
            isNextLoading={isLoading}
            onNextClick={handleNextClick}
            isFormValid={isFormValid}
          />
        </CardContent>
      </Card>
    </div>
  );
}

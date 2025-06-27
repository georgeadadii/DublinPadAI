'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-context';
import { generateEmailInquiry } from '@/ai/flows/generate-email-inquiry';
import type { AccommodationSuggestion } from '@/lib/types';
import { Mail, Phone } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: AccommodationSuggestion | null;
}

export function ContactModal({ isOpen, onClose, property }: ContactModalProps) {
  const { formData, updateFormData } = useAppContext();
  const [emailBody, setEmailBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && property) {
      setIsLoading(true);
      const generateEmail = async () => {
        try {
          const result = await generateEmailInquiry({
            refinedPreferences_JSON_String: JSON.stringify(formData),
            propertyName: property.name,
            propertyType: property.type,
            userPrimaryType: formData.userPrimaryType,
            userSpecificType: formData.userSpecificType as string
          });
          setEmailBody(result.emailBody);
        } catch (error) {
          console.error("Failed to generate email:", error);
          toast({ title: "Error", description: "Could not generate email inquiry.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      generateEmail();
    }
  }, [isOpen, property, formData, toast]);

  const handleSendEmail = () => {
    if (!property?.contactInfo?.email) {
      toast({ title: "No Email Address", description: "This property has not provided a contact email.", variant: "destructive" });
      return;
    }
    const subject = `Inquiry about ${property.name}`;
    const mailtoLink = `mailto:${property.contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    onClose();
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Contact {property.name}</DialogTitle>
          <DialogDescription>
            We've pre-filled a message based on your preferences. Please review and send it to inquire about availability.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          ) : (
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={15}
              className="font-code"
            />
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" value={formData.userName} onChange={(e) => updateFormData({ userName: e.target.value })}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" type="email" value={formData.userEmail} onChange={(e) => updateFormData({ userEmail: e.target.value })}/>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center w-full">
            <div className='text-sm text-muted-foreground'>
                {property.contactInfo?.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{property.contactInfo.phone}</span>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Close</Button>
                <Button onClick={handleSendEmail} disabled={isLoading}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email Inquiry
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

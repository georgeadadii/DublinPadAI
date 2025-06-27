"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import type { FormData, AccommodationSuggestion, UserPrimaryType, UserSpecificType } from '@/lib/types';
import { generateLocationPrompt } from '@/ai/flows/generate-location-prompt';
import { generateAmenitiesPrompt } from '@/ai/flows/generate-amenities-prompt';
import { generateStyleNeedsPrompt } from '@/ai/flows/generate-style-needs-prompt';

const initialFormData: FormData = {
  userPrimaryType: '',
  userSpecificType: '',
  adults: 1,
  children: 0,
  minBudget: 500,
  maxBudget: 2500,
  budgetUnit: 'per_month',
  initialFreeformQuery: '',
  preferredLocation: [],
  neighborhoodVibe: [],
  specificLandmarks: '',
  amenities: [],
  accommodationStyle: '',
  soundPreference: 'Flexible',
  viewPreference: [],
  localAmenitiesInterest: '',
  additionalNotes: '',
  userName: '',
  userEmail: '',
  userPhone: ''
};

interface AppContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  prompts: {
    location?: string;
    amenities?: string;
    style?: string;
  };
  suggestions: AccommodationSuggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<AccommodationSuggestion[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  generatePrompts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [prompts, setPrompts] = useState({});
  const [suggestions, setSuggestions] = useState<AccommodationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('dublinpad-ai-form');
      if (storedData) {
        setFormData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse form data from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('dublinpad-ai-form', JSON.stringify(formData));
      } catch (error) {
        console.error("Failed to save form data to localStorage", error);
      }
    }
  }, [formData, isInitialized]);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const generatePrompts = async () => {
    setIsLoading(true);
    try {
      const [locationRes, amenitiesRes, styleRes] = await Promise.all([
        generateLocationPrompt({
            ...formData, 
            initialFreeformQuery: formData.initialFreeformQuery || "Not provided"
        }),
        generateAmenitiesPrompt({
            userPrimaryType: formData.userPrimaryType,
            userSpecificType: formData.userSpecificType as string,
        }),
        generateStyleNeedsPrompt(formData),
      ]);

      setPrompts({
        location: locationRes.prompt,
        amenities: amenitiesRes.prompt,
        style: styleRes.prompt
      });

    } catch (error) {
      console.error("Error generating prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AppContextType = {
    formData,
    updateFormData,
    prompts,
    suggestions,
    setSuggestions,
    isLoading,
    setIsLoading,
    generatePrompts
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

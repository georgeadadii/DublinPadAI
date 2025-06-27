export type UserPrimaryType = 'Student' | 'Working Individual' | 'Tourist' | '';
export type StudentType = 'Undergraduate' | 'Postgraduate' | 'Intern' | 'Erasmus Student' | 'Other Student';
export type WorkerType = 'Full-time Employee' | 'Intern' | 'Contractor' | 'Remote Worker' | 'Business Traveler' | 'Other Professional';
export type TouristType = 'Short Stay' | 'Longer Visit';
export type UserSpecificType = StudentType | WorkerType | TouristType | '';


export interface FormData {
  userPrimaryType: UserPrimaryType;
  userSpecificType: UserSpecificType;
  inboundDate?: string;
  outboundDate?: string;
  movingInDate?: string;
  adults: number;
  children: number;
  minBudget: number;
  maxBudget: number;
  budgetUnit: 'per_night' | 'per_month';
  initialFreeformQuery: string;
  preferredLocation: string[];
  neighborhoodVibe: string[];
  specificLandmarks: string;
  amenities: string[];
  accommodationStyle: string;
  soundPreference: string;
  viewPreference: string[];
  localAmenitiesInterest: string;
  additionalNotes: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export type AccommodationSuggestion = {
    name: string;
    type: string;
    keyFeatures: string[];
    estimatedPriceRange: string;
    locationSnapshot: string;
    whyThisSuggestion: string;
    imageUrl: string;
    mapCoordinates: {
        lat: number;
        lng: number;
    };
    contactInfo?: {
        email?: string;
        phone?: string;
    };
    id: string;
};

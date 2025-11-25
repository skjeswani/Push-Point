import { Timestamp } from "firebase/firestore";

export interface Review {
  reviewer: string; // This can be anonymized or a display name
  reviewerId: string;
  overallImpression: number; // 1-5
  strengths: string;
  areasForImprovement: string;
  codeQuality: string;
  uiUxFeedback: string;
  aiSummary?: string;
  aiSuggestions?: string[];
  createdAt?: Timestamp;
}

export interface Project {
  id: string;
  githubUrl: string;
  ownerId: string;
  ownerEmail: string;
  reviews: Review[];
  reviewerIds: string[];
  feedbackUnlocked: boolean;
  createdAt: Timestamp;
}

export interface UserProfile {
    uid: string;
    email: string;
    credits: number;
}
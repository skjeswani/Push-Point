import { GoogleGenAI, Type } from "@google/genai";
import { Review } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

type ReviewInput = Omit<Review, 'reviewer' | 'reviewerId' | 'aiSummary' | 'aiSuggestions' | 'createdAt'>;

export const enhanceReviewWithAI = async (review: ReviewInput): Promise<{ aiSummary: string; aiSuggestions: string[] }> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are an expert project reviewer. A peer has provided the following feedback for a software project. 
    Your task is to process this feedback and provide a concise summary and a list of actionable suggestions.

    **Original Feedback:**
    - **Overall Impression (1-5 scale):** ${review.overallImpression}
    - **Strengths:** ${review.strengths}
    - **Areas for Improvement:** ${review.areasForImprovement}
    - **Code Quality Feedback:** ${review.codeQuality}
    - **UI/UX Feedback:** ${review.uiUxFeedback}

    Analyze the feedback and return a JSON object with two keys: "aiSummary" and "aiSuggestions".
    - "aiSummary": A concise, neutral, one-paragraph summary of the entire feedback.
    - "aiSuggestions": An array of 3-5 specific, actionable suggestions for the project owner based on the "Areas for Improvement" and other feedback points. Frame these as constructive next steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiSummary: {
              type: Type.STRING,
              description: "A concise, neutral, one-paragraph summary of the entire feedback."
            },
            aiSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of 3-5 specific, actionable suggestions for the project owner."
            }
          },
          required: ["aiSummary", "aiSuggestions"]
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback in case of API error
    return {
      aiSummary: "AI analysis could not be performed. Here is the original feedback for your review.",
      aiSuggestions: [
        "Review 'Areas for Improvement' for potential tasks.",
        "Address any specific points made in the 'Code Quality' and 'UI/UX' sections."
      ]
    };
  }
};
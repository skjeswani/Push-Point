import React, { useState } from 'react';
import { Project, Review } from '../types';
import { CloseIcon, LoadingSpinner, StarIcon } from './icons';

interface ReviewModalProps {
  project: Project;
  onClose: () => void;
  onSubmit: (reviewData: Omit<Review, 'reviewer' | 'reviewerId' | 'aiSummary' | 'aiSuggestions' | 'createdAt'>) => void;
  isSubmitting: boolean;
}

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          className="focus:outline-none"
        >
          <StarIcon className={`h-8 w-8 transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`} />
        </button>
      ))}
    </div>
  );
};


const ReviewModal: React.FC<ReviewModalProps> = ({ project, onClose, onSubmit, isSubmitting }) => {
    const [overallImpression, setOverallImpression] = useState(0);
    const [strengths, setStrengths] = useState('');
    const [areasForImprovement, setAreasForImprovement] = useState('');
    const [codeQuality, setCodeQuality] = useState('');
    const [uiUxFeedback, setUiUxFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overallImpression === 0 || !strengths || !areasForImprovement || !codeQuality || !uiUxFeedback) {
        alert("Please fill out all fields before submitting.");
        return;
    }
    onSubmit({ overallImpression, strengths, areasForImprovement, codeQuality, uiUxFeedback });
  };
  
  const FormTextarea: React.FC<{id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder: string}> = ({id, label, value, onChange, placeholder}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
        <textarea
            id={id}
            rows={4}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-brand-primary border border-brand-border rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
            required
        />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-secondary rounded-lg border border-brand-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <h2 className="text-xl font-semibold">Review: <span className="font-mono text-brand-accent">{project.githubUrl.split('/').slice(-2).join('/')}</span></h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div>
                <label className="block text-sm font-medium text-brand-text-secondary mb-2">Overall Impression</label>
                <StarRating rating={overallImpression} setRating={setOverallImpression} />
            </div>

            <FormTextarea id="strengths" label="Strengths" value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="What did you like about this project? What was done well?" />
            <FormTextarea id="areasForImprovement" label="Areas for Improvement" value={areasForImprovement} onChange={e => setAreasForImprovement(e.target.value)} placeholder="What could be improved? Are there any bugs or missing features?" />
            <FormTextarea id="codeQuality" label="Code Quality" value={codeQuality} onChange={e => setCodeQuality(e.target.value)} placeholder="Comment on code structure, readability, best practices, etc." />
            <FormTextarea id="uiUxFeedback" label="UI/UX Feedback" value={uiUxFeedback} onChange={e => setUiUxFeedback(e.target.value)} placeholder="How does the application look and feel? Is it intuitive?" />

        </form>
         <div className="p-4 border-t border-brand-border mt-auto">
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-md hover:bg-brand-accent-hover transition-colors duration-200 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <><LoadingSpinner className="h-5 w-5 mr-2"/> Submitting with AI enhancement...</> : "Submit Review"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
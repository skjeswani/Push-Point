
import React from 'react';
import { Project, Review } from '../types';
import { AiSparkleIcon, CheckCircleIcon, CloseIcon, LightbulbIcon, StarIcon, ThumbsDownIcon, ThumbsUpIcon } from './icons';

interface FeedbackViewModalProps {
  project: Project;
  onClose: () => void;
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    return (
        <div className="bg-brand-primary border border-brand-border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-brand-text-primary">{review.reviewer}'s Feedback</h4>
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-5 w-5 ${i < review.overallImpression ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                </div>
            </div>

            {review.aiSummary && (
                <div className="bg-brand-secondary/50 p-3 rounded-md border border-brand-border/50">
                    <h5 className="flex items-center text-md font-semibold text-brand-accent mb-2">
                        <AiSparkleIcon className="h-5 w-5 mr-2" />
                        AI Summary
                    </h5>
                    <p className="text-sm text-brand-text-secondary">{review.aiSummary}</p>
                </div>
            )}
            
            {review.aiSuggestions && review.aiSuggestions.length > 0 && (
                <div className="bg-brand-secondary/50 p-3 rounded-md border border-brand-border/50">
                    <h5 className="flex items-center text-md font-semibold text-brand-accent mb-2">
                        <LightbulbIcon className="h-5 w-5 mr-2" />
                        AI Actionable Suggestions
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-secondary">
                        {review.aiSuggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                    </ul>
                </div>
            )}
            
            <div className="space-y-3 pt-2">
                <FeedbackSection icon={<ThumbsUpIcon/>} title="Strengths" content={review.strengths} />
                <FeedbackSection icon={<ThumbsDownIcon/>} title="Areas for Improvement" content={review.areasForImprovement} />
                <FeedbackSection icon={<CheckCircleIcon/>} title="Code Quality" content={review.codeQuality} />
                <FeedbackSection icon={<AiSparkleIcon/>} title="UI/UX Feedback" content={review.uiUxFeedback} />
            </div>
        </div>
    )
}

const FeedbackSection: React.FC<{icon: React.ReactNode, title: string, content: string}> = ({icon, title, content}) => (
    <div>
        <h5 className="flex items-center text-sm font-semibold text-brand-text-primary mb-1">
            <span className="mr-2 text-brand-accent">{icon}</span>
            {title}
        </h5>
        <p className="text-sm text-brand-text-secondary pl-6 border-l-2 border-brand-border ml-2">{content}</p>
    </div>
)

const FeedbackViewModal: React.FC<FeedbackViewModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-secondary rounded-lg border border-brand-border shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <h2 className="text-xl font-semibold">Feedback for: <span className="font-mono text-brand-accent">{project.githubUrl.split('/').slice(-2).join('/')}</span></h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {project.reviews.length > 0 ? (
            project.reviews.map((review, index) => <ReviewCard key={index} review={review} />)
          ) : (
            <div className="text-center py-16">
              <p className="text-brand-text-secondary">No feedback has been received for this project yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackViewModal;


import React from 'react';
import { Project } from '../types';
import { GithubIcon, LockIcon, UnlockIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  type: 'my-project' | 'review-queue';
  onAction: (project: Project) => void;
  userCredits?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, type, onAction, userCredits = 0 }) => {
  const canUnlock = userCredits > 0;
  const hasFeedback = project.reviews.length > 0;

  const getRepoName = (url: string) => {
    try {
      const path = new URL(url).pathname;
      return path.substring(1);
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-brand-secondary border border-brand-border rounded-lg p-4 shadow-md transition-shadow hover:shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="flex items-center space-x-3 overflow-hidden">
        <GithubIcon className="h-6 w-6 text-brand-text-secondary flex-shrink-0" />
        <a 
          href={project.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-brand-text-primary font-mono truncate hover:text-brand-accent transition-colors"
        >
          {getRepoName(project.githubUrl)}
        </a>
      </div>
      
      {type === 'my-project' && (
        <button
          onClick={() => onAction(project)}
          disabled={!hasFeedback}
          className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 transition-colors duration-200 ${
            !hasFeedback
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : project.feedbackUnlocked
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : canUnlock
              ? 'bg-brand-accent hover:bg-brand-accent-hover text-white'
              : 'bg-yellow-600/80 text-white cursor-help'
          }`}
          title={!hasFeedback ? "No feedback received yet" : project.feedbackUnlocked ? "View unlocked feedback" : canUnlock ? "Spend 1 credit to unlock" : "Earn credits to unlock"}
        >
          {project.feedbackUnlocked ? <UnlockIcon className="h-4 w-4" /> : <LockIcon className="h-4 w-4" />}
          <span>{hasFeedback ? (project.feedbackUnlocked ? 'View Feedback' : 'Unlock Feedback') : 'Awaiting Feedback'}</span>
        </button>
      )}

      {type === 'review-queue' && (
        <button
          onClick={() => onAction(project)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors"
        >
          Review & Earn 1 Credit
        </button>
      )}
    </div>
  );
};

export default ProjectCard;

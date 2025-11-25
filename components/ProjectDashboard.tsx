
import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectDashboardProps {
  myProjects: Project[];
  projectsToReview: Project[];
  onReview: (project: Project) => void;
  onViewFeedback: (project: Project) => void;
  userCredits: number;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ myProjects, projectsToReview, onReview, onViewFeedback, userCredits }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-brand-border">My Projects</h2>
        <div className="space-y-4">
          {myProjects.length > 0 ? (
            myProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                type="my-project"
                onAction={onViewFeedback}
                userCredits={userCredits}
              />
            ))
          ) : (
            <div className="text-center py-10 px-4 bg-brand-secondary border border-brand-border rounded-lg">
              <p className="text-brand-text-secondary">You haven't submitted any projects yet.</p>
              <p className="text-sm text-brand-text-secondary">Use the form above to get started!</p>
            </div>
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-brand-border">Review Queue</h2>
        <div className="space-y-4">
          {projectsToReview.length > 0 ? (
            projectsToReview.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                type="review-queue"
                onAction={onReview}
              />
            ))
          ) : (
            <div className="text-center py-10 px-4 bg-brand-secondary border border-brand-border rounded-lg">
              <p className="text-brand-text-secondary">No projects to review right now.</p>
              <p className="text-sm text-brand-text-secondary">Check back later!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectDashboard;

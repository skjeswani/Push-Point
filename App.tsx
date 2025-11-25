import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Project, Review, UserProfile } from './types';
import { onAuthChange } from './firebase/config';
import { 
  submitProject, 
  getProjectsToReview, 
  getMyProjects, 
  addReview,
  spendCreditToUnlock,
  getUserProfile,
  signInWithGoogle,
  signInWithGithub,
  signOut,
  createUserProfile
} from './services/firebaseService';

import Header from './components/Header';
import SubmitProjectForm from './components/SubmitProjectForm';
import ProjectDashboard from './components/ProjectDashboard';
import ReviewModal from './components/ReviewModal';
import FeedbackViewModal from './components/FeedbackViewModal';
import { enhanceReviewWithAI } from './services/geminiService';
import { GithubIcon, GoogleIcon, LoadingSpinner } from './components/icons';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [projectsToReview, setProjectsToReview] = useState<Project[]>([]);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedProjectForReview, setSelectedProjectForReview] = useState<Project | null>(null);
  const [selectedProjectForFeedback, setSelectedProjectForFeedback] = useState<Project | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Check if a profile exists. If not, it's a first-time sign-in from a redirect.
        const profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          await createUserProfile(firebaseUser);
        }
        setUser(firebaseUser);
        // fetchData will now get the newly created or existing profile.
        await fetchData(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        setMyProjects([]);
        setProjectsToReview([]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const fetchData = async (uid: string) => {
      setIsLoading(true);
      const [myProjs, toReviewProjs, profile] = await Promise.all([
          getMyProjects(uid),
          getProjectsToReview(uid),
          getUserProfile(uid)
      ]);
      setMyProjects(myProjs);
      setProjectsToReview(toReviewProjs);
      setUserProfile(profile);
      setIsLoading(false);
  };

  const handleSubmitProject = async (githubUrl: string) => {
    if (!user) return;
    await submitProject({ githubUrl, ownerId: user.uid, ownerEmail: user.email! });
    fetchData(user.uid);
  };

  const handleOpenReviewModal = (project: Project) => {
    setSelectedProjectForReview(project);
    setIsReviewModalOpen(true);
  };
  
  const handleViewFeedback = async (project: Project) => {
    if (!user || !userProfile) return;
    
    if (project.feedbackUnlocked) {
      setSelectedProjectForFeedback(project);
      setIsFeedbackModalOpen(true);
      return;
    }

    if (userProfile.credits > 0) {
      await spendCreditToUnlock(user.uid, project.id);
      const updatedProject = { ...project, feedbackUnlocked: true };
      setSelectedProjectForFeedback(updatedProject);
      setMyProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      setUserProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
      setIsFeedbackModalOpen(true);
    } else {
      alert("You need at least 1 credit to view feedback. Review a project to earn credits!");
    }
  };

  const handleCloseModals = () => {
    setIsReviewModalOpen(false);
    setIsFeedbackModalOpen(false);
    setSelectedProjectForReview(null);
    setSelectedProjectForFeedback(null);
  };
  
  const handleSubmitReview = async (reviewData: Omit<Review, 'reviewer' | 'aiSummary' | 'aiSuggestions' | 'reviewerId' | 'createdAt'>) => {
    if (!selectedProjectForReview || !user) return;
    setIsSubmittingReview(true);
    try {
      const enhancedReview = await enhanceReviewWithAI(reviewData);

      const finalReview: Omit<Review, 'reviewer' | 'createdAt'> = {
        ...reviewData,
        reviewerId: user.uid,
        ...enhancedReview,
      };

      await addReview(selectedProjectForReview.id, user.uid, finalReview);
      
      handleCloseModals();
      await fetchData(user.uid);

    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("There was an error submitting your review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setUserProfile(null);
    setMyProjects([]);
    setProjectsToReview([]);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-primary flex flex-col items-center justify-center">
          <LoadingSpinner className="h-12 w-12 text-brand-accent"/>
          <p className="mt-4 text-brand-text-secondary">Loading Prod Point...</p>
      </div>
    );
  }

  if (!user) {
    return (
       <div className="min-h-screen bg-brand-primary flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold text-brand-text-primary mb-2">Welcome to Prod Point</h1>
        <p className="text-lg text-brand-text-secondary mb-8 max-w-xl">Get high-quality, peer-to-peer feedback on your projects. Review others' work to earn credits and unlock reviews for your own.</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={signInWithGoogle}
            className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-3 text-lg"
          >
            <GoogleIcon className="h-6 w-6"/>
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={signInWithGithub}
            className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-3 text-lg"
          >
            <GithubIcon className="h-6 w-6"/>
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header userCredits={userProfile?.credits ?? 0} onSignOut={handleSignOut} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <SubmitProjectForm onSubmit={handleSubmitProject} />
          <ProjectDashboard
            myProjects={myProjects}
            projectsToReview={projectsToReview}
            onReview={handleOpenReviewModal}
            onViewFeedback={handleViewFeedback}
            userCredits={userProfile?.credits ?? 0}
          />
        </div>
      </main>
      
      {isReviewModalOpen && selectedProjectForReview && (
        <ReviewModal
          project={selectedProjectForReview}
          onClose={handleCloseModals}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
        />
      )}

      {isFeedbackModalOpen && selectedProjectForFeedback && (
        <FeedbackViewModal
          project={selectedProjectForFeedback}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};

export default App;
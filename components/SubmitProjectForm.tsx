
import React, { useState } from 'react';
import { GithubIcon } from './icons';

interface SubmitProjectFormProps {
  onSubmit: (githubUrl: string) => void;
}

const SubmitProjectForm: React.FC<SubmitProjectFormProps> = ({ onSubmit }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+(\/)?$/;
    if (!githubUrl || !githubRegex.test(githubUrl)) {
      setError('Please enter a valid GitHub repository URL.');
      return;
    }
    setError('');
    onSubmit(githubUrl);
    setGithubUrl('');
  };

  return (
    <section className="bg-brand-secondary p-6 rounded-lg border border-brand-border mb-8 shadow-lg">
      <h2 className="text-xl font-semibold text-brand-text-primary mb-4">Get Feedback on Your Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GithubIcon className="h-5 w-5 text-brand-text-secondary" />
            </div>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => {
                setGithubUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://github.com/user/repository"
              className="w-full bg-brand-primary border border-brand-border rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-brand-accent focus:outline-none transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-brand-accent text-white font-bold py-3 px-6 rounded-md hover:bg-brand-accent-hover transition-colors duration-200 flex-shrink-0"
          >
            Submit Project
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </form>
    </section>
  );
};

export default SubmitProjectForm;

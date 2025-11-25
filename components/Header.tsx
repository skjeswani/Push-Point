import React from 'react';
import { CreditIcon, LogoIcon, SignOutIcon } from './icons';

interface HeaderProps {
  userCredits: number;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ userCredits, onSignOut }) => {
  return (
    <header className="bg-brand-secondary border-b border-brand-border sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-brand-accent"/>
            <h1 className="text-2xl font-bold text-brand-text-primary tracking-tight">
              PushPoint
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-brand-border px-4 py-2 rounded-full text-brand-accent">
              <CreditIcon className="h-5 w-5" />
              <span className="font-semibold text-lg">{userCredits}</span>
              <span className="text-brand-text-secondary text-sm hidden sm:inline">Credits</span>
            </div>
             <button onClick={onSignOut} className="p-2 rounded-full hover:bg-brand-border transition-colors" title="Sign Out">
                <SignOutIcon className="h-6 w-6 text-brand-text-secondary"/>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
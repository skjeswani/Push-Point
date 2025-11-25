# PushPoint: Peer-to-Peer Project Feedback Platform

PushPoint is a web application designed to facilitate a fair and insightful peer-to-peer review system for software projects. It operates on a "give-to-get" model: to receive feedback on your own projects, you must first contribute by reviewing the work of others.

## The Core Idea

The platform addresses a common challenge for developers: getting high-quality, constructive feedback on their projects. PushPoint standardizes the review process and incentivizes thoughtful feedback through a simple credit-based economy.

- **Submit Your Project**: Share a link to your public GitHub repository.
- **Earn Credits**: Browse the "Review Queue" and submit a detailed review for another user's project using our structured feedback form. Each completed review earns you one credit.
- **Unlock Feedback**: When your project receives feedback, you can spend one credit to unlock and view all the reviews submitted for it.

## Key Features

- **Secure Authentication**: Users can easily sign in using their Google or GitHub accounts.
- **Simple Project Submission**: A clean interface for submitting projects directly from a GitHub URL.
- **Credit-Based Economy**: A fair system that rewards users for their contributions, ensuring the community remains active and engaged.
- **Structured Review Form**: A standardized form guides reviewers to provide valuable feedback across several key areas:
    - Overall Impression (1-5 star rating)
    - Key Strengths
    - Areas for Improvement
    - Code Quality Analysis
    - UI/UX Feedback
- **AI-Enhanced Feedback**: Each peer review is automatically enhanced by the **Google Gemini API** to provide:
    - A concise, AI-generated summary of the feedback.
    - A list of actionable suggestions, making it easier for project owners to identify next steps.
- **Clean & Responsive Dashboard**: A dual-column layout allows users to easily track their own projects and the queue of projects available for review.

## Technology Stack

- **Frontend**: Built with **React** and **TypeScript** for a robust and type-safe user interface.
- **Styling**: Styled with **Tailwind CSS** for a modern, utility-first design that is fully responsive.
- **Backend & Database**: Powered by **Firebase**, utilizing:
    - **Firestore** for real-time database management of users, projects, and reviews.
    - **Firebase Authentication** for handling secure user sign-in.
- **AI Integration**: Leverages the **Google Gemini API** for intelligent analysis and summarization of review text.

## How It Works: A User's Journey

1.  **Sign In**: You arrive at the landing page and sign in with your Google or GitHub account.
2.  **Submit a Project**: You paste the URL of your GitHub repository into the submission form and submit it. Your project now appears in the "My Projects" list, awaiting feedback.
3.  **Earn a Credit**: You navigate to the "Review Queue," select a project, and fill out the detailed review form. Upon submission, your credit balance increases by one.
4.  **Unlock Your Feedback**: Once another user reviews your project, a button to "Unlock Feedback" appears. You click it, a credit is spent, and you can now view the detailed, AI-enhanced feedback left by your peers.
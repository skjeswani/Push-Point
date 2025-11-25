import { 
    doc,
    setDoc, 
    getDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    serverTimestamp,
    updateDoc,
    arrayUnion,
    increment,
    writeBatch
} from "firebase/firestore";
import { User } from 'firebase/auth';
import { db, signInWithGoogle as firebaseSignInGoogle, signInWithGithub as firebaseSignInGithub, signOut as firebaseSignOut } from "../firebase/config";
import { Project, Review, UserProfile } from "../types";

// Auth Functions
export const signInWithGoogle = (): Promise<void> => {
    return firebaseSignInGoogle();
}

export const signInWithGithub = (): Promise<void> => {
    return firebaseSignInGithub();
}

export const signOut = async (): Promise<void> => {
    await firebaseSignOut();
}

// User Profile Functions
export const createUserProfile = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        const newUserProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            credits: 1, // Start new users with 1 credit
        };
        await setDoc(userRef, newUserProfile);
    }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
};

// Project Functions
export const submitProject = async (projectData: Omit<Project, 'id' | 'reviews' | 'feedbackUnlocked' | 'createdAt' | 'reviewerIds'>) => {
    await addDoc(collection(db, "projects"), {
        ...projectData,
        reviews: [],
        reviewerIds: [],
        feedbackUnlocked: false,
        createdAt: serverTimestamp(),
    });
};

export const getMyProjects = async (ownerId: string): Promise<Project[]> => {
    const q = query(collection(db, "projects"), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const getProjectsToReview = async (userId: string): Promise<Project[]> => {
    // In a large-scale app, you might add pagination or more complex filtering.
    // For now, we query all projects not owned by the user.
    const q = query(collection(db, "projects"), where("ownerId", "!=", userId));
    const querySnapshot = await getDocs(q);
    
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

    // Efficiently filter out projects the user has already reviewed using the reviewerIds array.
    return projects.filter(p => !p.reviewerIds?.includes(userId));
};

// Review & Credit Functions
export const addReview = async (projectId: string, reviewerId: string, reviewData: Omit<Review, 'reviewer' | 'createdAt'>) => {
    const batch = writeBatch(db);

    // 1. Add review and reviewerId to the project
    const projectRef = doc(db, "projects", projectId);
    const finalReview = {
        ...reviewData,
        reviewer: `Peer (ID: ...${reviewerId.slice(-4)})`, // Anonymize reviewer
        createdAt: serverTimestamp()
    };
    batch.update(projectRef, {
        reviews: arrayUnion(finalReview),
        reviewerIds: arrayUnion(reviewerId)
    });

    // 2. Award credit to the reviewer
    const reviewerRef = doc(db, "users", reviewerId);
    batch.update(reviewerRef, {
        credits: increment(1)
    });
    
    await batch.commit();
};

export const spendCreditToUnlock = async (userId: string, projectId: string) => {
    const batch = writeBatch(db);

    // 1. Deduct credit from user
    const userRef = doc(db, "users", userId);
    batch.update(userRef, {
        credits: increment(-1)
    });

    // 2. Mark project as unlocked
    const projectRef = doc(db, "projects", projectId);
    batch.update(projectRef, {
        feedbackUnlocked: true
    });

    await batch.commit();
};
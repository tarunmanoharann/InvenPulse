// src/services/firebaseAuthService.ts
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    User
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  

  import { auth, db } from '../firebase';

  
  // Interface for user data in Firestore
  interface UserData {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    createdAt: number;
  }
  
  class FirebaseAuthService {
    private auth = auth;  // Use the imported auth instance
    private db = db;      // Use the imported db instance
    private googleProvider = new GoogleAuthProvider();
  
    // Sign in with email and password
    async loginWithEmail(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        return userCredential.user;
      } catch (error) {
        throw error;
      }
    }
  
    // Sign in with Google
    async loginWithGoogle() {
      try {
        const result = await signInWithPopup(this.auth, this.googleProvider);
        const user = result.user;
        
        // Check if user exists in your database, if not create new user
        await this.saveUserToFirestore(user);
        
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    // Register with email and password
    async registerWithEmail(email: string, password: string, displayName: string, phoneNumber?: string) {
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, { displayName });
        
        // Save additional user data to Firestore
        await this.saveUserToFirestore(user, phoneNumber);
        
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    // Save user data to Firestore
    private async saveUserToFirestore(user: User, phoneNumber?: string) {
      try {
        const userDocRef = doc(this.db, "users", user.uid);
        
        // Check if user already exists
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create new user document
          const userData: UserData = {
            uid: user.uid,
            displayName: user.displayName || "",
            email: user.email || "",
            phoneNumber: phoneNumber || user.phoneNumber || "",
            role: "user", // Default role
            createdAt: Date.now()
          };
          
          await setDoc(userDocRef, userData);
        }
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  
    // Get current user
    getCurrentUser() {
      return this.auth.currentUser;
    }
  
    // Sign out
    async logout() {
      try {
        await signOut(this.auth);
      } catch (error) {
        throw error;
      }
    }
  
    // Reset password
    async resetPassword(email: string) {
      try {
        await sendPasswordResetEmail(this.auth, email);
      } catch (error) {
        throw error;
      }
    }
  
    // Get user data from Firestore
    async getUserData(uid: string) {
      try {
        const userDocRef = doc(this.db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          return userDoc.data() as UserData;
        }
        
        return null;
      } catch (error) {
        throw error;
      }
    }
  }
  
  export const firebaseAuthService = new FirebaseAuthService();
import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";
import app from "../../Firebase/firebase.config";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/search?email=${email}`);
      const data = await res.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      alert("Error fetching user data. Please try again.");
      return null;
    }
  };

  const createUser = async (email, password, userName) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: userName });

      const displayName = userName;
      const imageUrl = result.user?.photoURL || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=';
      const newUser = { displayName, email, imageUrl };

      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      const savedUser = await response.json();
      setUser(savedUser);
      alert("Account created successfully!");
      return result;
    } catch (error) {
      let errorMessage = "Failed to create account. ";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += "Email is already registered.";
          break;
        case 'auth/invalid-email':
          errorMessage += "Invalid email address.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage += "Email/password accounts are not enabled.";
          break;
        case 'auth/weak-password':
          errorMessage += "Password should be at least 6 characters.";
          break;
        default:
          errorMessage += error.message;
      }
      
      alert(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email) => {
    setLoading(true);
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      let errorMessage = "Failed to send reset email. ";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage += "Invalid email address.";
          break;
        case 'auth/user-not-found':
          errorMessage += "No account found with this email.";
          break;
        default:
          errorMessage += error.message;
      }
      
      alert(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(result.user.email);
      setUser(userData);
      alert("Signed in successfully!");
      return result;
    } catch (error) {
      let errorMessage = "Failed to sign in. ";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage += "Invalid email address.";
          break;
        case 'auth/user-disabled':
          errorMessage += "This account has been disabled.";
          break;
        case 'auth/user-not-found':
          errorMessage += "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage += "Incorrect password.";
          break;
        default:
          errorMessage += error.message;
      }
      
      alert(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      alert("Signed out successfully!");
    } catch (error) {
      alert("Failed to sign out. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userData = await fetchUserData(currentUser.email);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    sendPasswordResetEmail,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
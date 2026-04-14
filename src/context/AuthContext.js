"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Optimistic UI: Set basic user immediately so app doesn't hang waiting for free backend
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: 'student'
                });
                setLoading(false); // Make UI fast

                try {
                    // Sync with MongoDB back-end using dynamic API URL in background
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                    const response = await fetch(`${apiUrl}/api/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL
                        })
                    });
                    
                    if (!response.ok) throw new Error('Sync failed');
                    
                    const mongoUser = await response.json();
                    
                    // Update user with database fields once loaded
                    setUser(prev => ({
                        ...prev,
                        role: mongoUser.role || 'student',
                        institution: mongoUser.institution || '',
                        location: mongoUser.location || '',
                        bio: mongoUser.bio || '',
                        guardianName: mongoUser.guardianName || '',
                        guardianContact: mongoUser.guardianContact || ''
                    }));
                } catch (error) {
                    console.error('Back-end sync failed or timeout', error);
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Login Failed', error);
        }
    };

    const logout = async () => {
        setUser(null);
        await signOut(auth);
    };

    const refreshUser = async () => {
        if (!user) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/users/${user.uid}`);
            
            if (!response.ok) throw new Error('Refresh failed');
            
            const mongoUser = await response.json();
            
            setUser({
                ...user,
                role: mongoUser.role || 'student',
                institution: mongoUser.institution || '',
                location: mongoUser.location || '',
                bio: mongoUser.bio || '',
                guardianName: mongoUser.guardianName || '',
                guardianContact: mongoUser.guardianContact || ''
            });
        } catch (error) {
            console.error('Refresh failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

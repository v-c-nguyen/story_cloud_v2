import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from './supabase';

export type User = {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    phonenumber?: string;
    // Add other user fields as needed
};

export type Child = {
    id: string;
    name: string;
    age: number;
    mode: string;
    avatar_url?: string;
    // Add other user fields as needed
};

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    child: Child | null;
    setChild: (id: Child | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [child, setChild] = useState<Child | null>(null);
    // On mount, fetch current session and set user

    useEffect(() => {
        let mounted = true;
        async function getSessionUser() {
            const { data } = await supabase.auth.getSession();
            const sessionUser = data?.session?.user;
            if (sessionUser && mounted) {
                // Fetch user profile from Supabase 'users' table
                const { data: profile, error } = await supabase
                    .from('users')
                    .select('name, avatar_url, phonenumber')
                    .eq('id', sessionUser.id)
                    .single();
                setUser({
                    id: sessionUser.id,
                    email: sessionUser.email ?? '',
                    name: profile?.name ?? '',
                    avatar_url: profile?.avatar_url,
                    phonenumber: profile?.phonenumber,
                });
            }
        }
        getSessionUser();

        // Listen to auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? '',
                    name: session.user.user_metadata?.name ?? '',
                    avatar_url: session.user.user_metadata?.avatar_url,
                    phonenumber: session.user.user_metadata?.phonenumber,
                });
            } else {
                setUser(null);
            }
        });
        return () => {
            mounted = false;
            listener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, child, setChild }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}


export default useContext
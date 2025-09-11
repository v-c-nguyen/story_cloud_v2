// lib/useAuth.ts
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import  supabase  from './supabase'; // your Supabase client
import { Session, User } from '@supabase/supabase-js';

function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Load initial session
        supabase.auth.getSession().then(({ data }) => {
            const s = data.session;
            if (s && s.expires_at && s.expires_at < Date.now() / 1000) {
                supabase.auth.signOut();
                setSession(null);
            } else {
                setSession(s);
            }
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 2. Listen for auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                // Already handled manually above — optional here
                setSession(null);
            }

            if (event === 'TOKEN_REFRESHED') {
                setSession(session);
                setUser(session?.user ?? null);
            }

            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                setSession(session);
                setUser(session?.user ?? null);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (state) => {
            if (state === 'active') {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
            }
        });

        return () => subscription.remove();
    })

    return {
        session,
        user,
        loading,
        isAuthenticated: !!session,
    };
}


export default useAuth;
import supabase from "@/app/lib/supabase";

export async function getAllTracksByChildId(childId: string) {
    if (!childId) return [];
    try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const response = await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/track/getAllByChildId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: jwt ? `Bearer ${jwt}` : '',
            },
            body: JSON.stringify({ childId })
        });
        const result = await response.json();
        if (response.ok && Array.isArray(result.data)) {
            return result.data;
        } else {
            throw new Error(result?.error || 'Failed to fetch tracks');
        }
    } catch (e) {
        console.error('Error fetching tracks:', e);
        throw e;
    }
}

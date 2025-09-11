import supabase from "@/app/lib/supabase";

export async function getSeriesByStoryId(storyId: string, activeChildId: string) {
    if (!storyId) return null;
    try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const response = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/series/getSeriesWithStory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: jwt ? `Bearer ${jwt}` : '',
            },
            body: JSON.stringify({ storyId, child_id: activeChildId })
        });
        const result = await response.json();
        if (response.ok && result) {
            return result;
        } else {
            throw new Error(result?.error || 'Failed to fetch series');
        }
    } catch (e) {
        console.error('Error fetching series:', e);
        throw e;
    }
}

export async function getAllSeries() {
    try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const response = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/series/getAllSeries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: jwt ? `Bearer ${jwt}` : '',
            },
        });
        const result = await response.json();
        if (response.ok && result) {
            return result;
        } else {
            throw new Error(result?.error || 'Failed to fetch series');
        }
    } catch (e) {
        console.error('Error fetching series:', e);
        throw e;
    }
}

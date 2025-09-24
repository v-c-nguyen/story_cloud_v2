import supabase from './supabase';

export async function fetchPathways() {
  const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
  // Change 'pathways' to your actual edge function name if different
  const { data, error } = await supabase.functions.invoke('pathway-modes', {
    method: 'GET',
    headers: {  
      Authorization: jwt ? `Bearer ${jwt}` : '',
    },
  });
  if (error) throw error;
  return data && Array.isArray(data) ? data : [];
}

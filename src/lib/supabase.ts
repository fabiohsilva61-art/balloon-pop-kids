import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface PlayerScore {
  id: number;
  username: string;
  max_score: number;
  max_phase: number;
  created_at: string;
}

export async function submitScore(
  username: string,
  score: number,
  phase: number
): Promise<boolean> {
  if (!supabase) {
    console.warn("Supabase not configured — score not saved");
    return false;
  }

  const { data: existing } = await supabase
    .from("players")
    .select("id, max_score")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    if (score > existing.max_score) {
      const { error } = await supabase
        .from("players")
        .update({ max_score: score, max_phase: phase })
        .eq("id", existing.id);
      return !error;
    }
    return true;
  }

  const { error } = await supabase
    .from("players")
    .insert({ username, max_score: score, max_phase: phase });
  return !error;
}

export async function getTopPlayers(limit = 10): Promise<PlayerScore[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("max_score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching ranking:", error);
    return [];
  }

  return data || [];
}

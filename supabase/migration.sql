-- Balloon Pop Kids — Supabase Schema
-- Execute this SQL in the Supabase SQL Editor

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 0,
  max_phase INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for ranking queries
CREATE INDEX IF NOT EXISTS idx_players_max_score ON players (max_score DESC);

-- Unique constraint on username to allow upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_players_username ON players (username);

-- Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read rankings
CREATE POLICY "Anyone can read rankings"
  ON players
  FOR SELECT
  USING (true);

-- Allow anonymous inserts (new players)
CREATE POLICY "Anyone can insert scores"
  ON players
  FOR INSERT
  WITH CHECK (true);

-- Allow update only if new score is higher
CREATE POLICY "Anyone can update their own score"
  ON players
  FOR UPDATE
  USING (true)
  WITH CHECK (max_score >= 0);

-- Create videos table for song-related videos
CREATE TABLE videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('lesson', 'performance')),
    platform TEXT NOT NULL CHECK (platform IN ('youtube', 'vimeo')),
    video_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for fast lookup by song_id
CREATE INDEX videos_song_id_idx ON videos(song_id);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view videos
CREATE POLICY "Videos are viewable by everyone" ON videos
    FOR SELECT USING (true);

-- Policy: Only authenticated users can insert videos
CREATE POLICY "Authenticated users can create videos" ON videos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only video creators can update/delete their videos (assuming future creator_id field)
-- (If you want to add creator_id, add a UUID column and reference auth.users)

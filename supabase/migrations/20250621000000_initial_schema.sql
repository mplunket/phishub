-- Create songs table
CREATE TABLE songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    composer TEXT[],
    debut_date DATE,
    history TEXT,
    lyrics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tabs table
CREATE TABLE tabs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('tab', 'chord_chart', 'sheet_music')),
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create comments table with self-referential relationship for nested comments
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    tab_id UUID REFERENCES tabs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CHECK (
        (song_id IS NOT NULL AND tab_id IS NULL) OR 
        (song_id IS NULL AND tab_id IS NOT NULL)
    )
);

-- Create setlists table
CREATE TABLE setlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE,
    venue TEXT,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create setlist_songs table for the many-to-many relationship
CREATE TABLE setlist_songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setlist_id UUID REFERENCES setlists(id) ON DELETE CASCADE,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (setlist_id, position)
);

-- Create RLS policies
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlist_songs ENABLE ROW LEVEL SECURITY;

-- Songs are publicly readable but only authenticated users can create/edit
CREATE POLICY "Songs are viewable by everyone" ON songs
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create songs" ON songs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Song authors can update their songs" ON songs
    FOR UPDATE USING (auth.uid() IN (
        SELECT author_id FROM tabs WHERE song_id = songs.id
    ));

-- Tabs are publicly readable but only authenticated users can create/edit their own
CREATE POLICY "Tabs are viewable by everyone" ON tabs
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tabs" ON tabs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Tab authors can update their tabs" ON tabs
    FOR UPDATE USING (auth.uid() = author_id);

-- Comments are publicly readable but only authenticated users can create/edit their own
CREATE POLICY "Comments are viewable by everyone" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Comment authors can update their comments" ON comments
    FOR UPDATE USING (auth.uid() = author_id);

-- Setlists are publicly readable but only authenticated users can create/edit their own
CREATE POLICY "Setlists are viewable by everyone" ON setlists
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create setlists" ON setlists
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = creator_id);

CREATE POLICY "Setlist creators can update their setlists" ON setlists
    FOR UPDATE USING (auth.uid() = creator_id);

-- Setlist songs inherit setlist permissions
CREATE POLICY "Setlist songs are viewable by everyone" ON setlist_songs
    FOR SELECT USING (true);

CREATE POLICY "Setlist creators can manage setlist songs" ON setlist_songs
    FOR ALL USING (auth.uid() IN (
        SELECT creator_id FROM setlists WHERE id = setlist_id
    ));

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_songs_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tabs_updated_at
    BEFORE UPDATE ON tabs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setlists_updated_at
    BEFORE UPDATE ON setlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create text search configurations
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create indexes for full text search
CREATE INDEX songs_title_search_idx ON songs USING GIN (to_tsvector('english', title));
CREATE INDEX songs_lyrics_search_idx ON songs USING GIN (to_tsvector('english', lyrics));
CREATE INDEX songs_history_search_idx ON songs USING GIN (to_tsvector('english', history));

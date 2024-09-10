-- Seed songs table
INSERT INTO songs (slug, name, artist, created_at) VALUES
('you-enjoy-myself', 'You Enjoy Myself', 'Phish', CURRENT_TIMESTAMP),
('chalk-dust-torture', 'Chalk Dust Torture', 'Phish', CURRENT_TIMESTAMP),
('divided-sky', 'Divided Sky', 'Phish', CURRENT_TIMESTAMP),
('tweezer', 'Tweezer', 'Phish', CURRENT_TIMESTAMP),
('bouncing-around-the-room', 'Bouncing Around the Room', 'Phish', CURRENT_TIMESTAMP);

-- Seed tabs table
INSERT INTO tabs (song_id, instrument, author, content, created_at) VALUES
(1, 'Guitar', 'PhishFan1', E'Em7 - A - Cmaj7 - D\n[...rest of tab content...]', CURRENT_TIMESTAMP),
(1, 'Bass', 'BassHead', E'E - A - C - D\n[...rest of tab content...]', CURRENT_TIMESTAMP),
(2, 'Guitar', 'GuitarHero', E'D - G - A\n[...rest of tab content...]', CURRENT_TIMESTAMP),
(3, 'Piano', 'KeyMaster', E'C - G - Am - F\n[...rest of tab content...]', CURRENT_TIMESTAMP),
(4, 'Guitar', 'TreyFanatic', E'F - Bb - C\n[...rest of tab content...]', CURRENT_TIMESTAMP),
(5, 'Guitar', 'PhishNewbie', E'G - D - Em - C\n[...rest of tab content...]', CURRENT_TIMESTAMP);

-- Seed videos table
INSERT INTO videos (song_id, type, platform, video_id, created_at) VALUES
(1, 'performance', 'youtube', 'dQw4w9WgXcQ', CURRENT_TIMESTAMP),
(1, 'lesson', 'youtube', 'dQw4w9WgXcQ', CURRENT_TIMESTAMP),
(2, 'performance', 'vimeo', '123456789', CURRENT_TIMESTAMP),
(3, 'lesson', 'youtube', 'abcdefghijk', CURRENT_TIMESTAMP),
(4, 'performance', 'youtube', 'lmnopqrstuv', CURRENT_TIMESTAMP);
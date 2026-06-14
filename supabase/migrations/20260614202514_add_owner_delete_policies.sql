-- Add missing owner DELETE policies.
--
-- RLS was enabled on these tables in the initial schema with SELECT/INSERT/
-- UPDATE policies, but no DELETE policy. Without one, deletes are silently
-- blocked even for the owner. Most importantly this means `deleteSetlist`
-- appeared to work but removed nothing — this migration fixes that and adds the
-- equivalent owner-scoped delete for tabs and comments.

-- Setlist creators can delete their own setlists. (setlist_songs already has a
-- FOR ALL policy scoped to the setlist creator, and ON DELETE CASCADE removes
-- the rows, so no separate policy is needed there.)
CREATE POLICY "Setlist creators can delete their setlists" ON setlists
    FOR DELETE USING (auth.uid() = creator_id);

-- Tab authors can delete their own tabs.
CREATE POLICY "Tab authors can delete their tabs" ON tabs
    FOR DELETE USING (auth.uid() = author_id);

-- Comment authors can delete their own comments. (Child replies cascade via the
-- self-referential parent_id ON DELETE CASCADE.)
CREATE POLICY "Comment authors can delete their comments" ON comments
    FOR DELETE USING (auth.uid() = author_id);

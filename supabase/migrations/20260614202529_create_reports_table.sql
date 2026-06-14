-- Community content reports. Lets signed-in users flag a tab or a comment for
-- moderator review. Exactly one target (tab or comment) is set per report.

CREATE TABLE reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tab_id UUID REFERENCES tabs(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CHECK (
        (tab_id IS NOT NULL AND comment_id IS NULL) OR
        (tab_id IS NULL AND comment_id IS NOT NULL)
    )
);

CREATE INDEX reports_status_idx ON reports (status);
CREATE INDEX reports_reporter_idx ON reports (reporter_id);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Authenticated users can file a report as themselves. There is intentionally
-- no SELECT/UPDATE/DELETE policy: reports are write-only for users and are
-- read/triaged by moderators using the service role (e.g. an admin dashboard),
-- so one user can't see what others have reported.
CREATE POLICY "Authenticated users can file reports" ON reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reporter_id);

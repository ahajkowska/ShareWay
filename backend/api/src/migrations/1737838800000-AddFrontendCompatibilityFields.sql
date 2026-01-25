ALTER TABLE trips
ADD COLUMN IF NOT EXISTS accent_preset VARCHAR(50) DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';

UPDATE trips
SET accent_preset = 'neutral'
WHERE accent_preset IS NULL;

UPDATE trips
SET status = 'ACTIVE'
WHERE status IS NULL;

ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE votes
ADD COLUMN IF NOT EXISTS title VARCHAR(500),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS created_by UUID;

UPDATE votes
SET title = question
WHERE title IS NULL AND question IS NOT NULL;

UPDATE votes
SET ends_at = created_at + INTERVAL '7 days'
WHERE ends_at IS NULL;

ALTER TABLE votes
ADD CONSTRAINT fk_votes_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
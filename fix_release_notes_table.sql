ALTER TABLE release_notes ADD COLUMN IF NOT EXISTS isPublished boolean DEFAULT true NOT NULL;
ALTER TABLE release_notes ADD COLUMN IF NOT EXISTS priority int DEFAULT 0 NOT NULL;  
ALTER TABLE release_notes ADD COLUMN IF NOT EXISTS releaseDate date NULL;
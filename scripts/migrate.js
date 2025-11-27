const { Client } = require('pg');

const connectionString = 'postgres://postgres.lpchnpbehgcmieskuhzo:yRyF4lbl6THsEK4f@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Create posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id UUID REFERENCES auth.users(id)
      );
    `);
    console.log('Created posts table');

    // Enable RLS on posts
    await client.query(`
      ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
    `);
    console.log('Enabled RLS on posts');

    // Create policy to allow read access to everyone
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Public posts are viewable by everyone'
        ) THEN
          CREATE POLICY "Public posts are viewable by everyone"
          ON posts FOR SELECT
          USING (true);
        END IF;
      END
      $$;
    `);
    console.log('Created read policy for posts');

    // Create policy to allow insert access to authenticated users
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can insert their own posts'
        ) THEN
          CREATE POLICY "Users can insert their own posts"
          ON posts FOR INSERT
          WITH CHECK (auth.uid() = user_id);
        END IF;
      END
      $$;
    `);
    console.log('Created insert policy for posts');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();

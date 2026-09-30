const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isMockFallback = false;

// Check if credentials are real and not placeholder
const isValidSupabaseConfig = (url, key) => {
  return (
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    key.length > 20
  );
};

if (isValidSupabaseConfig(supabaseUrl, supabaseKey)) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] Successfully connected to Supabase PostgreSQL at:', supabaseUrl);
  } catch (error) {
    console.error('[Supabase] Failed to initialize Supabase client:', error.message);
    isMockFallback = true;
  }
} else {
  console.warn(
    '[Supabase] Warning: Valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not found in .env.\n' +
    'Running with in-memory persistence fallback for seamless local testing. Add keys to .env to connect to live PostgreSQL.'
  );
  isMockFallback = true;
}

// In-Memory Storage Fallback for zero-friction local testing
const inMemoryStore = {
  users: [],
  inspections: [],
};

const mockSupabase = {
  from: (table) => {
    return {
      select: (fields = '*') => {
        let currentData = [...(inMemoryStore[table] || [])];
        const chain = {
          eq: (column, value) => {
            currentData = currentData.filter((item) => item[column] === value);
            return chain;
          },
          order: (column, { ascending = true } = {}) => {
            currentData.sort((a, b) => {
              if (a[column] < b[column]) return ascending ? -1 : 1;
              if (a[column] > b[column]) return ascending ? 1 : -1;
              return 0;
            });
            return chain;
          },
          range: (from, to) => {
            currentData = currentData.slice(from, to + 1);
            return chain;
          },
          single: async () => {
            const item = currentData[0] || null;
            return { data: item, error: item ? null : { message: 'Row not found' } };
          },
          then: (resolve, reject) => {
            resolve({ data: currentData, error: null });
          },
        };
        return chain;
      },
      insert: (records) => {
        const rows = Array.isArray(records) ? records : [records];
        const inserted = rows.map((r) => ({
          id: r.id || 'mock-id-' + Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          ...r,
        }));
        if (!inMemoryStore[table]) inMemoryStore[table] = [];
        inMemoryStore[table].push(...inserted);

        return {
          select: (fields = '*') => ({
            single: async () => ({ data: inserted[0], error: null }),
            then: (resolve) => resolve({ data: inserted, error: null }),
          }),
          then: (resolve) => resolve({ data: inserted, error: null }),
        };
      },
    };
  },
};

module.exports = {
  supabase: isMockFallback ? mockSupabase : supabase,
  isMockFallback,
};

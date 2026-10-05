const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Pull environment variables set in Render
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log('Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing or invalid.');
}

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Free LMIS API is running live!' });
});

// Observations endpoint
app.get('/observations', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase credentials are not configured.' });
  }
  const { data, error } = await supabase.from('observations').select('*');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
});

// Listen on process.env.PORT for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Set up Supabase Client using environment variables (or fallbacks)
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Root test endpoint for Render health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Free LMIS API is running live!' });
});

// Fetch observations endpoint
app.get('/observations', async (req, res) => {
  const { data, error } = await supabase.from('observations').select('*');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
});

// IMPORTANT: Render sets process.env.PORT automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Free LMIS API running on port ${PORT}`);
});
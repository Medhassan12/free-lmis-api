const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase Client using Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'LMIS API is operational', system: 'Djibouti SIMT/LMIS' });
});

// GET /institutions - Fetch all reporting institutions
app.get('/institutions', async (req, res) => {
  try {
    const { data, error } = await supabase.from('institutions').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /observations - Fetch observations with institution details
app.get('/observations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('observations')
      .select(`
        id,
        indicator_code,
        country_name,
        year,
        value,
        created_at,
        institution_code,
        institutions ( name, role_description )
      `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
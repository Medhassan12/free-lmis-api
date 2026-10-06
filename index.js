const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins and HTTP methods
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("WARNING: SUPABASE_URL or SUPABASE_KEY is missing!");
}

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Djibouti LMIS API is running' });
});

// GET /observations
app.get('/observations', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
    const { data, error } = await supabase.from('observations').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /observations (FIXES THE 404 ERROR)
app.post('/observations', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ detail: 'Supabase client not initialized' });
    }

    const { 
      institution_code, 
      indicator_code, 
      year, 
      value, 
      sex, 
      subdivision_code,
      subdivision 
    } = req.body;

    const newRecord = {
      institution_code: institution_code || 'UNKNOWN',
      indicator_code: indicator_code || 'UNKNOWN',
      year: parseInt(year, 10),
      value: parseFloat(value),
      sex: sex || 'TOTAL',
      subdivision_code: subdivision_code || subdivision || 'NATIONAL'
    };

    const { data, error } = await supabase
      .from('observations')
      .insert([newRecord])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(400).json({ detail: error.message });
    }

    res.status(201).json({ message: 'Observation created successfully', data });
  } catch (err) {
    console.error('Server POST Error:', err.message);
    res.status(500).json({ detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
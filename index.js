const express = require('express');
const cors = require('cors');

const app = express();

// Allow requests from any frontend domain
app.use(cors());

// Or allow specifically your GitHub Pages origin:
// app.use(cors({ origin: 'https://medhassan12.github.io' }));

app.use(express.json());
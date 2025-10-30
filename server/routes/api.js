const express = require('express');
const axios = require('axios');
const Search = require('../models/Search');
const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// POST /api/search
router.post('/search', ensureAuth, async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: 'term required' });

    // Store search
    await Search.create({ userId: req.user._id, term });

    // Query Unsplash
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query: term, per_page: 30 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    // Return results (pass through relevant fields)
    const results = response.data.results.map(img => ({
      id: img.id,
      description: img.alt_description,
      thumb: img.urls.small,
      regular: img.urls.regular,
      width: img.width,
      height: img.height,
      user: img.user
    }));

    res.json({ term, total: response.data.total, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/top-searches
router.get('/top-searches', async (req, res) => {
  try {
    const agg = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(agg.map(a => ({ term: a._id, count: a.count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/history
router.get('/history', ensureAuth, async (req, res) => {
  try {
    const userHistory = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(100);
    res.json(userHistory.map(h => ({ term: h.term, timestamp: h.timestamp })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

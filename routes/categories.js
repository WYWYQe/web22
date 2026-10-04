// routes/categories.js
// GET /api/categories -> all event categories (populates the search page filter)
const express = require('express');
const { getConnection } = require('../event_db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const db = await getConnection();
    const [rows] = await db.query(
      `SELECT c.category_id, c.category_name, c.description,
              COUNT(e.event_id) AS event_count
       FROM categories c
       LEFT JOIN events e
              ON e.category_id = c.category_id
             AND e.is_suspended = 0
       GROUP BY c.category_id, c.category_name, c.description
       ORDER BY c.category_name ASC`
    );
    res.json({ count: rows.length, categories: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// routes/events.js
// GET /api/events       -> collection of active events (home page + search page)
// GET /api/events/:id   -> one event with full details (event details page)
const express = require('express');
const { getConnection } = require('../event_db');

const router = express.Router();

// Summary shape used by the home page and the search results.
// event_status is derived from the date, so it can never go stale.
const EVENT_LIST_SELECT = `
  SELECT e.event_id, e.event_name, e.summary, e.event_date, e.start_time, e.end_time,
         e.venue, e.city, e.ticket_price, e.image_url,
         c.category_id, c.category_name,
         o.org_id, o.org_name,
         CASE WHEN e.event_date < CURDATE() THEN 'past' ELSE 'upcoming' END AS event_status
  FROM events e
  JOIN categories    c ON c.category_id = e.category_id
  JOIN organisations o ON o.org_id      = e.org_id
  WHERE e.is_suspended = 0
`;

// GET /api/events
// Optional query parameters: date, dateFrom, dateTo, city, categoryId, status, limit
router.get('/', async (req, res, next) => {
  try {
    const { date, dateFrom, dateTo, city, categoryId, status, limit } = req.query;
    const conditions = [];
    const params = [];

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'date must use the format YYYY-MM-DD' });
      }
      conditions.push('e.event_date = ?');
      params.push(date);
    }
    if (dateFrom) { conditions.push('e.event_date >= ?'); params.push(dateFrom); }
    if (dateTo)   { conditions.push('e.event_date <= ?'); params.push(dateTo); }

    if (city) { conditions.push('e.city = ?'); params.push(city); }

    if (categoryId !== undefined) {
      if (!/^\d+$/.test(categoryId)) {
        return res.status(400).json({ error: 'categoryId must be a number' });
      }
      conditions.push('e.category_id = ?');
      params.push(Number(categoryId));
    }

    if (status) {
      if (!['upcoming', 'past'].includes(status)) {
        return res.status(400).json({ error: "status must be 'upcoming' or 'past'" });
      }
      conditions.push(status === 'upcoming'
        ? 'e.event_date >= CURDATE()'
        : 'e.event_date <  CURDATE()');
    }

    const where = conditions.length ? ' AND ' + conditions.join(' AND ') : '';
    let sql = EVENT_LIST_SELECT + where + ' ORDER BY e.event_date ASC';

    // Optional row limit so one request can never return an unbounded result set.
    if (limit !== undefined) {
      const n = Number(limit);
      if (!Number.isInteger(n) || n < 1 || n > 100) {
        return res.status(400).json({ error: 'limit must be an integer between 1 and 100' });
      }
      sql += ' LIMIT ?';
      params.push(n);
    }

    const db = await getConnection();
    const [rows] = await db.query(sql, params);
    res.json({ count: rows.length, events: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Event id must be a positive integer' });
    }
    const db = await getConnection();
    const [rows] = await db.query(
      `SELECT e.*,
              c.category_name,
              o.org_name, o.mission, o.email, o.phone, o.website,
              CASE WHEN e.event_date < CURDATE() THEN 'past' ELSE 'upcoming' END AS event_status,
              ROUND(e.raised_amount / NULLIF(e.goal_amount, 0) * 100, 1)      AS progress_percent
       FROM events e
       JOIN categories    c ON c.category_id = e.category_id
       JOIN organisations o ON o.org_id      = e.org_id
       WHERE e.event_id = ? AND e.is_suspended = 0`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Event ${id} not found` });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

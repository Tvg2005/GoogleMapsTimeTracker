import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.VITE_DATABASE_HOST || 'localhost',
  port: parseInt(process.env.VITE_DATABASE_PORT || '5432'),
  database: process.env.VITE_DATABASE_NAME || 'postgres',
  user: process.env.VITE_DATABASE_USER || 'postgres',
  password: process.env.VITE_DATABASE_PASSWORD || 'postgres',
});

app.use(cors());
app.use(express.json());

app.post('/api/init-db', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        origin VARCHAR(500) NOT NULL,
        destination VARCHAR(500) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS travel_times (
        id SERIAL PRIMARY KEY,
        route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
        duration_seconds INTEGER NOT NULL,
        duration_in_traffic_seconds INTEGER,
        distance_meters INTEGER NOT NULL,
        query_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        traffic_condition VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        preparation_minutes INTEGER DEFAULT 15,
        query_frequency_minutes INTEGER DEFAULT 5,
        monitoring_intervals TEXT DEFAULT '08:00-09:00,18:00-19:00',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_travel_times_route_id ON travel_times(route_id);
      CREATE INDEX IF NOT EXISTS idx_travel_times_datetime ON travel_times(query_datetime);
      CREATE INDEX IF NOT EXISTS idx_routes_active ON routes(is_active);

      INSERT INTO user_settings (id, preparation_minutes, query_frequency_minutes, monitoring_intervals)
      SELECT 1, 15, 5, '08:00-09:00,18:00-19:00'
      WHERE NOT EXISTS (SELECT 1 FROM user_settings WHERE id = 1);
    `);

    res.json({ success: true });
  } catch (error) {
    console.error('Database init error:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

app.get('/api/routes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

app.get('/api/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

app.post('/api/routes', async (req, res) => {
  try {
    const { name, origin, destination } = req.body;
    const result = await pool.query(
      'INSERT INTO routes (name, origin, destination, is_active) VALUES ($1, $2, $3, true) RETURNING *',
      [name, origin, destination]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create route' });
  }
});

app.put('/api/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, origin, destination } = req.body;
    const result = await pool.query(
      'UPDATE routes SET name = $1, origin = $2, destination = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, origin, destination, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update route' });
  }
});

app.patch('/api/routes/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const result = await pool.query(
      'UPDATE routes SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [isActive, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle route' });
  }
});

app.delete('/api/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM routes WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

app.get('/api/routes/:id/travel-times', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit || 100;
    const result = await pool.query(
      'SELECT * FROM travel_times WHERE route_id = $1 ORDER BY query_datetime DESC LIMIT $2',
      [id, limit]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch travel times' });
  }
});

app.post('/api/travel-times', async (req, res) => {
  try {
    const { routeId, durationSeconds, durationInTrafficSeconds, distanceMeters, trafficCondition } = req.body;
    const result = await pool.query(
      'INSERT INTO travel_times (route_id, duration_seconds, duration_in_traffic_seconds, distance_meters, traffic_condition) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [routeId, durationSeconds, durationInTrafficSeconds, distanceMeters, trafficCondition]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save travel time' });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_settings WHERE id = 1');
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const { preparationMinutes, queryFrequencyMinutes, monitoringIntervals } = req.body;
    const result = await pool.query(
      'UPDATE user_settings SET preparation_minutes = $1, query_frequency_minutes = $2, monitoring_intervals = $3, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *',
      [preparationMinutes, queryFrequencyMinutes, monitoringIntervals]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

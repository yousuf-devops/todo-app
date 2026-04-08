const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'tododb',
});

app.get('/todos', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM todos');
  res.json(rows);
});

app.post('/todos', async (req, res) => {
  const { title } = req.body;
  const [result] = await db.query(
    'INSERT INTO todos (title, done) VALUES (?, false)', [title]
  );
  res.json({ id: result.insertId, title, done: false });
});

app.patch('/todos/:id', async (req, res) => {
  await db.query('UPDATE todos SET done=? WHERE id=?',
    [req.body.done, req.params.id]);
  res.json({ ok: true });
});

app.delete('/todos/:id', async (req, res) => {
  await db.query('DELETE FROM todos WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

app.listen(3000, () => console.log('Backend running on port 3000'));

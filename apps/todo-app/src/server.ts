import express from "express";
import cors from "cors";

import { db, pool } from "./database.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Create Todo
app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Title is required"
      });
    }

    const todo = await db.todo.create({
      title,
      completed: false
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create todo"
    });
  }
});

// Get Todos
app.get("/todos", async (req, res) => {
  try {
    const { completed } = req.query;

    let todos;

    if (completed === "true") {
      todos = await db.todo.findMany({
        where: {
          completed: true
        }
      });
    } else if (completed === "false") {
      todos = await db.todo.findMany({
        where: {
          completed: false
        }
      });
    } else {
      todos = await db.todo.findMany();
    }

    res.json(todos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch todos"
    });
  }
});

// Update Todo
app.patch("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const todo = await db.todo.update(id, {
      completed: true
    });

    res.json(todo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update todo"
    });
  }
});

// Delete Todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const todo = await db.todo.delete(id);

    res.json(todo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete todo"
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Close database when application stops
process.on("SIGINT", async () => {
  await pool.end();
  process.exit();
});
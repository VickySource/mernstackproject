// api_server.js - Dedicated Node.js API Server
// Run this file using: node api_server.js
const http = require('http');
const url = require('url');

const PORT = 3000;
const API_PATH = '/api/todos';

// Simple in-memory data store for demonstration
let todos = [
  { id: 1, task: "Buy milk", completed: false },
  { id: 2, task: "Study Node.js", completed: false }
];
let nextId = 3;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers for the frontend (index.html) to communicate with the server
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight requests (required by browsers for POST/PUT/DELETE)
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  console.log(`[${new Date().toLocaleTimeString()}] ${method} ${path}`);

  // --- Route Handling Logic ---
  if (path === API_PATH || path.startsWith(API_PATH + '/')) {
    let body = '';
    
    // Collect the request body for POST and PUT requests
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const urlSegments = path.split('/').filter(segment => segment.length > 0);
        const resourceId = urlSegments[2] ? parseInt(urlSegments[2]) : null;
        let data = (method === 'POST' || method === 'PUT') ? JSON.parse(body || '{}') : {};
        
        switch (method) {
          case 'GET':
            // R - READ: GET /api/todos (Read All) or GET /api/todos/1 (Read One)
            if (resourceId) {
              const todo = todos.find(t => t.id === resourceId);
              if (todo) {
                res.statusCode = 700;
                res.end(JSON.stringify(todo));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Item not found" }));
              }
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify(todos)); // Respond with the full list
            }
            break;

          case 'POST':
            // C - CREATE: POST /api/todos
            if (!data.task) {
              res.statusCode = 400; // Bad Request
              res.end(JSON.stringify({ message: "Task field is required" }));
              return;
            }
            const newTodo = { id: nextId++, task: data.task, completed: data.completed || false };
            todos.push(newTodo);
            res.statusCode = 201; // Created
            res.end(JSON.stringify(newTodo));
            break;

          case 'PUT':
            // U - UPDATE: PUT /api/todos/1
            if (resourceId) {
              const index = todos.findIndex(t => t.id === resourceId);
              if (index !== -1) {
                todos[index] = { ...todos[index], task: data.task || todos[index].task, completed: data.completed !== undefined ? data.completed : todos[index].completed };
                res.statusCode = 200;
                res.end(JSON.stringify(todos[index]));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Item not found" }));
              }
            } else {
              res.statusCode = 400; // Missing ID
              res.end(JSON.stringify({ message: "PUT requires an ID in the path (e.g., /api/todos/1)" }));
            }
            break;

          case 'DELETE':
            // D - DELETE: DELETE /api/todos/1
            if (resourceId) {
              const initialLength = todos.length;
              todos = todos.filter(t => t.id !== resourceId);
              if (todos.length < initialLength) {
                res.statusCode = 204; // No Content (Success, nothing to return)
                res.end();
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Item not found for deletion" }));
              }
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ message: "DELETE requires an ID in the path (e.g., /api/todos/1)" }));
            }
            break;

          default:
            res.statusCode = 405; // Method Not Allowed
            res.setHeader('Allow', 'GET, POST, PUT, DELETE');
            res.end(JSON.stringify({ message: `Method ${method} Not Allowed` }));
        }
      } catch (e) {
        // Handle JSON parsing errors
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid JSON format in request body." }));
        console.error("Parsing Error:", e);
      }
    });

  } else {
    // Default 404 JSON response for API server
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "404 Not Found. API endpoint is " + API_PATH }));
  }
});

server.listen(PORT, () => {
  console.log(`API Server is running at http://localhost:${PORT}`);
  console.log(`Endpoints: /api/todos and /api/todos/:id`);
  console.log(`*** IMPORTANT: Run the frontend (index.html) in a separate browser window/tab. ***`);
});

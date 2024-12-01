const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Initialize Express App
const app = express();

// Middleware
app.use(bodyParser.json());

const allowedOrigins = [
  'https://your-amplify-domain.com', // Update with your Amplify domain
  'https://amplify-ide-backend-test-422d9d6bb2a8.herokuapp.com'
];

app.use(cors({
  origin: '*', // Temporarily allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Helper Function to Write Code to File
const writeCodeToFile = (filename, content) => {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
};

app.post('/run', (req, res) => {
  const { language, code } = req.body;

  // Validate request body
  if (!code || !language) {
    return res.status(400).json({ output: 'Error: Missing code or language.' });
  }

  if (!code.trim()) {
    return res.status(400).json({ output: 'Error: Code is empty.' });
  }

  let command;
  try {
    switch (language.toLowerCase()) {
      case 'javascript':
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'python':
        command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'java':
        fs.writeFileSync('Main.java', code);
        command = `javac Main.java && java Main`;
        break;
      case 'cpp':
        fs.writeFileSync('temp.cpp', code);
        command = `g++ temp.cpp -o temp && ./temp`;
        break;
      default:
        return res.status(400).json({ output: 'Error: Unsupported language selected.' });
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        res.status(400).json({ output: stderr || error.message });
      } else {
        res.json({ output: stdout });
      }
    });
  } catch (err) {
    console.error(`Server error: ${err.message}`);
    res.status(500).json({ output: 'Server error.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000; // Use Heroku's dynamic port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

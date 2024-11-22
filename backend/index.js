const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper Function to Write Code to File
const writeCodeToFile = (filename, content) => {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
};

// Endpoint to Run Code
app.post('/run', (req, res) => {
  const { language, code } = req.body;
  let command;

  // Command Switch for Different Languages
  try {
    switch (language.toLowerCase()) {
      case 'c++':
        writeCodeToFile('temp.cpp', code);
        command = `g++ temp.cpp -o temp && ./temp`;
        break;
      case 'java':
        writeCodeToFile('Main.java', code);
        command = `javac Main.java && java Main`;
        break;
      case 'python':
        command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
        break;
      default:
        return res.status(400).json({ output: 'Invalid language' });
    }

    // Execute Command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        res.json({ output: stderr || error.message });
      } else {
        res.json({ output: stdout });
      }
    });
  } catch (err) {
    res.status(500).json({ output: 'Server error' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

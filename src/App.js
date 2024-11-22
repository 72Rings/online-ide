import React, { useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/the-matrix.css';
import 'codemirror/theme/night.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import axios from 'axios'; // For sending code to backend


const App = () => {
  const [theme, setTheme] = useState('dracula');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  const handleThemeChange = (event) => setTheme(event.target.value);
  const handleLanguageChange = (event) => setLanguage(event.target.value);

  const runCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/run', { language, code });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error executing code');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#282c34', height: '100vh', color: 'white' }}>
      <h1>Online Code Editor with Themes</h1>

      <label style={{ marginRight: '10px' }}>Select Theme:</label>
      <select onChange={handleThemeChange}>
        <option value="dracula">Dracula</option>
        <option value="material">Material</option>
        <option value="mdn-like">MDN-like</option>
        <option value="the-matrix">The Matrix</option>
        <option value="night">Night</option>
      </select>

      <label style={{ marginLeft: '20px', marginRight: '10px' }}>Select Language:</label>
      <select onChange={handleLanguageChange}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c++">C++</option>
      </select>

      <CodeMirror
        value={code}
        options={{
          mode: language,
          theme: theme,
          lineNumbers: true,
        }}
        onBeforeChange={(editor, data, value) => setCode(value)}
      />

      <button onClick={runCode} style={{ marginTop: '10px' }}>Run Code</button>

      <pre style={{ marginTop: '20px' }}>{output}</pre>
    </div>
  );
};

export default App;

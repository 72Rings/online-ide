import React, { useState } from 'react';
import 'codemirror/lib/codemirror.css'; // Include the required codemirror styles
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark'; // Correct import for One Dark theme
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import CodeMirror from '@uiw/react-codemirror';
import axios from 'axios';

const App = () => {
  const [theme, setTheme] = useState(oneDark);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(javascript);
  const [output, setOutput] = useState('');

  const API_URL = "http://3.23.99.211:5000/run"; // Replace with your ECS public IP and port 5000

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value === 'oneDark' ? oneDark : EditorView.theme({});
    setTheme(selectedTheme);
  };

  const handleLanguageChange = (event) => {
    const selectedLang = {
      javascript: javascript,
      python: python,
      java: java,
      cpp: cpp,
    }[event.target.value];
    setLanguage(selectedLang);
  };

  const runCode = async () => {
    const langName = {
      [javascript]: 'javascript',
      [python]: 'python',
      [java]: 'java',
      [cpp]: 'cpp',
    }[language];

    try {
      const response = await axios.post(API_URL, { language: langName, code });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error executing code');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#282c34', height: '100vh', color: 'white' }}>
      <h1>Online Code Editor with Themes</h1>

      {/* Theme Selector */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Select Theme:</label>
        <select onChange={handleThemeChange}>
          <option value="oneDark">One Dark</option>
          <option value="default">Default</option>
        </select>
      </div>

      {/* Language Selector */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Select Language:</label>
        <select onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Code Editor */}
      <CodeMirror
        value={code}
        extensions={[language]}
        theme={theme}
        onChange={(value) => setCode(value)}
      />

      {/* Run Code Button */}
      <button
        onClick={runCode}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#61dafb',
          color: '#282c34',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Run Code
      </button>

      {/* Output */}
      <pre style={{ marginTop: '20px', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '5px' }}>
        {output}
      </pre>
    </div>
  );
};

export default App;

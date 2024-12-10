import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';

import CodeEditor from './components/CodeEditor';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import AskAISection from './components/AskAiSection';
import './App.css';

const App = () => {
  const defaultCodes = {
    java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int number = scanner.nextInt();
    System.out.println(number);
  }
}`,
    cpp: `#include <iostream>
using namespace std;
int main() {
  int number;
  cin >> number;
  cout << number << endl;
  return 0;
}`
  };

  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(defaultCodes[language]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAi,setLoadingAi]=useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(defaultCodes[lang]);
  };

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/compile', { code, input, language });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Failed to execute code');
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async () => {
    setLoadingAi(true)
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=use key here from gemini';

    const requestBody = {
      contents: [
        {
          parts: [{ text: `Hey Gemini, if there is any error then rectify it and give the code only, no explanations; otherwise say "The Code is Correct": ${code}` }]
        }
      ]
    };

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      const content = response.data.candidates[0]?.content?.parts[0]?.text || 'No response available.';
      return content;
    } catch (error) {
      console.error('Error asking AI:', error);
      return 'Failed to get suggestions. Please try again.';
    }
    finally{
      setLoadingAi(false)
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-300 flex flex-col">
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <h1 className="text-4xl font-bold text-white font-roboto-mono">
          CODE<span className="text-4xl font-bold text-yellow-600 font-roboto-mono">SPHERE</span>
        </h1>
        <div>
          {['java', 'cpp'].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`mx-2 p-2 rounded ${
                language === lang ? 'bg-yellow-600' : 'bg-gray-700'
              } text-white`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="relative group">
          <button
            onClick={handleRunCode}
            disabled={loading}
            className="text-white p-2 rounded-full transition"
          >
            <FaPlay className="text-xl" />
          </button>
          <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Run
          </div>
        </div>
      </header>
      <div className="flex flex-grow p-4">
        <div className="w-[60%] h-full mr-4">
          <CodeEditor code={code} setCode={setCode} language={language} />
        </div>
        <div className="flex flex-col w-[40%] h-full">
          <div className="h-[20%] mb-4">
            <InputSection input={input} setInput={setInput} />
          </div>
          <div className="h-[35%] mb-4">
            <OutputSection output={output} loading={loading} />
            
          </div>
          <div className="h-[45%]">
          <AskAISection handleAskAI={handleAskAI} loadingAi={loadingAi}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

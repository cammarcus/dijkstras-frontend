import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [firstWord, setFirstWord] = useState('');
  const [finalWord, setFinalWord] = useState('');
  const [distance, setDistance] = useState('');
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add state for error
  const url = 'http://54.167.171.72:3000/'; // Update with your server URL

  const submit = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await makeGetRequest(firstWord, finalWord);
      const data = response.data;
      setDistance(data.distanceBetweenWords);
      setPath(data.path);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle specific error message for status 400
        setError(error.response.data.message || 'Invalid input. Please check your words.');
      } else {
        // Handle other errors
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error making GET request:', error.message);
    } finally {
      setLoading(false);
    }
  };

  async function makeGetRequest(firstWord, finalWord) {
    try {
      const response = await axios.get(url, {
        params: {
          firstWord,
          finalWord
        }
      });
      return response;
    } catch (error) {
      console.error('Error making GET request:', error.message);
      throw error; // Rethrow to be caught by submit
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <header className="mb-6">
        <img src={logo} className="w-24 h-24" alt="logo" />
        <h1 className="text-4xl font-bold text-gray-900">Word Transformation</h1>
      </header>
      <main className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <p className="text-xl font-semibold text-gray-700 mb-2">First Word:</p>
        <input
          type="text"
          value={firstWord}
          onChange={(e) => setFirstWord(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <p className="text-xl font-semibold text-gray-700 mb-2">Final Word:</p>
        <input
          type="text"
          value={finalWord}
          onChange={(e) => setFinalWord(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <button
          onClick={submit}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="none" stroke="currentColor" strokeWidth="4" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            'Submit'
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-100 text-red-800 p-4 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="text-lg font-medium text-gray-800">Distance:</p>
          <p className="text-xl font-semibold text-gray-900">{distance}</p>
        </div>

        <div className="mt-4">
          <p className="text-lg font-medium text-gray-800">Path:</p>
          <p className="text-xl font-semibold text-gray-900">{path.join(' ')}</p>
        </div>
      </main>
      <div className="mt-8 text-md text-gray-600 p-4">
        <p>This application uses Dijkstra's algorithm to find the shortest path between two words by changing one letter at a time. Inspired by the game <a href="https://wordwormdormdork.com/" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Weaver</a>.</p>
        <p>Built with React, styled with Tailwind CSS, and powered by a Node.js and Express backend running on an AWS EC2 instance. The backend handles the logic and calculations, while the frontend provides a user-friendly interface for interaction.</p>
      </div>
    </div>
  );
}

export default App;

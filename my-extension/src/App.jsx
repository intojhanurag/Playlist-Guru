import React, { useState } from 'react';

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [days, setDays] = useState(7);
  const [schedule, setSchedule] = useState('');
  const [depth, setDepth] = useState(false);
  const [timetable, setTimetable] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:3001/generate-timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlistUrl, days, schedule, depth })
    });
    const data = await res.json();
    setTimetable(data.timetable);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">YouTube Study Planner</h1>

      <input
        type="text"
        placeholder="Paste YouTube playlist URL"
        value={playlistUrl}
        onChange={e => setPlaylistUrl(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-3"
      />

      <input
        type="number"
        placeholder="Days to complete"
        value={days}
        onChange={e => setDays(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-3"
      />

      <textarea
        placeholder="Enter your 7-day schedule (Mon to Sun)"
        value={schedule}
        onChange={e => setSchedule(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-3"
      />

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={depth}
          onChange={e => setDepth(e.target.checked)}
          className="mr-2"
        />
        I want in-depth learning
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Generating...' : 'Generate Timetable'}
      </button>

      {timetable && (
        <div className="mt-6 bg-gray-100 p-4 rounded border-l-4 border-blue-600">
          <h2 className="font-semibold text-lg mb-2">Your 7-Day Study Plan</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{timetable}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

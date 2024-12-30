// src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideoPath, setCurrentVideoPath] = useState("");

  useEffect(() => {
      fetch("http://localhost:4747/videos")
//      fetch("http://localhost:4747/videos")
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Video List</h1>
      {/* 스크롤 가능한 리스트 영역 */}
      <div style={{
        maxHeight: '300px',     // 원하는 높이 지정
        overflowY: 'auto',      // 세로 스크롤 활성화
        border: '1px solid #ccc', 
        padding: '8px',
        marginBottom: '16px'    // 아래 여백
      }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {videos.map(video => (
            <li
              key={video.path}
              style={{ 
                cursor: 'pointer',
                padding: '4px 0'
              }}
              onClick={() => setCurrentVideoPath(video.path)}
            >
              {video.name}
            </li>
          ))}
        </ul>
      </div>

      {currentVideoPath && (
        <div>
          <h2>Now Playing</h2>
          <video 
            controls 
            width="640"
            src={`http://localhost:4747/video/stream?path=${encodeURIComponent(currentVideoPath)}`}
          />
        </div>
      )}
    </div>
  );
}

export default App;

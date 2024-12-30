// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const mediaDir = 'D:/working/project/mywork/temp_media/videos';

app.use(cors({ origin: 'http://localhost:3000' }));

// 1) 동영상 목록 API
app.get('/videos', (req, res) => {
  // 단순히 mediaDir 디렉터리의 mp4 파일만 스캔
  const files = fs.readdirSync(mediaDir)
    .filter(file => file.endsWith('.mp4'))
    .map(file => ({
      name: file,
      path: path.join(mediaDir, file)
    }));
  res.json(files);
});

// 2) 트랜스코딩(또는 직접 스트리밍) API
app.get('/video/stream', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).send('No file path provided.');
  }

  // 예: H.264 + AAC로 단순 트랜스코딩
  const ffmpeg = spawn('ffmpeg', [
    '-i', filePath,
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-movflags', 'frag_keyframe+empty_moov',
    '-f', 'mp4',
    'pipe:1'
  ]);

  // 스트리밍 시작
  res.setHeader('Content-Type', 'video/mp4'); 

  ffmpeg.stdout.pipe(res);
  ffmpeg.stderr.on('data', data => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on('close', code => {
    console.log(`FFmpeg process closed with code ${code}`);
  });

  // *** 연결(응답)이 끊겼을 때 처리 ***
  res.on('close', () => {
    console.log('Response closed. Killing FFmpeg...');
    // ffmpeg 프로세스 종료
    ffmpeg.kill('SIGTERM');
  });


});

app.listen(4747, () => {
  console.log('Server listening on port 4747');
});
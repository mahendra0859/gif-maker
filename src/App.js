import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useEffect, useState } from 'react';

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '13.5',
      '-ss',
      '0.0',
      '-f',
      'gif',
      'out.gif'
    );

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' })
    );
    setGif(url);
  };

  return ready ? (
    <div className='App'>
      <h1>Gif Maker</h1>
      {video && (
        <>
          <video controls src={URL.createObjectURL(video)} width='250'></video>
          <br />
          <br />
          <button onClick={convertToGif}>Covert to GIF</button>
          <br />
          <br />
          <br />
        </>
      )}
      <div>
        <input
          type='file'
          onChange={(e) => setVideo(e.target.files?.item(0))}
        />
      </div>

      {gif && (
        <>
          <h1>Gif Image</h1>
          <img src={gif} width='250' alt='gif' />
        </>
      )}
    </div>
  ) : (
    <div className='App'>
      <h1>Loading...</h1>
    </div>
  );
}

export default App;

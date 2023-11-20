import React, { useState, useEffect } from 'react';

const ApiCall = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [inputText, setInputText] = useState('');

  const makeApiCall = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic YmJiY2M4MDkzQGdtYWlsLmNvbQ:0BRi8yIs3jd-cnVI9-EWo`
      },
      body: JSON.stringify({
        source_url: sourceUrl,
        script: {
          type: 'text',
          input: inputText,
          subtitles: false,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural'
          },
          ssml: false
        },
        config: {
          fluent: false,
          pad_audio: 0.0,
          driver_expressions: {
            expressions: [
              {
                "start_frame": 0,
                "expression": "surprise",
                "intensity": 1.0
            },
            {
                "start_frame": 50,
                "expression": "happy",
                "intensity": 1.0
            },
            {
                "start_frame": 100,
                "expression": "serious",
                "intensity": 0.6
            },
            {
                "start_frame": 150,
                "expression": "neutral",
                "intensity": 1.0
            }
            ]
          }
        }
      })
    };


    try {
      const response = await fetch('https://api.d-id.com/talks', options);
      const data = await response.json();
      const talkId = data.id;

      // Poll the API to check if the video is ready
      const pollVideoStatus = async () => {
        const talkUrl = `https://api.d-id.com/talks/${talkId}`;
        const response = await fetch(talkUrl, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic YmJiY2M4MDkzQGdtYWlsLmNvbQ:0BRi8yIs3jd-cnVI9-EWo`
          },
        });
        const videoData = await response.json();
        console.log(videoData);

        if (videoData.status === 'done') {
          setVideoUrl(videoData.result_url);
        } else {
          setTimeout(pollVideoStatus, 1000); // Poll again after 1 second
        }
      };

      pollVideoStatus(); // Start polling for video availability
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
     

      <label>
        Source URL for Image:
        <input
          type="text"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
      </label>
      <br />
      <label>
        Input Text:
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </label>
      <br />




      <button onClick={makeApiCall}>Make API Call</button>
      {videoUrl && (
        <div>
          <h2>Video Response</h2>
          <video src={videoUrl} controls width="640" height="360"></video>
        </div>
      )}
    </div>
  );
};

export default ApiCall;

const axios = require('axios');


require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Converts ISO 8601 duration (e.g., PT1H2M30S) to seconds
function parseDuration(duration) {
  const regex = /PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/;
  const [, h, m, s] = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/) || [];
  return (
    (parseInt(h) || 0) * 3600 +
    (parseInt(m) || 0) * 60 +
    (parseInt(s) || 0)
  );
}

async function getPlaylistDuration(playlistId) {
  let nextPageToken = '';
  let videoIds = [];

  // Step 1: Fetch all video IDs
  do {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'contentDetails',
        maxResults: 50,
        playlistId,
        pageToken: nextPageToken,
        key: YOUTUBE_API_KEY
      }
    });

    const items = response.data.items;
    videoIds.push(...items.map(item => item.contentDetails.videoId));
    nextPageToken = response.data.nextPageToken;

  } while (nextPageToken);

  // Step 2: Get duration of all videos in batches
  let totalSeconds = 0;
  for (let i = 0; i < videoIds.length; i += 50) {
    const idsBatch = videoIds.slice(i, i + 50).join(',');

    const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails',
        id: idsBatch,
        key: YOUTUBE_API_KEY
      }
    });

    for (const video of videoResponse.data.items) {
      const isoDuration = video.contentDetails.duration;
      totalSeconds += parseDuration(isoDuration);
    }
  }

  const totalHours = (totalSeconds / 3600).toFixed(2);
  return totalHours;
}

module.exports = { getPlaylistDuration };

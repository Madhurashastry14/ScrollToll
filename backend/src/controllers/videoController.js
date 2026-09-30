const getVideos = async (req, res) => {
  try {
    const query = (req.query.query || "science facts").trim();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      videoDuration: "short",
      videoEmbeddable: "true",
      videoSyndicated: "true",
      safeSearch: "strict",
      regionCode: "IN",
      maxResults: "10",
      key: process.env.YOUTUBE_API_KEY,
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("YouTube API error:", data);

      return res.status(response.status).json({
        message: "Unable to fetch videos",
      });
    }

    const videos = (data.items || [])
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url,
        channelTitle: item.snippet.channelTitle,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      }));

    return res.json({
      videos,
    });
  } catch (error) {
    console.error("Video controller error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getVideos,
};

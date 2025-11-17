import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_KEY = import.meta.env.VITE_YOUTUBE_API;

const DEFAULT_TERM = "latest tech news";

export default function App() {
  const [videos, setVideos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideos = async (term) => {
    try {
      setLoading(true);
      const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          q: term,
          type: "video",
          maxResults: 12,
          key: API_KEY,
        },
      });
      setVideos(res.data.items);
    } catch (err) {
      console.log("API Error:", err);
      alert("YouTube API error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(DEFAULT_TERM);
  }, []);

  const handleSearch = () => {
    const term = searchText.trim();
    if (term === "") {
      fetchVideos(DEFAULT_TERM);
    } else {
      fetchVideos(term);
    }
    setSelectedVideo("");
  };

  const clearSearch = () => {
    setSearchText("");
    fetchVideos(DEFAULT_TERM);
    setSelectedVideo("");
  };

  return (
    <div className="bg-dark text-light min-vh-100">
      <nav className="navbar navbar-dark bg-black p-2 d-flex justify-content-between align-items-center">
        <h2 className="text-danger fw-bold ms-3 m-0">MyYouTube</h2>

        <div className="d-flex align-items-center w-50">
          <div className="position-relative flex-grow-1">
            <input
              type="text"
              className="form-control w-100 ps-3 pe-5"
              placeholder="Search videos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchText !== "" && (
              <span className="clear-search" onClick={clearSearch}>
                ✖
              </span>
            )}
          </div>
          <button className="btn btn-danger ms-2" onClick={handleSearch}>
            Search
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        {selectedVideo && (
          <div className="video-player-box mb-4 d-flex flex-column align-items-center">
            <button
              className="btn btn-danger close-btn mb-2"
              onClick={() => setSelectedVideo("")}
            >
              ✖ Close Video
            </button>

            <iframe
              src={selectedVideo}
              width="80%"
              height="400"
              style={{ borderRadius: "8px" }}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Selected Video"
            ></iframe>
          </div>
        )}

        {loading && <p className="text-center mt-3">Loading videos...</p>}

        <div className="row">
          {!loading &&
            videos.map((vid) => (
              <div
                className="col-md-4 mb-4"
                key={vid.id.videoId}
                onClick={() =>
                  setSelectedVideo(
                    "https://www.youtube.com/embed/" +
                      vid.id.videoId +
                      "?autoplay=1"
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <div className="card bg-secondary text-light p-2 video-card">
                  <img
                    src={vid.snippet.thumbnails.high.url}
                    className="card-img-top"
                    style={{ borderRadius: "6px" }}
                    alt={vid.snippet.title}
                  />
                  <div className="card-body">
                    <h6 className="card-title fw-bold">{vid.snippet.title}</h6>
                    <p className="card-text text-warning mb-0">
                      {vid.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {!loading && videos.length === 0 && (
          <p className="text-center mt-4">No videos found.</p>
        )}
      </div>

      <style>
        {`
          .video-card {
            cursor: pointer;
            transition: 0.2s ease;
          }
          .video-card:hover {
            transform: scale(1.05);
            background: #1b1b1b;
          }
          .clear-search {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 18px;
            color: #bbb;
          }
          .clear-search:hover {
            color: white;
          }
          .close-btn {
            font-size: 14px;
            padding: 5px 12px;
            border-radius: 20px;
          }
        `}
      </style>
    </div>
  );
}

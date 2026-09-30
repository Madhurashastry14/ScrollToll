import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const scrollOptions = [2, 4, 6, 8, 10];

function ScrollFeed() {
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoError, setVideoError] = useState("");
  const navigate = useNavigate();

  const [balance, setBalance] = useState(null);
  const [selectedMinutes, setSelectedMinutes] = useState(2);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null);
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setVideosLoading(true);
        setVideoError("");

        const data = await apiRequest("/videos?query=science facts shorts");

        setVideos(data.videos);
      } catch (err) {
        console.error("Failed to load videos:", err);
        setVideoError(err.message);
      } finally {
        setVideosLoading(false);
      }
    };

    loadVideos();
  }, []);
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const data = await apiRequest("/scroll/balance");
        setBalance(data.balance);
      } catch (err) {
        console.error("Failed to load token balance:", err);
      }
    };

    loadBalance();
  }, []);
  const endSession = useCallback(
    async (reason = "timer_expired") => {
      try {
        if (sessionId) {
          await apiRequest("/scroll/end", {
            method: "POST",
            body: JSON.stringify({
              sessionId,
              intentionality: "intentional",
              reason,
            }),
          });
        }
      } catch (err) {
        console.error("Failed to end scroll session:", err);
      } finally {
        setSessionStarted(false);
        setRemainingSeconds(0);
        setSessionId(null);
      }
    },
    [sessionId],
  );

  useEffect(() => {
    if (!sessionStarted) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          endSession("timer_expired");
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStarted, endSession]);

  const unlockScroll = async () => {
    try {
      setUnlocking(true);
      setError("");

      const data = await apiRequest("/scroll/unlock", {
        method: "POST",
        body: JSON.stringify({
          scrollMinutes: selectedMinutes,
        }),
      });

      setBalance(data.balance);
      setSessionId(data.sessionId);
      setRemainingSeconds(selectedMinutes * 60);
      setSessionStarted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setUnlocking(false);
    }
  };

  const exitSession = async () => {
    try {
      if (sessionId) {
        await apiRequest("/scroll/end", {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            intentionality: "intentional",
            reason: "user_exit",
          }),
        });
      }
    } catch (err) {
      console.error("Failed to end scroll session:", err);
    } finally {
      setSessionStarted(false);
      setRemainingSeconds(0);
      setSessionId(null);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(
      2,
      "0",
    )}`;
  };

  if (!sessionStarted) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Controlled Feed
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Choose your scroll time
          </h1>

          <p className="mt-4 text-gray-600">
            1 Scroll Token gives you 2 minutes of scrolling.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Available tokens</p>

          <p className="mt-2 text-4xl font-bold">{balance ?? "—"}</p>

          <div className="mt-8">
            <p className="text-sm font-medium">Select duration</p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {scrollOptions.map((minutes) => {
                const cost = minutes / 2;
                const selected = selectedMinutes === minutes;

                return (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => setSelectedMinutes(minutes)}
                    className={`rounded-xl border p-4 transition ${
                      selected
                        ? "border-black bg-gray-100"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <p className="font-semibold">{minutes} min</p>

                    <p className="mt-1 text-sm text-gray-500">
                      {cost} token{cost !== 1 ? "s" : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={unlockScroll}
            disabled={unlocking}
            className="mt-8 w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {unlocking ? "Unlocking..." : `Unlock ${selectedMinutes} minutes`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/90 px-6 py-4 backdrop-blur">
        <div>
          <p className="text-sm text-gray-400">ScrollToll</p>

          <p className="font-semibold">{formatTime(remainingSeconds)}</p>
        </div>

        <button
          type="button"
          onClick={exitSession}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          Exit
        </button>
      </header>

      <main className="mx-auto max-w-xl px-4 py-6">
        {videosLoading && (
          <div className="rounded-2xl bg-gray-900 p-8 text-center">
            <p className="text-gray-400">Loading videos...</p>
          </div>
        )}

        {videoError && (
          <div className="rounded-2xl bg-red-950 p-6 text-center">
            <p className="text-red-300">{videoError}</p>
          </div>
        )}

        {!videosLoading && !videoError && videos.length === 0 && (
          <div className="rounded-2xl bg-gray-900 p-8 text-center">
            <p className="text-gray-400">No videos found.</p>
          </div>
        )}

        {!videosLoading && !videoError && videos.length > 0 && (
          <div className="space-y-6">
            {videos.map((video) => (
              <article
                key={video.videoId}
                className="overflow-hidden rounded-2xl bg-gray-900"
              >
                <div className="aspect-video bg-gray-800">
                  <iframe
                    src={`${video.embedUrl}?rel=0`}
                    title={video.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold">{video.title}</h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {video.description}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    {video.channelTitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {remainingSeconds === 0 && (
          <div className="mt-8 rounded-2xl bg-white p-6 text-center text-black">
            <h2 className="text-xl font-bold">
              Your scroll session has ended.
            </h2>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-5 rounded-lg bg-black px-5 py-2.5 font-medium text-white"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ScrollFeed;

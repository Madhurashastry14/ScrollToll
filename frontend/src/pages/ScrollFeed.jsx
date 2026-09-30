import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

const scrollOptions = [2, 4, 6, 8, 10];

const scrollReasons = [
  {
    value: "specific_content",
    label: "I have something specific to watch",
    intentionality: "intentional",
  },
  {
    value: "quick_break",
    label: "I want to take a quick break",
    intentionality: "intentional",
  },
  {
    value: "bored_checking",
    label: "I'm bored or just checking",
    intentionality: "habitual",
  },
  {
    value: "just_browsing",
    label: "I'm just browsing",
    intentionality: "habitual",
  },
];

function ScrollFeed() {
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoError, setVideoError] = useState("");

  const [balance, setBalance] = useState(null);
  const [selectedMinutes, setSelectedMinutes] = useState(2);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [scrollReason, setScrollReason] = useState("");

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

  useEffect(() => {
    if (!sessionStarted || !sessionId) {
      return;
    }

    const verifySession = async () => {
      try {
        const data = await apiRequest(`/scroll/session/${sessionId}`);

        if (!data.active) {
          setSessionStarted(false);
          setRemainingSeconds(0);
          setSessionId(null);
          setScrollReason("");
        }
      } catch (err) {
        console.error("Failed to verify scroll session:", err);
      }
    };

    verifySession();

    const interval = setInterval(verifySession, 10000);

    return () => clearInterval(interval);
  }, [sessionStarted, sessionId]);

  useEffect(() => {
    if (!sessionStarted) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStarted]);

  const unlockScroll = async () => {
    if (!scrollReason) {
      setError("Please choose why you want to scroll.");
      return;
    }

    try {
      setUnlocking(true);
      setError("");

      const selectedReason = scrollReasons.find(
        (item) => item.value === scrollReason,
      );

      const data = await apiRequest("/scroll/unlock", {
        method: "POST",
        body: JSON.stringify({
          scrollMinutes: selectedMinutes,
          intentionality: selectedReason.intentionality,
          reason: selectedReason.value,
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
            intentionality:
              scrollReasons.find((item) => item.value === scrollReason)
                ?.intentionality || "unknown",
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
      setScrollReason("");
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

          <div className="mt-8">
            <p className="text-sm font-medium">Why are you scrolling?</p>

            <div className="mt-4 space-y-3">
              {scrollReasons.map((reason) => {
                const selected = scrollReason === reason.value;

                return (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() => {
                      setScrollReason(reason.value);
                      setError("");
                    }}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-black bg-gray-100"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <p className="font-medium">{reason.label}</p>
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

      <main className="h-[calc(100vh-73px)] snap-y snap-mandatory overflow-y-auto">
        {videosLoading && (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">Loading videos...</p>
          </div>
        )}

        {videoError && (
          <div className="flex h-full items-center justify-center px-6">
            <div className="rounded-2xl bg-red-950 p-6 text-center">
              <p className="text-red-300">{videoError}</p>
            </div>
          </div>
        )}

        {!videosLoading && !videoError && videos.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">No videos found.</p>
          </div>
        )}

        {!videosLoading &&
          !videoError &&
          videos.map((video) => (
            <article
              key={video.videoId}
              className="relative h-[calc(100vh-73px)] snap-start"
            >
              <div className="absolute inset-0">
                <iframe
                  src={`${video.embedUrl}?rel=0`}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 pt-24">
                <h2 className="max-w-lg text-lg font-semibold">
                  {video.title}
                </h2>

                <p className="mt-2 max-w-lg text-sm text-gray-300">
                  {video.description}
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  {video.channelTitle}
                </p>
              </div>
            </article>
          ))}
      </main>
    </div>
  );
}

export default ScrollFeed;

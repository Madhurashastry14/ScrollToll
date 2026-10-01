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

  const optionBase =
    "rounded-lg border p-3.5 text-left transition active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 sm:p-4";
  const optionSelected = "border-zinc-700 bg-zinc-50/60 ring-1 ring-zinc-700";
  const optionIdle =
    "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50";

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
        <div className="st-enter mx-auto max-w-2xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            <span aria-hidden="true">←</span> Back to Dashboard
          </Link>

          <div className="mt-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Choose your scroll time
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              1 Scroll Token gives you 2 minutes of scrolling.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
            <div className="flex items-baseline justify-between gap-4 border-b border-zinc-100 pb-5">
              <p className="text-sm text-zinc-500">Available tokens</p>

              <p className="text-3xl font-semibold tracking-tight tabular-nums text-zinc-900">
                {balance ?? "—"}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-zinc-900">
                Select duration
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-3">
                {scrollOptions.map((minutes) => {
                  const cost = minutes / 2;
                  const selected = selectedMinutes === minutes;

                  return (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => setSelectedMinutes(minutes)}
                      aria-pressed={selected}
                      className={`${optionBase} ${
                        selected ? optionSelected : optionIdle
                      }`}
                    >
                      <p className="font-semibold text-zinc-900">
                        {minutes} min
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        {cost} token{cost !== 1 ? "s" : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-zinc-900">
                Why are you scrolling?
              </p>

              <div className="mt-3 space-y-2">
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
                      aria-pressed={selected}
                      className={`${optionBase} w-full ${
                        selected ? optionSelected : optionIdle
                      }`}
                    >
                      <p
                        className={`text-sm text-zinc-900 ${
                          selected ? "font-medium" : ""
                        }`}
                      >
                        {reason.label}
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
              className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-900 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {unlocking ? "Unlocking..." : `Unlock ${selectedMinutes} minutes`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/90 px-6 py-4 backdrop-blur">
        <div>
          <p className="text-xs text-zinc-400">ScrollToll</p>

          <p
            className={`font-mono text-sm font-semibold tabular-nums tracking-wider transition-colors ${
              remainingSeconds <= 30 ? "text-amber-400" : "text-white"
            }`}
            role="timer"
            aria-live="off"
          >
            {formatTime(remainingSeconds)}
          </p>
        </div>

        <button
          type="button"
          onClick={exitSession}
          className="rounded-lg border border-white/20 px-4 py-2 text-xs font-medium transition hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Exit
        </button>
      </header>

      <main className="h-[calc(100vh-73px)] snap-y snap-mandatory overflow-y-auto">
        {videosLoading && (
          <div
            className="flex h-full items-center justify-center gap-2.5"
            role="status"
          >
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white motion-reduce:animate-none" />
            <p className="text-sm text-zinc-400">Loading videos...</p>
          </div>
        )}

        {videoError && (
          <div className="flex h-full items-center justify-center px-6">
            <div
              role="alert"
              className="rounded-lg border border-rose-900/50 bg-rose-950/40 p-5 text-center"
            >
              <p className="text-sm text-rose-300">{videoError}</p>
            </div>
          </div>
        )}

        {!videosLoading && !videoError && videos.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-zinc-400">No videos found.</p>
          </div>
        )}

        {!videosLoading &&
          !videoError &&
          videos.map((video) => (
            <article
              key={video.videoId}
              className="relative h-[calc(100vh-73px)] snap-start bg-black"
            >
              <div className="absolute inset-0">
                <iframe
                  src={`${video.embedUrl}?rel=0`}
                  title={video.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-24 sm:p-6">
                <h2 className="max-w-lg text-base font-semibold leading-snug sm:text-lg">
                  {video.title}
                </h2>

                <p className="mt-1.5 line-clamp-2 max-w-lg text-xs text-zinc-300 sm:text-sm">
                  {video.description}
                </p>

                <p className="mt-2.5 text-xs font-medium text-zinc-400">
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

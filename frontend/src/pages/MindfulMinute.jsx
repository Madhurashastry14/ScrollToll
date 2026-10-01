import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function MindfulMinute() {
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const timerRef = useRef(null);
  const completingRef = useRef(false);

  useEffect(() => {
    if (!started || completed || stopped) {
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current);

          completingRef.current = true;
          setCompleted(true);

          if (document.fullscreenElement) {
            document.exitFullscreen().catch((error) => {
              console.error("Fullscreen exit failed:", error);
            });
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [started, completed, stopped]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        started &&
        !completed &&
        !completingRef.current
      ) {
        clearInterval(timerRef.current);

        setStarted(false);
        setStopped(true);
        setRemainingSeconds(60);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [started, completed]);

  const startMindfulMinute = async () => {
    setError("");
    setStopped(false);
    setCompleted(false);
    completingRef.current = false;
    setRemainingSeconds(60);

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen request failed:", error);
    }

    setStarted(true);
  };

  const submitReflection = async () => {
    if (!reflection.trim()) {
      setError("Please write a short reflection before completing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = await apiRequest("/activities/mindful-minute", {
        method: "POST",
        body: JSON.stringify({
          durationSeconds: 60,
          reflection: reflection.trim(),
        }),
      });

      setResult(data);
    } catch (err) {
      console.error("Mindful Minute submission failed:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const backLink =
    "inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700";
  const primaryButton =
    "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50";

  if (result) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
        <div className="st-enter mx-auto max-w-xl">
          <Link to="/dashboard" className={backLink}>
            <span aria-hidden="true">←</span> Back to Dashboard
          </Link>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 text-center sm:p-8">
            <p className="text-sm text-zinc-500">Mindful Minute</p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Nice pause.
            </h1>

            <p className="st-pop mx-auto mt-4 w-fit rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-zinc-900">
              You earned {result.tokensEarned} Scroll Token.
            </p>

            <div className="mt-6 rounded-lg bg-zinc-50 p-4 text-left sm:p-5">
              <p className="text-xs font-medium text-zinc-500">
                Your reflection
              </p>

              <p className="mt-1.5 text-sm leading-relaxed text-zinc-800">
                {result.reflection}
              </p>
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              Current balance:{" "}
              <span className="font-semibold tabular-nums text-zinc-900">
                {result.balance} tokens
              </span>
            </p>

            <Link
              to="/dashboard"
              className={`${primaryButton} mt-7 w-full sm:w-auto`}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
        <div className="st-enter mx-auto max-w-xl">
          <Link to="/dashboard" className={backLink}>
            <span aria-hidden="true">←</span> Back to Dashboard
          </Link>

          <div className="mt-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Take one intentional minute.
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Step away from the feed for a moment. Slow down, notice where your
              attention is, and reflect before deciding what to do next.
            </p>

            <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
              <h2 className="text-sm font-semibold text-zinc-900">
                What to do
              </h2>

              <ul className="mt-3 space-y-2.5 text-sm text-zinc-700">
                <li className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700"
                    aria-hidden="true"
                  />
                  Put the feed aside.
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700"
                    aria-hidden="true"
                  />
                  Take a few slow breaths.
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700"
                    aria-hidden="true"
                  />
                  Notice how you feel right now.
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700"
                    aria-hidden="true"
                  />
                  Think about what you actually want to do next.
                </li>
              </ul>

              <button
                type="button"
                onClick={startMindfulMinute}
                className={`${primaryButton} mt-7 w-full`}
              >
                Start 1-minute pause
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!completed && !stopped) {
    const ringRadius = 54;
    const ringCircumference = 2 * Math.PI * ringRadius;

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="max-w-md text-center">
          <p className="text-sm text-zinc-400">Mindful Minute</p>

          <div className="relative mx-auto mt-6 h-44 w-44 sm:h-52 sm:w-52">
            <svg
              viewBox="0 0 120 120"
              className="h-full w-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                strokeWidth="4"
                className="stroke-white/10"
              />
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                className="stroke-zinc-400 transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
                strokeDasharray={ringCircumference}
                strokeDashoffset={
                  ringCircumference * (1 - remainingSeconds / 60)
                }
              />
            </svg>

            <div
              className="absolute inset-0 flex items-center justify-center text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl"
              role="timer"
              aria-live="off"
            >
              {remainingSeconds}
            </div>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-zinc-300 sm:text-base">
            Stay away from the feed.
            <br />
            Notice your attention without judging it.
          </p>
          <p className="mt-8 text-xs text-zinc-500">Press Esc to stop</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="st-enter mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What did you notice?
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
          Write a few words about how you felt, what you noticed, or what you
          want to do next.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-5">
          <textarea
            value={reflection}
            onChange={(event) => {
              setReflection(event.target.value);
              setError("");
            }}
            maxLength={1000}
            rows={5}
            placeholder="For example: I noticed I was opening the feed because I was bored. I actually want to finish my assignment."
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white p-4 text-sm leading-relaxed text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />

          <div className="mt-1.5 text-right text-xs tabular-nums text-zinc-400">
            {reflection.length}/1000
          </div>
        </div>

        <button
          type="button"
          onClick={submitReflection}
          disabled={submitting}
          className={`${primaryButton} mt-3 w-full`}
        >
          {submitting ? "Saving..." : "Earn 1 token"}
        </button>
      </div>
    </div>
  );
}

export default MindfulMinute;

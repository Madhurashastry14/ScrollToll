import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function MindfulMinute() {
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!started || completed || remainingSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setCompleted(true);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, completed, remainingSeconds]);

  const startMindfulMinute = () => {
    setStarted(true);
    setError("");
  };

  const submitReflection = async () => {
    if (!reflection.trim()) {
      setError("Please write a short reflection before completing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = await apiRequest("/activity/mindful-minute", {
        method: "POST",
        body: JSON.stringify({
          durationSeconds: 60,
          reflection: reflection.trim(),
        }),
      });

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Mindful Minute
          </p>

          <h1 className="mt-3 text-3xl font-bold">Nice pause.</h1>

          <p className="mt-4 text-gray-600">
            You earned {result.tokensEarned} Scroll Token.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Your reflection</p>

            <p className="mt-2 text-gray-800">{result.reflection}</p>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Current balance:{" "}
            <span className="font-semibold text-gray-900">
              {result.balance} tokens
            </span>
          </p>

          <Link
            to="/dashboard"
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-80"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Mindful Minute
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Take one intentional minute.
          </h1>

          <p className="mt-4 text-gray-600">
            Step away from the feed for a moment. Slow down, notice where your
            attention is, and reflect before deciding what to do next.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-gray-500">What to do</p>

            <ul className="mt-4 space-y-3 text-gray-700">
              <li>• Put the feed aside.</li>
              <li>• Take a few slow breaths.</li>
              <li>• Notice how you feel right now.</li>
              <li>• Think about what you actually want to do next.</li>
            </ul>

            <button
              type="button"
              onClick={startMindfulMinute}
              className="mt-8 w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-80"
            >
              Start 1-minute pause
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!completed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Mindful Minute
          </p>

          <div className="mt-8 text-7xl font-bold tracking-tight">
            {remainingSeconds}
          </div>

          <p className="mt-6 text-gray-600">
            Stay away from the feed.
            <br />
            Notice your attention without judging it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        Mindful Minute
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        What did you notice?
      </h1>

      <p className="mt-4 text-gray-600">
        Write a few words about how you felt, what you noticed, or what you want
        to do next.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <textarea
        value={reflection}
        onChange={(event) => {
          setReflection(event.target.value);
          setError("");
        }}
        maxLength={1000}
        rows={6}
        placeholder="For example: I noticed I was opening the feed because I was bored. I actually want to finish my assignment."
        className="mt-6 w-full resize-none rounded-2xl border border-gray-200 p-5 outline-none transition focus:border-gray-500"
      />

      <div className="mt-2 text-right text-xs text-gray-400">
        {reflection.length}/1000
      </div>

      <button
        type="button"
        onClick={submitReflection}
        disabled={submitting}
        className="mt-6 w-full rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save reflection & earn 1 token"}
      </button>
    </div>
  );
}

export default MindfulMinute;

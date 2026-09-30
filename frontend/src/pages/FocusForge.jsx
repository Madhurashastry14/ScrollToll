import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
const SESSION_DURATION = 60;

function FocusForge() {
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reward, setReward] = useState(null);
  const completeSession = async () => {
    setSubmitting(true);

    try {
      const data = await apiRequest("/activities/focus-forge", {
        method: "POST",
        body: JSON.stringify({
          durationSeconds: SESSION_DURATION,
        }),
      });

      setReward(data);
      setCompleted(true);
    } catch (error) {
      console.error("Focus Forge submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);

          setTimeout(() => {
            completeSession();
          }, 0);

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const resetSession = () => {
    setTimeLeft(SESSION_DURATION);
    setIsRunning(false);
    setCompleted(false);
    setReward(null);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Productivity Activity
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">Focus Forge</h1>

          <p className="mt-2 text-gray-600">
            Stay focused for a short session before you scroll.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          {completed ? (
            <>
              <p className="text-sm font-medium text-gray-500">
                Session Complete
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Well done!
              </h2>

              <p className="mt-4 text-gray-600">
                You completed your focus session.
              </p>
              {reward && (
                <div className="mt-6 rounded-xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Tokens earned</p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    +{reward.tokensEarned}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Current balance: {reward.balance}
                  </p>
                </div>
              )}

              <button
                onClick={resetSession}
                className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-80"
              >
                Start Again
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-500">Focus Session</p>

              <div className="mt-8 text-7xl font-bold tracking-tight text-gray-900">
                {minutes}:{String(seconds).padStart(2, "0")}
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Put away distractions and focus on one task.
              </p>

              <div className="mt-8 flex justify-center gap-3">
                {!isRunning ? (
                  <button
                    onClick={() => setIsRunning(true)}
                    disabled={submitting}
                    className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Start Focus
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunning(false)}
                    disabled={submitting}
                    className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Pause
                  </button>
                )}

                <button
                  onClick={resetSession}
                  disabled={submitting}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset
                </button>
                {timeLeft === 0 && (
                  <button
                    onClick={completeSession}
                    disabled={submitting}
                    className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Complete Session"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FocusForge;

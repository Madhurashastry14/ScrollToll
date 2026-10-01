import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/analytics");

        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div
          className="flex items-center gap-2.5 text-sm text-zinc-500"
          role="status"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-teal-700 motion-reduce:animate-none" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </Link>

        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="st-enter mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </Link>

        <div className="mt-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your attention patterns
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
            See how you are spending your time between focused activities and
            controlled scrolling.
          </p>
        </div>

        {/* Main metrics */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          <MetricCard
            label="Scroll Time"
            value={`${analytics.scroll.minutes} min`}
            description={`${analytics.scroll.sessions} completed sessions`}
          />

          <MetricCard
            label="Scroll Unlocks"
            value={analytics.unlocks.total}
            description={`${analytics.unlocks.minutes} minutes unlocked`}
          />
        </div>

        {/* Scroll behavior */}
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight">
            How you entered your scroll sessions
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MetricCard
              subtle
              label="Total Sessions"
              value={analytics.scroll.sessions}
              description="Completed scroll sessions"
            />

            <MetricCard
              subtle
              label="Intentional"
              value={analytics.scroll.intentionalSessions}
              description="Sessions with an intentional reason"
            />

            <MetricCard
              subtle
              label="Habitual"
              value={analytics.scroll.habitualSessions}
              description="Sessions marked as habitual"
            />
          </div>
        </section>

        {/* Brain Gym */}
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight">
            Brain Gym performance
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard
              subtle
              label="Sessions"
              value={analytics.brainGym.sessions}
              description="Completed Brain Gym sessions"
            />

            <MetricCard
              subtle
              label="Questions"
              value={analytics.brainGym.questionsAnswered}
              description="Questions answered"
            />

            <MetricCard
              subtle
              label="Correct"
              value={analytics.brainGym.correctAnswers}
              description="Correct answers"
            />

            <MetricCard
              subtle
              label="Accuracy"
              value={
                analytics.brainGym.accuracy === null
                  ? "—"
                  : `${analytics.brainGym.accuracy}%`
              }
              description="Overall Brain Gym accuracy"
            />
          </div>
        </section>

        {/* Focus Forge */}
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight">
            Focus Forge performance
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard
              subtle
              label="Games"
              value={analytics.focusForge.sessions}
              description="Completed Focus Forge games"
            />

            <MetricCard
              subtle
              label="Rounds"
              value={`${analytics.focusForge.roundsCompleted}/${analytics.focusForge.roundsPlayed}`}
              description="Successful rounds"
            />

            <MetricCard
              subtle
              label="Average Score"
              value={`${analytics.focusForge.averageScore}%`}
              description="Average game score"
            />

            <MetricCard
              subtle
              label="Tokens Earned"
              value={analytics.focusForge.tokensEarned}
              description="Tokens earned through Focus Forge"
            />
          </div>
        </section>

        {/* Token summary */}
        <section className="mt-6 flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-sm text-zinc-500">Scroll Tokens</p>

            <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums text-zinc-900">
              {analytics.tokenBalance}
            </p>

            <p className="mt-1 text-sm text-zinc-600">
              Current available tokens
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Back to Dashboard
          </Link>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, description, subtle = false }) {
  return (
    <div
      className={`rounded-lg p-4 sm:p-5 ${
        subtle
          ? "bg-zinc-50"
          : "border border-zinc-200 bg-white transition-colors hover:border-zinc-300"
      }`}
    >
      <p className="text-sm text-zinc-500">{label}</p>

      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-zinc-900 sm:text-3xl">
        {value}
      </p>

      <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
        {description}
      </p>
    </div>
  );
}

export default Analytics;

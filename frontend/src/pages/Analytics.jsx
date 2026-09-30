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
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        to="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to Dashboard
      </Link>

      <div className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Analytics
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Your attention patterns
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          See how you are spending your time between focused activities and
          controlled scrolling.
        </p>
      </div>

      {/* Main metrics */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Focus Time"
          value={`${analytics.focus.minutes} min`}
          description={`${analytics.focus.sessions} completed sessions`}
        />

        <MetricCard
          label="Scroll Time"
          value={`${analytics.scroll.minutes} min`}
          description={`${analytics.scroll.sessions} completed sessions`}
        />

        <MetricCard
          label="Focus / Scroll"
          value={
            analytics.focusToScrollRatio === null
              ? "—"
              : `${analytics.focusToScrollRatio}×`
          }
          description="Focus time relative to scroll time"
        />

        <MetricCard
          label="Scroll Unlocks"
          value={analytics.unlocks.total}
          description={`${analytics.unlocks.minutes} minutes unlocked`}
        />
      </div>

      {/* Scroll behavior */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Scroll behavior
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            How you entered your scroll sessions
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total Sessions"
            value={analytics.scroll.sessions}
            description="Completed scroll sessions"
          />

          <MetricCard
            label="Intentional"
            value={analytics.scroll.intentionalSessions}
            description="Sessions with an intentional reason"
          />

          <MetricCard
            label="Habitual"
            value={analytics.scroll.habitualSessions}
            description="Sessions marked as habitual"
          />
        </div>
      </section>

      {/* Brain Gym */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Brain Gym
          </p>

          <h2 className="mt-2 text-2xl font-semibold">Activity performance</h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Sessions"
            value={analytics.brainGym.sessions}
            description="Completed Brain Gym sessions"
          />

          <MetricCard
            label="Questions"
            value={analytics.brainGym.questionsAnswered}
            description="Questions answered"
          />

          <MetricCard
            label="Correct"
            value={analytics.brainGym.correctAnswers}
            description="Correct answers"
          />

          <MetricCard
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

      {/* Token summary */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Scroll Tokens
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-4xl font-bold">{analytics.tokenBalance}</p>

            <p className="mt-1 text-sm text-gray-500">
              Current available tokens
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:opacity-80"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>

      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default Analytics;

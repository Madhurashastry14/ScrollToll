import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    scrollTimeMinutes: null,
    tokenBalance: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const data = await apiRequest("/dashboard/stats");

        setStats({
          scrollTimeMinutes: data.scrollTimeMinutes,
          tokenBalance: data.tokenBalance,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    loadDashboardStats();
  }, []);

  const activityLink =
    "group flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-700/40 hover:bg-zinc-50/30 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700";

  return (
    <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-10">
      <div className="st-enter mx-auto max-w-6xl">
        {/* Header */}
        <section>
          <p className="text-sm text-zinc-500">Welcome back</p>

          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            {user?.name}
          </h1>

          <p className="mt-1.5 text-sm text-zinc-600 sm:text-base">
            Here's an overview of your attention today.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <StatCard
            title="Scroll Time"
            value={
              stats.scrollTimeMinutes !== null
                ? `${stats.scrollTimeMinutes} min`
                : "—"
            }
            description="Time spent scrolling"
          />

          <StatCard
            title="Scroll Tokens"
            value={stats.tokenBalance ?? "—"}
            description="Available for intentional scrolling"
          />
        </section>

        {/* Main Actions */}
        <section className="mt-6 grid gap-4 lg:grid-cols-5 lg:gap-6">
          {/* Productivity */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-7 lg:col-span-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Earn Scroll Tokens
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Complete a productive activity before you scroll.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Link to="/brain-gym" className={activityLink}>
                <div>
                  <p className="font-semibold text-zinc-900">Brain Gym</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Solve quick challenges
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-900">
                  Start
                  <span
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </Link>

              <Link to="/focus-forge" className={activityLink}>
                <div>
                  <p className="font-semibold text-zinc-900">Focus Forge</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Train your attention with focus games
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-900">
                  Start
                  <span
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </Link>

              <Link to="/mindful-minute" className={activityLink}>
                <div>
                  <p className="font-semibold text-zinc-900">Mindful Minute</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Take a 1-min intentional pause.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-900">
                  Start
                  <span
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Scroll */}
          <div className="flex flex-col justify-between rounded-xl bg-zinc-900 p-5 text-white sm:p-7 lg:col-span-2">
            <div>
              <p className="text-sm text-zinc-400">Controlled feed</p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                Ready to scroll intentionally?
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
                Use your earned tokens to access a controlled short-video
                session.
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/scroll-feed"
                className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                Start Scrolling
              </Link>
            </div>
          </div>
        </section>
        {/* Analytics */}
        <section className="mt-6 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Attention Analytics
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-zinc-600">
              Review your scrolling patterns, Brain Gym performance, and Focus
              Forge progress.
            </p>
          </div>

          <Link
            to="/analytics"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            View Analytics
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

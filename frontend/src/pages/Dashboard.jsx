import StatCard from "../components/StatCard";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section>
          <p className="text-sm font-medium text-gray-500">Welcome back</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {user?.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Here's an overview of your attention today.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard
            title="Focus Time"
            value="0 min"
            description="Time spent productively"
          />

          <StatCard
            title="Scroll Time"
            value="0 min"
            description="Time spent scrolling"
          />

          <StatCard
            title="Scroll Tokens"
            value="0"
            description="Available for intentional scrolling"
          />
        </section>

        {/* Main Actions */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Productivity */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Earn Scroll Tokens
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Complete a productive activity before you scroll.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                to="/brain-gym"
                className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
              >
                <p className="font-semibold text-gray-900">Brain Gym</p>

                <p className="mt-1 text-sm text-gray-500">
                  Solve quick challenges
                </p>
              </Link>

              <Link
                to="/focus-forge"
                className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
              >
                <p className="font-semibold text-gray-900">Focus Forge</p>

                <p className="mt-1 text-sm text-gray-500">
                  Complete a focus session
                </p>
              </Link>

              <Link
                to="/mindful-minute"
                className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
              >
                <p className="font-semibold text-gray-900">Mindful Minute</p>

                <p className="mt-1 text-sm text-gray-500">
                  Take a mindful break
                </p>
              </Link>
            </div>
          </div>

          {/* Scroll */}
          <div className="rounded-2xl bg-black p-6 text-white shadow-sm">
            <p className="text-sm font-medium text-gray-300">Controlled Feed</p>

            <h2 className="mt-2 text-2xl font-bold">
              Ready to scroll intentionally?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-300">
              Use your earned tokens to access a controlled short-video session.
            </p>

            <button className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200">
              Start Scrolling
            </button>
          </div>
        </section>

        {/* Attention Overview */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Attention Overview
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your focus and scrolling patterns will appear here.
            </p>
          </div>

          <div className="mt-6 flex min-h-56 items-center justify-center rounded-xl bg-gray-50">
            <p className="text-sm text-gray-400">No activity data yet</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

import { Link } from "react-router-dom";

const games = [
  {
    id: "target_focus",
    title: "Target Focus",
    description: "Find all the target symbols hidden in the grid.",
    icon: "🎯",
  },
  {
    id: "odd_one_out",
    title: "Odd One Out",
    description: "Spot the one item that is different from the rest.",
    icon: "🔎",
  },
  {
    id: "color_challenge",
    title: "Color Challenge",
    description: "Ignore the word and respond to its actual color.",
    icon: "🎨",
  },
  {
    id: "sequence_recall",
    title: "Sequence Recall",
    description: "Remember a sequence and reproduce it correctly.",
    icon: "🧠",
  },
  {
    id: "distraction_challenge",
    title: "Distraction Challenge",
    description: "Stay focused on the task while distractions appear.",
    icon: "🔔",
  },
];

function FocusForge() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 transition hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Productivity Activity
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Focus Forge
          </h1>

          <p className="mt-4 text-gray-600">
            Train your attention through quick focus challenges. Choose a game
            and complete three rounds.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/focus-forge/${game.id}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-md"
            >
              <div className="text-4xl">{game.icon}</div>

              <h2 className="mt-5 text-xl font-semibold">{game.title}</h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {game.description}
              </p>

              <div className="mt-6 text-sm font-semibold">Play →</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm font-medium text-gray-900">
            How Focus Forge works
          </p>

          <div className="mt-4 grid gap-4 text-sm text-gray-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-gray-900">1. Choose</p>
              <p className="mt-1">Pick the focus game you want to play.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900">2. Play</p>
              <p className="mt-1">
                Complete three increasingly challenging rounds.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900">3. Earn</p>
              <p className="mt-1">
                Your performance determines the Scroll Tokens you earn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusForge;

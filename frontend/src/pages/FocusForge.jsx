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
    <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="st-enter mx-auto max-w-5xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </Link>

        <div className="mt-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Focus Forge
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Train your attention through quick focus challenges. Choose a game
            and complete three rounds.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/focus-forge/${game.id}`}
              className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-700/40 hover:bg-zinc-50/30 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 sm:p-6"
            >
              <div className="flex items-start gap-4 sm:block">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xl"
                  aria-hidden="true"
                >
                  {game.icon}
                </div>

                <div className="sm:mt-4">
                  <h2 className="text-base font-semibold text-zinc-900">
                    {game.title}
                  </h2>

                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    {game.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-zinc-900">
                <span>Play</span>
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
          <h2 className="text-base font-semibold text-zinc-900">
            How Focus Forge works
          </h2>

          <ol className="mt-4 grid gap-4 text-sm text-zinc-600 sm:grid-cols-3 sm:gap-6">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                1
              </span>
              <div>
                <p className="font-medium text-zinc-900">Choose</p>
                <p className="mt-1 text-xs leading-relaxed">
                  Pick the focus game you want to play.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                2
              </span>
              <div>
                <p className="font-medium text-zinc-900">Play</p>
                <p className="mt-1 text-xs leading-relaxed">
                  Complete three increasingly challenging rounds.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                3
              </span>
              <div>
                <p className="font-medium text-zinc-900">Earn</p>
                <p className="mt-1 text-xs leading-relaxed">
                  Your performance determines the Scroll Tokens you earn.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default FocusForge;

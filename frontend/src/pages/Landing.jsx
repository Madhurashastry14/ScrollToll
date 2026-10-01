import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold tracking-tight">
            ScrollToll
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-gray-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Digital Wellbeing
          </p>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl sm:leading-[1.1]">
            Earn your scroll.
            <br />
            Control your attention.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            ScrollToll puts a small moment of intention between you and endless
            scrolling. Complete meaningful activities, earn Scroll Tokens, and
            use them for controlled scrolling sessions.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="w-full sm:w-auto rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-xs transition hover:bg-gray-800"
            >
              Start with ScrollToll
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-xs transition hover:bg-gray-50"
            >
              See how it works
            </a>
          </div>
        </section>

        {/* Problem */}
        <section className="border-y border-gray-100 bg-[#faf9f6]">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                The problem
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                One video can easily become an hour.
              </h2>

              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                Short-form feeds are designed around continuous scrolling. You
                may open them for a specific reason and end up spending much
                longer than you intended.
              </p>

              <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">
                ScrollToll introduces a little friction before that experience
                begins — giving you a chance to make a deliberate choice.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-6xl px-6 py-20 sm:py-24"
        >
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Turn intention into scroll time.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-gray-600 leading-relaxed">
              Your attention budget starts with activities that encourage
              thinking, focus, and intentional pauses.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="text-2xl">🧠</div>

              <p className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Step 01
              </p>

              <h3 className="mt-2 text-lg font-bold text-gray-900">
                Choose an activity
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                Challenge your mind with Brain Gym, focus on a task with Focus
                Forge, or take an intentional pause with Mindful Minute.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="text-2xl">🪙</div>

              <p className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Step 02
              </p>

              <h3 className="mt-2 text-lg font-bold text-gray-900">
                Earn Scroll Tokens
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                Complete activities and build your attention budget through
                meaningful actions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="text-2xl">📱</div>

              <p className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Step 03
              </p>

              <h3 className="mt-2 text-lg font-bold text-gray-900">
                Spend them intentionally
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                Use your tokens to unlock controlled scrolling sessions instead
                of entering an unlimited feed automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="bg-[#faf9f6]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Earn your tokens
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Different ways to build your attention budget.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="text-2xl">🧩</div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  Brain Gym
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                  Solve short challenges in logic, patterns, quick math, memory,
                  and attention.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="text-2xl">🎯</div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  Focus Forge
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                  Complete a focused session around something you actually want
                  to accomplish.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="text-2xl">🧘</div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  Mindful Minute
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                  Take a short intentional pause and decide whether you still
                  want to scroll.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Your attention, your choice
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            ScrollToll doesn't decide what you should watch.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            It simply creates a moment between the impulse to scroll and the
            decision to do it. You choose how to spend your time.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-xs transition hover:bg-gray-800"
          >
            Get Started
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-gray-900">ScrollToll</p>

          <p>Earn your scroll. Control your attention.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
          ScrollToll
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Earn your scroll.
          <br />
          Control your attention.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
          Make short-form entertainment more intentional by introducing
          meaningful friction between impulse and endless scrolling.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:opacity-80"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium transition hover:bg-gray-50"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;

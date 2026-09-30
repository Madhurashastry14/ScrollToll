import { useAuth } from "../context/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Welcome back</p>

            <h1 className="text-3xl font-bold">{user?.name}</h1>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Focus Time</p>

            <p className="mt-2 text-3xl font-bold">0 min</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Scroll Time</p>

            <p className="mt-2 text-3xl font-bold">0 min</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Scroll Tokens</p>

            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

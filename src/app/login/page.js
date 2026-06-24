export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

      <div className="bg-slate-900 p-10 rounded-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">
          Login
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-slate-800 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-slate-800 outline-none"
          />

          <button className="w-full bg-cyan-500 py-3 rounded-lg font-semibold hover:bg-cyan-600">
            Login
          </button>

        </div>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account? Sign Up
        </p>

      </div>

    </div>
  );
}
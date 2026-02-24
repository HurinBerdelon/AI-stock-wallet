export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-700 to-purple-900 text-white py-24 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">AI Stock Wallet</h1>
        <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Manage your stock portfolio smarter with AI-powered insights, real-time profitability
          tracking, and effortless transaction management.
        </p>
        <button
          type="button"
          className="bg-green-400 hover:bg-green-500 text-purple-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-green-50">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-12">
          Why AI Stock Wallet?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Portfolio Tracking</h3>
            <p className="text-gray-600">
              Monitor all your stock positions in one place. Know your average purchase price and
              current profitability at a glance.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Leverage artificial intelligence to analyze your trades, identify trends, and make
              more informed investment decisions.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">
              Transaction Management
            </h3>
            <p className="text-gray-600">
              Easily add, edit, and delete buy or sell transactions. Keep a full history of your
              investment activity with zero friction.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-purple-700 py-16 px-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your investments?</h2>
        <p className="text-purple-200 mb-8 text-lg max-w-xl mx-auto">
          Join thousands of investors who already use AI Stock Wallet to grow their wealth
          intelligently.
        </p>
        <button
          type="button"
          className="bg-green-400 hover:bg-green-500 text-purple-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </section>
    </main>
  );
}

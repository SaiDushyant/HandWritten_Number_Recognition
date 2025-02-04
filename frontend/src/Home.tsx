import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 px-4">
          <h2 className="text-4xl font-bold text-gray-800">
            Recognize Handwritten Digits with AI
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl">
            Our AI-powered tool helps you recognize handwritten digits
            seamlessly. Draw on the canvas and let the AI predict your numbers
            instantly.
          </p>
          <Link
            to="/canvas"
            className="mt-6 px-6 py-3 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition"
          >
            Start Drawing
          </Link>
        </section>

        {/* Features Section */}
        <section className="max-w-lg mx-auto px-4 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-indigo-600">
              Live Prediction
            </h3>
            <p className="text-gray-600 mt-2">
              See real-time predictions as you draw digits on the canvas.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4">
        Made with ❤️ | AI-powered Digit Recognition
      </footer>
    </div>
  );
};

export default Home;

import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-indigo-600">
            AI Handwriting Recognizer
          </h1>
          <Link
            to={location.pathname === "/canvas" ? "/" : "/canvas"}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go to {location.pathname === "/canvas" ? "Home" : "Canvas"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

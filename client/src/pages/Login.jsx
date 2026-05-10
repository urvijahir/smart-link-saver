import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    //validation
    if (!email || !password) {
      toast.error("All fields required");
      return;
    }

    try {
      const res = await axios.post(
        "https://smart-link-saver.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");

      // Clear inputs
      setEmail("");
      setPassword("");

      // Redirect
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6  bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            className="w-full p-3 rounded bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full p-3 rounded bg-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg">
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

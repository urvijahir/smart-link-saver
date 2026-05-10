import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    //Validation
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await axios.post(
        "https://smart-link-saver.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        },
      );

      toast.success("Account created!");

      // Clear inputs
      setName("");
      setEmail("");
      setPassword("");

      // redirect to login
      navigate("/");
    } catch {
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <form
          onSubmit={handleRegister}
          autoComplete="off"
          className="space-y-3"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            autoComplete="off"
            className="w-full p-3 rounded bg-gray-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            className="w-full p-3 rounded bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full p-3 rounded bg-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg">
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

// src/pages/Auth/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import loginImg from "../assets/images/login.png";
import logo from '../assets/images/afrologo.png'
const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let bodyData = {};

      if (isLogin) {
        // ✅ Login requires username + password
        bodyData = {
          username: form.username,
          password: form.password,

        };
      } else {
        // ✅ Register requires fullname, username, phone, email, password
        bodyData = {
          fullname: form.fullname,
          username: form.username,
          phone: form.phone,
          email: form.email,
          password: form.password,
        };
      }

      const endpoint = isLogin
        ? "https://afrophuket-backend-gr4j.onrender.com/auth/login/"
        : "https://afrophuket-backend-gr4j.onrender.com/auth/register/";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // ✅ Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccess(isLogin ? "Login successful 🎉" : "Account created 🎉");
      console.log("Response:", data);

      // ✅ Redirect after success
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center">
      {/* Left Section */}
      <div className="w-full md:w-1/2 text-white flex flex-col justify-center px-10">
        <div className="mb-10">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
          {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </h1>
        <p className="mt-4 text-gray-300">
          {isLogin
            ? "Login to continue creating and managing your events."
            : "Register to start creating and managing your events."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Register Fields */}
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-purple-500 py-2"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-purple-500 py-2"
                  placeholder="Username"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-purple-500 py-2"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-purple-500 py-2"
                  placeholder="Email"
                />
              </div>
            </>
          )}

          {/* Shared Fields */}
          <div>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-purple-500 py-2"
              placeholder="Username"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-purple-500 py-2"
              placeholder="Password"
            />
          </div>

          {/* Forgot password (Login only) */}
          {isLogin && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-400 cursor-pointer">
                Forgot Password?
              </span>
            </div>
          )}

          <div className="relative block w-full">
            <span className="absolute inset-0 bg-black rounded-lg translate-x-1.5 translate-y-1.5 border-2"></span>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full text-sm sm:text-base font-semibold uppercase cursor-pointer px-6 py-3 bg-white text-black rounded-lg border-2 border-black shadow-md hover:scale-105 transition-all duration-300"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                ? "LOG IN"
                : "REGISTER"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </form>

        <p className="mt-6 text-sm text-gray-400">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 cursor-pointer hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>

      {/* Right Section */}
      <div className="hidden md:block w-1/2 p-4">
        <img src={loginImg} alt="Party" className="w-full object-cover" />
      </div>
    </div>
  );
};

export default AuthPage;

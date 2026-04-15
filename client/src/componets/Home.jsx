"use client";
import React, { useState } from "react";
import Link from "next/link";
import Login from "@/components/ui/modals/login";
import Register from "@/components/ui/modals/register";
import Cookies from "js-cookie";

export default function WordMasterHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-12">
        <Hero />
        <Features />
        <WhySection />
        <Footer />
      </main>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  const token = Cookies.get("token");

  return (
    <nav className="w-full bg-white/60 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            WM
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">WordMaster</h2>
            <p className="text-xs text-gray-500 -mt-1">
              Learn English vocabulary
            </p>
          </div>
        </div>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#how" className="text-gray-600 hover:text-gray-900">
            How it works
          </Link>

          {token ? (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Login>
                <button className="px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                  Login
                </button>
              </Login>
              <Register>
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                  Register
                </button>
              </Register>
            </div>
          )}
        </div>

        {/* mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
            className="p-2 rounded-lg bg-white border"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="#1F2937"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* mobile panel */}
      {open && (
        <div className="md:hidden border-t bg-white/90">
          <div className="px-6 py-4 flex flex-col gap-3">
            <Link
              href="#features"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              Features
            </Link>
            <Link
              href="#how"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              How it works
            </Link>
            {token ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-gray-700"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex gap-3 mt-2">
                <Login>
                  <button className="flex-1 text-center px-3 py-2 border border-blue-600 rounded-md text-blue-600">
                    Login
                  </button>
                </Login>
                <Register>
                  <button className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-md">
                    Register
                  </button>
                </Register>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
          Learn English <span className="text-blue-600">smarter</span>, one word
          at a time.
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          Build your vocabulary with personalized lessons. Add words, practice
          with instant feedback, listen to pronunciation, and track your
          progress.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Sign in
          </Link>
          <a
            href="#how"
            className="px-6 py-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            How it works
          </a>
        </div>

        {/* stats pill */}
        <div className="mt-6 flex items-center gap-4">
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Lessons</div>
            <div className="text-xl font-semibold">0</div>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Words</div>
            <div className="text-xl font-semibold">0</div>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-xl font-semibold">0%</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {/* Illustration card */}
        <div className="w-full max-w-md p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-transparent">
          <div className="text-sm text-gray-500 mb-3">Quick demo</div>

          <div className="bg-white rounded-lg p-4 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-gray-500">Lesson</div>
                <div className="font-semibold">Animals — Basic</div>
              </div>
              <div className="text-xs text-gray-400">3 min</div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">cat</div>
                  <div className="text-xs text-gray-400">
                    mushuk • The cat is sleeping.
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md">
                  ▶️
                </button>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">dog</div>
                  <div className="text-xs text-gray-400">
                    it • The dog is barking.
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md">
                  ▶️
                </button>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">bird</div>
                  <div className="text-xs text-gray-400">
                    qush • The bird is flying.
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md">
                  ▶️
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "Personal Dashboard",
      desc: "Create lessons, add words, and track your personal progress.",
    },
    {
      title: "Practice Mode",
      desc: "Interactive quizzes: write translation, get instant feedback, repeat until memorized.",
    },
    {
      title: "Audio Support",
      desc: "Listen to pronunciation for every word with a single click.",
    },
  ];

  return (
    <section
      id="features"
      className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {items.map((it) => (
        <div
          key={it.title}
          className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold mb-3">
            ★
          </div>
          <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
          <p className="text-gray-600 text-sm">{it.desc}</p>
        </div>
      ))}
    </section>
  );
}

function WhySection() {
  return (
    <section
      id="how"
      className="mt-14 bg-gradient-to-r from-white to-gray-50 p-8 rounded-2xl"
    >
      <div className="md:flex md:items-center md:gap-8">
        <div className="md:flex-1">
          <h3 className="text-2xl font-bold">How it works</h3>
          <p className="mt-3 text-gray-600 max-w-xl">
            Add new lessons with words (English + translation + example). Start
            practice mode to go through words one-by-one, submit your
            translation, get instant correct/incorrect feedback, and collect
            lists of remembered and unremembered words for later practice.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              href="/dashboard"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg"
            >
              Open dashboard
            </Link>
            <Link
              href="/register"
              className="px-5 py-3 border border-gray-200 rounded-lg"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="md:w-80 mt-6 md:mt-0">
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Today practice</div>
            <div className="mt-3 font-semibold text-lg">5 words</div>
            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-2/5 h-full bg-blue-600 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                2 remembered • 3 left
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 py-8 text-center text-gray-500">
      © {new Date().getFullYear()} WordMaster — All rights reserved.
    </footer>
  );
}

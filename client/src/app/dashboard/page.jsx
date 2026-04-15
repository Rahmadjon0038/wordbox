"use client";
import React, { useState } from "react";
import Link from "next/link";
import CreateLessonModal from "@/components/ui/modals/CreateLessonModals";
import Login from "@/components/ui/modals/login";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  useAddLesson,
  useAdminStats,
  useDeleteLesson,
  useGetAllLessons,
} from "@/hooks/lessons";
import { instance } from "@/hooks/api";
import Loader from "@/components/ui/loaders/Loader";
import NotifiModal from "@/components/ui/modals/NotifiModal";
import { usegetStats } from "@/hooks/words";
export default function Dashboard() {
  const { data, isLoading, error } = useGetAllLessons();
  const lessons = data?.lessons;
  const lessonMutation = useAddLesson();

  const {
    data: stats,
    isLoading: stastloading,
    error: stasterr,
    refetch,
  } = useAdminStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Lessons" value={stats?.stats?.totalLessons} />
          <StatCard label="Total Words" value={stats?.stats?.totalWords} />
          <StatCard label="Learned Words" value={stats?.stats?.learnedWords} />
        </div>

        {/* Lessons */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Lessons</h2>
          <CreateLessonModal>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + New Lesson
            </button>
          </CreateLessonModal>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-24 mt-12 bg-white rounded-xl shadow text-center w-full">
            <span className="text-lg text-gray-500">
              <Loader />
            </span>
          </div>
        ) : lessons && lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div className="p-24 mt-12 bg-white rounded-xl shadow text-center w-full">
              <span className="text-lg text-gray-400">Not found</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Navbar() {
  const router = useRouter();

  const logout = async () => {
    try {
      await instance.post("/api/auth/logout");
    } catch (e) {
      // baribir lokal cookie tozalaymiz
    }
    Cookies.remove("role");
    Cookies.remove("token");
    router.push("/");
  };
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            WM
          </div>
          <span className="font-bold text-gray-800">WordMaster</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* <Login>
            <button className="text-gray-600 hover:text-gray-900">Login</button>
          </Login> */}
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>

          <button
            onClick={logout}
            className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="text-sm text-gray-500 min-h-4">{label}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}

function LessonCard({ lesson }) {
  const progress = Math.round((lesson.learned / lesson.words) * 100);

  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
      <div>
        {/* <p>{lesson?.id}</p> */}
        <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {lesson.totalWords} words • {lesson.learnedWords} learned
        </p>

        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-blue-600"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/dashboard/lesson/${lesson.id}`}
          className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Open
        </Link>
        <Link
          href={`/dashboard/lesson/${lesson.id}/practice`}
          className="flex-1 text-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          Practice
        </Link>

        <NotifiModal
          lessonid={lesson.id}
          text="Siz ushbu amalni bajarishga rozimisiz?
            Bu amalni tasdiqlaganingizdan so‘ng ortga qaytarib bo‘lmaydi."
        >
          <button className="flex-1 text-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Delete
          </button>
        </NotifiModal>
      </div>
    </div>
  );
}

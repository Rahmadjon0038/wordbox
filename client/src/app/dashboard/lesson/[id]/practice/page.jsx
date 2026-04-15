"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usegetLessonPractice, useupdateword } from "@/hooks/lessons";
import { useParams } from "next/navigation";
import {
  BookOpen,
  ArrowLeftCircle,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";
import Loader from "@/components/ui/loaders/Loader";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PracticePage() {
  const { id } = useParams();
  const { data, isLoading } = usegetLessonPractice(id);

  const words = useMemo(() => {
    if (!data?.words) return [];
    return shuffleArray([...data.words]);
  }, [data?.words?.length]);

  const updatewordMutation = useupdateword();

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [learned, setLearned] = useState([]);
  const [unlearned, setUnlearned] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [mode, setMode] = useState(null); // en-uz | uz-en

  const logWordCheck = (id, isCorrect) => {
    updatewordMutation.mutate({ id, learned: isCorrect ? 1 : 0 });
  };

  const checkAnswer = () => {
    const currentWord = words[index];
    if (!currentWord) return null;
    const correctAnswer =
      mode === "en-uz"
        ? currentWord?.uz?.toLowerCase()
        : currentWord?.en?.toLowerCase();

    const isCorrect = answer.trim().toLowerCase() === correctAnswer;
    logWordCheck(currentWord?.id, isCorrect);
    if (isCorrect) {
      setResult("correct");
      setLearned([...learned, currentWord]);
      setTimeout(() => nextWord(), 1000);
    } else {
      setResult("wrong");
    }
  };

  const nextWord = () => {
    setAnswer("");
    setResult(null);
    setShowTranslate(false);
    if (index + 1 < words.length) setIndex(index + 1);
    else setFinished(true);
  };

  const skipWord = () => {
    setUnlearned([...unlearned, words[index]]);
    logWordCheck(words[index]?.id, false);
    nextWord();
  };

  const translateWord = () => {
    logWordCheck(words[index]?.id, false);
    setShowTranslate(true);
  };

  const restart = () => {
    setIndex(0);
    setAnswer("");
    setResult(null);
    setLearned([]);
    setUnlearned([]);
    setFinished(false);
    setShowTranslate(false);
    setMode(null);
  };

  const speakWord = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!words || words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="bg-white w-full max-w-md sm:max-w-2xl p-8 sm:p-12 rounded-3xl border text-center">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            So‘zlar mavjud emas 😕
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-3">
            Hozircha hech qanday so‘z topilmadi. Keyinroq urinib ko‘ring.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-medium rounded-2xl hover:bg-blue-700 transition"
          >
            <ArrowLeftCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10">
        {/* Mode tanlash */}
        {!mode ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-6">Choose Mode</h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button
                onClick={() => setMode("en-uz")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                English → Uzbek
              </button>
              <button
                onClick={() => setMode("uz-en")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Uzbek → English
              </button>
            </div>
          </div>
        ) : !finished ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${((index + 1) / words.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {index + 1} / {words.length}
              </p>
            </div>

            {/* Word */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
              {mode === "en-uz" ? words[index]?.en : words[index]?.uz}
            </h2>

            {mode === "en-uz" && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => speakWord(words[index]?.en)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  🔊 Listen
                </button>
              </div>
            )}

            {/* Input */}
            <input
              type="text"
              placeholder="Write the translation..."
              value={answer}
              disabled={showTranslate}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !showTranslate) {
                  checkAnswer();
                }
              }}
              className="w-full px-4 py-3 border rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />

            {/* Result */}
            {result === "correct" && (
              <p className="text-green-600 font-semibold mt-3 text-center">
                Correct!
              </p>
            )}
            {result === "wrong" && !showTranslate && (
              <p className="text-red-600 font-semibold mt-3 text-center">
                Wrong! Try again.
              </p>
            )}

            {showTranslate && (
              <p className="font-semibold mt-3 text-center">
                translation:{" "}
                {mode === "en-uz" ? words[index]?.uz : words[index]?.en}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
              <button
                onClick={checkAnswer}
                disabled={showTranslate}
                className={`px-6 py-3 rounded-lg text-white transition ${
                  showTranslate
                    ? "bg-gray-300"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Check
              </button>
              <button
                onClick={skipWord}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Skip
              </button>
              <button
                onClick={translateWord}
                disabled={showTranslate}
                className={`px-6 py-3 rounded-lg text-white transition ${
                  showTranslate
                    ? "bg-gray-300"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                Translate
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl bg-white p-6 sm:p-12 rounded-3xl border">
              <div className="flex flex-col items-center mb-8 sm:mb-12">
                <Trophy className="w-12 sm:w-14 h-12 sm:h-14 text-yellow-500 mb-4" />
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 text-center">
                  Practice Finished 🎉
                </h2>
                <p className="text-gray-500 mt-3 text-base sm:text-lg text-center">
                  Here are the results of your practice session:
                </p>
              </div>

              {/* Learned / Unlearned */}
              <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-2xl font-semibold text-green-600 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-6 sm:w-7 h-6 sm:h-7" /> Learned
                    Words
                  </h3>
                  {learned.length === 0 ? (
                    <p className="text-gray-400 italic">No words learned.</p>
                  ) : (
                    <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 text-sm sm:text-base">
                      {learned.map((w, i) => (
                        <li
                          key={i}
                          className="bg-green-50 text-green-800 px-4 py-2 sm:px-5 sm:py-3 rounded-xl flex justify-between items-center"
                        >
                          <span className="font-medium">{w.en}</span>
                          <span className="font-semibold">→</span>
                          <span>{w.uz}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg sm:text-2xl font-semibold text-red-600 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <XCircle className="w-6 sm:w-7 h-6 sm:h-7" /> Unlearned
                    Words
                  </h3>
                  {unlearned.length === 0 ? (
                    <p className="text-gray-400 italic">No unlearned words.</p>
                  ) : (
                    <ul className="space-y-3 max-h-[50vh] overflow-y-auto pl-2 text-sm sm:text-base">
                      {unlearned.map((w, i) => (
                        <li
                          key={i}
                          className="bg-red-50 text-red-800 px-4 py-2 sm:px-5 sm:py-3 rounded-xl flex justify-between items-center"
                        >
                          <span className="font-medium">{w.en}</span>
                          <span className="font-semibold">→</span>
                          <span>{w.uz}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <button
                  onClick={restart}
                  className="px-8 sm:px-12 py-3 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition"
                >
                  <RotateCcw className="w-5 sm:w-6 h-5 sm:h-6" />
                  Restart
                </button>
                <Link
                  href={`/dashboard/lesson/${id}`}
                  className="px-8 sm:px-12 py-3 flex items-center justify-center gap-2 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 transition"
                >
                  <Home className="w-5 sm:w-6 h-5 sm:h-6" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            WM
          </div>
          <span className="font-bold text-gray-800">WordMaster</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/profile"
            className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
          >
            Profile
          </Link>
          <Link
            href="/logout"
            className="px-2 sm:px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 text-sm sm:text-base"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

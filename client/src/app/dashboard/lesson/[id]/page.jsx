'use client'
import React, { useState } from 'react'
import { Switch } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useaddWords, usedeleteWord, usegetWords } from '@/hooks/words'
import Loader from '@/components/ui/loaders/Loader'
import { Pencil, Trash2, Volume2, SpellCheck, Menu } from "lucide-react";
import EditWord from '@/components/ui/modals/EditWord'
import { usegetLessonId } from '@/hooks/lessons'

export default function LessonPage() {
    const { id } = useParams()
    const addWordsMutation = useaddWords()
    const { data, isLoading } = usegetWords(id)
    const deleteWordMutation = usedeleteWord()

    const { data: lessonName, isLoading: lessonNameLoading, error, refetch } = usegetLessonId(id)

    const words = data?.words
    const [filter, setFilter] = useState('all')
    const [newWord, setNewWord] = useState({ english: '', uzbek: '', example: '', exampleUz: '' })
    const [autoTranslate, setAutoTranslate] = useState(true);


    // Debounce uchun state (english word)
    const [debouncedEnglish, setDebouncedEnglish] = useState('');
    React.useEffect(() => {
        if (!autoTranslate) return;
        const handler = setTimeout(() => {
            setDebouncedEnglish(newWord.english);
        }, 500);
        return () => clearTimeout(handler);
    }, [newWord.english, autoTranslate]);

    // Debounce uchun state (example sentence)
    const [debouncedExample, setDebouncedExample] = useState('');
    React.useEffect(() => {
        if (!autoTranslate) return;
        const handler = setTimeout(() => {
            setDebouncedExample(newWord.example);
        }, 500);
        return () => clearTimeout(handler);
    }, [newWord.example, autoTranslate]);

    // TanStack Query bilan tarjima qilish (word)
    const { data: uzbekTranslation, isFetching: isTranslating } = useQuery({
        queryKey: ['translate-en-uz', debouncedEnglish],
        queryFn: async () => {
            if (!debouncedEnglish) return '';
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=${encodeURIComponent(debouncedEnglish)}`);
            const data = await res.json();
            return data[0][0][0];
        },
        enabled: !!debouncedEnglish,
    });

    // TanStack Query bilan tarjima qilish (example sentence)
    const { data: uzbekExampleTranslation, isFetching: isExampleTranslating } = useQuery({
        queryKey: ['translate-en-uz-example', debouncedExample],
        queryFn: async () => {
            if (!debouncedExample) return '';
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=${encodeURIComponent(debouncedExample)}`);
            const data = await res.json();
            return data[0][0][0];
        },
        enabled: !!debouncedExample,
    });

    // Uzbek tarjimani inputga joylash (word)
    React.useEffect(() => {
        if (!autoTranslate) return;
        if (debouncedEnglish === '') {
            setNewWord((prev) => ({ ...prev, uzbek: '' }));
        } else if (uzbekTranslation && !isTranslating) {
            setNewWord((prev) => ({ ...prev, uzbek: uzbekTranslation }));
        }
    }, [uzbekTranslation, isTranslating, debouncedEnglish, autoTranslate]);

    // Uzbek tarjimani inputga joylash (example sentence)
    React.useEffect(() => {
        if (!autoTranslate) return;
        if (debouncedExample === '') {
            setNewWord((prev) => ({ ...prev, exampleUz: '' }));
        } else if (uzbekExampleTranslation && !isExampleTranslating) {
            setNewWord((prev) => ({ ...prev, exampleUz: uzbekExampleTranslation }));
        }
    }, [uzbekExampleTranslation, isExampleTranslating, debouncedExample, autoTranslate]);

    const handleDelete = (id) => deleteWordMutation.mutate(id)

    const speak = (text) => {
        if (!text) return;
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()
        const utter = new window.SpeechSynthesisUtterance(text)
        utter.lang = 'en-US'
        if (typeof text === 'string' && text.trim().includes(' ')) utter.rate = 0.8
        const setVoiceAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices()
            utter.voice = voices.find(v => v.lang === 'en-US') || voices[0]
            window.speechSynthesis.speak(utter)
        }
        setVoiceAndSpeak()
    }

    const spellWord = (text) => {
        if (!text) return;
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()
        const letters = text.split('')
        let idx = 0
        const speakNext = () => {
            if (idx >= letters.length) return
            const utter = new window.SpeechSynthesisUtterance(letters[idx])
            utter.lang = 'en-US'
            utter.rate = 0.6
            utter.onend = () => {
                idx++
                setTimeout(speakNext, 350)
            }
            window.speechSynthesis.speak(utter)
        }
        speakNext()
    }

    // Statistikalar
    const total = words?.length || 0
    const learnedCount = words?.filter?.(w => w.learned)?.length || 0
    const notLearnedCount = total - learnedCount

    const filteredWords = words?.filter?.((w) => {
        if (filter === 'learned') return w.learned
        if (filter === 'notLearned') return !w.learned
        return true
    }) || []

    const addWord = (e) => {
        e.preventDefault()
        if (!newWord.english || !newWord.uzbek) return
        const newEntry = { ...newWord, learned: false }
        addWordsMutation.mutate({ id, newEntry })
        setNewWord({ english: '', uzbek: '', example: '', exampleUz: '' })
    }

    if (isLoading || !words) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">{lessonName?.title}</h1>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
                </div>

                {/* Statistikalar */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-white shadow rounded-lg">
                        <p className="text-gray-500">Total Words</p>
                        <p className="text-2xl font-bold">{total}</p>
                    </div>
                    <div className="p-4 bg-green-50 shadow rounded-lg">
                        <p className="text-gray-500">Learned</p>
                        <p className="text-2xl font-bold text-green-600">{learnedCount}</p>
                    </div>
                    <div className="p-4 bg-red-50 shadow rounded-lg">
                        <p className="text-gray-500">Not Learned</p>
                        <p className="text-2xl font-bold text-red-600">{notLearnedCount}</p>
                    </div>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {['all', 'learned', 'notLearned'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm sm:text-base transition ${filter === f
                                ? f === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : f === 'learned'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {f === 'all' ? 'All Words' : f === 'learned' ? 'Learned' : 'Not Learned'}
                        </button>
                    ))}
                </div>

                {/* Word qo‘shish formasi */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow">
                    <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-lg sm:text-xl font-semibold">➕ Add New Word</h2>
                        <Switch
                            checked={autoTranslate}
                            onChange={setAutoTranslate}
                            className={`${autoTranslate ? 'bg-blue-600' : 'bg-gray-300'}
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                        >
                            <span className="sr-only">Auto Translate</span>
                            <span
                                className={`${autoTranslate ? 'translate-x-6' : 'translate-x-1'}
                                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                        <span className="text-sm text-gray-500">Auto Translate</span>
                    </div>
                    <form onSubmit={addWord} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="English word"
                                value={newWord.english}
                                onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                                className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 w-full pr-10"
                            />
                            {isTranslating && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Uzbek translation"
                            value={newWord.uzbek}
                            onChange={(e) => setNewWord({ ...newWord, uzbek: e.target.value })}
                            className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                            readOnly={isTranslating}
                        />
                        <input
                            type="text"
                            placeholder="Example sentence (EN)"
                            value={newWord.example}
                            onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                            className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 sm:col-span-2"
                        />
                        <input
                            type="text"
                            placeholder="Example translation (UZ)"
                            value={newWord.exampleUz}
                            onChange={(e) => setNewWord({ ...newWord, exampleUz: e.target.value })}
                            className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 sm:col-span-2"
                            readOnly={isExampleTranslating}
                        />
                        <button
                            type="submit"
                            className="sm:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Add Word
                        </button>
                    </form>
                </div>

                {/* Words list */}
                <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Words in this Lesson</h2>
                    {filteredWords?.length === 0 ? (
                        <p className="text-gray-500">No words found.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {filteredWords?.map?.((w) => (
                                <li key={w.id} className="py-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <div className="font-medium text-base sm:text-lg">
                                                {w.english} → {w.uzbek}
                                                {w.learned === 1 && (
                                                    <span className="ml-2 text-green-600 text-sm">(Learned)</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">{w.example}</div>
                                            <div className="text-sm text-gray-500 italic">({w.exampleUz})</div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => speak(w.english)}
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                                            >
                                                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Word
                                            </button>

                                            <button
                                                onClick={() => speak(w.example)}
                                                className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 text-sm"
                                            >
                                                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Sentence
                                            </button>

                                            <button
                                                onClick={() => spellWord(w.english)}
                                                className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 text-sm"
                                            >
                                                <SpellCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Spelling
                                            </button>

                                            <EditWord word={w}>
                                                <button
                                                    className="flex items-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 text-sm"
                                                >
                                                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    Edit
                                                </button>
                                            </EditWord>

                                            <button
                                                onClick={() => handleDelete(w.id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm"
                                            >
                                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Practice buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/dashboard/lesson/${id}/practice`}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                    >
                        Start Practice
                    </Link>
                    <Link
                        href={`/dashboard/lesson/${id}/notlearned`}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-center"
                    >
                        Practice Not Learned
                    </Link>
                </div>
            </main>
        </div>
    )
}

function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="w-full bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">WM</div>
                    <span className="font-bold text-gray-800 hidden sm:inline">WordMaster</span>
                </Link>

                {/* Desktop menu */}
                <div className="hidden sm:flex items-center gap-4">
                    <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
                    <Link href="/logout" className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">Logout</Link>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="sm:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="sm:hidden bg-white shadow-md px-4 py-3 flex flex-col gap-2">
                    <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
                    <Link href="/logout" className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">Logout</Link>
                </div>
            )}
        </nav>
    )
}

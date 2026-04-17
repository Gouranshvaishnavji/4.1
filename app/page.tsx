"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, CheckCircle, Clock, Layout, MessageSquare, TrendingUp, Upload, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const stats = [
    { label: "Overall Mastery", value: 68, icon: Brain, color: "text-purple-500" },
    { label: "Study Streak", value: 12, icon: TrendingUp, color: "text-orange-500" },
    { label: "Chapters Done", value: 4, icon: CheckCircle, color: "text-green-500" },
  ];

  const recentDocs = [
    { title: "Operating Systems 101", progress: 45, lastRead: "2h ago" },
    { title: "Data Structures & Algorithms", progress: 82, lastRead: "Yesterday" },
  ];

  const onboardingSteps = [
    { title: "Welcome to EduFlow AI", description: "Your personalized learning journey starts here. Let's transform your static PDFs into active knowledge.", button: "Get Started" },
    { title: "Upload Your Material", description: "Drag and drop any textbook or notes. Our AI will index it and create a custom mastery path.", button: "Upload Now" },
    { title: "Personalized Roadmap", description: "We'll track your strengths and weaknesses using spaced repetition to ensure you never forget.", button: "Go to Dashboard" }
  ];

  return (
    <div className={`min-h-screen bg-zinc-50 transition-colors duration-500 ${isFocusMode ? 'bg-white' : ''}`}>

      {/* Onboarding Overlay */}
      <AnimatePresence>
        {onboardingStep < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">{onboardingSteps[onboardingStep].title}</h2>
              <p className="text-zinc-500 mb-8 leading-relaxed">{onboardingSteps[onboardingStep].description}</p>
              <Button
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setOnboardingStep(prev => prev + 1)}
              >
                {onboardingSteps[onboardingStep].button} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="flex justify-center gap-2 mt-6">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === onboardingStep ? 'w-8 bg-blue-600' : 'w-2 bg-zinc-200'}`} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar / Navigation */}
      {!isFocusMode && (
        <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-zinc-200 p-6 flex flex-col gap-8">
          <div className="flex items-center gap-2 font-bold text-xl text-zinc-900">
            <Brain className="w-8 h-8 text-blue-600" />
            <span>EduFlow AI</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: "overview", label: "Dashboard", icon: Layout },
              { id: "library", label: "My Library", icon: BookOpen },
              { id: "chat", label: "AI Mentor", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4">
             <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Daily Goal</p>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-lg font-bold">4/5</span>
                  <span className="text-xs text-zinc-500 font-medium">80%</span>
                </div>
                <Progress value={80} className="h-1.5" />
             </div>
            <Button className="w-full flex gap-2" variant="outline" onClick={() => setIsFocusMode(true)}>
              <Clock className="w-4 h-4" /> Deep Focus Mode
            </Button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-500 ${isFocusMode ? 'p-12 max-w-4xl mx-auto' : 'ml-64 p-10'}`}>
        <AnimatePresence mode="wait">
          {isFocusMode ? (
            <motion.div
              key="focus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setIsFocusMode(false)}>← Exit Focus Mode</Button>
                <div className="text-zinc-400 font-mono">00:24:59</div>
              </div>
              <div className="prose prose-zinc lg:prose-xl">
                <h1 className="text-4xl font-bold">The Banker's Algorithm</h1>
                <p className="text-xl text-zinc-600 mt-4 leading-relaxed">The banker's algorithm is a resource allocation and deadlock avoidance algorithm that tests for safety by simulating the allocation for predetermined maximum possible amounts of all resources...</p>
                <div className="bg-zinc-100 p-8 rounded-2xl border border-zinc-200 mt-10">
                  <h4 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                    <Brain className="w-5 h-5 text-blue-500"/> Mentor's Analogy
                  </h4>
                  <p className="text-zinc-600 italic">"Think of it like a bank manager who won't lend money unless they are sure they can satisfy the needs of all their customers if they all asked for their maximum limit at different times."</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-10"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">Welcome back, Jules!</h1>
                  <p className="text-zinc-500">Ready to level up your OS mastery today?</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex gap-2">
                    <BookOpen className="w-4 h-4" /> View Schedule
                  </Button>
                  <Button className="flex gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Upload className="w-4 h-4" /> Upload PDF
                  </Button>
                </div>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                          <h3 className="text-2xl font-bold">{stat.value}{stat.label.includes('Streak') ? 'd' : '%'}</h3>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Proactive Suggestions */}
                <div className="flex flex-col gap-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" /> AI Recommendations
                  </h2>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-lg">Ready for a 2-minute revision?</CardTitle>
                      <CardDescription>You last studied "Deadlocks" 3 days ago. Spaced repetition says it's time!</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <Button size="sm">Start Quick Quiz</Button>
                      <span className="text-xs text-zinc-400 font-medium">+15 Mastery pts</span>
                    </CardFooter>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="text-lg">Struggling with Semaphores?</CardTitle>
                      <CardDescription>You've spent 2x more time on this topic. Let me explain it with a new analogy.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button size="sm" variant="outline">Explain Differently</Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Recent Documents */}
                <div className="flex flex-col gap-6">
                  <h2 className="text-xl font-semibold">Active Journeys</h2>
                  {recentDocs.map((doc, i) => (
                    <Card key={i} className="hover:border-zinc-300 transition-colors cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base group-hover:text-blue-600 transition-colors">{doc.title}</CardTitle>
                            <CardDescription>Chapter 4 of 12</CardDescription>
                          </div>
                          <span className="text-xs text-zinc-400">{doc.lastRead}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Mastery</span>
                            <span className="font-semibold">{doc.progress}%</span>
                          </div>
                          <Progress value={doc.progress} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View full library <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

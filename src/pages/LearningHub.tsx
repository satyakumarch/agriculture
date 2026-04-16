import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Star, CheckCircle, XCircle, Lightbulb, Gift, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const dailyTips = [
  { icon: '💧', tip: 'Water your crops early morning (5-8 AM) to reduce evaporation by up to 30%.', category: 'Irrigation' },
  { icon: '🌱', tip: 'Rotate crops every season to prevent soil nutrient depletion and reduce pest buildup.', category: 'Soil Health' },
  { icon: '🐛', tip: 'Yellow sticky traps can reduce whitefly and aphid populations by 40% without chemicals.', category: 'Pest Control' },
  { icon: '🌡️', tip: 'Mulching reduces soil temperature by 5-8°C and retains moisture for 3x longer.', category: 'Soil Management' },
  { icon: '📊', tip: 'Keep a farm diary — farmers who track expenses earn 15-20% more profit on average.', category: 'Finance' },
  { icon: '🌾', tip: 'Intercropping wheat with mustard can increase overall yield by 20% and reduce pest pressure.', category: 'Cropping' },
  { icon: '🔬', tip: 'Soil testing every 2 years saves ₹2,000-5,000/acre in unnecessary fertilizer costs.', category: 'Soil Health' },
];

const quizzes: Quiz[] = [
  { id: 1, question: 'What is the ideal soil pH for most crops?', options: ['4.0 - 5.0', '6.0 - 7.0', '7.5 - 8.5', '8.5 - 9.5'], correct: 1, explanation: 'Most crops grow best in slightly acidic to neutral soil (pH 6.0-7.0). This range ensures optimal nutrient availability.' },
  { id: 2, question: 'Which fertilizer provides nitrogen to crops?', options: ['Superphosphate', 'Muriate of Potash', 'Urea', 'Gypsum'], correct: 2, explanation: 'Urea (46% N) is the most concentrated solid nitrogen fertilizer. It is widely used for top-dressing crops.' },
  { id: 3, question: 'What does MSP stand for in agriculture?', options: ['Maximum Selling Price', 'Minimum Support Price', 'Market Standard Price', 'Monthly Subsidy Payment'], correct: 1, explanation: 'MSP (Minimum Support Price) is the price set by the government to protect farmers from market price fluctuations.' },
  { id: 4, question: 'Which irrigation method is most water-efficient?', options: ['Flood irrigation', 'Sprinkler irrigation', 'Drip irrigation', 'Furrow irrigation'], correct: 2, explanation: 'Drip irrigation delivers water directly to roots, saving 40-60% water compared to flood irrigation.' },
  { id: 5, question: 'Kharif crops are sown in which season?', options: ['Winter (October-November)', 'Monsoon (June-July)', 'Summer (March-April)', 'Spring (February-March)'], correct: 1, explanation: 'Kharif crops like rice, cotton, and maize are sown at the beginning of the monsoon season (June-July).' },
];

const achievements = [
  { id: 1, name: 'First Quiz', icon: '🎯', description: 'Complete your first quiz', earned: true, points: 50 },
  { id: 2, name: 'Knowledge Seeker', icon: '📚', description: 'Read 5 daily tips', earned: true, points: 100 },
  { id: 3, name: 'Quiz Master', icon: '🏆', description: 'Score 100% on 3 quizzes', earned: false, points: 300 },
  { id: 4, name: 'Farm Expert', icon: '🌾', description: 'Complete all learning modules', earned: false, points: 500 },
  { id: 5, name: 'Community Helper', icon: '🤝', description: 'Answer 10 community questions', earned: false, points: 200 },
];

const LearningHub = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [points, setPoints] = useState(150);
  const [tipIndex, setTipIndex] = useState(0);
  const { toast } = useToast();

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === quizzes[currentQuiz].correct) {
      setScore(s => s + 1);
      setPoints(p => p + 20);
      toast({ title: '+20 Points!', description: 'Correct answer! Keep going.' });
    }
  };

  const handleNext = () => {
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz(c => c + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizComplete(false);
  };

  const nextTip = () => setTipIndex(i => (i + 1) % dailyTips.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 rounded-full px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300 mb-3">
              <BookOpen className="h-4 w-4" />
              <span>Learning & Gamification</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Farming Learning Hub</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Daily tips, quizzes, and rewards to grow your farming knowledge and earn points.
            </p>
          </div>

          {/* Points Banner */}
          <div className="glass-card rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-xl">{points} Points</p>
                <p className="text-sm text-gray-500">Level 3 — Experienced Farmer</p>
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress to Level 4</span>
                <span>{points}/500</span>
              </div>
              <Progress value={(points / 500) * 100} className="h-2" />
            </div>
            <Badge className="bg-amber-600 text-white"><Zap className="h-3 w-3 mr-1" /> 7-day streak</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Tip */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" /> Daily Farming Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <span className="text-4xl">{dailyTips[tipIndex].icon}</span>
                  </div>
                  <Badge variant="outline" className="mb-2 text-xs">{dailyTips[tipIndex].category}</Badge>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{dailyTips[tipIndex].tip}</p>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={nextTip}>Next Tip →</Button>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Gift className="h-4 w-4 text-purple-500" /> Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {achievements.map(a => (
                    <div key={a.id} className={`flex items-center gap-2 p-2 rounded-lg ${a.earned ? 'bg-amber-50 dark:bg-amber-950/20' : 'opacity-50'}`}>
                      <span className="text-xl">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{a.name}</p>
                        <p className="text-xs text-gray-500 truncate">{a.description}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-600 shrink-0">+{a.points}</span>
                      {a.earned && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quiz Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500" /> Farming Quiz</span>
                    <Badge variant="outline">{currentQuiz + 1}/{quizzes.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quizComplete ? (
                    <div className="text-center py-8">
                      <Trophy className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">You scored {score}/{quizzes.length} — {Math.round((score / quizzes.length) * 100)}%</p>
                      <p className="text-amber-600 font-semibold mb-6">+{score * 20} points earned!</p>
                      <Button onClick={handleRestart} className="bg-amber-600 hover:bg-amber-700 text-white">Try Again</Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <Progress value={((currentQuiz) / quizzes.length) * 100} className="h-1.5 mb-4" />
                        <p className="font-semibold text-base mb-4">{quizzes[currentQuiz].question}</p>
                      </div>
                      <div className="space-y-2 mb-4">
                        {quizzes[currentQuiz].options.map((opt, idx) => {
                          let cls = 'border-gray-200 dark:border-gray-700 hover:border-amber-400';
                          if (answered) {
                            if (idx === quizzes[currentQuiz].correct) cls = 'border-green-500 bg-green-50 dark:bg-green-950/30';
                            else if (idx === selectedAnswer) cls = 'border-red-500 bg-red-50 dark:bg-red-950/30';
                          }
                          return (
                            <button key={idx} onClick={() => handleAnswer(idx)}
                              className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all flex items-center gap-2 ${cls}`}>
                              {answered && idx === quizzes[currentQuiz].correct && <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />}
                              {answered && idx === selectedAnswer && idx !== quizzes[currentQuiz].correct && <XCircle className="h-4 w-4 text-red-600 shrink-0" />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 mb-4 text-sm text-blue-800 dark:text-blue-300">
                          <span className="font-semibold">Explanation: </span>{quizzes[currentQuiz].explanation}
                        </div>
                      )}
                      <Button onClick={handleNext} disabled={!answered} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                        {currentQuiz < quizzes.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningHub;

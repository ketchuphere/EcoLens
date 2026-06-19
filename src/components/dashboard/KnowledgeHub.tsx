import React, { useState } from 'react';
import { ARTICLES, QUIZ_QUESTIONS, Article, QuizQuestion } from '../../data/sustainability';
import { Award, CheckCircle, XCircle, ChevronRight, HelpCircle, ArrowLeft, Sun, RefreshCw, Apple, Globe } from 'lucide-react';

interface KnowledgeHubProps {
  points: number;
  onAwardPoints: (pts: number) => void;
  onQuizCompleted: () => void;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({
  points: _points,
  onAwardPoints,
  onQuizCompleted
}) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSelectAnswer = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optionIdx);
  };

  const handleAnswerSubmit = (q: QuizQuestion) => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    
    setIsAnswerSubmitted(true);
    const correct = selectedAnswer === q.correctAnswer;
    
    if (correct) {
      setQuizScore(prev => prev + 1);
      onAwardPoints(q.pointsAwarded);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      onQuizCompleted();
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-stone-800" id="knowledge_hub_container">
      {/* Article Detail View Reader */}
      {activeArticle ? (
        <div className="bg-white border border-slate-200/70 rounded-[32px] p-8 shadow-xs space-y-6 font-sans">
          <button
            onClick={() => setActiveArticle(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl py-2 px-4 bg-white cursor-pointer no-print focus:outline-emerald-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hub Directory</span>
          </button>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-100 py-1 px-3 rounded-full font-mono">
              {activeArticle.category} Focus
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">{activeArticle.title}</h2>
            <p className="text-xs text-slate-400 font-medium">{activeArticle.summary}</p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed border-t border-slate-150 pt-6">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Practical Tips bullets */}
          <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-250 space-y-3">
            <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Sun className="w-4.5 h-4.5 text-amber-500 animate-spin-slow" />
              <span>Recommended Quick Actions</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-bold pl-0.5">
              {activeArticle.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs pr-1">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          {/* Left Grid: Educational pages directory */}
          <div className="lg:col-span-7 bg-white border border-slate-200/70 rounded-[32px] p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ecology Hub Library</h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Read professional scientific insights on home power grids, diet shares, and circular recycling</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ARTICLES.map(article => {
                let catColor = "bg-teal-50 border-teal-150 text-teal-700";
                let iconEl = <Globe className="w-5 h-5" />;

                if (article.category === 'energy') { catColor = "bg-amber-50 border-amber-150 text-amber-700"; iconEl = <Sun className="w-5 h-5" />; }
                else if (article.category === 'recycling') { catColor = "bg-blue-50 border-blue-150 text-blue-700"; iconEl = <RefreshCw className="w-5 h-5" />; }
                else if (article.category === 'food') { catColor = "bg-rose-50 border-rose-150 text-rose-700"; iconEl = <Apple className="w-5 h-5" />; }

                return (
                  <div
                    key={article.id}
                    onClick={() => setActiveArticle(article)}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-xs hover:border-slate-350 hover:translate-y-[-1px] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] uppercase font-extrabold py-1 px-2.5 rounded-full border font-mono ${catColor}`}>
                          {article.category}
                        </span>
                        <div className="text-slate-400">{iconEl}</div>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-xs tracking-tight line-clamp-1">{article.title}</h3>
                      <p className="text-[11px] text-slate-450 line-clamp-3 leading-relaxed font-sans">{article.summary}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-150 flex justify-between items-center text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                      <span>OPEN ARTICLE</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Spot: Quizzes */}
          <div className="lg:col-span-5 bg-white border border-slate-200/70 rounded-[32px] p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-100 flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Eco-Science Quiz</h3>
                  <p className="text-xs text-slate-400 font-medium font-sans">Test your environmental intelligence parameters</p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
              </div>

              {quizFinished ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Award className="w-9 h-9" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-800">Quiz Completed!</h4>
                    <p className="text-xs text-slate-500 font-bold font-sans">You answered {quizScore} of {QUIZ_QUESTIONS.length} correctly.</p>
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-normal font-sans pr-1">
                    By answering these correctly, you unlocked the authoritative <strong>Quiz Wizard</strong> honor badge in your profile dashboard!
                  </p>

                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="py-2.5 px-6 text-xs font-bold text-slate-800 bg-slate-100 border border-stone-200 hover:bg-slate-200 rounded-xl cursor-pointer focus:outline-emerald-600"
                  >
                    Rerun Quiz parameters
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {(() => {
                    const q = QUIZ_QUESTIONS[currentQuestionIndex];
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center font-sans">
                          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest font-mono">Question {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">{q.category}</span>
                        </div>

                        <h4 className="text-[13px] font-extrabold text-slate-800 leading-normal pl-0.5">
                          {q.question}
                        </h4>

                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswer === oIdx;
                            let optStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-350";
                            
                            if (isAnswerSubmitted) {
                              if (oIdx === q.correctAnswer) {
                                optStyle = "border-emerald-300 bg-emerald-50 text-emerald-950 font-bold hover:bg-emerald-50";
                              } else if (isSelected) {
                                optStyle = "border-rose-300 bg-rose-50 text-rose-950 font-bold hover:bg-rose-50";
                              } else {
                                optStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                              }
                            } else if (isSelected) {
                              optStyle = "border-emerald-600 bg-emerald-50/50 font-black text-emerald-950 shadow-xs";
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSelectAnswer(oIdx)}
                                className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer focus:outline-emerald-600  ${optStyle}`}
                                disabled={isAnswerSubmitted}
                              >
                                <span className="font-extrabold shrink-0 text-slate-400 font-mono">{String.fromCharCode(65 + oIdx)}.</span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {isAnswerSubmitted ? (
                          <div className="space-y-3 animate-fade-in font-sans">
                            <div className={`p-4 rounded-2xl border text-[11px] leading-relaxed ${
                              selectedAnswer === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-250 text-emerald-900 font-semibold'
                                : 'bg-rose-50 border-rose-250 text-rose-900'
                            }`}>
                              <div className="flex items-center gap-1.5 font-bold mb-1 uppercase text-[10px] tracking-wider font-mono">
                                {selectedAnswer === q.correctAnswer ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span>CORRECT ANSWER! (+{q.pointsAwarded} PTS)</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                    <span>INCORRECT ANSWER</span>
                                  </>
                                )}
                              </div>
                              <span className="pl-0.5">{q.expertExplanation}</span>
                            </div>

                            <button
                              type="button"
                              onClick={handleNextQuizQuestion}
                              className="w-full py-3 px-5 text-xs font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 cursor-pointer text-center tracking-wider focus:outline-emerald-600"
                            >
                              <span>{currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAnswerSubmit(q)}
                            disabled={selectedAnswer === null}
                            className={`w-full py-3 px-5 text-xs font-bold text-white rounded-2xl transition-all tracking-wider focus:outline-emerald-600 ${
                              selectedAnswer !== null 
                                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer' 
                                : 'bg-slate-200 cursor-not-allowed text-slate-400'
                            }`}
                          >
                            Submit Answer
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

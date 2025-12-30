import React, { useState, useEffect, useCallback } from 'react';
import { X, Play, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

type CubeLabel = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | 'FRONT' | 'BACK';
type Command = 'LEFT' | 'RIGHT' | 'FRONT' | 'BACK';

interface CubeState {
    TOP: CubeLabel;
    BOTTOM: CubeLabel;
    LEFT: CubeLabel;
    RIGHT: CubeLabel;
    FRONT: CubeLabel;
    BACK: CubeLabel;
}

const INITIAL_CUBE_STATE: CubeState = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    FRONT: 'FRONT',
    BACK: 'BACK',
};

const applyCommand = (state: CubeState, cmd: Command): CubeState => {
    const newState = { ...state };
    switch (cmd) {
        case 'LEFT':
            newState.TOP = state.RIGHT;
            newState.RIGHT = state.BOTTOM;
            newState.BOTTOM = state.LEFT;
            newState.LEFT = state.TOP;
            break;
        case 'RIGHT':
            newState.TOP = state.LEFT;
            newState.LEFT = state.BOTTOM;
            newState.BOTTOM = state.RIGHT;
            newState.RIGHT = state.TOP;
            break;
        case 'FRONT':
            newState.FRONT = state.TOP;
            newState.TOP = state.BACK;
            newState.BACK = state.BOTTOM;
            newState.BOTTOM = state.FRONT;
            break;
        case 'BACK':
            newState.FRONT = state.BOTTOM;
            newState.BOTTOM = state.BACK;
            newState.BACK = state.TOP;
            newState.TOP = state.FRONT;
            break;
    }
    return newState;
};

// Helper to find where a face moved
const findPositionOfLabel = (state: CubeState, label: CubeLabel): CubeLabel => {
    if (state.TOP === label) return 'TOP';
    if (state.BOTTOM === label) return 'BOTTOM';
    if (state.LEFT === label) return 'LEFT';
    if (state.RIGHT === label) return 'RIGHT';
    if (state.FRONT === label) return 'FRONT';
    if (state.BACK === label) return 'BACK';
    return 'TOP';
};

interface PracticeModeProps {
    onExit: () => void;
    tier: 'FREE' | 'PRO' | 'GUEST';
    onShowProModal: () => void;
    showSuccessModal?: boolean;
    onCloseSuccessModal?: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({ 
    onExit, 
    tier, 
    showSuccessModal = false,
    onCloseSuccessModal
}) => {
    const { user } = useAuth();
    const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
    const [step, setStep] = useState<'START' | 'COMMAND' | 'QUESTION' | 'FEEDBACK' | 'RESULTS'>('START');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [startFace, setStartFace] = useState<CubeLabel>('RIGHT');
    const [commands, setCommands] = useState<Command[]>(['LEFT']);
    const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<CubeLabel | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<CubeLabel>('TOP');
    const [timeLeft, setTimeLeft] = useState(3);
    const [blurredIndices, setBlurredIndices] = useState<number[]>([]);
    
    // Stats State
    const [stats, setStats] = useState({
        phase1: { correct: 0, wrong: 0 },
        phase2: { correct: 0, wrong: 0 },
        phase3: { correct: 0, wrong: 0 },
        phase4: { correct: 0, wrong: 0 },
        wrongCommands: {} as Record<Command, number>
    });

    // Track previous question to prevent consecutive duplicates
    const lastQuestionRef = React.useRef<{ startFace: CubeLabel, commands: Command[] } | null>(null);
    const justSwitchedRef = React.useRef(false);

    const handleUpgrade = async () => {
        if (!user) {
            toast.error('Lütfen önce giriş yapın');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    userEmail: user.email,
                    returnUrl: window.location.href,
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error('Ödeme sayfası oluşturulamadı');
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            toast.error('Bir hata oluştu');
        }
    };

    // Total questions logic
    const getTotalQuestions = useCallback(() => {
        if (phase === 1) return 5;
        if (phase === 2) return tier === 'PRO' ? 10 : 5;
        if (phase === 3) return 10;
        if (phase === 4) return 10;
        return 5;
    }, [phase, tier]);

    const totalQuestions = getTotalQuestions();

    const getCommandDuration = useCallback(() => {
        if (phase === 3) return 1500;
        if (phase === 4) return 1000;
        return 3000; // Phase 1 & 2 default
    }, [phase]);

    const startNewQuestion = useCallback(() => {
        const faces: CubeLabel[] = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT', 'FRONT', 'BACK'];
        const possibleCommands: Command[] = ['LEFT', 'RIGHT', 'FRONT', 'BACK'];
        
        let newStartFace: CubeLabel;
        let newCommands: Command[];
        let commandCount = 1;

        if (phase === 2) {
            // PRO: 3 questions 2 commands, 7 questions 3 commands (Total 10)
            // FREE: 3 questions 2 commands, 2 questions 3 commands (Total 5)
            commandCount = questionIndex < 3 ? 2 : 3;
        } else if (phase === 3) {
            // 4 or 5 commands randomly
            commandCount = Math.random() > 0.5 ? 4 : 5;
        } else if (phase === 4) {
            // 6-8 commands randomly
            commandCount = Math.floor(Math.random() * 3) + 6; // 6, 7, 8
        }

        // Ensure new question is not the same as the last one
        do {
            newStartFace = faces[Math.floor(Math.random() * faces.length)];
            newCommands = Array.from({ length: commandCount }, () => possibleCommands[Math.floor(Math.random() * possibleCommands.length)]);
        } while (
            lastQuestionRef.current && 
            lastQuestionRef.current.startFace === newStartFace && 
            JSON.stringify(lastQuestionRef.current.commands) === JSON.stringify(newCommands)
        );
        
        // Update ref
        lastQuestionRef.current = { startFace: newStartFace, commands: newCommands };

        // Calculate blurred indices
        const newBlurredIndices: number[] = [];
        if (phase === 2) {
             // 3-command question (last of P2 or some random ones starting from index 0 of P2 which is question 6 overall)
             // Phase 2 always starts at Q6.
             // "3 komutlu son soru" -> questionIndex === totalQuestions - 1 (if commandCount is 3)
             // "6. sorudan itibaren" -> In Phase 2 context, this is all questions. 
             // Logic: If commandCount is 3, chance to blur. Last question definitely blur.
             if (commandCount === 3) {
                 const isLastQuestion = questionIndex === totalQuestions - 1;
                 if (isLastQuestion || Math.random() > 0.5) {
                     // Blur 1 random image
                     newBlurredIndices.push(Math.floor(Math.random() * commandCount));
                 }
             }
        } else if (phase === 3) {
            // Always 2 blurred images, except last 2 questions (no images)
            // Last 2 questions logic handled in render
            if (questionIndex < 8) { // 0-7 (First 8 questions)
                 while (newBlurredIndices.length < 2) {
                     const idx = Math.floor(Math.random() * commandCount);
                     if (!newBlurredIndices.includes(idx)) {
                         newBlurredIndices.push(idx);
                     }
                 }
            }
        }
        // Phase 4: No images shown, so blurring doesn't matter much but good to keep empty

        setStartFace(newStartFace);
        setCommands(newCommands);
        setCurrentCommandIndex(0);
        setBlurredIndices(newBlurredIndices);
        
        // Set initial time based on phase
        const duration = getCommandDuration();
        setTimeLeft(duration / 1000); // Convert to seconds for display logic if needed, but existing logic uses 3s base.
        // Wait, existing logic uses `setTimeLeft(3)` hardcoded and decrements by 0.1 every 100ms.
        // If we want 1500ms, we should set time left to 1.5.
        
        let currentState = { ...INITIAL_CUBE_STATE };
        newCommands.forEach(cmd => {
            currentState = applyCommand(currentState, cmd);
        });
        
        const newPos = findPositionOfLabel(currentState, newStartFace);
        setCorrectAnswer(newPos);
        
        setStep('START');
        setUserAnswer(null);
    }, [phase, questionIndex, totalQuestions, getCommandDuration]);

    useEffect(() => {
        const timer = setTimeout(() => {
            startNewQuestion();
        }, 0);
        return () => clearTimeout(timer);
    }, [phase, questionIndex, startNewQuestion]);

    // Timer for Command Step
    useEffect(() => {
        if (step !== 'COMMAND') return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0.1) {
                    // Time's up for current command
                    if (!justSwitchedRef.current) {
                        justSwitchedRef.current = true;
                        if (currentCommandIndex < commands.length - 1) {
                            setCurrentCommandIndex(curr => curr + 1);
                            return 3;
                        } else {
                            clearInterval(timer);
                            setStep('QUESTION');
                            return 0;
                        }
                    }
                    return prev;
                }
                const next = prev - 0.1;
                return next < 0 ? 0 : next;
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, [step, currentCommandIndex, commands.length]); // commands.length is stable during command phase

    useEffect(() => {
        if (step !== 'COMMAND') return;
        const duration = getCommandDuration();
        const t = setTimeout(() => setTimeLeft(duration / 1000), 0);
        justSwitchedRef.current = false;
        return () => clearTimeout(t);
    }, [step, currentCommandIndex, getCommandDuration]);

    const handleAnswer = (answer: CubeLabel) => {
        setUserAnswer(answer);
        
        // Update Stats
        const isCorrect = answer === correctAnswer;
        setStats(prev => {
            const newStats = { ...prev };
            
            // Phase Stats
            if (phase === 1) {
                if (isCorrect) newStats.phase1.correct++;
                else newStats.phase1.wrong++;
            } else if (phase === 2) {
                if (isCorrect) newStats.phase2.correct++;
                else newStats.phase2.wrong++;
            } else if (phase === 3) {
                if (isCorrect) newStats.phase3.correct++;
                else newStats.phase3.wrong++;
            } else {
                if (isCorrect) newStats.phase4.correct++;
                else newStats.phase4.wrong++;
            }

            // Wrong Command Stats (if incorrect)
            if (!isCorrect) {
                commands.forEach(cmd => {
                    newStats.wrongCommands[cmd] = (newStats.wrongCommands[cmd] || 0) + 1;
                });
            }

            return newStats;
        });

        setStep('FEEDBACK');
        
        if (isCorrect) {
            // Correct - Auto advance after delay
            setTimeout(() => {
                nextQuestion();
            }, 1000);
        }
    };

    const nextQuestion = () => {
        if (questionIndex + 1 < totalQuestions) {
            setQuestionIndex(prev => prev + 1);
        } else {
            // End of current Phase
            if (phase === 1) {
                toast.success("Faz 1 Tamamlandı! Faz 2'ye geçiliyor...");
                setTimeout(() => {
                    setPhase(2);
                    setQuestionIndex(0);
                }, 1500);
            } else if (phase === 2) {
                if (tier === 'FREE') {
                     // Show Results Screen instead of Pro Modal directly
                     setStep('RESULTS');
                } else {
                    toast.success("Faz 2 Tamamlandı! Faz 3'e geçiliyor...");
                    setTimeout(() => {
                        setPhase(3);
                        setQuestionIndex(0);
                    }, 1500);
                }
            } else if (phase === 3) {
                toast.success("Faz 3 Tamamlandı! Faz 4'e geçiliyor...");
                setTimeout(() => {
                    setPhase(4);
                    setQuestionIndex(0);
                }, 1500);
            } else {
                toast.success("Tebrikler! Practice Mode Tamamlandı!");
                setStep('RESULTS');
            }
        }
    };

    const getMostWrongCommand = () => {
        let max = 0;
        let cmd = '-';
        Object.entries(stats.wrongCommands).forEach(([key, val]) => {
            if (val > max) {
                max = val;
                cmd = key;
            }
        });
        return cmd;
    };

    const renderResults = () => {
        const p1Total = stats.phase1.correct + stats.phase1.wrong;
        const p2Total = stats.phase2.correct + stats.phase2.wrong;
        const p3Total = stats.phase3.correct + stats.phase3.wrong;
        const p4Total = stats.phase4.correct + stats.phase4.wrong;
        
        const p1Success = p1Total > 0 ? Math.round((stats.phase1.correct / p1Total) * 100) : 0;
        const p2Success = p2Total > 0 ? Math.round((stats.phase2.correct / p2Total) * 100) : 0;
        const p3Success = p3Total > 0 ? Math.round((stats.phase3.correct / p3Total) * 100) : 0;
        const p4Success = p4Total > 0 ? Math.round((stats.phase4.correct / p4Total) * 100) : 0;
        
        const totalGames = 1; // Session based for now

        // Calculate Total Score if Phase 4 is done
        const grandTotal = p1Total + p2Total + p3Total + p4Total;
        const grandCorrect = stats.phase1.correct + stats.phase2.correct + stats.phase3.correct + stats.phase4.correct;
        const grandSuccess = grandTotal > 0 ? Math.round((grandCorrect / grandTotal) * 100) : 0;

        return (
            <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-300 p-8">
                <h2 className="text-4xl font-bold text-white text-center mb-8">
                    {phase === 4 ? 'Tüm Sonuçlar' : 'Sonuçlar'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Stats Card */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                        {phase !== 4 && <div className="text-gray-400 mb-4">Bu oyunu <span className="text-white font-bold">{totalGames}</span>. kez oynadınız.</div>}
                        {phase === 4 && (
                            <div className="mb-6 p-4 bg-gray-700/50 rounded-xl text-center border border-gray-600">
                                <h3 className="text-lg text-gray-300 mb-1">GENEL BAŞARI</h3>
                                <div className="text-4xl font-black text-green-400">%{grandSuccess}</div>
                                <div className="text-sm text-gray-400 mt-1">{grandCorrect}/{grandTotal} Doğru</div>
                            </div>
                        )}
                        
                        <div className="space-y-6">
                            {/* Phase 1 Stats */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-xl font-bold text-blue-400">FAZ 1</h3>
                                    <span className="text-2xl font-bold text-green-400">%{p1Success}</span>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> {stats.phase1.correct} Doğru</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> {stats.phase1.wrong} Yanlış</span>
                                </div>
                                <div className="w-full h-3 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${p1Success}%` }}></div>
                                </div>
                            </div>

                            {/* Phase 2 Stats */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-xl font-bold text-purple-400">FAZ 2</h3>
                                    <span className="text-2xl font-bold text-green-400">%{p2Success}</span>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> {stats.phase2.correct} Doğru</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> {stats.phase2.wrong} Yanlış</span>
                                </div>
                                <div className="w-full h-3 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-purple-500" style={{ width: `${p2Success}%` }}></div>
                                </div>
                            </div>

                            {/* Phase 3 Stats */}
                            {phase >= 3 && (
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-xl font-bold text-yellow-400">FAZ 3</h3>
                                        <span className="text-2xl font-bold text-green-400">%{p3Success}</span>
                                    </div>
                                    <div className="flex gap-4 text-sm text-gray-300">
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> {stats.phase3.correct} Doğru</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> {stats.phase3.wrong} Yanlış</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-yellow-500" style={{ width: `${p3Success}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Phase 4 Stats */}
                            {phase === 4 && (
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-xl font-bold text-red-500">FAZ 4</h3>
                                        <span className="text-2xl font-bold text-green-400">%{p4Success}</span>
                                    </div>
                                    <div className="flex gap-4 text-sm text-gray-300">
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> {stats.phase4.correct} Doğru</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> {stats.phase4.wrong} Yanlış</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-red-600" style={{ width: `${p4Success}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Most Wrong Command */}
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                                <div className="text-gray-400 text-sm mb-1">EN çok HATA yapılan komut</div>
                                <div className="text-2xl font-bold text-red-400">{getMostWrongCommand()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Pro Teaser Cards or Exam Mode Prompt */}
                    <div className="space-y-4">
                        {tier === 'FREE' && phase === 2 && (
                            <>
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 opacity-75 relative overflow-hidden group">
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PRO</div>
                                    <h3 className="text-xl font-bold text-white mb-2">FAZ 3</h3>
                                    <p className="text-gray-400">4 ve daha fazla komut ile ileri seviye rotasyon pratikleri.</p>
                                </div>

                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 opacity-75 relative overflow-hidden group">
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PRO</div>
                                    <h3 className="text-xl font-bold text-white mb-2">FAZ 4</h3>
                                    <p className="text-gray-400">Gerçek sınav koşullarında süre sınırlı simülasyon modu.</p>
                                </div>
                                
                                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-2xl p-6 text-center">
                                    <p className="text-yellow-200 mb-4">Bu modlara erişmek için Pro Üyelik gereklidir.</p>
                                    <button 
                                        onClick={handleUpgrade}
                                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                                    >
                                        PRO Üyeliğe Geç
                                    </button>
                                </div>
                            </>
                        )}

                        {phase === 4 && (
                            <div className="bg-green-600/20 border border-green-500 rounded-2xl p-8 text-center animate-pulse-slow">
                                <h3 className="text-2xl font-bold text-white mb-4">Hazırsın!</h3>
                                <p className="text-gray-300 mb-6">
                                    Tüm pratik modlarını tamamladın. Artık gerçek sınav simülasyonu için EXAM MODE'a geçebilirsin.
                                </p>
                                <button 
                                    onClick={onExit}
                                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Play size={24} />
                                    EXAM MODE'a Geç
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    type GifFrame = { cmd: Command; pre: CubeLabel; dest: CubeLabel | 'ANY' };
    const getGifFrames = useCallback((): GifFrame[] => {
        const frames: GifFrame[] = [];
        let currentState = { ...INITIAL_CUBE_STATE };
        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            const pre = findPositionOfLabel(currentState, startFace);
            const nextState = applyCommand(currentState, cmd);
            const post = findPositionOfLabel(nextState, startFace);
            const dest: CubeLabel | 'ANY' = post === pre ? 'ANY' : post;
            frames.push({ cmd, pre, dest });
            currentState = nextState;
        }
        return frames;
    }, [commands, startFace]);

    

    return (
        <div className="fixed inset-0 bg-[#1a1a1a] z-[100] flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
                <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                </button>
                <div className="text-xl font-bold">FAZ {phase} - Soru {questionIndex + 1}/{totalQuestions}</div>
                <div className="w-10"></div>
            </div>

            <div className="max-w-6xl w-full flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300 h-full justify-center">
                
                {step === 'RESULTS' && renderResults()}

                {/* START STEP */}
                {step === 'START' && (
                    <div className="text-center space-y-8">
                        <h2 className="text-4xl font-bold text-white">Başlangıç Yüzü:</h2>
                        <div className="text-6xl font-black text-blue-400">{startFace}</div>
                        <p className="text-gray-400 text-xl">Bu yüzü aklında tut!</p>
                        <button 
                            onClick={() => setStep('COMMAND')}
                            className="px-12 py-4 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-2xl transition-all hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
                        >
                            <Play size={28} />
                            Hazırım
                        </button>
                    </div>
                )}

                {/* COMMAND STEP */}
                {step === 'COMMAND' && (
                    <div className="text-center space-y-6 relative">
                        <h2 className="text-4xl font-bold text-white">
                            Komut {commands.length > 1 ? `(${Math.min(currentCommandIndex + 1, commands.length)}/${commands.length})` : ''}: 
                            <span className="text-yellow-400 ml-2">
                                {(() => {
                                    const frames = getGifFrames();
                                    const idx = Math.min(currentCommandIndex, frames.length - 1);
                                    return frames[idx]?.cmd ?? '';
                                })()}
                            </span>
                        </h2>
                        
                        <div className="relative w-96 h-96 bg-gray-800 rounded-xl overflow-hidden border-4 border-gray-700 mx-auto">
                            {(() => {
                                const frames = getGifFrames();
                                const idx = Math.min(currentCommandIndex, frames.length - 1);
                                const f = frames[idx];
                                const file = `/Cube Anime/${f.cmd}-${f.pre}-${f.dest}.gif`;
                                return <img src={file} alt={`${f.cmd}-${f.pre}-${f.dest}`} className="w-full h-full object-contain" />;
                            })()}
                            {/* Timer Bar */}
                            <div className="absolute bottom-0 left-0 h-2 bg-yellow-500 transition-all duration-100 ease-linear" style={{ width: `${(timeLeft / 3) * 100}%` }} />
                        </div>
                    </div>
                )}

                {/* QUESTION & FEEDBACK STEPS */}
                {(step === 'QUESTION' || step === 'FEEDBACK') && (
                    <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center h-full max-h-[80vh]">
                        {/* Image Stack / Grid */}
                        <div className={`
                            max-h-full p-2 no-scrollbar transition-all duration-300
                            ${phase === 3 
                                ? `grid gap-4 content-center justify-center ${commands.length === 5 ? 'grid-cols-3' : 'grid-cols-2'}`
                                : 'flex flex-col gap-4 overflow-y-auto'
                            }
                        `}>
                            {(() => {
                                // Phase 4 or Last 2 questions of Phase 3: No images unless feedback wrong
                                const hideImagesInitially = phase === 4 || (phase === 3 && questionIndex >= 8);
                                const showImages = !hideImagesInitially || (step === 'FEEDBACK' && userAnswer !== correctAnswer);

                                if (!showImages) {
                                    return (
                                        <div className="flex flex-col items-center justify-center w-64 h-64 bg-gray-800/50 rounded-xl border-4 border-gray-700/50 text-gray-500">
                                            <div className="text-4xl font-bold mb-2">?</div>
                                            <div className="text-sm">Görseller Gizli</div>
                                        </div>
                                    );
                                }

                                const frames = getGifFrames();
                                return frames.map((f, idx) => {
                                    const file = `/Cube Anime/${f.cmd}-${f.pre}-${f.dest}.gif`;
                                    
                                    // Blur logic
                                    // If Phase 2 or 3, apply blur to specific indices
                                    // If Feedback and wrong answer, remove blur
                                    const isBlurred = blurredIndices.includes(idx) && !(step === 'FEEDBACK' && userAnswer !== correctAnswer);
                                    
                                    return (
                                        <div key={idx} className={`
                                            relative bg-gray-800 rounded-xl overflow-hidden border-4 border-gray-700 flex-shrink-0 transition-all duration-300
                                            ${phase === 3 ? 'w-48 h-48' : 'w-64 h-64'}
                                        `}>
                                            <img 
                                                src={file} 
                                                alt={`${f.cmd}-${f.pre}-${f.dest}`} 
                                                className={`w-full h-full object-contain transition-all duration-300 ${isBlurred ? 'blur-md scale-110' : ''}`} 
                                            />
                                            <div className="absolute bottom-2 left-0 right-0 text-center bg-black/50 text-white text-sm py-1 font-bold z-10">
                                                {idx + 1}. Komut: {f.cmd} ➝ {f.dest}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>

                        {/* Question & Options */}
                        <div className="flex-1 flex flex-col items-center space-y-6">
                            <h2 className="text-3xl font-bold text-white text-center">
                                <span className="text-blue-400">{startFace}</span> yüzü şimdi nerede?
                            </h2>

                            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                {(['TOP', 'BOTTOM', 'LEFT', 'RIGHT', 'FRONT', 'BACK'] as CubeLabel[]).map((pos) => {
                                    let btnClass = "h-20 rounded-xl text-lg font-bold transition-all duration-200 border-4 ";
                                    
                                    if (step === 'FEEDBACK') {
                                        if (pos === correctAnswer) {
                                            btnClass += "bg-green-600 border-green-400 text-white scale-105";
                                        } else if (pos === userAnswer) {
                                            btnClass += "bg-red-600 border-red-400 text-white opacity-50";
                                        } else {
                                            btnClass += "bg-gray-800 border-gray-700 text-gray-500 opacity-30";
                                        }
                                    } else {
                                        btnClass += "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-blue-500 hover:scale-105";
                                    }

                                    return (
                                        <button
                                            key={pos}
                                            onClick={() => handleAnswer(pos)}
                                            disabled={step === 'FEEDBACK'}
                                            className={btnClass}
                                        >
                                            {pos}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback Message */}
                            {step === 'FEEDBACK' && userAnswer !== correctAnswer && (
                                <div className="bg-red-900/50 border border-red-500/50 p-4 rounded-xl text-center animate-in fade-in slide-in-from-bottom-4">
                                    <p className="text-white text-lg font-bold mb-2">Yanlış!</p>
                                    <p className="text-red-200">
                                        {startFace === correctAnswer 
                                            ? `${commands.join(', ')} komutları sonunda ${startFace} yüzü ${correctAnswer} konumunda kalır.`
                                            : `${commands.join(', ')} komutları sonunda ${startFace} yüzü ${correctAnswer} konumuna gelir.`
                                        }
                                    </p>
                                    <button 
                                        onClick={nextQuestion}
                                        className="mt-4 px-6 py-2 bg-white text-red-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Devam Et
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-gray-800 border border-green-500/50 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden animate-in zoom-in duration-300">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-400" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2">Ödeme Başarılı!</h2>
                        <p className="text-gray-300 mb-8">
                            Pro üyeliğiniz aktif edildi. Tüm modüller ve ileri seviye pratikler açıldı.
                        </p>

                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    setPhase(2);
                                    setQuestionIndex(0);
                                    setStep('START');
                                    onCloseSuccessModal?.();
                                }}
                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <Play size={20} />
                                Kaldığım Yerden Devam Et (Soru 6)
                            </button>

                            <button 
                                onClick={onExit}
                                className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all hover:scale-105"
                            >
                                Ana Menüye Dön
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

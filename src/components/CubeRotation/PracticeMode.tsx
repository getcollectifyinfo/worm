import React, { useState, useEffect, useCallback } from 'react';
import { X, Play } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

export const PracticeMode: React.FC<PracticeModeProps> = ({ onExit, tier, onShowProModal }) => {
    const [phase, setPhase] = useState<1 | 2>(1);
    const [step, setStep] = useState<'START' | 'COMMAND' | 'QUESTION' | 'FEEDBACK'>('START');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [startFace, setStartFace] = useState<CubeLabel>('RIGHT');
    const [commands, setCommands] = useState<Command[]>(['LEFT']);
    const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<CubeLabel | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<CubeLabel>('TOP');
    const [timeLeft, setTimeLeft] = useState(3);

    // Track previous question to prevent consecutive duplicates
    const lastQuestionRef = React.useRef<{ startFace: CubeLabel, commands: Command[] } | null>(null);

    // Total questions logic
    const getTotalQuestions = useCallback(() => {
        if (phase === 1) return 5;
        // Phase 2: PRO gets 10, FREE gets 5 (modal trigger handled in nextQuestion)
        return tier === 'PRO' ? 10 : 5;
    }, [phase, tier]);

    const totalQuestions = getTotalQuestions();

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

        setStartFace(newStartFace);
        setCommands(newCommands);
        setCurrentCommandIndex(0);
        setTimeLeft(3);
        
        let currentState = { ...INITIAL_CUBE_STATE };
        newCommands.forEach(cmd => {
            currentState = applyCommand(currentState, cmd);
        });
        
        const newPos = findPositionOfLabel(currentState, newStartFace);
        setCorrectAnswer(newPos);
        
        setStep('START');
        setUserAnswer(null);
    }, [phase, questionIndex]);

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
                    if (currentCommandIndex < commands.length - 1) {
                        setCurrentCommandIndex(curr => curr + 1);
                        return 3; // Reset for next command
                    } else {
                        // All commands done
                        clearInterval(timer);
                        setStep('QUESTION');
                        return 0;
                    }
                }
                return prev - 0.1; 
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, [step, currentCommandIndex, commands.length]); // commands.length is stable during command phase

    useEffect(() => {
        if (step !== 'COMMAND') return;
        const t = setTimeout(() => setTimeLeft(3), 0);
        return () => clearTimeout(t);
    }, [step, currentCommandIndex]);

    const handleAnswer = (answer: CubeLabel) => {
        setUserAnswer(answer);
        setStep('FEEDBACK');
        
        if (answer === correctAnswer) {
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
                    // startNewQuestion will be triggered by useEffect dependency on phase/questionIndex
                }, 1500);
            } else {
                // Phase 2 Ends
                if (tier === 'FREE') {
                     // Trigger Pro Modal
                     onShowProModal();
                } else {
                    toast.success("Tebrikler! Practice Mode Tamamlandı!");
                    onExit();
                }
            }
        }
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
                            <span className="text-yellow-400 ml-2">{commands[currentCommandIndex] || ''}</span>
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
                        {/* Image Stack */}
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-full p-2 no-scrollbar">
                            {(() => {
                                const frames = getGifFrames();
                                return frames.map((f, idx) => {
                                    const file = `/Cube Anime/${f.cmd}-${f.pre}-${f.dest}.gif`;
                                    return (
                                        <div key={idx} className="relative w-64 h-64 bg-gray-800 rounded-xl overflow-hidden border-4 border-gray-700 flex-shrink-0">
                                            <img src={file} alt={`${f.cmd}-${f.pre}-${f.dest}`} className="w-full h-full object-contain" />
                                            <div className="absolute bottom-2 left-0 right-0 text-center bg-black/50 text-white text-sm py-1 font-bold">
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
        </div>
    );
};

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  Mail,
  MessageSquare,
  PhoneCall,
  Globe,
  FileCode,
  Key,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  ShieldCheck as ShieldIcon,
  Activity,
  Terminal,
  Wifi,
} from 'lucide-react';
import hackerHeroImg from '../../assets/images/cyber_hacker_hero_1789905393541.jpg';
import {
  HuntQuestion,
  getQuestionsForRound,
  evaluateQuestionAnswer,
  getQuestionDebrief,
} from '../../data/huntQuestions';
import { Team } from '../../types';
import { cyberAudio } from '../../utils/cyberAudio';

interface HuntRoundRunnerProps {
  roundNumber: 1 | 2 | 3 | 4;
  team: Team;
  isReadOnly?: boolean;
  onComplete: (score: number, details: Record<string, unknown>) => void;
}

export const HuntRoundRunner: React.FC<HuntRoundRunnerProps> = ({
  roundNumber,
  team,
  isReadOnly = false,
  onComplete,
}) => {
  const questions = useMemo(() => getQuestionsForRound(roundNumber), [roundNumber]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Load existing answers if any from team progress
  const existingProgress = (team?.roundProgress?.[roundNumber] as unknown) as Record<string, unknown> | undefined;
  const initialAnswers = (existingProgress?.answers as Record<string, string>) || {};
  const isRoundAlreadyCompleted = team?.roundProgress?.[roundNumber]?.completed || false;

  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  // Tracks individual question submission status
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    if (isRoundAlreadyCompleted || isReadOnly) {
      questions.forEach((q) => {
        map[q.id] = true;
      });
    } else {
      // If answers were previously submitted in this session
      Object.keys(initialAnswers).forEach((qid) => {
        if (initialAnswers[qid]?.trim()) {
          map[qid] = true;
        }
      });
    }
    return map;
  });

  const [roundSubmitted, setRoundSubmitted] = useState(isRoundAlreadyCompleted);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);

  const currentQ = questions[activeIdx] || questions[0];
  const isQuestionSubmitted = submittedMap[currentQ.id] || isReadOnly || roundSubmitted;

  // Real-time evaluation of all questions in this round
  const evaluationResults = useMemo(() => {
    const results: Record<string, ReturnType<typeof evaluateQuestionAnswer>> = {};
    questions.forEach((q) => {
      const ans = answers[q.id] || '';
      results[q.id] = evaluateQuestionAnswer(q, ans);
    });
    return results;
  }, [questions, answers]);

  // Calculate live round score based only on submitted questions (or all if round completed)
  const totalRoundScore = useMemo(() => {
    let sum = 0;
    questions.forEach((q) => {
      if (submittedMap[q.id] || roundSubmitted) {
        const res = evaluationResults[q.id];
        if (res && answers[q.id]?.trim()) {
          sum += res.score;
        }
      }
    });
    return Math.max(0, sum);
  }, [questions, evaluationResults, answers, submittedMap, roundSubmitted]);

  // Max potential score for this round
  const maxRoundScore = useMemo(() => {
    return questions.reduce((acc, q) => acc + q.correctPoints, 0);
  }, [questions]);

  // Total questions submitted
  const submittedQuestionsCount = useMemo(() => {
    return questions.filter((q) => submittedMap[q.id] && !!answers[q.id]?.trim()).length;
  }, [questions, submittedMap, answers]);

  // Direct typing
  const handleAnswerChange = (val: string) => {
    if (isQuestionSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  // Submit single question answer with cyber forensic analysis sequence
  const handleSubmitAnswer = () => {
    if (isQuestionSubmitted || isAnalyzing) return;
    const trimmed = (answers[currentQ.id] || '').trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setAnalyzingStep(0);
    cyberAudio.click();

    setTimeout(() => {
      setAnalyzingStep(1);
    }, 240);

    setTimeout(() => {
      setAnalyzingStep(2);
    }, 480);

    setTimeout(() => {
      const evalResult = evaluationResults[currentQ.id];
      if (evalResult?.isCorrect) {
        cyberAudio.accessGranted();
      } else {
        cyberAudio.warning();
      }

      setSubmittedMap((prev) => ({
        ...prev,
        [currentQ.id]: true,
      }));
      setIsAnalyzing(false);
    }, 720);
  };

  // Move to next question
  const handleContinueNext = () => {
    cyberAudio.click();
    if (activeIdx < questions.length - 1) {
      setActiveIdx((prev) => prev + 1);
    }
  };

  // Final round submission
  const handleSubmitRound = () => {
    if (roundSubmitted || isReadOnly) return;
    cyberAudio.accessGranted();
    setRoundSubmitted(true);
    onComplete(totalRoundScore, {
      answers,
      evaluationResults,
      completedAt: Date.now(),
      submittedQuestionsCount,
      totalQuestions: questions.length,
    });
  };

  // Type-specific icon
  const getScenarioIcon = (type: HuntQuestion['type']) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="w-5 h-5 text-red-400" />;
      case 'CHAT':
        return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'CALL':
        return <PhoneCall className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'BROWSER':
        return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'DOCUMENT':
        return <FileCode className="w-5 h-5 text-red-400" />;
      case 'OAUTH':
        return <Key className="w-5 h-5 text-purple-400" />;
      case 'AUTHENTICATOR':
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'FINAL_ATTACK':
        return <AlertOctagon className="w-5 h-5 text-red-500 animate-bounce" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
    }
  };

  const currentEval = evaluationResults[currentQ.id];
  const currentAnswer = answers[currentQ.id] || '';
  const currentDebrief = getQuestionDebrief(currentQ);
  const allQuestionsSubmitted = questions.every((q) => submittedMap[q.id]);
  const isFinalAttack = currentQ.type === 'FINAL_ATTACK' || currentQ.questionNumber === 25;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in font-chakra">
      
      {/* Background Cyber HUD Layer & Faint Hacker Silhouette */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isFinalAttack && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Glowing Red Silhouette Backlight */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.35)_0%,transparent_70%)] blur-[60px] animate-pulse" />
            <img
              src={hackerHeroImg}
              alt="Adversary In Shadow"
              referrerPolicy="no-referrer"
              className="w-full max-w-2xl object-contain opacity-50 filter contrast-140 brightness-110 drop-shadow-[0_0_40px_#ef4444] drop-shadow-[0_0_70px_#dc2626] animate-red-rim-pulse"
            />
          </div>
        )}
        <div className={`scanlines absolute inset-0 pointer-events-none ${isFinalAttack ? 'opacity-35' : 'opacity-15'}`} />
        <div
          className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent shadow-[0_0_15px_#ef4444] pointer-events-none ${
            isFinalAttack ? 'animate-scanline-sweep' : ''
          }`}
          style={{ animationDuration: isFinalAttack ? '1.1s' : '2.5s' }}
        />
      </div>

      {/* MANDATED FINAL ATTACK CRITICAL ALERT BANNER */}
      {isFinalAttack && (
        <div className="relative z-10 p-4 rounded-xl bg-red-950/80 border-2 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.75)] font-mono text-xs text-red-200 corner-bracket-tl corner-bracket-br animate-cyber-glitch">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-red-800 pb-2.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="font-orbitron font-black text-sm text-white tracking-widest uppercase text-glow-red">
                &gt; ⚠ CRITICAL ALERT // ADVERSARY ACTIVE BREACH
              </span>
            </div>
            <div className="px-2.5 py-0.5 rounded bg-red-600 text-black font-orbitron font-bold text-[10px] tracking-wider uppercase shadow-[0_0_10px_#ef4444]">
              THREAT LEVEL: CRITICAL
            </div>
          </div>
          <div className="space-y-1 text-xs text-red-300 pl-2">
            <div>&gt; ⚠ MULTIPLE ACCOUNTS COMPROMISED</div>
            <div>&gt; SUSPICIOUS OAUTH ACTIVITY DETECTED</div>
            <div>&gt; CONTAINMENT PROTOCOL REQUIRED</div>
          </div>
        </div>
      )}

      {/* Top Banner & Telemetry Bar */}
      <div className="bg-[#09090b] rounded-xl border border-red-900/80 p-5 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-red-950 border border-red-800 text-red-400 font-mono text-xs font-bold uppercase tracking-widest">
                STAGE 0{roundNumber} // FORENSIC INVESTIGATION
              </span>
              <span className="text-zinc-500 font-mono text-xs">
                {currentQ.difficulty}
              </span>
            </div>
            <h1 className="font-orbitron font-bold text-2xl sm:text-3xl text-white tracking-wide uppercase">
              ROUND {roundNumber} — <span className="text-red-500">{roundNumber === 1 ? 'EASY' : roundNumber === 2 ? 'MEDIUM' : roundNumber === 3 ? 'MEDIUM → HARD' : 'HARD / FINAL'}</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Independently inspect each realistic scenario. Identify the suspicious mistakes without hints.
            </p>
          </div>

          {/* Points Meter */}
          <div className="flex items-center gap-4 bg-black/80 px-4 py-2.5 rounded-lg border border-red-950">
            <div className="text-right">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">ROUND SCORE</div>
              <div className="font-orbitron font-black text-xl text-red-400">
                {totalRoundScore} <span className="text-xs text-zinc-600 font-normal">/ {maxRoundScore} PTS</span>
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-right">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">ANSWERED</div>
              <div className="font-orbitron font-bold text-base text-zinc-200">
                {submittedQuestionsCount} / {questions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Question Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-zinc-900 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {questions.map((q, idx) => {
            const isSub = submittedMap[q.id];
            const isActive = idx === activeIdx;
            const evalState = evaluationResults[q.id];

            return (
              <button
                key={q.id}
                onClick={() => {
                  cyberAudio.click();
                  setActiveIdx(idx);
                }}
                className={`py-2 px-3 rounded text-left transition-all border font-mono text-xs flex flex-col justify-between ${
                  isActive
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.7)]'
                    : isSub
                    ? evalState?.isCorrect
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:bg-emerald-950/70'
                      : 'bg-red-950/30 text-red-300 border-red-900/60 hover:bg-red-950/60'
                    : 'bg-black/60 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Q{q.questionNumber}</span>
                  {isSub && (
                    <span className="text-[11px] font-bold">
                      {evalState?.isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <span className="text-[10px] opacity-80 truncate">
                  {isSub ? (evalState?.score > 0 ? `+${evalState.score}` : `${evalState?.score}`) + ' PTS' : `+${q.correctPoints} / ${q.wrongPenalty}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Realistic Threat Artifact Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-[#09090b] rounded-xl border border-red-900/60 p-5 shadow-lg space-y-4">
            
            {/* Artifact Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-black border border-red-900">
                  {getScenarioIcon(currentQ.type)}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    TARGET EVIDENCE ARTIFACT // {currentQ.type}
                  </span>
                  <h2 className="font-orbitron font-bold text-lg text-white">
                    Q{currentQ.questionNumber} — {currentQ.title}
                  </h2>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  +{currentQ.correctPoints} / {currentQ.wrongPenalty} PTS
                </span>
              </div>
            </div>

            {/* Specialized Artifact Visualizer */}
            <div className="bg-black rounded-lg border border-zinc-800 overflow-hidden font-mono text-xs">
              
              {/* EMAIL CLIENT VIEW */}
              {currentQ.type === 'EMAIL' && (
                <div className="p-4 space-y-3">
                  <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-1.5 text-zinc-300">
                    {currentQ.artifact.from && (
                      <div>
                        <span className="text-zinc-500 font-semibold">From: </span>
                        <span className="text-white">{currentQ.artifact.from}</span>
                      </div>
                    )}
                    {currentQ.artifact.sender && (
                      <div>
                        <span className="text-zinc-500 font-semibold">Sender Email: </span>
                        <span className="text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/60">
                          {currentQ.artifact.sender}
                        </span>
                      </div>
                    )}
                    {currentQ.artifact.displayedSender && (
                      <div>
                        <span className="text-zinc-500 font-semibold">Displayed Sender: </span>
                        <span className="text-zinc-300">{currentQ.artifact.displayedSender}</span>
                      </div>
                    )}
                    {currentQ.artifact.replyTo && (
                      <div>
                        <span className="text-zinc-500 font-semibold">Reply-To: </span>
                        <span className="text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-900/60">
                          {currentQ.artifact.replyTo}
                        </span>
                      </div>
                    )}
                    {currentQ.artifact.subject && (
                      <div>
                        <span className="text-zinc-500 font-semibold">Subject: </span>
                        <span className="text-white font-bold">{currentQ.artifact.subject}</span>
                      </div>
                    )}
                    {currentQ.artifact.attachment && (
                      <div className="pt-1">
                        <span className="text-zinc-500 font-semibold">Attachment: </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-950 border border-red-700 text-red-300 font-bold">
                          <FileCode className="w-3.5 h-3.5 text-red-400" />
                          {currentQ.artifact.attachment}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-[#0a0a0d] rounded border border-zinc-800 font-chakra text-zinc-200 text-sm whitespace-pre-line leading-relaxed">
                    {currentQ.artifact.body}
                  </div>
                </div>
              )}

              {/* CHATAPP VIEW */}
              {currentQ.type === 'CHAT' && (
                <div className="p-4 space-y-4">
                  {/* Chat Contact Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center font-bold text-emerald-400">
                        {currentQ.artifact.contact?.slice(0, 2).toUpperCase() || 'CH'}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">
                          {currentQ.artifact.contact}
                        </div>
                        {currentQ.artifact.number && (
                          <div className="text-zinc-400 text-xs">
                            {currentQ.artifact.number}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-400">
                      SECURE CHAT
                    </span>
                  </div>

                  {/* Chat Message Bubble */}
                  <div className="flex flex-col items-start space-y-2">
                    <div className="max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl rounded-tl-sm p-4 text-zinc-200 font-chakra text-sm whitespace-pre-line leading-relaxed shadow-md">
                      {currentQ.artifact.body}
                      <div className="text-right text-[10px] text-zinc-500 mt-2 font-mono">
                        Just now • Unverified Contact
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CALL / VISHING VIEW */}
              {currentQ.type === 'CALL' && (
                <div className="p-5 space-y-4">
                  <div className="p-4 rounded bg-red-950/40 border border-red-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center animate-pulse">
                        <PhoneCall className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-red-400 text-xs font-bold uppercase tracking-wider">
                          INCOMING SUSPECT VOICE CALL
                        </div>
                        <div className="text-white font-bold text-base">
                          {currentQ.artifact.caller}
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {currentQ.artifact.number}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-red-900/60 text-red-300 text-xs font-bold animate-pulse">
                      CONNECTED
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-zinc-300 font-chakra text-sm whitespace-pre-line leading-relaxed">
                    <div className="text-xs font-mono text-zinc-500 mb-2 uppercase">
                      VOICE TRANSCRIPTION LOG:
                    </div>
                    {currentQ.artifact.body}
                  </div>
                </div>
              )}

              {/* BROWSER ADDRESS BAR VIEW */}
              {currentQ.type === 'BROWSER' && (
                <div className="p-4 space-y-4">
                  {/* Browser Chrome Header */}
                  <div className="bg-zinc-900 rounded p-2.5 border border-zinc-700 flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-black px-3 py-1.5 rounded border border-zinc-800 flex items-center justify-between text-zinc-300">
                      <span className="text-red-400 font-bold truncate">
                        {currentQ.artifact.addressBar || currentQ.artifact.url}
                      </span>
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 ml-2" />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-zinc-200 font-chakra text-sm whitespace-pre-line leading-relaxed">
                    {currentQ.artifact.body}
                  </div>
                </div>
              )}

              {/* OAUTH PERMISSIONS CONSENT VIEW */}
              {currentQ.type === 'OAUTH' && (
                <div className="p-4 space-y-4">
                  <div className="p-4 bg-purple-950/40 rounded border border-purple-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase">
                      <Key className="w-4 h-4" />
                      THIRD-PARTY OAUTH CONSENT DIALOG
                    </div>
                    <div className="text-white font-bold text-base">
                      {currentQ.artifact.subject}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      Sender: {currentQ.artifact.sender}
                    </div>
                  </div>

                  {currentQ.artifact.options && (
                    <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-2">
                      <div className="text-xs font-mono text-zinc-400 uppercase font-bold">
                        REQUESTED ACCESS SCOPES:
                      </div>
                      <div className="space-y-1.5">
                        {currentQ.artifact.options.map((opt, i) => (
                          <div
                            key={i}
                            className="p-2 rounded bg-red-950/40 border border-red-900/60 text-red-300 font-mono text-xs flex items-center gap-2"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-zinc-200 font-chakra text-sm whitespace-pre-line leading-relaxed">
                    {currentQ.artifact.body}
                  </div>
                </div>
              )}

              {/* AUTHENTICATOR VIEW */}
              {currentQ.type === 'AUTHENTICATOR' && (
                <div className="p-4 space-y-4">
                  <div className="p-4 bg-blue-950/40 rounded border border-blue-800/80 space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                      <ShieldCheck className="w-4 h-4" />
                      MFA PUSH AUTHENTICATION PROMPT
                    </div>
                    <div className="p-3 bg-black rounded border border-blue-900/60 text-zinc-200 font-mono text-xs whitespace-pre-line leading-relaxed">
                      {currentQ.artifact.notificationText}
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-zinc-200 font-chakra text-sm whitespace-pre-line leading-relaxed">
                    {currentQ.artifact.body}
                  </div>
                </div>
              )}

              {/* DOCUMENT VIEW */}
              {currentQ.type === 'DOCUMENT' && (
                <div className="p-4 space-y-4">
                  <div className="p-3 bg-amber-950/60 rounded border border-amber-800 text-amber-300 text-xs flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>SECURITY WARNING: MACROS HAVE BEEN DISABLED</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-900 font-bold text-black">
                      ENABLE CONTENT
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-2 text-zinc-300 font-chakra text-sm whitespace-pre-line leading-relaxed">
                    <div className="text-xs font-mono text-zinc-500">
                      From: {currentQ.artifact.from} ({currentQ.artifact.sender})
                    </div>
                    <div className="text-xs font-mono text-red-400 font-bold">
                      Attachment: {currentQ.artifact.attachment}
                    </div>
                    <p className="mt-2 text-zinc-200">{currentQ.artifact.body}</p>
                  </div>
                </div>
              )}

              {/* FINAL ATTACK VIEW */}
              {currentQ.type === 'FINAL_ATTACK' && (
                <div className="p-4 space-y-4">
                  <div className="p-3 bg-red-950/80 rounded border border-red-700 text-red-200 text-xs flex items-center gap-2 font-mono font-bold">
                    <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
                    CRITICAL INCIDENT: MULTI-STAGE CO-ORDINATED ATTACK ACTIVE
                  </div>

                  <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-zinc-200 font-chakra text-sm whitespace-pre-line leading-relaxed">
                    {currentQ.artifact.body}
                  </div>

                  {currentQ.artifact.browserAppList && (
                    <div className="p-4 bg-black rounded border border-red-900/60 space-y-2">
                      <div className="text-xs font-mono text-red-400 font-bold uppercase">
                        BROWSER — CONNECTED APPLICATIONS AUDIT:
                      </div>
                      <div className="space-y-1 font-mono text-xs">
                        {currentQ.artifact.browserAppList.map((app, i) => (
                          <div
                            key={i}
                            className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300"
                          >
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Right: Forensic Task & Clean Independent Answer Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#09090b] rounded-xl border border-red-900/60 p-5 shadow-lg space-y-5">
            
            {/* Task Banner */}
            <div className="p-4 rounded-lg bg-black border border-red-900/80 space-y-2">
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>FORENSIC MISSION TASK</span>
              </div>
              <p className="text-white font-chakra text-sm font-semibold leading-relaxed">
                {currentQ.task}
              </p>
            </div>

            {/* Answer Input Section */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold tracking-wider">
                YOUR INVESTIGATION ANSWER:
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  disabled={isQuestionSubmitted}
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isQuestionSubmitted && currentAnswer.trim()) {
                      handleSubmitAnswer();
                    }
                  }}
                  placeholder="Enter your answer..."
                  className={`w-full px-4 py-3.5 rounded-lg bg-black border text-white font-mono text-sm placeholder:text-zinc-600 outline-none transition-all ${
                    isQuestionSubmitted
                      ? 'border-zinc-800 bg-zinc-950/80 text-zinc-300 cursor-not-allowed'
                      : 'border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  }`}
                />
              </div>

              {/* Forensic Analysis Telemetry Progress */}
              {isAnalyzing && (
                <div className="p-3.5 rounded-lg bg-black border border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] font-mono text-xs space-y-1.5 animate-cyber-glitch">
                  <div className="flex items-center justify-between text-red-400 font-bold border-b border-red-950 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-red-500 animate-spin" />
                      CROSS-EXAMINATION ENGINE
                    </span>
                    <span className="text-[10px] text-zinc-500">HEURISTIC SCAN</span>
                  </div>
                  <div className="space-y-1 text-[11px] pt-1">
                    <div className={`flex items-center gap-2 ${analyzingStep >= 0 ? 'text-red-300 font-bold' : 'opacity-30'}`}>
                      <span>&gt; ANALYZING EVIDENCE...</span>
                      {analyzingStep === 0 && <span className="w-1.5 h-3 bg-red-500 animate-terminal-blink inline-block" />}
                    </div>
                    {analyzingStep >= 1 && (
                      <div className={`flex items-center gap-2 ${analyzingStep >= 1 ? 'text-red-300 font-bold' : 'opacity-30'}`}>
                        <span>&gt; CROSS-REFERENCING CLUES...</span>
                        {analyzingStep === 1 && <span className="w-1.5 h-3 bg-red-500 animate-terminal-blink inline-block" />}
                      </div>
                    )}
                    {analyzingStep >= 2 && (
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <span>&gt; INVESTIGATION RESULT READY</span>
                        <span className="w-1.5 h-3 bg-emerald-500 animate-terminal-blink inline-block" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isQuestionSubmitted && !isAnalyzing && (
                <div className="pt-2">
                  <button
                    disabled={!currentAnswer.trim()}
                    onClick={handleSubmitAnswer}
                    className="w-full py-3 px-5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 border border-red-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    SUBMIT ANSWER
                  </button>
                </div>
              )}
            </div>

            {/* POST-SUBMISSION DEBRIEF CARD (Only shown AFTER submission) */}
            {isQuestionSubmitted && (
              <div className="space-y-4 pt-3 border-t border-zinc-800/80 animate-fade-in">
                
                {/* Result Status Header */}
                <div
                  className={`p-3.5 rounded-lg border font-mono text-xs flex items-center justify-between ${
                    currentEval?.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : 'bg-red-950/60 border-red-800 text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {currentEval?.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-sm block">
                        {currentEval?.isCorrect ? 'CORRECT FORENSIC DEDUCTION' : 'INCORRECT EVALUATION'}
                      </span>
                      <span className="text-[11px] opacity-80">
                        {currentEval?.message}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-orbitron font-bold text-sm px-2.5 py-1 rounded bg-black/70 border border-current">
                      {currentEval?.score > 0 ? `+${currentEval.score}` : `${currentEval.score}`} PTS
                    </span>
                  </div>
                </div>

                {/* Debrief Details */}
                <div className="p-4 rounded-lg bg-black/90 border border-zinc-800 space-y-3 font-chakra text-xs">
                  
                  {/* Correct Answer */}
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">
                      CORRECT ANSWER:
                    </span>
                    <span className="font-mono text-red-300 text-sm font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-900/60 inline-block mt-1">
                      {currentDebrief.correctAnswer}
                    </span>
                  </div>

                  {/* Explanation */}
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">
                      EXPLANATION:
                    </span>
                    <p className="text-zinc-200 mt-1 leading-relaxed text-sm">
                      {currentDebrief.explanation}
                    </p>
                  </div>

                  {/* Real-World Example */}
                  <div className="pt-2 border-t border-zinc-900">
                    <span className="font-mono text-[10px] text-amber-500 uppercase tracking-wider flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      REAL-WORLD ATTACK EXAMPLE:
                    </span>
                    <p className="text-zinc-300 mt-1 leading-relaxed">
                      {currentDebrief.realWorldExample}
                    </p>
                  </div>

                  {/* Prevention Tip */}
                  <div className="pt-2 border-t border-zinc-900">
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider flex items-center gap-1 font-bold">
                      <ShieldIcon className="w-3 h-3" />
                      DEFENSE &amp; PREVENTION TIP:
                    </span>
                    <p className="text-zinc-300 mt-1 leading-relaxed">
                      {currentDebrief.preventionTip}
                    </p>
                  </div>

                </div>

                {/* Action button after submission: Continue to Next Question */}
                <div className="pt-2">
                  {activeIdx < questions.length - 1 ? (
                    <button
                      onClick={handleContinueNext}
                      className="w-full py-3 px-5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all"
                    >
                      <span>CONTINUE → NEXT QUESTION</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      disabled={roundSubmitted}
                      onClick={handleSubmitRound}
                      className="w-full py-3 px-5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all"
                    >
                      <Send className="w-4 h-4" />
                      {roundSubmitted ? 'ROUND COMPLETED' : 'TRANSMIT FINAL ROUND DOSSIER'}
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* Bottom Navigation buttons */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <button
                disabled={activeIdx === 0}
                onClick={() => {
                  cyberAudio.click();
                  setActiveIdx((prev) => Math.max(0, prev - 1));
                }}
                className="px-3.5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                PREV
              </button>

              <span className="text-zinc-500">
                QUESTION {activeIdx + 1} OF {questions.length}
              </span>

              <button
                disabled={activeIdx === questions.length - 1}
                onClick={() => {
                  cyberAudio.click();
                  setActiveIdx((prev) => Math.min(questions.length - 1, prev + 1));
                }}
                className="px-3.5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all"
              >
                NEXT
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Completion Confirmation Banner */}
      {roundSubmitted && (
        <div className="p-6 rounded-xl bg-gradient-to-r from-red-950/80 via-black to-red-950/80 border-2 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <CheckCircle className="w-4 h-4" />
              ROUND {roundNumber} TRANSMISSION CONFIRMED
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white mt-1">
              SCORE: {totalRoundScore} / {maxRoundScore} POINTS RECORDED
            </h3>
            <p className="text-zinc-400 text-xs font-mono mt-0.5">
              Authoritative scoreboard synced. All questions in this dossier are completed.
            </p>
          </div>

          <div className="px-5 py-3 rounded-lg bg-black/80 border border-red-800 font-orbitron font-black text-2xl text-red-400">
            {totalRoundScore} PTS
          </div>
        </div>
      )}

    </div>
  );
};

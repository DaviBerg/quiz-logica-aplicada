import React, { useState, useEffect, useCallback } from "react";

interface Hint {
  label: string;
  value: string;
}

interface Question {
  clues: { predators: string; diet: string; habitat: string };
  hints: Hint[];
  options: string[];
  correctAnswer: string;
}

type AnswerState = "waiting" | "correct" | "wrong";

const MAX_HINTS = 3;
const POINTS_PER_ROUND = 10;
const HINT_PENALTY = 2;

export const QuizGame = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Dicas: quantas já foram reveladas nesta rodada
  const [hintsUsed, setHintsUsed] = useState(0);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAnswerState("waiting");
    setSelectedAnswer(null);
    setHintsUsed(0);

    try {
      const response = await fetch("http://localhost:3001/api/quiz");
      if (!response.ok) {
        setError(`Erro do servidor: ${response.status}`);
        return;
      }
      const data: Question = await response.json();
      setCurrentQuestion(data);
    } catch (err) {
      setError("Não foi possível conectar ao backend. Verifique se o servidor está rodando em http://localhost:3001");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadQuestion(); }, [loadQuestion]);

  // Pontos disponíveis nesta rodada = 10 - (dicas usadas × 2), mínimo 2
  const availablePoints = Math.max(2, POINTS_PER_ROUND - hintsUsed * HINT_PENALTY);

  const handleHint = () => {
    if (hintsUsed < MAX_HINTS && answerState === "waiting") {
      setHintsUsed((h) => h + 1);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answerState !== "waiting") return;
    const isCorrect = answer === currentQuestion?.correctAnswer;
    setSelectedAnswer(answer);
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + availablePoints);

    setTimeout(() => {
      if (round < 10) {
        setRound((r) => r + 1);
        loadQuestion();
      } else {
        setGameOver(true);
      }
    }, 1600);
  };

  const getButtonStyle = (opt: string) => {
    if (answerState === "waiting")
      return "bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white border-2 border-transparent";
    if (opt === currentQuestion?.correctAnswer)
      return "bg-emerald-500 text-white border-2 border-emerald-300 scale-105";
    if (opt === selectedAnswer && answerState === "wrong")
      return "bg-red-500 text-white border-2 border-red-300 opacity-80";
    return "bg-gray-100 text-gray-400 border-2 border-transparent opacity-40";
  };

  // ── Game Over ──────────────────────────────────────────────────────────────
  if (gameOver) {
    const pct = Math.round((score / (10 * POINTS_PER_ROUND)) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "🎯" : "🐾";
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-violet-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Fim de Jogo!</h1>
          <p className="text-gray-400 mb-6">{pct}% de aproveitamento</p>
          <div className="bg-indigo-50 rounded-2xl p-6 mb-6">
            <p className="text-5xl font-black text-indigo-600">{score}</p>
            <p className="text-gray-400 text-sm mt-1">pontos de {10 * POINTS_PER_ROUND} possíveis</p>
          </div>
          <button
            onClick={() => { setScore(0); setRound(1); setGameOver(false); loadQuestion(); }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-violet-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Erro de conexão</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button onClick={loadQuestion} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-violet-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-5xl mb-4 animate-spin">🔄</div>
          <p className="text-lg opacity-80">A carregar do Prolog...</p>
        </div>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  const progress = ((round - 1) / 10) * 100;
  const hintsLeft = MAX_HINTS - hintsUsed;
  const revealedHints = currentQuestion?.hints.slice(0, hintsUsed) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <span className="text-indigo-200 text-sm font-medium">Rodada {round} de 10</span>
          <span className="text-white font-extrabold text-lg">🏅 {score} pts</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-indigo-100">
          <div className="h-full bg-indigo-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="px-6 py-5">

          {/* Pistas iniciais */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quem sou eu?</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { emoji: "🐯", label: "Predador",     value: currentQuestion?.clues.predators  },
              { emoji: "🍖", label: "Dieta",   value: currentQuestion?.clues.diet },
              { emoji: "🌿", label: "Habitat", value: currentQuestion?.clues.habitat },
            ].map(({ emoji, label, value }) => (
              <div key={label} className="bg-indigo-50 rounded-2xl p-3 text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-bold text-gray-700 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Dicas reveladas */}
          {revealedHints.length > 0 && (
            <div className="mb-4 space-y-2">
              {revealedHints.map((hint, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm animate-pulse-once"
                >
                  <span className="text-amber-700 font-semibold">💡 {hint.label}</span>
                  <span className="text-gray-700 font-bold">{hint.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Botão de dica + indicador de pontos */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={handleHint}
              disabled={hintsLeft === 0 || answerState !== "waiting"}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border-2 transition-all
                ${hintsLeft > 0 && answerState === "waiting"
                  ? "border-amber-400 text-amber-600 hover:bg-amber-50 active:scale-95"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
            >
              💡 Dica
              <span className={`text-xs px-2 py-0.5 rounded-full font-black
                ${hintsLeft > 0 ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-300"}`}>
                {hintsLeft} restantes
              </span>
            </button>

            {/* Indicador de quanto vale acertar agora */}
            <div className={`text-right transition-all ${hintsUsed > 0 ? "text-amber-600" : "text-indigo-600"}`}>
              <p className="text-xs text-gray-400">Vale agora</p>
              <p className="text-xl font-black">+{availablePoints} pts</p>
            </div>
          </div>

          {/* Feedback de acerto/erro */}
          {answerState !== "waiting" && (
            <div className={`rounded-xl px-4 py-2 mb-4 text-center text-sm font-bold transition-all
              ${answerState === "correct" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {answerState === "correct"
                ? `✅ Correto! +${availablePoints} pontos`
                : `❌ Errado! Era: ${currentQuestion?.correctAnswer}`}
            </div>
          )}

          {/* Opções */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion?.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={answerState !== "waiting"}
                className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm ${getButtonStyle(opt)}`}
              >
                {opt}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

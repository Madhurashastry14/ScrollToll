import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

const GAME_CONFIG = {
  target_focus: {
    title: "Target Focus",
    description: "Find all the target symbols hidden in the grid.",
  },

  odd_one_out: {
    title: "Odd One Out",
    description: "Spot the one item that is different from the rest.",
  },

  color_challenge: {
    title: "Color Challenge",
    description: "Ignore the word and respond to its actual color.",
  },

  sequence_recall: {
    title: "Sequence Recall",
    description: "Remember a sequence and reproduce it correctly.",
  },

  distraction_challenge: {
    title: "Distraction Challenge",
    description: "Stay focused on the task while distractions appear.",
  },
};

const TOTAL_ROUNDS = 3;

function FocusGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const game = GAME_CONFIG[gameId];

  const [currentRound, setCurrentRound] = useState(1);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reward, setReward] = useState(null);
  const [error, setError] = useState("");

  if (!game) {
    return (
      <div className="min-h-screen bg-[#faf9f6] px-6 py-12 text-gray-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Focus Forge
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Game not found
          </h1>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            The selected Focus Forge game does not exist.
          </p>

          <Link
            to="/focus-forge"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
          >
            Back to Focus Forge
          </Link>
        </div>
      </div>
    );
  }

  const handleRoundComplete = (successful) => {
    if (roundFinished) {
      return;
    }

    const nextRoundsCompleted = successful
      ? roundsCompleted + 1
      : roundsCompleted;

    setRoundsCompleted(nextRoundsCompleted);
    setRoundFinished(true);
  };

  const handleNextRound = () => {
    if (currentRound === TOTAL_ROUNDS) {
      finishGame(roundsCompleted);
      return;
    }

    setCurrentRound((previous) => previous + 1);
    setRoundFinished(false);
  };

  const finishGame = async (finalRoundsCompleted) => {
    try {
      setSubmitting(true);
      setError("");

      const score = Math.round((finalRoundsCompleted / TOTAL_ROUNDS) * 100);

      const data = await apiRequest("/activities/focus-game", {
        method: "POST",
        body: JSON.stringify({
          gameType: gameId,
          roundsPlayed: TOTAL_ROUNDS,
          roundsCompleted: finalRoundsCompleted,
          score,
        }),
      });

      setReward(data);
    } catch (err) {
      console.error("Focus Forge submission failed:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (reward) {
    return (
      <div className="min-h-screen bg-[#faf9f6] px-6 py-12 text-gray-900">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Focus Forge Complete
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {game.title}
            </h1>

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Rounds completed
              </p>

              <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                {reward.session.roundsCompleted}/3
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Tokens earned
              </p>

              <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
                +{reward.tokensEarned}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Current balance: {reward.balance}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/focus-forge/${gameId}`)}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
              >
                Play Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/focus-forge")}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-xs transition hover:bg-gray-50"
              >
                Choose Another Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/focus-forge"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <span aria-hidden="true">←</span> Back to Focus Forge
        </Link>

        <div className="mt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Focus Forge
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {game.title}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-xs">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Round
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {currentRound} / {TOTAL_ROUNDS}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Completed
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {roundsCompleted}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          {gameId === "target_focus" && (
            <TargetFocus
              key={`${gameId}-${currentRound}`}
              round={currentRound}
              disabled={roundFinished}
              onComplete={handleRoundComplete}
            />
          )}

          {gameId === "odd_one_out" && (
            <OddOneOut
              key={`${gameId}-${currentRound}`}
              round={currentRound}
              disabled={roundFinished}
              onComplete={handleRoundComplete}
            />
          )}

          {gameId === "color_challenge" && (
            <ColorChallenge
              key={`${gameId}-${currentRound}`}
              round={currentRound}
              disabled={roundFinished}
              onComplete={handleRoundComplete}
            />
          )}

          {gameId === "sequence_recall" && (
            <SequenceRecall
              key={`${gameId}-${currentRound}`}
              round={currentRound}
              disabled={roundFinished}
              onComplete={handleRoundComplete}
            />
          )}

          {gameId === "distraction_challenge" && (
            <DistractionChallenge
              key={`${gameId}-${currentRound}`}
              round={currentRound}
              disabled={roundFinished}
              onComplete={handleRoundComplete}
            />
          )}

          {roundFinished && (
            <div className="mt-8 border-t border-gray-100 pt-6 text-center">
              <p className="text-base font-semibold text-gray-900">
                Round {currentRound} complete
              </p>

              <button
                type="button"
                onClick={handleNextRound}
                disabled={submitting}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
              >
                {currentRound === TOTAL_ROUNDS ? "Finish Game" : "Next Round"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TARGET FOCUS
========================================================= */

function TargetFocus({ round, disabled, onComplete }) {
  const gridSize = round === 1 ? 3 : round === 2 ? 4 : 5;

  const totalCells = gridSize * gridSize;

  const targetCount = round === 1 ? 2 : round === 2 ? 3 : 4;

  const memorizeDuration = round === 1 ? 2200 : round === 2 ? 2600 : 3000;
  const [phase, setPhase] = useState("ready");

  const [targetCells] = useState(() => {
    const cells = [];

    while (cells.length < targetCount) {
      const cell = Math.floor(Math.random() * totalCells);

      if (!cells.includes(cell)) {
        cells.push(cell);
      }
    }

    return cells;
  });

  const [selectedCells, setSelectedCells] = useState([]);
  const [wrongCell, setWrongCell] = useState(null);

  useEffect(() => {
    if (phase !== "memorize" || disabled) {
      return;
    }

    const timer = setTimeout(() => {
      setPhase("recall");
    }, memorizeDuration);

    return () => clearTimeout(timer);
  }, [phase, memorizeDuration, disabled]);

  const startGame = () => {
    if (disabled || targetCells.length === 0) {
      return;
    }

    setSelectedCells([]);
    setWrongCell(null);
    setPhase("memorize");
  };

  const handleClick = (index) => {
    if (disabled || phase !== "recall" || selectedCells.includes(index)) {
      return;
    }

    if (!targetCells.includes(index)) {
      setWrongCell(index);
      setPhase("failed");

      setTimeout(() => {
        onComplete(false);
      }, 700);

      return;
    }

    const nextSelected = [...selectedCells, index];

    setSelectedCells(nextSelected);

    if (nextSelected.length === targetCells.length) {
      setPhase("success");

      setTimeout(() => {
        onComplete(true);
      }, 700);
    }
  };

  const progress =
    targetCells.length > 0
      ? (selectedCells.length / targetCells.length) * 100
      : 0;

  return (
    <div>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Visual Recall
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900">
          Find the Targets
        </h2>

        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-gray-500">
          Memorize where the targets appear, then find them after they
          disappear.
        </p>
      </div>

      <div className="mt-6 text-center">
        {phase === "ready" && (
          <>
            <p className="text-base font-semibold text-gray-900">Ready?</p>

            <p className="mt-1 text-xs text-gray-500">
              You will have a few seconds to memorize the target positions.
            </p>

            <button
              type="button"
              onClick={startGame}
              disabled={disabled}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
            >
              Start Round
            </button>
          </>
        )}

        {phase === "memorize" && (
          <>
            <p className="text-base font-semibold text-gray-900">Memorize</p>

            <p className="mt-1 text-xs text-gray-500">
              Remember the highlighted cells.
            </p>
          </>
        )}

        {phase === "recall" && (
          <>
            <p className="text-base font-semibold text-gray-900">Your turn</p>

            <p className="mt-1 text-xs text-gray-500">
              Find all {targetCount} targets.
            </p>
          </>
        )}

        {phase === "success" && (
          <>
            <p className="text-base font-semibold text-emerald-700">
              ✓ Excellent
            </p>

            <p className="mt-1 text-xs text-gray-500">
              You found every target.
            </p>
          </>
        )}

        {phase === "failed" && (
          <>
            <p className="text-base font-semibold text-rose-700">✕ Missed</p>

            <p className="mt-1 text-xs text-gray-500">
              That wasn't one of the target cells.
            </p>
          </>
        )}
      </div>

      <div className="mx-auto mt-6 max-w-xs">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Targets found</span>

          <span>
            {selectedCells.length}/{targetCount}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div
        className="mx-auto mt-6 grid max-w-xs gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, index) => {
          const isTarget = targetCells.includes(index);

          const isSelected = selectedCells.includes(index);

          const isWrong = wrongCell === index;

          const showTarget = phase === "memorize" && isTarget;

          return (
            <button
              key={index}
              type="button"
              disabled={disabled || phase !== "recall" || isSelected}
              onClick={() => handleClick(index)}
              className={`
                  aspect-square rounded-xl border text-lg font-semibold
                  transition-all duration-200 flex items-center justify-center
                  ${
                    showTarget
                      ? "border-gray-900 bg-gray-900 text-white shadow-xs"
                      : ""
                  }
                  ${isSelected ? "border-gray-900 bg-gray-800 text-white" : ""}
                  ${
                    isWrong
                      ? "border-rose-500 bg-rose-50 text-rose-600 animate-pulse"
                      : ""
                  }
                  ${
                    !showTarget && !isSelected && !isWrong
                      ? "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
                      : ""
                  }
                  ${phase === "recall" ? "cursor-pointer" : "cursor-default"}
                `}
            >
              {showTarget && "●"}
              {isSelected && "✓"}
              {isWrong && "✕"}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        {phase === "ready" && (
          <p className="text-xs text-gray-400">
            Round {round}: {targetCount} targets
          </p>
        )}

        {phase === "memorize" && (
          <p className="text-xs text-gray-400">
            Memorize their positions before they disappear.
          </p>
        )}

        {phase === "recall" && (
          <p className="text-xs text-gray-400">
            One wrong click ends the round.
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ODD ONE OUT
========================================================= */

function OddOneOut({ round, disabled, onComplete }) {
  const gridSize = round === 1 ? 3 : round === 2 ? 4 : 5;

  const totalCells = gridSize * gridSize;

  const [oddCell] = useState(() => Math.floor(Math.random() * totalCells));

  const handleClick = (index) => {
    if (disabled) {
      return;
    }

    onComplete(index === oddCell);
  };

  return (
    <div>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Find the odd one
        </p>

        <p className="mt-1 text-base font-semibold text-gray-900">
          🔎 Tap the item that is different
        </p>
      </div>

      <div
        className="mx-auto mt-6 grid max-w-xs gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => handleClick(index)}
            className="aspect-square rounded-xl border border-gray-200 bg-gray-50 text-xl transition hover:bg-gray-100 hover:border-gray-300 disabled:cursor-default"
          >
            {index === oddCell ? "○" : "●"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   COLOR CHALLENGE
========================================================= */

function ColorChallenge({ round, disabled, onComplete }) {
  const COLORS = [
    { name: "RED", value: "#ef4444" },
    { name: "BLUE", value: "#3b82f6" },
    { name: "GREEN", value: "#22c55e" },
    { name: "PURPLE", value: "#a855f7" },
  ];

  const timeLimit = round === 1 ? 5 : round === 2 ? 4 : 3;

  const [challenge] = useState(() => createColorChallenge(COLORS));

  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (disabled || answered || timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => {
        const nextTime = previous - 1;

        if (nextTime === 0) {
          setAnswered(true);
          setResult("timeout");

          setTimeout(() => {
            onComplete(false);
          }, 700);
        }

        return nextTime;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, disabled, answered, onComplete]);

  const handleChoice = (colorName) => {
    if (disabled || answered) {
      return;
    }

    setAnswered(true);

    const correct = colorName === challenge.displayColor.name;

    setResult(correct ? "success" : "failed");

    setTimeout(() => {
      onComplete(correct);
    }, 700);
  };

  return (
    <div>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Attention Control
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900">
          Color Challenge
        </h2>

        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-gray-500">
          Ignore the word. Select the actual color of the text.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-xs">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-500">Time remaining</span>

          <span
            className={`font-bold ${
              timeLeft <= 2 ? "text-rose-600" : "text-gray-900"
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-300"
            style={{
              width: `${(timeLeft / timeLimit) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-xs text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          What color is this text?
        </p>

        <div
          className="mt-3 text-4xl font-black tracking-tight"
          style={{
            color: challenge.displayColor.value,
          }}
        >
          {challenge.word}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-xs grid-cols-2 gap-2.5">
        {COLORS.map((color) => (
          <button
            key={color.name}
            type="button"
            disabled={disabled || answered}
            onClick={() => handleChoice(color.name)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-xs transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-default disabled:opacity-50"
          >
            {color.name}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        {result === "success" && (
          <p className="text-base font-semibold text-emerald-700">✓ Correct</p>
        )}

        {result === "failed" && (
          <p className="text-base font-semibold text-rose-700">✕ Incorrect</p>
        )}

        {result === "timeout" && (
          <p className="text-base font-semibold text-amber-600">⏱ Time's up</p>
        )}
      </div>
    </div>
  );
}

function createColorChallenge(colors) {
  const displayColor = colors[Math.floor(Math.random() * colors.length)];

  let word;

  do {
    word = colors[Math.floor(Math.random() * colors.length)];
  } while (word.name === displayColor.name);

  return {
    word: word.name,
    displayColor,
  };
}

/* =========================================================
   SEQUENCE RECALL
========================================================= */

function SequenceRecall({ round, disabled, onComplete }) {
  const sequenceLength = round + 2;

  const symbols = ["▲", "●", "■", "◆", "★", "⬟"];

  const [sequence] = useState(() =>
    Array.from({ length: sequenceLength }, () =>
      Math.floor(Math.random() * symbols.length),
    ),
  );

  const [showingSequence, setShowingSequence] = useState(true);
  const [userSequence, setUserSequence] = useState([]);
  const [mistake, setMistake] = useState(false);
  const [success, setSuccess] = useState(false);

  const displayTime = Math.max(1200, sequenceLength * 700);

  useEffect(() => {
    if (!showingSequence) {
      return;
    }

    const timer = setTimeout(() => {
      setShowingSequence(false);
    }, displayTime);

    return () => clearTimeout(timer);
  }, [displayTime, showingSequence]);

  const handleSymbolClick = (index) => {
    if (disabled || showingSequence || mistake || success) {
      return;
    }

    const nextSequence = [...userSequence, index];
    setUserSequence(nextSequence);

    const currentPosition = nextSequence.length - 1;

    if (index !== sequence[currentPosition]) {
      setMistake(true);
      setTimeout(() => {
        onComplete(false);
      }, 700);
      return;
    }

    if (nextSequence.length === sequence.length) {
      setSuccess(true);
      setTimeout(() => {
        onComplete(true);
      }, 700);
    }
  };

  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        Remember the sequence
      </p>

      <p className="mt-1 text-base font-semibold text-gray-900">
        🧠 Watch carefully, then reproduce it
      </p>

      {showingSequence ? (
        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Memorize
          </p>

          <div className="mt-4 flex justify-center gap-4 text-3xl sm:text-4xl">
            {sequence.map((value, index) => (
              <span key={`${value}-${index}`}>{symbols[value]}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Your sequence
          </p>

          <div className="mt-3 flex min-h-12 justify-center gap-3 text-3xl">
            {userSequence.map((value, index) => {
              const isCorrectMatch = value === sequence[index];
              return (
                <span
                  key={`${value}-${index}`}
                  className={
                    isCorrectMatch
                      ? "text-gray-900"
                      : "text-rose-600 animate-bounce"
                  }
                >
                  {symbols[value]}
                </span>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {symbols.map((symbol, index) => (
              <button
                key={symbol}
                type="button"
                disabled={disabled || mistake || success}
                onClick={() => handleSymbolClick(index)}
                className="rounded-xl border border-gray-200 bg-white py-4 text-2xl transition hover:bg-gray-50 active:scale-95 disabled:cursor-default disabled:opacity-60 shadow-xs"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {mistake && (
        <p className="mt-4 text-base font-semibold text-rose-600">
          ✕ Incorrect sequence
        </p>
      )}

      {success && (
        <p className="mt-4 text-base font-semibold text-emerald-600">
          ✓ Perfect sequence!
        </p>
      )}

      {!showingSequence && !mistake && !success && (
        <p className="mt-4 text-xs text-gray-400">
          {sequence.length - userSequence.length} symbol
          {sequence.length - userSequence.length === 1 ? "" : "s"} remaining
        </p>
      )}
    </div>
  );
}

/* =========================================================
   DISTRACTION CHALLENGE
========================================================= */

function DistractionChallenge({ round, disabled, onComplete }) {
  const COLORS = [
    { name: "RED", value: "#ef4444" },
    { name: "BLUE", value: "#3b82f6" },
    { name: "GREEN", value: "#22c55e" },
    { name: "YELLOW", value: "#eab308" },
  ];

  const distractionCount = round === 1 ? 3 : round === 2 ? 5 : 7;

  const moveInterval = round === 1 ? 900 : round === 2 ? 700 : 500;

  const [challenge] = useState(() =>
    createDistractionChallenge(COLORS, distractionCount),
  );

  const [distractors, setDistractors] = useState(challenge.distractors);

  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (disabled || answered) {
      return;
    }

    const interval = setInterval(() => {
      setDistractors((previous) =>
        previous.map((distractor) => ({
          ...distractor,
          x: Math.random() * 80 + 5,
          y: Math.random() * 70 + 10,
          rotation: Math.floor(Math.random() * 40) - 20,
          scale: 0.8 + Math.random() * 0.5,
        })),
      );
    }, moveInterval);

    return () => clearInterval(interval);
  }, [disabled, answered, moveInterval]);

  const handleChoice = (colorName) => {
    if (disabled || answered) {
      return;
    }

    const correct = colorName === challenge.target.name;

    setAnswered(true);
    setResult(correct ? "success" : "failed");

    setTimeout(() => {
      onComplete(correct);
    }, 700);
  };

  return (
    <div>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Distraction Control
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900">
          Distraction Challenge
        </h2>

        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-gray-500">
          Focus on the target instruction and ignore everything else moving
          around you.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-xs rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Your target
        </p>

        <p className="mt-1.5 text-xs text-gray-500">Select this color:</p>

        <p
          className="mt-1 text-3xl font-black tracking-tight"
          style={{
            color: challenge.target.value,
          }}
        >
          {challenge.target.name}
        </p>
      </div>

      <div
        className={`
          relative mx-auto mt-6
          h-56 max-w-lg
          overflow-hidden rounded-xl
          border border-gray-200
          bg-white
          shadow-xs
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg border border-dashed border-gray-200 px-6 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-300">
              Stay focused
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-400">
              Ignore the noise
            </p>
          </div>
        </div>

        {distractors.map((distractor) => (
          <span
            key={distractor.id}
            className="absolute select-none text-2xl font-black transition-all duration-500 ease-in-out"
            style={{
              left: `${distractor.x}%`,
              top: `${distractor.y}%`,
              color: distractor.color.value,
              transform: `
                translate(-50%, -50%)
                rotate(${distractor.rotation}deg)
                scale(${distractor.scale})
              `,
            }}
          >
            {distractor.symbol}
          </span>
        ))}
      </div>

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-2.5">
        {COLORS.map((color) => (
          <button
            key={color.name}
            type="button"
            disabled={disabled || answered}
            onClick={() => handleChoice(color.name)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-xs transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-default disabled:opacity-50"
          >
            {color.name}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        {result === "success" && (
          <p className="text-base font-semibold text-emerald-700">
            ✓ Excellent focus
          </p>
        )}

        {result === "failed" && (
          <p className="text-base font-semibold text-rose-700">✕ Distracted</p>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        {round === 1
          ? "A few distractions will move around you."
          : round === 2
            ? "The distractions are faster now."
            : "Maximum distraction. Stay focused."}
      </p>
    </div>
  );
}

function createDistractionChallenge(colors, count) {
  const target = colors[Math.floor(Math.random() * colors.length)];

  const symbols = ["★", "✦", "●", "◆", "✕", "⚡", "⬟", "✧"];

  const distractors = Array.from({ length: count }, (_, index) => {
    let color;

    do {
      color = colors[Math.floor(Math.random() * colors.length)];
    } while (color.name === target.name);

    return {
      id: `${Date.now()}-${index}-${Math.random()}`,
      color,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 80 + 5,
      y: Math.random() * 70 + 10,
      rotation: Math.floor(Math.random() * 40) - 20,
      scale: 0.8 + Math.random() * 0.5,
    };
  });

  return {
    target,
    distractors,
  };
}

export default FocusGame;

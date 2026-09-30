import { useState } from "react";
import { apiRequest } from "../services/api";
const questions = [
  {
    question: "What is the output of 2 + 3 × 4?",
    options: ["20", "14", "24", "10"],
    answer: "14",
  },
  {
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
  },
  {
    question: "Which HTTP method is commonly used to retrieve data?",
    options: ["POST", "PUT", "GET", "DELETE"],
    answer: "GET",
  },
];

function BrainGym() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reward, setReward] = useState(null);

  const question = questions[currentQuestion];

  const handleAnswer = (option) => {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(option);

    if (option === question.answer) {
      setScore((previousScore) => previousScore + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((previousQuestion) => previousQuestion + 1);
      setSelectedAnswer(null);
      return;
    }

    const finalScore = score + (selectedAnswer === question.answer ? 1 : 0);

    setSubmitting(true);

    try {
      const data = await apiRequest("/activities/brain-gym", {
        method: "POST",
        body: JSON.stringify({
          questionsAnswered: questions.length,
          correctAnswers: finalScore,
        }),
      });

      setReward(data);
      setCompleted(true);
    } catch (error) {
      console.error("Brain Gym submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Brain Gym Complete
            </p>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Great job!
            </h1>

            <p className="mt-4 text-gray-600">
              You answered{" "}
              <span className="font-semibold text-gray-900">
                {score} out of {questions.length}
              </span>{" "}
              questions correctly.
            </p>

            {reward && (
              <div className="mt-6 rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Tokens earned</p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  +{reward.tokensEarned}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Current balance: {reward.balance}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setReward(null);
                setCompleted(false);
              }}
              className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-80"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            Productivity Activity
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">Brain Gym</h1>

          <p className="mt-2 text-gray-600">
            Give your brain a quick workout before you scroll.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="text-gray-500">Score: {score}</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-black transition-all"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold leading-8 text-gray-900">
            {question.question}
          </h2>

          <div className="mt-6 space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.answer;

              let className =
                "w-full rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-400";

              if (selectedAnswer) {
                if (isCorrect) {
                  className =
                    "w-full rounded-xl border border-green-500 bg-green-50 p-4 text-left";
                } else if (isSelected) {
                  className =
                    "w-full rounded-xl border border-red-500 bg-red-50 p-4 text-left";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={Boolean(selectedAnswer)}
                  className={className}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:opacity-80"
            >
              {submitting
                ? "Saving..."
                : currentQuestion === questions.length - 1
                  ? "Finish"
                  : "Next Question"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrainGym;

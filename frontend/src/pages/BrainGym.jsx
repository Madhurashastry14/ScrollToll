import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

const domains = [
  {
    id: "logic",
    name: "Logic",
    description: "Test your reasoning and problem-solving skills.",
  },
  {
    id: "patterns",
    name: "Patterns",
    description: "Identify sequences and relationships.",
  },
  {
    id: "quick_math",
    name: "Quick Math",
    description: "Solve short mathematical problems.",
  },
  {
    id: "memory",
    name: "Memory",
    description: "Challenge your ability to remember information.",
  },
  {
    id: "attention",
    name: "Attention",
    description: "Test your focus and attention to detail.",
  },
];

const getOptions = (question) => ({
  A: question.option_a,
  B: question.option_b,
  C: question.option_c,
  D: question.option_d,
});

function BrainGym() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startQuiz = async (domain) => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/activities/brain-gym/start", {
        method: "POST",
        body: JSON.stringify({ domain }),
      });

      setSelectedDomain(domain);
      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setAnswers({});
      setCurrentQuestion(0);
      setResult(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      setError("");

      const formattedAnswers = questions.map((question) => ({
        questionId: question.id,
        answer: answers[question.id],
      }));

      const data = await apiRequest("/activities/brain-gym/submit", {
        method: "POST",
        body: JSON.stringify({
          attemptId,
          answers: formattedAnswers,
        }),
      });

      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Brain Gym
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              Choose your challenge
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Complete three questions to earn Scroll Tokens.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {domains.map((domain) => (
              <button
                key={domain.id}
                type="button"
                onClick={() => startQuiz(domain.id)}
                disabled={loading}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {domain.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {domain.description}
                </p>

                <p className="mt-5 text-sm font-medium text-gray-900">
                  3 questions →
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Brain Gym Complete
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {result.correctAnswers} / {result.questionsAnswered} correct
            </h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Tokens earned</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  +{result.tokensEarned}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Token balance</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {result.balance}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {result.questions.map((question, index) => {
              const options = question.options;

              return (
                <div
                  key={question.questionId}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </p>

                      <h2 className="mt-2 text-lg font-semibold text-gray-900">
                        {question.question}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        question.isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {question.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {Object.entries(options).map(([letter, text]) => (
                      <div
                        key={letter}
                        className={`rounded-xl border p-3 text-sm ${
                          letter === question.correctAnswer
                            ? "border-green-300 bg-green-50"
                            : letter === question.userAnswer
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <span className="font-semibold">{letter}.</span> {text}
                      </div>
                    ))}
                  </div>

                  {!question.isCorrect && (
                    <p className="mt-4 text-sm text-gray-600">
                      Your answer:{" "}
                      <span className="font-semibold">
                        {question.userAnswer}
                      </span>
                    </p>
                  )}

                  {question.explanation && (
                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Explanation
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              to="/dashboard"
              className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const options = getOptions(question);
  const selectedAnswer = answers[question.id];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Exit Brain Gym
        </Link>

        <div className="mt-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {domains.find((domain) => domain.id === selectedDomain)?.name}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-black transition-all"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-white p-7 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            {question.difficulty}
          </p>

          <h1 className="mt-3 text-2xl font-bold leading-9 text-gray-900">
            {question.question}
          </h1>

          <div className="mt-8 space-y-3">
            {Object.entries(options).map(([letter, text]) => {
              const isSelected = selectedAnswer === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => selectAnswer(question.id, letter)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-black bg-gray-100"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  } cursor-pointer`}
                >
                  <span className="font-semibold">{letter}.</span> {text}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={submitQuiz}
                disabled={!selectedAnswer || loading}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrainGym;

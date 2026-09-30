import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

const domains = [
  {
    id: "logic",
    name: "Logic",
    description: "Test deduction, reasoning, and problem-solving.",
    icon: "🧩",
  },
  {
    id: "patterns",
    name: "Patterns",
    description: "Find sequences, relationships, and patterns.",
    icon: "🔢",
  },
  {
    id: "quick_math",
    name: "Quick Math",
    description: "Challenge your mental calculation speed.",
    icon: "➗",
  },
  {
    id: "memory",
    name: "Memory",
    description: "Test your short-term recall.",
    icon: "🧠",
  },
  {
    id: "attention",
    name: "Attention",
    description: "Test your observation and concentration.",
    icon: "👀",
  },
];

const getOptions = (question) => [
  { label: "A", value: question.option_a },
  { label: "B", value: question.option_b },
  { label: "C", value: question.option_c },
  { label: "D", value: question.option_d },
];

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
        body: JSON.stringify({
          domain,
        }),
      });

      setSelectedDomain(domain);
      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setCurrentQuestion(0);
      setAnswers({});
      setResult(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, answer) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
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

  const restart = () => {
    setSelectedDomain(null);
    setAttemptId(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setError("");
  };

  if (!selectedDomain) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
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

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Choose your challenge
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Pick a domain and complete a short challenge to earn Scroll Tokens.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => startQuiz(domain.id)}
              disabled={loading}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="text-3xl">{domain.icon}</div>

              <h2 className="mt-5 text-xl font-bold">{domain.name}</h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {domain.description}
              </p>

              <p className="mt-5 text-sm font-medium">Start challenge →</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Brain Gym Complete
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            {result.correctAnswers}/{result.questionsAnswered}
          </h1>

          <p className="mt-2 text-gray-600">Correct answers</p>

          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Tokens earned</p>

            <p className="mt-1 text-3xl font-bold">+{result.tokensEarned}</p>

            <p className="mt-2 text-sm text-gray-500">
              Current balance: {result.balance}
            </p>
          </div>

          <button
            type="button"
            onClick={restart}
            className="mt-8 rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:opacity-80"
          >
            Try another challenge
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.id];

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to Dashboard
      </Link>

      <div className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          {domains.find((domain) => domain.id === selectedDomain)?.name}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Brain Gym</h1>

          <span className="text-sm text-gray-500">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-black transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <p className="text-lg font-semibold leading-8">{question.question}</p>

          <div className="mt-6 grid gap-3">
            {getOptions(question).map((option) => {
              const isSelected = selectedAnswer === option.label;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => selectAnswer(question.id, option.label)}
                  className={`rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-black bg-gray-100"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="font-semibold">{option.label}.</span>{" "}
                  {option.value}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={previousQuestion}
              disabled={currentQuestion === 0 || loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                onClick={nextQuestion}
                disabled={!selectedAnswer || loading}
                className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submitQuiz}
                disabled={!selectedAnswer || loading}
                className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrainGym;

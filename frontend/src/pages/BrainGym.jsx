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

  const backLink =
    "inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700";
  const primaryButton =
    "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-40";

  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
        <div className="st-enter mx-auto max-w-4xl">
          <Link to="/dashboard" className={backLink}>
            <span aria-hidden="true">←</span> Back to Dashboard
          </Link>

          <div className="mt-6 max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Brain Gym: choose your challenge
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Complete three questions to earn Scroll Tokens.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {domains.map((domain) => (
              <button
                key={domain.id}
                type="button"
                onClick={() => startQuiz(domain.id)}
                disabled={loading}
                className="group rounded-xl border border-zinc-200 bg-white p-5 text-left transition hover:border-zinc-700/40 hover:bg-zinc-50/30 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 sm:p-6"
              >
                <h2 className="text-base font-semibold text-zinc-900">
                  {domain.name}
                </h2>

                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {domain.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-zinc-900">
                  <span>3 questions</span>
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
        <div className="st-enter mx-auto max-w-3xl">
          <Link to="/dashboard" className={backLink}>
            <span aria-hidden="true">←</span> Back to Dashboard
          </Link>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
            <p className="text-sm text-zinc-500">Brain Gym complete</p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {result.correctAnswers} / {result.questionsAnswered} correct
            </h1>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="st-pop rounded-lg bg-zinc-50 p-4 sm:p-5">
                <p className="text-sm text-zinc-900/70">Tokens earned</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">
                  +{result.tokensEarned}
                </p>
              </div>

              <div className="rounded-lg bg-zinc-50 p-4 sm:p-5">
                <p className="text-sm text-zinc-500">Token balance</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">
                  {result.balance}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 sm:space-y-4">
            {result.questions.map((question, index) => {
              const options = question.options;

              return (
                <div
                  key={question.questionId}
                  className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Question {index + 1}
                      </p>

                      <h2 className="mt-1 text-base font-semibold leading-snug text-zinc-900">
                        {question.question}
                      </h2>
                    </div>

                    <span
                      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${
                        question.isCorrect
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-rose-50 text-rose-800"
                      }`}
                    >
                      {question.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {Object.entries(options).map(([letter, text]) => (
                      <div
                        key={letter}
                        className={`rounded-lg border px-3.5 py-2.5 text-sm ${
                          letter === question.correctAnswer
                            ? "border-emerald-300 bg-emerald-50/70 font-medium text-emerald-900"
                            : letter === question.userAnswer
                              ? "border-rose-300 bg-rose-50/70 font-medium text-rose-900"
                              : "border-zinc-200 bg-white text-zinc-700"
                        }`}
                      >
                        <span className="mr-1.5 font-semibold">{letter}.</span>{" "}
                        {text}
                      </div>
                    ))}
                  </div>

                  {!question.isCorrect && (
                    <p className="mt-3 text-xs text-zinc-600">
                      Your answer:{" "}
                      <span className="font-semibold text-zinc-900">
                        {question.userAnswer}
                      </span>
                    </p>
                  )}

                  {question.explanation && (
                    <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                      <p className="text-xs font-semibold text-zinc-700">
                        Explanation
                      </p>

                      <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Link to="/dashboard" className={primaryButton}>
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
    <div className="min-h-screen bg-[#f6f6f3] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="st-enter mx-auto max-w-2xl">
        <Link to="/dashboard" className={backLink}>
          <span aria-hidden="true">←</span> Exit Brain Gym
        </Link>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-zinc-900">
              {domains.find((domain) => domain.id === selectedDomain)?.name}
            </p>

            <p className="mt-0.5 text-sm font-medium text-zinc-900">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div
            className="h-1.5 w-28 overflow-hidden rounded-full bg-zinc-200 sm:w-36"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={questions.length}
            aria-valuenow={currentQuestion + 1}
          >
            <div
              className="h-full rounded-full bg-teal-700 transition-all duration-300 motion-reduce:transition-none"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-5 sm:p-8">
          <p className="text-xs font-medium capitalize text-zinc-500">
            {question.difficulty}
          </p>

          <h1 className="mt-2 text-xl font-semibold leading-snug text-zinc-900 sm:text-2xl">
            {question.question}
          </h1>

          <div className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
            {Object.entries(options).map(([letter, text]) => {
              const isSelected = selectedAnswer === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => selectAnswer(question.id, letter)}
                  aria-pressed={isSelected}
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:p-4 sm:text-base ${
                    isSelected
                      ? "border-zinc-700 bg-zinc-50/60 font-medium ring-1 ring-zinc-700"
                      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                      isSelected
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="pt-px">{text}</span>
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
                className={`${primaryButton} w-full sm:w-auto`}
              >
                Next{" "}
                <span className="ml-1.5" aria-hidden="true">
                  →
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={submitQuiz}
                disabled={!selectedAnswer || loading}
                className={`${primaryButton} w-full sm:w-auto`}
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

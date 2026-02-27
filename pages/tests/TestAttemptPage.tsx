import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type Option = 'A' | 'B' | 'C' | 'D';

interface ExamRow {
  exam_id: number;
  exam_name: string;
  duration_minutes: number;
  total_questions: number;
}

interface QuestionRow {
  question_id: number;
  exam_id: number;
  subject: 'maths' | 'physics' | 'chemistry';
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface ResponseRow {
  question_id: number;
  selected_option: Option | null;
}

interface TestAttemptPageProps {
  userId: string;
  isRetake?: boolean;
}

const OPTIONS: Option[] = ['A', 'B', 'C', 'D'];

const TestAttemptPage: React.FC<TestAttemptPageProps> = ({ userId, isRetake = false }) => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get retake flag from location state or props
  const isRetakeFromState = location.state?.isRetake || false;
  const actualIsRetake = isRetake || isRetakeFromState;

  const [exam, setExam] = useState<ExamRow | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [answers, setAnswers] = useState<Record<number, Option | null>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startedAt, setStartedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [saveWarning, setSaveWarning] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const hasSubmittedRef = useRef(false);
  const pendingSavesRef = useRef<Map<number, Option | null>>(new Map());
  const lastPersistedAnswersRef = useRef<Record<number, Option | null>>({});
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFlushingRef = useRef(false);

  const examIdNum = useMemo(() => Number(examId), [examId]);

  // Listen for auth state changes to ensure session is ready
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setAuthReady(true);
      } else if (event === 'INITIAL_SESSION') {
        // Initial session is loaded from storage
        setAuthReady(true);
      } else if (event === 'SIGNED_OUT') {
        setAuthReady(false);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchExamData = async () => {
      // Wait for auth to be ready before proceeding
      if (!authReady) {
        console.log('Waiting for auth to be ready...');
        return;
      }

      // Check authentication first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session || sessionError) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!examId || Number.isNaN(examIdNum)) {
        setError('Invalid exam id.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const [{ data: examData, error: examError }, { data: questionsData, error: questionsError }] =
        await Promise.all([
          supabase
            .from('exams')
            .select('exam_id, exam_name, duration_minutes, total_questions')
            .eq('exam_id', examIdNum)
            .eq('is_active', true)
            .single(),
          supabase.from('questions').select('*').eq('exam_id', examIdNum).order('question_number', { ascending: true }),
        ]);

      if (examError || !examData) {
        setError(examError?.message || 'Exam not found.');
        setLoading(false);
        return;
      }

      if (questionsError || !questionsData?.length) {
        setError(questionsError?.message || 'No questions found for this exam.');
        setLoading(false);
        return;
      }

      const questionRows = questionsData as QuestionRow[];
      const questionIds = questionRows.map((q) => q.question_id);

      const initialAnswers: Record<number, Option | null> = {};
      questionRows.forEach((q) => {
        initialAnswers[q.question_id] = null;
      });

      // Skip fetching previous responses if this is a retake
      if (!actualIsRetake) {
        const { data: previousResponses, error: responsesError } = await supabase
          .from('student_responses')
          .select('question_id, selected_option')
          .eq('user_id', userId)
          .in('question_id', questionIds);

        if (responsesError) {
          setError(responsesError.message);
          setLoading(false);
          return;
        }

        (previousResponses as ResponseRow[] | null)?.forEach((res) => {
          initialAnswers[res.question_id] = res.selected_option;
        });
      }

      setAnswers(initialAnswers);
      lastPersistedAnswersRef.current = { ...initialAnswers };
      pendingSavesRef.current.clear();
      setSaveWarning(null);
      setSaving(false);
      setLastSavedAt(null);

      setExam(examData as ExamRow);
      setQuestions(questionRows);
      setStartedAt(new Date().toISOString());
      setTimeLeft((examData.duration_minutes || 180) * 60);
      setLoading(false);
    };

    fetchExamData();
  }, [examId, examIdNum, userId, authReady, navigate]);

  useEffect(() => {
    if (loading || submitting) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [loading, submitting]);

  const scheduleRetry = () => {
    if (retryTimeoutRef.current) return;

    retryTimeoutRef.current = setTimeout(() => {
      retryTimeoutRef.current = null;
      void flushPendingSaves();
    }, 2000);
  };

  const flushPendingSaves = async () => {
    if (isFlushingRef.current || pendingSavesRef.current.size === 0) {
      if (pendingSavesRef.current.size === 0) setSaving(false);
      return;
    }

    isFlushingRef.current = true;
    setSaving(true);

    try {
      while (pendingSavesRef.current.size > 0) {
        const nextEntry = pendingSavesRef.current.entries().next().value as [number, Option | null] | undefined;
        if (!nextEntry) break;

        const [questionId, selectedOption] = nextEntry;
        pendingSavesRef.current.delete(questionId);

        if (lastPersistedAnswersRef.current[questionId] === selectedOption) {
          continue;
        }

        const { error: saveError } = await supabase.from('student_responses').upsert(
          {
            user_id: userId,
            question_id: questionId,
            selected_option: selectedOption,
            is_correct: null,
          },
          { onConflict: 'user_id,question_id' }
        );

        if (saveError) {
          pendingSavesRef.current.set(questionId, selectedOption);
          setSaveWarning(`Auto-save retrying (${saveError.message})`);
          scheduleRetry();
          break;
        }

        lastPersistedAnswersRef.current[questionId] = selectedOption;
        setLastSavedAt(new Date().toLocaleTimeString());
        setSaveWarning(null);
      }
    } finally {
      isFlushingRef.current = false;
      if (pendingSavesRef.current.size === 0) setSaving(false);
    }
  };

  const queueAnswerSave = (questionId: number, selectedOption: Option | null) => {
    pendingSavesRef.current.set(questionId, selectedOption);
    void flushPendingSaves();
  };

  const updateAnswer = (questionId: number, selectedOption: Option | null) => {
    const currentOption = answers[questionId] ?? null;
    if (currentOption === selectedOption) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
    queueAnswerSave(questionId, selectedOption);
  };

  const clearResponse = (questionId: number) => {
    updateAnswer(questionId, null);
  };

  const saveAndNext = () => {
    const currentQ = questions[currentIndex];
    if (currentQ) {
      const selectedOption = answers[currentQ.question_id] ?? null;
      queueAnswerSave(currentQ.question_id, selectedOption);
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (autoSubmitted = false) => {
    if (submitting || hasSubmittedRef.current) return;

    // Wait for auth to be ready before proceeding
    if (!authReady) {
      setError('Authentication system is still loading. Please wait a moment and try again.');
      return;
    }

    if (!autoSubmitted) {
      setShowSubmitModal(true);
      return;
    }

    // For auto-submit, show modal with countdown
    setShowSubmitModal(true);
    setAutoSubmitCountdown(10);
  };

  const confirmSubmit = async () => {
    setShowSubmitModal(false);
    setAutoSubmitCountdown(null);

    // Check if user has active session before invoking Edge Function
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (!session || sessionError) {
      setError('Authentication required. Please log in again.');
      setSubmitting(false);
      hasSubmittedRef.current = false;
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    console.log('Session confirmed, submitting test with JWT:', session.access_token ? 'JWT present' : 'JWT missing');

    hasSubmittedRef.current = true;
    setSubmitting(true);

    const responsePayload = questions.map((question) => ({
      question_id: question.question_id,
      selected_option: answers[question.question_id] || null,
    }));

    const { data, error: submitError } = await supabase.functions.invoke('submit-test', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      },
      body: {
        user_id: userId,
        exam_id: examIdNum,
        responses: responsePayload,
        started_at: startedAt || new Date().toISOString(),
      },
    });

    console.log('Edge Function response:', { data, submitError });
    console.log('Raw data type:', typeof data);
    console.log('Raw data:', data);

    // Parse response if it's a string
    let parsedData = data;
    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data);
        console.log('Parsed data:', parsedData);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        parsedData = { success: false, error: 'Invalid response format' };
      }
    }

    console.log('Final parsed data:', parsedData);
    console.log('Success check:', parsedData?.success);

    // Handle successful response
    if (!submitError && parsedData?.success === true) {
      console.log('Test submission successful, navigating to results');
      navigate(`/dashboard/test/${examIdNum}/result`);
      return;
    }

    // Handle error response
    let submitMessage = parsedData?.error || 'Failed to submit test.';
    
    if (submitError) {
      console.log('Submit error occurred:', submitError);
      submitMessage = submitError?.message || submitMessage;
      
      const anyErr: any = submitError;
      const bodyText =
        anyErr?.context?.body ||
        anyErr?.context?.response?.body ||
        anyErr?.body ||
        null;

      if (typeof bodyText === 'string') {
        try {
          const parsed = JSON.parse(bodyText);
          submitMessage = parsed?.error || submitMessage;
        } catch {
          submitMessage = bodyText || submitMessage;
        }
      }
    }

    setSubmitting(false);
    hasSubmittedRef.current = false;
    setError(submitMessage);
    return;
  };

  useEffect(() => {
    if (loading || submitting) return;
    if (timeLeft > 0) return;
    handleSubmit(true);
  }, [loading, submitting, timeLeft]);

  // Handle auto-submit countdown
  useEffect(() => {
    if (autoSubmitCountdown === null) return;

    const timer = setTimeout(() => {
      if (autoSubmitCountdown && autoSubmitCountdown > 1) {
        setAutoSubmitCountdown(prev => prev! - 1);
      } else {
        confirmSubmit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoSubmitCountdown]);

  if (loading || !authReady) return <p className="text-gray-500">Loading test...</p>;
  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-red-100">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/dashboard/tests" className="text-indigo-600 font-semibold hover:underline">
          Back to Tests
        </Link>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100">
        <p className="text-gray-600 mb-4">Exam data unavailable.</p>
        <Link to="/dashboard/tests" className="text-indigo-600 font-semibold hover:underline">
          Back to Tests
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const markedCount = questions.filter((q) => Boolean(marked[q.question_id])).length;
  const answeredCount = questions.filter(
    (q) => Boolean(answers[q.question_id]) && !marked[q.question_id]
  ).length;
  const notAnsweredCount = questions.filter(
    (q) => !answers[q.question_id] && !marked[q.question_id]
  ).length;

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const getOptionText = (question: QuestionRow, option: Option) => {
    if (option === 'A') return question.option_a;
    if (option === 'B') return question.option_b;
    if (option === 'C') return question.option_c;
    return question.option_d;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{exam.exam_name}</h1>
          <p className="text-sm text-gray-500">
            Answered {answeredCount}/{questions.length}
            {lastSavedAt ? ` • Last saved at ${lastSavedAt}` : ''}
            {saving ? ' • Saving...' : ''}
            {saveWarning ? ` • ${saveWarning}` : ''}
          </p>
        </div>
        <div className={`text-2xl font-bold ${timeLeft <= 300 ? 'text-red-600' : 'text-indigo-700'}`}>
          {mins}:{secs}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <aside className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-bold text-gray-900 mb-4">Question Navigator</h2>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {questions.map((question, index) => {
              const isCurrent = index === currentIndex;
              const isAnswered = Boolean(answers[question.question_id]);
              const isMarked = Boolean(marked[question.question_id]);

              let buttonClass = 'bg-gray-100 text-gray-700';
              if (isAnswered) buttonClass = 'bg-green-100 text-green-700';
              if (isMarked) buttonClass = 'bg-amber-100 text-amber-700';
              if (isCurrent) buttonClass = 'bg-indigo-600 text-white';

              return (
                <button
                  key={question.question_id}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-9 w-9 rounded-md text-xs font-bold transition ${buttonClass}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          {/* Question Status Legend */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                <span className="text-gray-600">Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-gray-600">Not Visited</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                {currentQuestion.subject} • Question {currentIndex + 1}
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">{currentQuestion.question_text}</h3>
            </div>
            <div className="flex gap-2">
              {answers[currentQuestion.question_id] && (
                <button
                  onClick={() => clearResponse(currentQuestion.question_id)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Clear Response
                </button>
              )}
              <button
                onClick={() =>
                  setMarked((prev) => ({
                    ...prev,
                    [currentQuestion.question_id]: !prev[currentQuestion.question_id],
                  }))
                }
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                  marked[currentQuestion.question_id]
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {marked[currentQuestion.question_id] ? 'Marked' : 'Mark for Review'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {OPTIONS.map((option) => {
              const selected = answers[currentQuestion.question_id] === option;
              return (
                <button
                  key={option}
                  onClick={() => updateAnswer(currentQuestion.question_id, option)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold mr-2">{option}.</span>
                  {getOptionText(currentQuestion, option)}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-between">
            <div className="flex gap-3">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentIndex === questions.length - 1}
                onClick={saveAndNext}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-60 hover:bg-indigo-700"
              >
                Save & Next
              </button>
            </div>

            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </section>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {autoSubmitCountdown !== null ? 'Time Up - Auto Submitting' : 'Submit Test'}
            </h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Answered:</span>
                <span className="font-semibold text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Not Answered:</span>
                <span className="font-semibold text-red-600">{notAnsweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marked for Review:</span>
                <span className="font-semibold text-amber-600">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold">{questions.length}</span>
              </div>
            </div>

            {autoSubmitCountdown !== null && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-amber-800 text-center">
                  Auto-submitting in <span className="font-bold">{autoSubmitCountdown}</span> seconds...
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {autoSubmitCountdown === null && (
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
              >
                {autoSubmitCountdown !== null ? 'Submit Now' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAttemptPage;

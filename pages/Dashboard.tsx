import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/database';
import TestsSection from './tests/TestsSection';
import TestAttemptPage from './tests/TestAttemptPage';
import TestResultPage from './tests/TestResultPage';
import { 
  Home, 
  Video, 
  FileText, 
  MessageCircle, 
  Bell, 
  User, 
  Wifi, 
  Battery,
  Clock,
  Calendar,
  Play,
  ChevronRight
} from 'lucide-react';

type Subject = 'maths' | 'physics' | 'chemistry';

interface DailyClassRow {
  class_id: number;
  date: string;
  subject: Subject;
  teacher_name: string;
  teacher_photo_url: string | null;
  class_title: string;
  duration: string;
  youtube_live_link: string;
}

interface RecordedClassRow {
  recording_id: number;
  date: string;
  subject: Subject;
  teacher_name: string;
  teacher_photo_url: string | null;
  class_title: string;
  duration: string;
  youtube_video_link: string;
}

interface DoubtsClassRow {
  doubts_class_id: number;
  date: string;
  subject: 'maths' | 'physics' | 'chemistry' | 'general';
  teacher_name: string;
  class_title: string;
  time_slot: string;
  google_meet_link: string;
}

interface ExamAttemptRow {
  score: number;
  total_questions: number;
}

const SUBJECTS: Subject[] = ['maths', 'physics', 'chemistry'];

const getTodayISO = () => new Date().toISOString().split('T')[0];

const formatSubject = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const getRouteTitle = (pathname: string) => {
  if (pathname.includes('/test/') && pathname.includes('/attempt')) return 'Test Attempt';
  if (pathname.includes('/test/') && pathname.includes('/result')) return 'Test Result';
  if (pathname.includes('/tests')) return 'Tests';
  if (pathname.includes('/recordings')) return 'Recorded Classes';
  if (pathname.includes('/doubts')) return 'Doubts Classes';
  if (pathname.includes('/profile')) return 'Profile';
  return 'My Classes';
};

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkAuthAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*, batches(*)')
        .eq('user_id', session.user.id)
        .single();

      if (!mounted) return;

      if (error || !data || data.account_status === 'suspended') {
        await supabase.auth.signOut();
        navigate('/login');
        return;
      }

      setProfile(data);
      setLoading(false);

      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', session.user.id);
    };

    checkAuthAndProfile();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const hasDoubtsAccess = Boolean(profile?.batches?.has_doubts_access);
  const pageTitle = useMemo(() => getRouteTitle(location.pathname), [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Mobile Tab Navigation
  const MobileTabNav = () => (
    <div className="bg-white border-b border-gray-200 overflow-x-auto">
      <div className="flex space-x-6 px-4 py-3 min-w-max">
        <NavLink
          to="/dashboard/classes"
          className={({ isActive }) => `
            px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
            ${isActive 
              ? 'text-indigo-600 border-indigo-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }
          `}
        >
          Live Classes
        </NavLink>
        <NavLink
          to="/dashboard/recordings"
          className={({ isActive }) => `
            px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
            ${isActive 
              ? 'text-indigo-600 border-indigo-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }
          `}
        >
          Recorded
        </NavLink>
        <NavLink
          to="/dashboard/tests"
          className={({ isActive }) => `
            px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
            ${isActive 
              ? 'text-indigo-600 border-indigo-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }
          `}
        >
          Tests
        </NavLink>
        {hasDoubtsAccess && (
          <NavLink
            to="/dashboard/doubts"
            className={({ isActive }) => `
              px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${isActive 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
              }
            `}
          >
            Doubts
          </NavLink>
        )}
      </div>
    </div>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
      <div className="flex justify-around py-2">
        <NavLink
          to="/dashboard/classes"
          className={({ isActive }) => `
            flex flex-col items-center p-2 text-xs transition-colors
            ${isActive ? 'text-indigo-600' : 'text-gray-500'}
          `}
        >
          <Home className="w-5 h-5 mb-1" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/dashboard/recordings"
          className={({ isActive }) => `
            flex flex-col items-center p-2 text-xs transition-colors
            ${isActive ? 'text-indigo-600' : 'text-gray-500'}
          `}
        >
          <Video className="w-5 h-5 mb-1" />
          <span>Recorded</span>
        </NavLink>
        <NavLink
          to="/dashboard/tests"
          className={({ isActive }) => `
            flex flex-col items-center p-2 text-xs transition-colors
            ${isActive ? 'text-indigo-600' : 'text-gray-500'}
          `}
        >
          <FileText className="w-5 h-5 mb-1" />
          <span>Tests</span>
        </NavLink>
        <NavLink
          to="/dashboard/doubts"
          className={({ isActive }) => `
            flex flex-col items-center p-2 text-xs transition-colors
            ${isActive ? 'text-indigo-600' : 'text-gray-500'}
          `}
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span>Doubts</span>
        </NavLink>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => `
            flex flex-col items-center p-2 text-xs transition-colors
            ${isActive ? 'text-indigo-600' : 'text-gray-500'}
          `}
        >
          <User className="w-5 h-5 mb-1" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between lg:hidden sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-indigo-600">EDUSPHERE</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-600">
            Logout
          </button>
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold text-indigo-600">EDUSPHERE</span>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
          >
            <User className="w-5 h-5 text-white" />
          </button>
          <span className="text-sm text-gray-500">Hi, {profile.student_name}</span>
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-600">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        {/* Desktop Tab Navigation */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="flex space-x-6 px-6 py-3">
            <NavLink
              to="/dashboard/classes"
              className={({ isActive }) => `
                px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${isActive 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                }
              `}
            >
              Live Classes
            </NavLink>
            <NavLink
              to="/dashboard/recordings"
              className={({ isActive }) => `
                px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${isActive 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                }
              `}
            >
              Recorded
            </NavLink>
            <NavLink
              to="/dashboard/tests"
              className={({ isActive }) => `
                px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${isActive 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                }
              `}
            >
              Tests
            </NavLink>
            {hasDoubtsAccess && (
              <NavLink
                to="/dashboard/doubts"
                className={({ isActive }) => `
                  px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${isActive 
                    ? 'text-indigo-600 border-indigo-600' 
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                  }
                `}
              >
                Doubts
              </NavLink>
            )}
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => `
                px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${isActive 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                }
              `}
            >
              Profile
            </NavLink>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route index element={<Navigate to="classes" replace />} />
            <Route path="classes" element={<MyClassesSection />} />
            <Route path="recordings" element={<RecordedClassesSection />} />
            <Route path="tests" element={<TestsSection userId={profile.user_id} />} />
            <Route path="test/:examId/attempt" element={<TestAttemptPage userId={profile.user_id} />} />
            <Route path="test/:examId/result" element={<TestResultPage userId={profile.user_id} />} />
            <Route path="doubts" element={<DoubtsClassesSection hasDoubtsAccess={hasDoubtsAccess} />} />
            <Route path="profile" element={<ProfileSection profile={profile} />} />
            <Route path="*" element={<Navigate to="classes" replace />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

const MyClassesSection: React.FC = () => {
  const [classesBySubject, setClassesBySubject] = useState<Record<Subject, DailyClassRow | null>>({
    maths: null,
    physics: null,
    chemistry: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError('');

      const today = getTodayISO();
      const { data, error: fetchError } = await supabase
        .from('daily_classes')
        .select('*')
        .eq('date', today)
        .eq('is_active', true);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const mapped: Record<Subject, DailyClassRow | null> = {
        maths: null,
        physics: null,
        chemistry: null
      };
      (data || []).forEach((row) => {
        if (row.subject === 'maths' || row.subject === 'physics' || row.subject === 'chemistry') {
          mapped[row.subject] = row as DailyClassRow;
        }
      });

      setClassesBySubject(mapped);
      setLoading(false);
    };

    fetchClasses();
  }, []);

  if (loading) return <p className="text-gray-500">Loading today's classes...</p>;
  if (error) return <p className="text-red-600">Failed to load classes: {error}</p>;

  const getSubjectColor = (subject: Subject) => {
    switch (subject) {
      case 'maths': return 'bg-blue-100 text-blue-700';
      case 'physics': return 'bg-green-100 text-green-700';
      case 'chemistry': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubjectIcon = (subject: Subject) => {
    switch (subject) {
      case 'maths': return 'M';
      case 'physics': return 'P';
      case 'chemistry': return 'C';
      default: return 'D';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Date Header */}
      <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Today's Live Classes</h2>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>

      {/* Class Cards - Mobile: Single Column, Desktop: Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {SUBJECTS.map((subject) => {
          const classInfo = classesBySubject[subject];
          const initials = getSubjectIcon(subject);
          const subjectColor = getSubjectColor(subject);

          return (
            <div key={subject} className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3 lg:space-x-4 mb-4 lg:mb-6">
                {/* Teacher Avatar */}
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full ${subjectColor} flex items-center justify-center font-bold text-white flex-shrink-0`}>
                  {classInfo?.teacher_photo_url ? (
                    <img
                      src={classInfo.teacher_photo_url}
                      alt={classInfo.teacher_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg lg:text-xl">{initials}</span>
                  )}
                </div>

                {/* Subject and Teacher Info */}
                <div className="flex-1 min-w-0">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-1 lg:mb-2 ${subjectColor}`}>
                    {formatSubject(subject)}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                    {classInfo?.teacher_name || 'Teacher TBD'}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-500 line-clamp-2">
                    {classInfo?.class_title || `No ${formatSubject(subject)} class today`}
                  </p>
                </div>
              </div>

              {/* Duration and Action */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs lg:text-sm">{classInfo?.duration || 'Schedule not announced'}</span>
                </div>
                
                <button
                  onClick={() => {
                    if (classInfo?.youtube_live_link) {
                      window.open(classInfo.youtube_live_link, '_blank');
                    }
                  }}
                  disabled={!classInfo?.youtube_live_link}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
                    classInfo?.youtube_live_link
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {classInfo?.youtube_live_link ? 'Attend Class' : 'Not Scheduled'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecordedClassesSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [recordingsBySubject, setRecordingsBySubject] = useState<Record<Subject, RecordedClassRow | null>>({
    maths: null,
    physics: null,
    chemistry: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getSubjectColor = (subject: Subject) => {
    switch (subject) {
      case 'maths': return 'bg-blue-100 text-blue-700';
      case 'physics': return 'bg-green-100 text-green-700';
      case 'chemistry': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubjectIcon = (subject: Subject) => {
    switch (subject) {
      case 'maths': return 'M';
      case 'physics': return 'P';
      case 'chemistry': return 'C';
      default: return 'D';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('recorded_classes')
        .select('*')
        .eq('date', selectedDate)
        .eq('is_active', true);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const mapped: Record<Subject, RecordedClassRow | null> = {
        maths: null,
        physics: null,
        chemistry: null
      };
      (data || []).forEach((row) => {
        if (row.subject === 'maths' || row.subject === 'physics' || row.subject === 'chemistry') {
          mapped[row.subject] = row as RecordedClassRow;
        }
      });

      setRecordingsBySubject(mapped);
      setLoading(false);
    };

    fetchRecordings();
  }, [selectedDate]);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header with Date Selection */}
      <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Recorded Classes</h2>
            <p className="text-sm text-gray-600">Select a date to watch subject-wise recordings.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-gray-600">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading recordings...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load recordings: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {SUBJECTS.map((subject) => {
            const recording = recordingsBySubject[subject];
            const initials = getSubjectIcon(subject);
            const subjectColor = getSubjectColor(subject);

            return (
              <div key={subject} className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3 lg:space-x-4 mb-4 lg:mb-6">
                  {/* Teacher Avatar */}
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full ${subjectColor} flex items-center justify-center font-bold text-white flex-shrink-0`}>
                    {recording?.teacher_photo_url ? (
                      <img
                        src={recording.teacher_photo_url}
                        alt={recording.teacher_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg lg:text-xl">{initials}</span>
                    )}
                  </div>

                  {/* Subject and Teacher Info */}
                  <div className="flex-1 min-w-0">
                    <div className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-1 lg:mb-2 ${subjectColor}`}>
                      {formatSubject(subject)}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                      {recording?.teacher_name || 'Teacher TBD'}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-500 line-clamp-2">
                      {recording?.class_title || `No ${formatSubject(subject)} recording`}
                    </p>
                  </div>
                </div>

                {/* Duration and Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs lg:text-sm">{recording?.duration || 'No duration available'}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (recording?.youtube_video_link) {
                        window.open(recording.youtube_video_link, '_blank');
                      }
                    }}
                    disabled={!recording?.youtube_video_link}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
                      recording?.youtube_video_link
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {recording?.youtube_video_link ? 'Watch Recording' : 'No Recording'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DoubtsClassesSection: React.FC<{ hasDoubtsAccess: boolean }> = ({ hasDoubtsAccess }) => {
  const [sessions, setSessions] = useState<DoubtsClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      if (!hasDoubtsAccess) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('doubts_classes')
        .select('*')
        .gte('date', getTodayISO())
        .eq('is_active', true)
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setSessions((data || []) as DoubtsClassRow[]);
      setLoading(false);
    };

    fetchSessions();
  }, [hasDoubtsAccess]);

  if (!hasDoubtsAccess) {
    return (
      <div className="bg-white border border-orange-100 rounded-lg p-6 lg:p-8">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Restricted Section</h2>
        <p className="text-gray-600">
          Doubts Classes are available only for batches with doubts access.
        </p>
      </div>
    );
  }

  if (loading) return (
    <div className="text-center py-8">
      <p className="text-gray-500">Loading doubts sessions...</p>
    </div>
  );
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-600">Failed to load doubts sessions: {error}</p>
    </div>
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Upcoming Doubts Classes</h2>
        <p className="text-sm text-gray-600">Join sessions and clear your doubts with faculty.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-6 lg:p-8 text-center">
          <p className="text-gray-500">No upcoming doubts sessions are scheduled right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {sessions.map((session) => (
            <div key={session.doubts_class_id} className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 ${
                    session.subject === 'maths' ? 'bg-blue-100 text-blue-700' :
                    session.subject === 'physics' ? 'bg-green-100 text-green-700' :
                    session.subject === 'chemistry' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {formatSubject(session.subject)}
                  </div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 line-clamp-2">{session.class_title}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 whitespace-nowrap">
                  {new Date(session.date).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Teacher: <span className="font-medium">{session.teacher_name}</span></p>
                <p className="text-sm text-gray-600">Time: <span className="font-medium">{session.time_slot}</span></p>
              </div>

              <button
                onClick={() => {
                  if (session.google_meet_link) {
                    window.open(session.google_meet_link, '_blank');
                  }
                }}
                className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Join Doubts Class
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSection: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [stats, setStats] = useState({
    testsAttempted: 0,
    averageScore: 0,
    averagePercent: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);

      const { data } = await supabase
        .from('exam_attempts')
        .select('score, total_questions')
        .eq('user_id', profile.user_id);

      const attempts = (data || []) as ExamAttemptRow[];

      if (!attempts.length) {
        setStats({
          testsAttempted: 0,
          averageScore: 0,
          averagePercent: 0,
        });
        setLoadingStats(false);
        return;
      }

      const totalScore = attempts.reduce((acc, row) => acc + row.score, 0);
      const totalQuestions = attempts.reduce((acc, row) => acc + row.total_questions, 0);
      const averageScore = Number((totalScore / attempts.length).toFixed(1));
      const averagePercent = totalQuestions ? Math.round((totalScore / totalQuestions) * 100) : 0;

      setStats({
        testsAttempted: attempts.length,
        averageScore,
        averagePercent,
      });
      setLoadingStats(false);
    };

    fetchStats();
  }, [profile.user_id]);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Profile</h2>
        <p className="text-sm text-gray-600">Your personal details, batch info and performance stats.</p>
      </div>

      {/* Personal and Batch Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <section className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Personal Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-semibold text-gray-900 text-right">{profile.student_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-semibold text-gray-900 text-right truncate max-w-[200px]">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="font-semibold text-gray-900 text-right">{profile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Status:</span>
              <span className="font-semibold text-gray-900 capitalize text-right">{profile.account_status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined On:</span>
              <span className="font-semibold text-gray-900 text-right">{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Batch Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Batch Name:</span>
              <span className="font-semibold text-gray-900 capitalize text-right">{profile.batches?.batch_name || 'Not assigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration:</span>
              <span className="font-semibold text-gray-900 text-right">{profile.batches?.duration_months || 0} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Doubts Access:</span>
              <span className="font-semibold text-gray-900 text-right">
                {profile.batches?.has_doubts_access ? 'Enabled' : 'Not available'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Test Statistics */}
      <section className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Test Statistics</h3>
        {loadingStats ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading test statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-2">Tests Attempted</p>
              <p className="text-2xl lg:text-3xl font-bold text-indigo-700">{stats.testsAttempted}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide mb-2">Average Score</p>
              <p className="text-2xl lg:text-3xl font-bold text-emerald-700">{stats.averageScore}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-wide mb-2">Average Percentage</p>
              <p className="text-2xl lg:text-3xl font-bold text-amber-700">{stats.averagePercent}%</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

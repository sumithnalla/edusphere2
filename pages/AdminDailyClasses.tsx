import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DailyClass } from '../types/database';
import AdminSidebar from '../components/AdminSidebar';

type DailySubject = DailyClass['subject'];

interface DailyClassFormData {
  date: string;
  subject: DailySubject;
  teacher_name: string;
  class_title: string;
  duration: string;
  youtube_live_link: string;
}

const SUBJECT_OPTIONS: DailySubject[] = ['maths', 'physics', 'chemistry'];

const getTodayISO = () => {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localNow.toISOString().split('T')[0];
};

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString();

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const createDefaultForm = (): DailyClassFormData => ({
  date: getTodayISO(),
  subject: 'maths',
  teacher_name: '',
  class_title: '',
  duration: '',
  youtube_live_link: '',
});

const AdminDailyClasses: React.FC = () => {
  const [rows, setRows] = useState<DailyClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filterDate, setFilterDate] = useState(getTodayISO());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DailyClassFormData>(createDefaultForm());
  const navigate = useNavigate();

  const requireAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.app_metadata?.role !== 'admin') {
      navigate('/admin/login');
      return false;
    }
    return true;
  };

  const loadRows = async (dateValue: string) => {
    if (!(await requireAdmin())) return;

    setLoading(true);
    setError('');

    let query = supabase.from('daily_classes').select('*').order('date', { ascending: false }).order('created_at', {
      ascending: false,
    });
    if (dateValue) {
      query = query.eq('date', dateValue);
    }

    const { data, error: fetchError } = await query;
    if (fetchError) {
      setError(fetchError.message);
      setRows([]);
      setLoading(false);
      return;
    }

    setRows((data || []) as DailyClass[]);
    setLoading(false);
  };

  useEffect(() => {
    loadRows(filterDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(createDefaultForm());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!(await requireAdmin())) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      if (!isValidUrl(formData.youtube_live_link)) {
        throw new Error('Please enter a valid YouTube live link.');
      }

      const payload = {
        date: formData.date,
        subject: formData.subject,
        teacher_name: formData.teacher_name.trim(),
        class_title: formData.class_title.trim(),
        duration: formData.duration.trim(),
        youtube_live_link: formData.youtube_live_link.trim(),
      };

      if (editingId) {
        const { error: updateError } = await supabase.from('daily_classes').update(payload).eq('class_id', editingId);
        if (updateError) throw updateError;
        setNotice('Class updated successfully.');
      } else {
        const { error: insertError } = await supabase.from('daily_classes').insert(payload);
        if (insertError) throw insertError;
        setNotice('Class added successfully.');
      }

      resetForm();
      await loadRows(filterDate);
    } catch (err: any) {
      setError(err.message || 'Failed to save class.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (classId: number) => {
    if (!(await requireAdmin())) return;
    if (!window.confirm('Delete this class record permanently?')) return;

    setError('');
    setNotice('');
    const { error: deleteError } = await supabase.from('daily_classes').delete().eq('class_id', classId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setNotice('Class deleted.');
    await loadRows(filterDate);
    if (editingId === classId) resetForm();
  };

  const handleToggleActive = async (row: DailyClass) => {
    if (!(await requireAdmin())) return;

    setError('');
    setNotice('');
    const { error: updateError } = await supabase
      .from('daily_classes')
      .update({ is_active: !row.is_active })
      .eq('class_id', row.class_id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotice('Class status updated.');
    await loadRows(filterDate);
  };

  const startEdit = (row: DailyClass) => {
    setEditingId(row.class_id);
    setFormData({
      date: row.date,
      subject: row.subject,
      teacher_name: row.teacher_name,
      class_title: row.class_title,
      duration: row.duration,
      youtube_live_link: row.youtube_live_link,
    });
    setNotice('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="ml-64 flex-grow p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Daily Classes</h1>
          <p className="text-gray-500 mt-1">Create and manage live class schedules for students.</p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{notice}</div>}

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">{editingId ? 'Edit Class' : 'Add New Class'}</h2>
            {editingId && (
              <button onClick={resetForm} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={(event) => setFormData({ ...formData, subject: event.target.value as DailySubject })}
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {SUBJECT_OPTIONS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Teacher Name</label>
              <input
                required
                value={formData.teacher_name}
                onChange={(event) => setFormData({ ...formData, teacher_name: event.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Faculty name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Class Title</label>
              <input
                required
                value={formData.class_title}
                onChange={(event) => setFormData({ ...formData, class_title: event.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Chapter / topic name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Duration</label>
              <input
                required
                value={formData.duration}
                onChange={(event) => setFormData({ ...formData, duration: event.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Example: 60 mins"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">YouTube Live Link</label>
              <input
                required
                type="url"
                value={formData.youtube_live_link}
                onChange={(event) => setFormData({ ...formData, youtube_live_link: event.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="md:col-span-2">
              <button
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : editingId ? 'Update Class' : 'Add Class'}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Classes List</h2>
              <p className="text-sm text-gray-500 mt-1">Filter by date and manage active status.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(event) => setFilterDate(event.target.value)}
                className="border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setFilterDate('')}
                className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Teacher</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Live Link</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      Loading classes...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      No classes found for current filter.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.class_id} className="hover:bg-gray-50">
                      <td className="p-4">{formatDate(row.date)}</td>
                      <td className="p-4 capitalize">{row.subject}</td>
                      <td className="p-4">{row.teacher_name}</td>
                      <td className="p-4">{row.class_title}</td>
                      <td className="p-4">{row.duration}</td>
                      <td className="p-4">
                        <a
                          href={row.youtube_live_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          Open
                        </a>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            row.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {row.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => startEdit(row)}
                            className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(row)}
                            className="px-3 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100"
                          >
                            {row.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(row.class_id)}
                            className="px-3 py-1 text-xs font-semibold rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDailyClasses;

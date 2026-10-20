// src/App.jsx
// Source: Local React setup and standard JS Date math
import { useState, useEffect } from 'react';

export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const TEAM = ['Toby Bishop'];

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', [
    {
      id: '1',
      title: 'setup vite and react',
      description: 'get local dev running',
      type: 'feature',
      status: 'done', 
      assignee: 'Toby Bishop',
      dueDate: '2026-10-25',
      createdDate: '2026-10-20'
    },
    {
      id: '2',
      title: 'design tailwind colors',
      description: 'sort out the mid-grey colors',
      type: 'feature',
      status: 'review',
      assignee: 'Toby Bishop',
      dueDate: '2026-10-26',
      createdDate: '2026-10-20'
    },
    {
      id: '3',
      title: 'fix board layout',
      description: 'padding on mobile is off',
      type: 'bug',
      status: 'in-progress',
      assignee: 'Toby Bishop',
      dueDate: '2026-10-22',
      createdDate: '2026-10-20'
    },
    {
      id: '4',
      title: 'create add task modal',
      description: 'build the form',
      type: 'feature',
      status: 'todo',
      assignee: 'Toby Bishop',
      dueDate: '2026-10-28',
      createdDate: '2026-10-20'
    }
  ]);

  const [editing, setEditing] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = Object.fromEntries(formData.entries());

    if (editing.id) {
      setTasks(tasks.map(t => t.id === editing.id ? { ...t, ...taskData } : t));
    } else {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0]
      };
      setTasks([...tasks, newTask]);
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (editing.id && window.confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== editing.id));
      setEditing(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper to figure out how close the deadline is and return the right colors
  const getDueTint = (dueDate, status) => {
    if (status === 'done') return 'border-due-neutral bg-slate-50';
    if (!dueDate) return 'border-slate-200 bg-white';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    // Get the difference in days
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'border-due-overdue bg-red-50'; // Past due
    if (diffDays <= 1) return 'border-due-warning bg-orange-50'; // Less than 24-48 hours
    return 'border-due-safe bg-white'; // Safe
  };

  return (
    <div className="min-h-screen bg-surface-page p-6 font-sans">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary tracking-tight">
            Team Bish Tracker
          </h1>
          <p className="text-sm text-text-muted mt-1">
            A solo vibecoding project tracker built for speed.
          </p>
        </div>
        
        <button
          onClick={() => setEditing({ title: '', description: '', type: 'feature', status: 'todo', assignee: TEAM[0], dueDate: '' })}
          className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          + Add Task
        </button>
      </header>

      <main className="grid grid-cols-4 gap-6 pb-4">
        {STAGES.map(stage => (
          <div key={stage.id} className="bg-surface-card rounded-xl p-4 min-h-[70vh] border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
              {stage.label}
            </h2>
            
            <div className="space-y-3">
              {tasks.filter(t => t.status === stage.id).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => setEditing(task)}
                  // Inject the dynamic due date tint here
                  className={`p-4 rounded-lg border-2 hover:border-brand-primary transition-colors shadow-sm cursor-pointer flex flex-col gap-3 ${getDueTint(task.dueDate, task.status)}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium text-text-primary leading-tight">{task.title}</p>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      task.type === 'bug' 
                        ? 'bg-bug/10 text-bug' 
                        : 'bg-feature/10 text-feature'
                    }`}>
                      {task.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1 border-t border-slate-200/60 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-[10px] font-bold border border-brand-primary/20">
                        {getInitials(task.assignee)}
                      </div>
                      <span className="text-xs text-text-muted font-medium">{task.assignee}</span>
                    </div>
                    {/* Render the due date so you can test the math */}
                    <span className="text-[10px] text-text-muted font-mono">
                      {task.dueDate ? task.dueDate : 'No due date'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {editing && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-card rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-text-primary">
                {editing.id ? 'Edit Task' : 'New Task'}
              </h2>

              <div>
                <label className="block text-sm text-text-muted mb-1">Title</label>
                <input name="title" defaultValue={editing.title} required className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary outline-none focus:border-brand-primary" />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1">Description</label>
                <textarea name="description" defaultValue={editing.description} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary h-24 outline-none focus:border-brand-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1">Type</label>
                  <select name="type" defaultValue={editing.type} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary outline-none focus:border-brand-primary">
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Status</label>
                  <select name="status" defaultValue={editing.status} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary outline-none focus:border-brand-primary">
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1">Assignee</label>
                  <select name="assignee" defaultValue={editing.assignee} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary outline-none focus:border-brand-primary">
                    {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Due Date</label>
                  <input type="date" name="dueDate" defaultValue={editing.dueDate} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary outline-none focus:border-brand-primary" />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                {editing.id ? (
                  <button type="button" onClick={handleDelete} className="text-bug hover:text-red-700 text-sm font-medium transition-colors">
                    Delete
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(null)} className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
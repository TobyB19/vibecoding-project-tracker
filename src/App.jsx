// src/App.jsx
// Source: Local React setup with search bar and task completion progress
import { useState, useEffect } from 'react';

export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const TEAM = ['Toby Bishop'];

export const DELIVERABLES = [
  { id: 'd1', label: 'Design System', status: 'done' },
  { id: 'd2', label: 'Data Model', status: 'done' },
  { id: 'd3', label: 'CRUD Operations', status: 'done' },
  { id: 'd4', label: 'AI Context Integration', status: 'done' },
  { id: 'd5', label: 'Accessibility Report', status: 'todo' },
];

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
      context: 'use vite with react swc template',
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
      context: '',
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
      context: '',
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
      context: 'needs to have crud functionality',
      type: 'feature',
      status: 'todo',
      assignee: 'Toby Bishop',
      dueDate: '2026-10-28',
      createdDate: '2026-10-20'
    }
  ]);

  const [editing, setEditing] = useState(null);
  const [copied, setCopied] = useState(false);

  // Secret Sauce 1: Quick Search Query State
  const [searchQuery, setSearchQuery] = useState('');

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
    setCopied(false);
  };

  const handleDelete = () => {
    if (editing.id && window.confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== editing.id));
      setEditing(null);
      setCopied(false);
    }
  };

  const handleCopy = () => {
    if (editing && editing.context) {
      navigator.clipboard.writeText(editing.context);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDueTint = (dueDate, status) => {
    if (status === 'done') return 'border-due-neutral bg-slate-50';
    if (!dueDate) return 'border-slate-200 bg-white';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'border-due-overdue bg-red-50';
    if (diffDays <= 1) return 'border-due-warning bg-orange-50';
    return 'border-due-safe bg-white';
  };

  // Secret Sauce 2: Completion Progress Bar Math
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  // Filter tasks based on search query
  const displayedTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-page p-6 font-sans">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary tracking-tight">
            Team Bish Tracker
          </h1>
          <p className="text-sm text-text-muted mt-1">
            A solo vibecoding project tracker built for speed.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Search Input */}
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-card border border-slate-200 text-text-primary text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-primary shadow-sm placeholder:text-text-muted w-48"
          />

          <button
            onClick={() => {
              setEditing({ title: '', description: '', context: '', type: 'feature', status: 'todo', assignee: TEAM[0], dueDate: '' });
              setCopied(false);
            }}
            className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            + Add Task
          </button>
        </div>
      </header>

      {/* Deliverables and Progress Bar Section */}
      <section className="mb-8 bg-surface-card rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Project Deliverables
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {DELIVERABLES.map(d => (
              <div key={d.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm whitespace-nowrap">
                <div className={`w-2 h-2 rounded-full ${d.status === 'done' ? 'bg-feature' : 'bg-brand-primary'}`} />
                <span className="text-sm font-medium text-text-primary">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Overall Completion</span>
            <span className="text-xs font-bold text-brand-primary">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-brand-primary h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </section>

      <main className="grid grid-cols-4 gap-6 pb-4">
        {STAGES.map(stage => (
          <div key={stage.id} className="bg-surface-card rounded-xl p-4 min-h-[70vh] border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
              {stage.label}
            </h2>
            
            <div className="space-y-3">
              {displayedTasks.filter(t => t.status === stage.id).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => {
                    setEditing(task);
                    setCopied(false);
                  }}
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
          <div className="bg-surface-card rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
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
                <textarea name="description" defaultValue={editing.description} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary h-20 outline-none focus:border-brand-primary" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-text-muted">AI Context (Paste-ready briefing)</label>
                  <button 
                    type="button" 
                    onClick={handleCopy}
                    className="text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea 
                  name="context" 
                  value={editing.context} 
                  onChange={(e) => setEditing({...editing, context: e.target.value})}
                  placeholder="Drop code snippets or AI prompts here..." 
                  className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-text-primary h-20 outline-none focus:border-brand-primary font-mono text-xs" 
                />
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
                  <button type="button" onClick={() => { setEditing(null); setCopied(false); }} className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">
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
// src/App.jsx
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
      </header>

      <main className="grid grid-cols-4 gap-6 pb-4">
        {STAGES.map(stage => (
          <div key={stage.id} className="bg-surface-card rounded-xl p-4 min-h-[70vh] border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
              {stage.label}
            </h2>
            
            <div className="space-y-3">
              {tasks.filter(t => t.status === stage.id).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-brand-primary transition-colors shadow-sm">
                  <p className="text-sm font-medium text-text-primary">{task.title}</p>
                  <p className="text-xs text-text-muted mt-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                      T
                    </span>
                    {task.assignee}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface Note {
  id: string;
  author: string;
  text: string;
  at: string;
}

const KEY = (slug: string) => `eapn-notes-${slug}`;

/**
 * Listener notes (comments) — stored locally per episode in demo mode;
 * in production these sync via /api/listening-history or a comments service.
 */
export default function ListenerNotes({ episodeSlug }: { episodeSlug: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY(episodeSlug));
      if (raw) setNotes(JSON.parse(raw) as Note[]);
    } catch {
      /* ignore */
    }
  }, [episodeSlug]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const note: Note = {
      id: Math.random().toString(36).slice(2),
      author: author.trim() || 'Anonymous listener',
      text: text.trim(),
      at: new Date().toISOString(),
    };
    const next = [note, ...notes].slice(0, 50);
    setNotes(next);
    localStorage.setItem(KEY(episodeSlug), JSON.stringify(next));
    setText('');
  };

  return (
    <div>
      <h2 className="section-heading font-bold mb-6 flex items-center gap-2">
        <MessageCircle size={20} className="text-primary" /> Listener Notes
      </h2>
      <form onSubmit={submit} className="card-eapn p-5 mb-6" noValidate>
        <div className="grid sm:grid-cols-[200px_1fr] gap-3">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="field"
            aria-label="Your name"
          />
          <div className="flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share a note about this episode…"
              className="field flex-1"
              aria-label="Your note"
            />
            <button type="submit" className="btn-primary-eapn shrink-0">
              Post
            </button>
          </div>
        </div>
      </form>
      {notes.length === 0 ? (
        <p className="text-[14px] font-light text-body/70">
          No notes yet — be the first to share what this episode made you think about.
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="card-eapn p-4">
              <p className="text-[14px] text-ink font-normal">
                {n.author}
                <span className="text-[12px] text-body/50 font-light ml-2">
                  {new Date(n.at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                </span>
              </p>
              <p className="text-[14px] font-light text-body mt-1">{n.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

/** Transcript accordion (if a transcript is available for the episode). */
export default function TranscriptAccordion({ transcript }: { transcript?: string[] }) {
  const [open, setOpen] = useState(false);

  if (!transcript || transcript.length === 0) {
    return (
      <div className="card-eapn p-6 text-center">
        <FileText size={20} className="text-primary mx-auto mb-2" />
        <p className="text-[14px] font-light text-body">
          Transcript for this episode is on the way — our transcription partners process new
          episodes within 48 hours of publication.
        </p>
      </div>
    );
  }

  return (
    <div className="card-eapn overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-menuhover/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-[16px] font-normal text-ink">
          <FileText size={16} className="text-primary" /> Transcript
        </span>
        <ChevronDown size={18} className={`text-body transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-line pt-5">
          {transcript.map((line, i) => (
            <p key={i} className="text-[15px] font-light text-body leading-[1.9] mb-3">
              {line}
            </p>
          ))}
          <p className="text-[12px] text-body/50 font-light">
            Transcript continues in the full episode. Automated transcription, lightly edited.
          </p>
        </div>
      )}
    </div>
  );
}

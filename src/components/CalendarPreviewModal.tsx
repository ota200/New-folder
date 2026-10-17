import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { SyllabusAnalysisResult } from '../types/syllabus';
import { generateIcsCalendar, downloadFile } from '../utils/calendarExport';

interface CalendarPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SyllabusAnalysisResult | null;
}

export const CalendarPreviewModal: React.FC<CalendarPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  // Flatten events for timeline display
  const timelineEvents: Array<{
    date: string;
    title: string;
    type: 'due' | 'prep' | 'milestone';
    parentItem: string;
    weight?: string;
    details?: string;
  }> = [];

  data.items.forEach((item) => {
    // Due Date
    timelineEvents.push({
      date: item.dueDate,
      title: `[DUE] ${item.title}`,
      type: 'due',
      parentItem: item.id,
      weight: item.weight,
      details: item.description,
    });

    // Prep start
    if (item.prepingInfo?.prepDate) {
      timelineEvents.push({
        date: item.prepingInfo.prepDate,
        title: `[PREP START] Study for: ${item.title}`,
        type: 'prep',
        parentItem: item.id,
        details: `Duration: ${item.prepingInfo.duration}. ${item.prepingInfo.summary}`,
      });
    }

    // Milestones
    if (item.prepingInfo?.milestones) {
      const dueD = new Date(item.dueDate);
      if (!isNaN(dueD.getTime())) {
        item.prepingInfo.milestones.forEach((m) => {
          const mDate = new Date(dueD);
          mDate.setDate(mDate.getDate() - (m.dayOffset ?? 2));
          timelineEvents.push({
            date: mDate.toISOString().slice(0, 10),
            title: `[STUDY BLOCK] ${m.title}`,
            type: 'milestone',
            parentItem: item.id,
            details: `Milestone for ${item.title} (${m.durationMinutes || 60} mins)`,
          });
        });
      }
    }
  });

  // Sort chronological
  timelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleDownload = () => {
    const icsContent = generateIcsCalendar(data, { includePrepSessions: true });
    const filename = `${(data.courseCode || 'course').toLowerCase()}_calendar.ics`;
    downloadFile(icsContent, filename, 'text/calendar;charset=utf-8');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Calendar Timeline Preview
              </h2>
              <p className="text-xs text-slate-400">
                Scheduled events &amp; preparation sessions imported to Apple, Google, or Outlook Calendar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ics</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-3">
            {timelineEvents.map((evt, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  evt.type === 'due'
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : evt.type === 'prep'
                    ? 'bg-purple-950/20 border-purple-800/60'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    evt.type === 'due'
                      ? 'bg-emerald-400 ring-4 ring-emerald-950'
                      : evt.type === 'prep'
                      ? 'bg-purple-400 ring-4 ring-purple-950'
                      : 'bg-blue-400 ring-4 ring-slate-900'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {evt.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {evt.date.slice(0, 10)}
                    </span>
                  </div>

                  {evt.details && (
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {evt.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

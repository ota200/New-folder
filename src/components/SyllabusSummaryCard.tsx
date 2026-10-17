import React, { useState } from 'react';
import {
  Calendar,
  Download,
  FileCode,
  Copy,
  Check,
  GraduationCap,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { SyllabusAnalysisResult } from '../types/syllabus';
import { generateIcsCalendar, downloadFile } from '../utils/calendarExport';

interface SyllabusSummaryCardProps {
  data: SyllabusAnalysisResult;
  onViewJson: () => void;
  onReset: () => void;
}

export const SyllabusSummaryCard: React.FC<SyllabusSummaryCardProps> = ({
  data,
  onViewJson,
  onReset,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [includePrepInIcs, setIncludePrepInIcs] = useState(true);

  const courseTitle = data.courseName || 'Extracted Course Syllabus';
  const totalItems = data.items.length;

  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendar(data, {
      includePrepSessions: includePrepInIcs,
    });
    const filename = `${(data.courseCode || 'course').toLowerCase().replace(/[^a-z0-9]/g, '_')}_schedule.ics`;
    downloadFile(icsContent, filename, 'text/calendar;charset=utf-8');
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const filename = `${(data.courseCode || 'course').toLowerCase().replace(/[^a-z0-9]/g, '_')}_schedule.json`;
    downloadFile(jsonStr, filename, 'application/json;charset=utf-8');
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {data.courseCode && (
              <span className="px-2.5 py-0.5 rounded-lg font-mono text-xs font-semibold bg-blue-950/80 border border-blue-800/80 text-blue-300">
                {data.courseCode}
              </span>
            )}
            {data.semester && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300">
                {data.semester}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              AI Extracted
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {courseTitle}
          </h2>

          {data.instructor && (
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span>Instructor: <strong className="text-slate-300">{data.instructor}</strong></span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* iCalendar Download Button */}
          <div className="relative inline-flex items-center">
            <button
              onClick={handleDownloadIcs}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              title="Download iCalendar file (.ics)"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Download .ics Calendar</span>
            </button>
          </div>

          {/* JSON Download Button */}
          <button
            onClick={handleDownloadJson}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download JSON structure"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          {/* Copy JSON */}
          <button
            onClick={handleCopyJson}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="Copy JSON to clipboard"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* View Raw JSON */}
          <button
            onClick={onViewJson}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="Inspect raw JSON schema"
          >
            <FileCode className="w-4 h-4" />
          </button>

          {/* Reset / Upload Another */}
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            New Upload
          </button>
        </div>
      </div>

      {/* Metrics Row & iCal Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>
              Total Items: <strong className="text-white font-mono">{totalItems}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>
              Includes preparation blocks &amp; study schedules
            </span>
          </div>
        </div>

        {/* Toggle option for ICS export */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 text-xs">
          <input
            type="checkbox"
            checked={includePrepInIcs}
            onChange={(e) => setIncludePrepInIcs(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-950 cursor-pointer"
          />
          <span>Include prep &amp; milestone blocks in .ics calendar</span>
        </label>
      </div>
    </div>
  );
};

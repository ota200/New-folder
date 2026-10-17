export interface PrepMilestone {
  id: string;
  dayOffset?: number;
  title: string;
  durationMinutes?: number;
}

export interface PrepingInfo {
  id: string;
  duration: string;
  summary: string;
  prepDate?: string;
  milestones?: PrepMilestone[];
}

export interface SyllabusItem {
  id: string;
  title: string;
  type: 'assignment' | 'exam' | 'quiz' | 'project' | 'midterm' | 'final' | 'lab' | 'homework' | 'paper' | string;
  dueDate: string;
  weight: string;
  description?: string;
  prepingInfo: PrepingInfo;
}

export interface SyllabusAnalysisResult {
  courseName?: string;
  courseCode?: string;
  instructor?: string;
  semester?: string;
  items: SyllabusItem[];
}

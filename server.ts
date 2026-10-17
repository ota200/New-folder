import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Increase body parser limit to support PDF uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize server-side Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Analyze PDF document with Gemini API
app.post('/api/analyze-pdf', async (req: Request, res: Response) => {
  try {
    const { pdfBase64, filename } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({
        error: 'Missing PDF data',
        message: 'Please provide a base64 encoded PDF file to analyze.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY',
        message: 'GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    // Strip data URL scheme if present (e.g. "data:application/pdf;base64,")
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').replace(/\s/g, '');

    const promptText = `You are a high-level academic assistant and syllabus schedule extractor.
Analyze the attached PDF syllabus, course document, or exam guide (${filename || 'document.pdf'}).
Carefully extract all assignments, homeworks, exams, midterms, finals, quizzes, projects, labs, and deliverables.

For each item, extract:
1. id: A unique alphanumeric identifier (e.g., "item-1", "midterm-1", "proj-2")
2. title: The exact title or name of the assignment/exam (e.g., "Midterm Exam 1", "Project 3: Neural Net Classifier")
3. type: Classification, one of: "assignment", "exam", "quiz", "project", "midterm", "final", "lab", "homework", "presentation", "paper"
4. dueDate: Due date in ISO format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss. If time is omitted in document, default to 23:59:00. Infer current/upcoming academic year 2026.
5. weight: Weight towards final grade, e.g., "15%", "25%", "100 pts", "10%"
6. description: Brief summary of instructions, coverage, and requirements
7. prepingInfo:
   - id: Unique identifier for preparation (e.g., "prep-item-1")
   - duration: Recommended prep duration (e.g., "12 hours across 4 days", "6 hours", "3 days")
   - summary: Specific, actionable study advice and preparation checklist (chapters, practice problems, draft reviews, software setup)
   - prepDate: Recommended preparation start date in YYYY-MM-DD format (scheduled ahead of the due date, e.g., 5 to 10 days before exams/projects, 2 to 4 days for homework)
   - milestones: 2 to 4 actionable study blocks/milestones leading up to the due date with dayOffset (days prior to dueDate), title, and durationMinutes.

Also detect the courseName, courseCode, instructor, and semester from the syllabus header.
Ensure dueDate and prepDate are in valid date format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanBase64,
          },
        },
        {
          text: promptText,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courseName: { type: Type.STRING, description: 'Full course title' },
            courseCode: { type: Type.STRING, description: 'Course code like CS 189 or MATH 110' },
            instructor: { type: Type.STRING, description: 'Course instructor name' },
            semester: { type: Type.STRING, description: 'Semester or term, e.g. Fall 2026 or Spring 2026' },
            items: {
              type: Type.ARRAY,
              description: 'List of all assignments, projects, quizzes, and exams',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Unique identifier' },
                  title: { type: Type.STRING, description: 'Assignment or exam title' },
                  type: { type: Type.STRING, description: 'Type of item' },
                  dueDate: { type: Type.STRING, description: 'Due date in YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss format' },
                  weight: { type: Type.STRING, description: 'Percentage or point weight' },
                  description: { type: Type.STRING, description: 'Summary of the assignment or exam' },
                  prepingInfo: {
                    type: Type.OBJECT,
                    description: 'Preparation time, schedule, and checklist',
                    properties: {
                      id: { type: Type.STRING, description: 'Prep session ID' },
                      duration: { type: Type.STRING, description: 'Recommended prep time duration' },
                      summary: { type: Type.STRING, description: 'Detailed study summary and guidelines' },
                      prepDate: { type: Type.STRING, description: 'Recommended prep start date (YYYY-MM-DD)' },
                      milestones: {
                        type: Type.ARRAY,
                        description: 'Step-by-step prep milestones leading up to deadline',
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            dayOffset: { type: Type.INTEGER, description: 'Days before dueDate' },
                            title: { type: Type.STRING, description: 'Specific milestone task' },
                            durationMinutes: { type: Type.INTEGER, description: 'Time in minutes for this session' },
                          },
                          required: ['id', 'title'],
                        },
                      },
                    },
                    required: ['id', 'duration', 'summary'],
                  },
                },
                required: ['id', 'title', 'type', 'dueDate', 'weight', 'prepingInfo'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Gemini API returned an empty response.');
    }

    const parsedData = JSON.parse(outputText);
    return res.json({
      success: true,
      data: parsedData,
      rawTokens: response.usageMetadata,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-pdf:', error);
    return res.status(500).json({
      error: 'Analysis Failed',
      message: error?.message || 'Failed to analyze PDF with Gemini API.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

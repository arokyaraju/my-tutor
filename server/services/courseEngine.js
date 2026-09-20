import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COURSE_DOMAINS, getAllCoursesFlat } from '../data/courseCatalogData.js';
import { synthesizeElaborateCourse } from './curriculumSynthesizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COURSES_PATH = path.join(__dirname, '..', 'data', 'courses.json');
const STUDENT_STATE_PATH = path.join(__dirname, '..', 'data', 'studentState.json');

export function loadCourses() {
  try {
    if (fs.existsSync(COURSES_PATH)) {
      return JSON.parse(fs.readFileSync(COURSES_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error("Error reading courses.json:", err);
  }
  return [];
}

export function saveCourses(courses) {
  try {
    fs.writeFileSync(COURSES_PATH, JSON.stringify(courses, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving courses.json:", err);
  }
}

export function getCatalog() {
  const allFlat = getAllCoursesFlat();
  const loadedCourses = loadCourses();
  const loadedIds = new Set(loadedCourses.map(c => c.id));
  const loadedTitles = new Set(loadedCourses.map(c => c.title.toLowerCase()));

  // Annotate courses with isStructured status
  const domainsWithStatus = COURSE_DOMAINS.map(domain => ({
    ...domain,
    courses: domain.courses.map(course => {
      const isStructured = loadedIds.has(`course-${course.id}`) || 
                           loadedIds.has(course.id) || 
                           loadedTitles.has(course.title.toLowerCase());
      return {
        ...course,
        domainId: domain.id,
        domainName: domain.name,
        domainShortName: domain.shortName,
        emoji: domain.emoji,
        gradient: domain.gradient,
        accentColor: domain.accentColor,
        isStructured
      };
    })
  }));

  return {
    domains: domainsWithStatus,
    totalDomains: domainsWithStatus.length,
    totalCourses: allFlat.length,
    loadedCoursesCount: loadedCourses.length
  };
}

export function getOrSynthesizeCourse(courseIdentifier, domainHint = null) {
  const courses = loadCourses();
  const identLower = (courseIdentifier || '').toLowerCase();

  // 1. Try finding in existing courses
  let existingIndex = courses.findIndex(c => 
    c.id.toLowerCase() === identLower ||
    c.title.toLowerCase() === identLower ||
    c.id.toLowerCase() === `course-${identLower}` ||
    (c.title && c.title.toLowerCase().includes(identLower))
  );

  let existing = existingIndex >= 0 ? courses[existingIndex] : null;

  // If existing has full 4-section architecture, verified video lectures, and video quiz, return it
  const BAD_VIDEO_IDS = new Set(['7Z_Q2Xk_t9s', '1YmXuzk8Q0Q', 'AfQxyVuLeZ4', 'e2i9b218u_s', 'dQw4w9WgXcQ']);
  if (
    existing && 
    existing.tiers?.basics?.[0]?.sections && 
    existing.tiers.basics[0].sections.length >= 3 &&
    existing.tiers.basics[0].video_quiz &&
    existing.tiers.basics[0].video_lecture?.videoId &&
    !BAD_VIDEO_IDS.has(existing.tiers.basics[0].video_lecture.videoId)
  ) {
    return { course: existing, wasNewlySynthesized: false };
  }

  // 2. Synthesize new high-fidelity elaborate course with 3-4 sections & video lectures
  const synthesized = synthesizeElaborateCourse(courseIdentifier, domainHint);

  // 3. Save into catalog (replace stale or prepend)
  if (existingIndex >= 0) {
    courses[existingIndex] = synthesized;
  } else {
    courses.unshift(synthesized);
  }
  saveCourses(courses);

  return { course: synthesized, wasNewlySynthesized: true };
}

export function loadStudentState() {
  try {
    if (fs.existsSync(STUDENT_STATE_PATH)) {
      return JSON.parse(fs.readFileSync(STUDENT_STATE_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error("Error reading studentState.json:", err);
  }
  return { currentUser: {}, leaderboard: [] };
}

export function saveStudentState(state) {
  try {
    fs.writeFileSync(STUDENT_STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving studentState.json:", err);
  }
}

export function updateStudentExamScore(examResult) {
  const state = loadStudentState();
  const user = state.currentUser;

  // Add XP
  const gainedXP = Math.round((examResult.total_percentage || 70) * 0.8) + 20;
  user.total_xp = (user.total_xp || 0) + gainedXP;

  // Record exam in history
  if (!user.exam_history) user.exam_history = [];
  user.exam_history.unshift({
    id: 'exam-' + Date.now(),
    ...examResult,
    timestamp: new Date().toISOString()
  });

  // Mark module completed if percentage >= 60%
  if (examResult.total_percentage >= 60 && examResult.module_id) {
    if (!user.completed_modules.includes(examResult.module_id)) {
      user.completed_modules.push(examResult.module_id);
    }
  }

  // Update tier mastery calculation
  const allCourses = loadCourses();
  let totalBasics = 0, totalAdv = 0, totalExp = 0;
  let compBasics = 0, compAdv = 0, compExp = 0;

  allCourses.forEach(c => {
    (c.tiers?.basics || []).forEach(m => {
      totalBasics++;
      if (user.completed_modules.includes(m.id)) compBasics++;
    });
    (c.tiers?.advanced || []).forEach(m => {
      totalAdv++;
      if (user.completed_modules.includes(m.id)) compAdv++;
    });
    (c.tiers?.expert || []).forEach(m => {
      totalExp++;
      if (user.completed_modules.includes(m.id)) compExp++;
    });
  });

  user.tier_mastery = {
    basics: totalBasics > 0 ? Math.min(100, Math.round((compBasics / totalBasics) * 100)) : 100,
    advanced: totalAdv > 0 ? Math.min(100, Math.round((compAdv / totalAdv) * 100)) : 0,
    expert: totalExp > 0 ? Math.min(100, Math.round((compExp / totalExp) * 100)) : 0
  };

  // Update user in leaderboard and sort
  const myEntry = state.leaderboard.find(l => l.name.includes(user.name) || l.name.includes("You"));
  if (myEntry) {
    myEntry.xp = user.total_xp;
  }
  state.leaderboard.sort((a, b) => b.xp - a.xp);
  state.leaderboard.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  saveStudentState(state);
  return { user, leaderboard: state.leaderboard, gainedXP };
}

const STUDENT_LOGS_PATH = path.join(__dirname, '..', 'data', 'studentLogs.json');
const ADMIN_SECRET_PASSWORD = "3791552";

export function loadStudentLogs() {
  try {
    if (fs.existsSync(STUDENT_LOGS_PATH)) {
      return JSON.parse(fs.readFileSync(STUDENT_LOGS_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error("Error reading studentLogs.json:", err);
  }
  return [];
}

export function saveStudentLogs(logs) {
  try {
    fs.writeFileSync(STUDENT_LOGS_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving studentLogs.json:", err);
  }
}

export function logStudentActivity(entry) {
  const logs = loadStudentLogs();
  const logItem = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    ...entry
  };
  logs.unshift(logItem);
  // Keep last 500 entries
  if (logs.length > 500) logs.length = 500;
  saveStudentLogs(logs);
  return logItem;
}

export function getAdminAuditData(providedPassword) {
  if (String(providedPassword).trim() !== ADMIN_SECRET_PASSWORD) {
    return { authorized: false, message: "Invalid administrator credentials." };
  }

  const logs = loadStudentLogs();
  const state = loadStudentState();
  const courses = loadCourses();

  return {
    authorized: true,
    logs,
    totalLogsCount: logs.length,
    student: state.currentUser,
    leaderboard: state.leaderboard,
    activeCoursesCount: courses.length,
    timestamp: new Date().toISOString()
  };
}



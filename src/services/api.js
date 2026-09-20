/**
 * Client API services for MyTutor AI
 */

const BASE_URL = '/api';

export async function fetchCatalog() {
  const res = await fetch(`${BASE_URL}/catalog`);
  const data = await res.json();
  return data;
}

export async function fetchAdminLogs(password) {
  const res = await fetch(`${BASE_URL}/admin/verify-and-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Invalid administrator credentials.');
  }
  return data;
}

export async function logStudentTelemetry({ eventType, details, courseTitle, moduleTitle, sectionIndex }) {
  try {
    const res = await fetch(`${BASE_URL}/student/activity-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, details, courseTitle, moduleTitle, sectionIndex })
    });
    return await res.json();
  } catch (e) {
    console.warn('Telemetry log error:', e);
  }
}

export async function fetchVideoLectureContent({ courseId, courseTitle, domain, sectionIndex = 0 }) {
  const res = await fetch(`${BASE_URL}/courses/video-lecture-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId, courseTitle, domain, sectionIndex })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch video lecture content');
  return data;
}

export async function submitVideoQuizResult({ courseTitle, moduleTitle, sectionIndex, score, percentage, passed, totalQuestions = 10 }) {
  const res = await fetch(`${BASE_URL}/student/video-quiz-result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseTitle, moduleTitle, sectionIndex, score, percentage, passed, totalQuestions })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit video quiz');
  return data;
}

export async function structureAndTeachCourse({ courseId, courseTitle, domain }) {
  const res = await fetch(`${BASE_URL}/courses/structure-and-teach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId, courseTitle, domain })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to structure and teach course.');
  }
  return data;
}

export async function fetchCourses() {
  const res = await fetch(`${BASE_URL}/courses`);
  const data = await res.json();
  return data.courses || [];
}

export async function fetchCourseById(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`);
  const data = await res.json();
  return data.course;
}


export async function generateCourseFromTopic(topic) {
  const res = await fetch(`${BASE_URL}/courses/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  const data = await res.json();
  return data.course;
}

export async function uploadCourseDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/courses/upload`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to parse and upload course file.');
  }
  return data.course;
}

export async function fetchStudentState() {
  const res = await fetch(`${BASE_URL}/student`);
  return await res.json();
}

export async function verifySincerityCheck(question, studentAnswer, expectedKeywords = []) {
  const res = await fetch(`${BASE_URL}/student/sincerity-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      student_answer: studentAnswer,
      expected_keywords: expectedKeywords
    })
  });
  return await res.json();
}

export async function submitExamAnswers({
  moduleId,
  moduleTitle,
  objectiveAnswers,
  writingSubmission
}) {
  const res = await fetch(`${BASE_URL}/student/submit-exam`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      module_id: moduleId,
      module_title: moduleTitle,
      objective_answers: objectiveAnswers,
      writing_submission: writingSubmission
    })
  });
  return await res.json();
}

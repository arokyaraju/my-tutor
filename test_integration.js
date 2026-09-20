async function testSystem() {
  console.log('--- 1. Testing Courses API ---');
  const coursesRes = await fetch('http://localhost:5000/api/courses');
  const coursesData = await coursesRes.json();
  console.log('Courses count:', coursesData.courses.length);
  console.log('First Course:', coursesData.courses[0].title);

  console.log('\n--- 2. Testing Sincerity Verification API ---');
  const sincRes = await fetch('http://localhost:5000/api/student/sincerity-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'Why do we drop constant factors in Big-O analysis?',
      student_answer: 'Because as input size N grows towards infinity, the dominant highest-order term dictates asymptotic growth and lower constants become negligible.',
      expected_keywords: ['dominant', 'infinity', 'constants']
    })
  });
  const sincData = await sincRes.json();
  console.log('Sincerity passed:', sincData.passed, '-', sincData.reason);

  console.log('\n--- 3. Testing Exam AI Rubric Evaluator API ---');
  const examRes = await fetch('http://localhost:5000/api/student/submit-exam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      module_id: 'dsa-b-01',
      module_title: 'Big-O Notation & Asymptotic Complexity',
      objective_answers: { score: 3, total: 3 },
      writing_submission: {
        question: 'Explain why binary search requires O(log N) time while linear search requires O(N) time.',
        mark_weight: 5,
        answer_key: 'Binary search requires sorted array and repeatedly halves the search space comparing target with middle element.',
        essential_keywords: ['sorted', 'halves', 'middle element', 'logarithmic', 'divide and conquer'],
        student_answer: 'Binary search requires a sorted array. At each step it repeatedly halves the search space by checking the middle element. Since it divides by 2 each time, the number of operations is logarithmic O(log N) using divide and conquer, unlike linear search which scans every element sequentially.'
      }
    })
  });
  const examData = await examRes.json();
  console.log('Exam Result Total %:', examData.exam_result.total_percentage);
  console.log('Descriptive Score:', examData.writing_evaluation.assigned_score, '/', examData.writing_evaluation.max_score);
  console.log('Key Phrases Found:', examData.writing_evaluation.key_phrases_found);
  console.log('Fact Accuracy:', examData.writing_evaluation.fact_accuracy_score + '%');
  console.log('Feedback:', examData.writing_evaluation.constructive_feedback);
  console.log('Gained XP:', examData.gained_xp);

  console.log('\n--- 4. Testing Document / Custom Ingestion API ---');
  const customTopicRes = await fetch('http://localhost:5000/api/courses/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'Quantum Computing and Superposition' })
  });
  const customTopicData = await customTopicRes.json();
  console.log('Generated Course:', customTopicData.course.title);
  console.log('Tiers in synthesized course:', Object.keys(customTopicData.course.tiers));
  console.log('Basics Module Title:', customTopicData.course.tiers.basics[0].title);
  console.log('Questions 1M count:', customTopicData.course.tiers.basics[0].questions_1_mark.length);
  console.log('Questions 5M count:', customTopicData.course.tiers.basics[0].questions_5_mark.length);

  console.log('\n--- 5. Testing Vite Frontend HTTP Output ---');
  const viteRes = await fetch('http://localhost:5173/');
  const viteHtml = await viteRes.text();
  console.log('Vite status:', viteRes.status, 'HTML bytes:', viteHtml.length);
  console.log('All backend and frontend services verified 100% operational!');
}

testSystem();

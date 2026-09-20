// Automated test for multi-step sections, video lecture metadata, and secret admin verification
const BASE_URL = 'http://127.0.0.1:5000';

async function runTests() {
  console.log('--- TEST 1: Verify 24-Domain Catalog ---');
  const catalogRes = await fetch(`${BASE_URL}/api/catalog`);
  const catalogData = await catalogRes.json();
  console.log(`Status: ${catalogRes.status}, Domains: ${catalogData?.domains?.length}, Total Courses: ${catalogData?.totalCourses}`);
  if (catalogData?.domains?.length !== 24 || catalogData?.totalCourses !== 164) {
    throw new Error('Catalog domain or course count mismatch!');
  }
  console.log('✓ TEST 1 PASSED: 24 Domains, 164 Courses verified.');

  console.log('\n--- TEST 2: Synthesize Course with 3-4 Theory Sections & Video Lecture ---');
  const synthRes = await fetch(`${BASE_URL}/api/courses/structure-and-teach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId: 'tech_ai_ml',
      courseTitle: 'Artificial Intelligence and Machine Learning (AI & ML)',
      domain: 'Computer & Information Sciences'
    })
  });
  const synthData = await synthRes.json();
  console.log(`Status: ${synthRes.status}, Course: ${synthData?.course?.title}`);
  const firstMod = synthData?.course?.tiers?.basics?.[0];
  console.log(`Module 1: ${firstMod?.title}`);
  console.log(`Number of Theory Sections: ${firstMod?.sections?.length}`);
  if (!firstMod?.sections || firstMod.sections.length < 3) {
    throw new Error(`Expected at least 3-4 sections, got ${firstMod?.sections?.length}`);
  }
  console.log(`Section 1: ${firstMod.sections[0].title}`);
  console.log(`Section 4: ${firstMod.sections[firstMod.sections.length - 1].title}`);
  const vl = firstMod.sections[0]?.video_lecture || firstMod.video_lecture;
  console.log(`Video Lecture title: ${vl?.title}`);
  console.log(`Video Lecture embedUrl: ${vl?.embedUrl}`);
  if (!vl || !vl.embedUrl) throw new Error('Expected video_lecture with embedUrl');
  console.log('✓ TEST 2 PASSED: 4 Theory sections and YouTube/professional video lecture metadata verified.');

  console.log('\n--- TEST 3: Student Step Completion Telemetry ---');
  const telemetryRes = await fetch(`${BASE_URL}/api/student/activity-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'section_step_completed',
      details: 'Student clicked I Get It Now on Section 1',
      courseTitle: 'Artificial Intelligence and Machine Learning (AI & ML)',
      moduleTitle: firstMod?.title,
      sectionIndex: 0
    })
  });
  const telemetryData = await telemetryRes.json();
  console.log('telemetryData response:', JSON.stringify(telemetryData));
  if (telemetryData?.status !== 'success') throw new Error('Telemetry logging failed');
  console.log('✓ TEST 3 PASSED: Student telemetry logged successfully.');

  console.log('\n--- TEST 4: Secret Admin Authentication with Incorrect Password ---');
  const badAuthRes = await fetch(`${BASE_URL}/api/admin/verify-and-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'wrongpassword' })
  });
  const badAuthData = await badAuthRes.json();
  console.log(`Status: ${badAuthRes.status}, Message: ${badAuthData?.message}`);
  if (badAuthRes.status !== 401) throw new Error('Expected 401 for wrong admin password');
  console.log('✓ TEST 4 PASSED: Incorrect password rejected with 401.');

  console.log('\n--- TEST 5: Secret Admin Authentication with Correct Password (3791552) ---');
  const goodAuthRes = await fetch(`${BASE_URL}/api/admin/verify-and-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: '3791552' })
  });
  const goodAuthData = await goodAuthRes.json();
  console.log(`Status: ${goodAuthRes.status}, Authorized: ${goodAuthData?.authorized}`);
  if (goodAuthRes.status !== 200 || !goodAuthData?.authorized) {
    throw new Error('Expected 200 with authorized: true for correct admin password 3791552');
  }
  const logs = goodAuthData?.logs || goodAuthData?.studentLogs;
  console.log(`Total Audit Events in Log: ${logs?.length}`);
  const latest = logs?.[0];
  console.log(`Latest Event: [${latest?.type}] ${latest?.details}`);
  if (!logs || logs.length === 0) throw new Error('Expected logs to be non-empty');
  console.log('✓ TEST 5 PASSED: Secret Admin Portal verified with password 3791552!');

  console.log('\n=========================================');
  console.log('🎉 ALL 5 COMPREHENSIVE INTEGRATION TESTS PASSED!');
  console.log('=========================================');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});

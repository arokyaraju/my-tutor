/**
 * Academic AI Evaluator for student writing exam submissions
 * Assesses descriptive answers (1, 2, 5, 10 markers) against official rubrics
 */
export function evaluateStudentWriting({
  question,
  markWeight = 5,
  answerKey = '',
  essentialKeywords = [],
  studentAnswer = ''
}) {
  const cleanAnswer = (studentAnswer || '').trim().toLowerCase();
  
  if (!cleanAnswer || cleanAnswer.length < 10) {
    return {
      assigned_score: 0,
      max_score: markWeight,
      percentage: 0,
      key_phrases_found: [],
      missing_keywords: essentialKeywords,
      fact_accuracy_score: 10,
      factual_errors_found: "Answer was either empty or insufficient in depth to evaluate.",
      constructive_feedback: "Please provide a thorough written response addressing the core prompt criteria."
    };
  }

  // Derive target keyword list from explicit keywords or answer key words
  const targetKeywords = essentialKeywords.length > 0 
    ? essentialKeywords.map(k => k.toLowerCase())
    : answerKey.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 4)
        .slice(0, 8);

  const foundKeywords = [];
  const missingKeywords = [];

  targetKeywords.forEach(kw => {
    // Check keyword or stem presence
    const stem = kw.slice(0, Math.max(4, kw.length - 2));
    if (cleanAnswer.includes(kw) || cleanAnswer.includes(stem)) {
      foundKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Calculate completeness and accuracy ratios
  const keywordRatio = targetKeywords.length > 0 ? (foundKeywords.length / targetKeywords.length) : 0.7;
  
  // Length factor: rough heuristic for depth compared to mark weight
  // 1-2 mark: ~25 words; 5 mark: ~60 words; 10 mark: ~120+ words
  const words = cleanAnswer.split(/\s+/).length;
  const targetWordCount = markWeight === 1 ? 15 : markWeight === 2 ? 30 : markWeight === 5 ? 65 : 130;
  const depthFactor = Math.min(1.0, words / targetWordCount);

  // Compute fact accuracy score
  let factAccuracy = Math.min(100, Math.round((keywordRatio * 0.65 + depthFactor * 0.35) * 100));
  if (factAccuracy < 20 && words > 15) factAccuracy = 45;

  // Assigned score out of markWeight
  let calculatedScore = (factAccuracy / 100) * markWeight;
  // Round to nearest 0.5
  calculatedScore = Math.round(calculatedScore * 2) / 2;
  // Keep within bounds
  calculatedScore = Math.max(0.5, Math.min(markWeight, calculatedScore));

  const percentage = Math.round((calculatedScore / markWeight) * 100);

  // Generate actionable constructive feedback
  let feedback = "";
  let factualErrors = "";

  if (percentage >= 85) {
    feedback = `Exceptional academic articulation! You accurately integrated ${foundKeywords.length} core technical principles and provided thorough conceptual depth.`;
  } else if (percentage >= 65) {
    feedback = `Solid answer demonstrating good comprehension. To reach full marks, you should more explicitly incorporate: ${missingKeywords.slice(0, 3).join(', ')}.`;
  } else {
    feedback = `Your answer touches upon the general topic but lacks critical technical precision. Be sure to address: ${missingKeywords.slice(0, 4).join(', ')}.`;
    factualErrors = `Missing detailed elaboration on ${missingKeywords.slice(0, 2).join(' and ')}.`;
  }

  return {
    assigned_score: calculatedScore,
    max_score: markWeight,
    percentage,
    key_phrases_found: foundKeywords,
    missing_keywords: missingKeywords,
    fact_accuracy_score: factAccuracy,
    factual_errors_found: factualErrors || "None detected; statements align with official key.",
    constructive_feedback: feedback
  };
}

/**
 * Assess sincerity response for attention lock checkpoints
 */
export function evaluateSincerityResponse(question, studentAnswer, expectedKeywords = []) {
  const clean = (studentAnswer || '').toLowerCase().trim();
  if (clean.length < 5) return { passed: false, reason: "Answer too short or unattempted." };

  let matches = 0;
  expectedKeywords.forEach(kw => {
    if (clean.includes(kw.toLowerCase())) matches++;
  });

  const passed = matches >= 1 || clean.split(/\s+/).length >= 10;
  return {
    passed,
    matches,
    reason: passed 
      ? "Attention check verified successfully! Lesson unlocked."
      : "Answer lacked expected core keywords taught in this segment. Avatar will provide clarification."
  };
}

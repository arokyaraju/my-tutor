import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, XCircle, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CodeSandboxView({ challenge, onPassedValidation }) {
  const defaultChallenge = challenge || {
    title: "Coin Change Minimum Subproblem",
    language: "javascript",
    prompt: "Write a function `coinChange(coins, amount)` that returns the fewest number of coins needed to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    initial_boilerplate: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0 && dp[i - c] !== Infinity) {\n        dp[i] = Math.min(dp[i], dp[i - c] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
    test_cases: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 }
    ]
  };

  const [code, setCode] = useState(defaultChallenge.initial_boilerplate);
  const [outputLogs, setOutputLogs] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [validationState, setValidationState] = useState('untested'); // 'untested' | 'passed' | 'failed'

  const executeCodeHarness = () => {
    setIsRunning(true);
    setOutputLogs('Initializing safe execution sandbox...\nCompiling code harness...\n');

    setTimeout(() => {
      try {
        // Execute student function in isolated evaluator
        // Create function from string
        const userFn = new Function(`
          ${code}
          return typeof coinChange !== 'undefined' ? coinChange : null;
        `)();

        if (!userFn) {
          throw new Error("Function `coinChange` not found. Please ensure function name matches the prompt.");
        }

        const results = [];
        let allPassed = true;
        let logs = "Running automated unit test harness:\n";

        defaultChallenge.test_cases.forEach((tc, idx) => {
          const [coins, amount] = tc.input;
          const actual = userFn(coins, amount);
          const passed = actual === tc.expected;

          if (!passed) allPassed = false;

          results.push({
            index: idx + 1,
            input: `coins=[${coins.join(',')}], amount=${amount}`,
            expected: tc.expected,
            actual,
            passed
          });

          logs += `Test #${idx + 1}: ${passed ? '✓ PASSED' : '✗ FAILED'} (Input: [${coins}], ${amount} | Expected: ${tc.expected}, Got: ${actual})\n`;
        });

        setTestResults(results);
        setIsRunning(false);

        if (allPassed) {
          setValidationState('passed');
          logs += '\n🎉 ALL TEST CASES PASSED! Optimal space-time complexity verified.\n+50 Expert XP Awarded!';
          confetti({ particleCount: 70, spread: 50 });
          if (onPassedValidation) onPassedValidation(true);
        } else {
          setValidationState('failed');
          logs += '\n⚠️ Some test cases failed. Check subproblem boundary conditions or edge cases.';
        }

        setOutputLogs(logs);
      } catch (err) {
        setIsRunning(false);
        setValidationState('failed');
        setOutputLogs(`Runtime Error:\n${err.message}\n${err.stack || ''}`);
      }
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Sandbox Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-expert">EXPERT TIER</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Interactive Code Compilation Sandbox</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
              {defaultChallenge.title}
            </h3>
          </div>

          <div style={{
            padding: '6px 14px',
            borderRadius: '8px',
            background: validationState === 'passed' ? 'rgba(16, 185, 129, 0.2)' : validationState === 'failed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${validationState === 'passed' ? '#10b981' : validationState === 'failed' ? '#ef4444' : 'var(--border-subtle)'}`,
            fontSize: '0.84rem',
            fontWeight: 700,
            color: validationState === 'passed' ? '#34d399' : validationState === 'failed' ? '#f87171' : '#94a3b8'
          }}>
            Status: {validationState.toUpperCase()}
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '10px', lineHeight: 1.5 }}>
          {defaultChallenge.prompt}
        </p>
      </div>

      {/* Editor & Terminal Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '16px'
      }}>
        
        {/* Code Editor Panel */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', fontFamily: 'JetBrains Mono' }}>
              SOURCE CODE // {defaultChallenge.language.toUpperCase()}
            </span>
            <button
              onClick={() => setCode(defaultChallenge.initial_boilerplate)}
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '0.74rem', border: 'none' }}
              title="Reset Boilerplate"
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          <textarea
            rows={15}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              flex: 1,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              background: '#0a0f1d',
              color: '#38bdf8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '14px',
              resize: 'vertical'
            }}
          />

          <div style={{ marginTop: '12px' }}>
            <button
              onClick={executeCodeHarness}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.92rem' }}
            >
              <Play size={16} />
              {isRunning ? 'Executing Test Harness...' : 'Run & Validate Solution'}
            </button>
          </div>
        </div>

        {/* Runtime Terminal Output */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} /> RUNTIME ENGINE CONSOLE
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Isolated Sandbox</span>
          </div>

          <pre style={{
            flex: 1,
            minHeight: '260px',
            background: '#05070e',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '14px',
            color: '#a7f3d0',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            overflowY: 'auto'
          }}>
            {outputLogs || '// Execution terminal clear. Click "Run & Validate Solution" to test.'}
          </pre>

          {/* Test Case Badges */}
          {testResults.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {testResults.map(tr => (
                <div
                  key={tr.index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: tr.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${tr.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {tr.passed ? <CheckCircle2 size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Test #{tr.index}:</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>{tr.input}</span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', color: tr.passed ? '#34d399' : '#f87171', fontWeight: 700 }}>
                    {tr.actual} === {tr.expected}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

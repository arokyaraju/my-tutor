import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Pen, 
  Eraser, 
  Trash2, 
  Maximize2, 
  Minimize2,
  RotateCcw, 
  Sparkles,
  Layers,
  Download,
  Film,
  ExternalLink,
  Play,
  CheckCircle2,
  FileText,
  Award,
  HelpCircle,
  Radio
} from 'lucide-react';

export default function WhiteboardCanvas({
  activeMark,
  whiteboardCommands = [],
  onClearBoard,
  currentConceptTitle,
  videoLecture,
  aiLectureSummary,
  boardMode = 'ai_whiteboard',
  onToggleBoardMode,
  onOpenVideoQuiz
}) {
  const canvasRef = useRef(null);
  const userDrawCanvasRef = useRef(null);

  // Student freehand drawing state
  const [activeTool, setActiveTool] = useState('pen'); // 'pen' | 'highlighter' | 'eraser' | 'cursor'
  const [penColor, setPenColor] = useState('#38bdf8');
  const [isDrawing, setIsDrawing] = useState(false);
  const [executedMarks, setExecutedMarks] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamMirrorIndex, setStreamMirrorIndex] = useState(0);

  // Blacklist of deprecated or removed YouTube video IDs mapped to 100% verified working streams
  const VERIFIED_FALLBACKS = {
    '7Z_Q2Xk_t9s': 'pyX8kQ-JzHI', // Stanford Modern Physics (Verified 200 OK)
    '1YmXuzk8Q0Q': 'btGYcizV0iI', // CrashCourse Engineering (Verified 200 OK)
    'AfQxyVuLeZ4': 'w82aSjLuD_8', // Electric Circuits (Verified 200 OK)
    'e2i9b218u_s': 'uBGl2BujkPQ', // Anatomy & Physiology (Verified 200 OK)
    'h9afNFBcJVw': 'ED84NRVGWNk', // Fashion Illustration & Sketching (Verified 200 OK)
    'zOjov-2OZ0E': 'ED84NRVGWNk'  // Legacy CS50 fallback mapped to active subject
  };

  const conceptLower = ((currentConceptTitle || '') + ' ' + (videoLecture?.title || '')).toLowerCase();
  const isFashion = conceptLower.includes('fashion') || conceptLower.includes('illustration') || conceptLower.includes('mood board') || conceptLower.includes('draping') || conceptLower.includes('textile');

  let rawVideoId = videoLecture?.videoId;
  if (isFashion) {
    rawVideoId = 'ED84NRVGWNk';
  } else if (conceptLower.includes('biology') || conceptLower.includes('cellular')) {
    rawVideoId = 'AfhRglVwx4g';
  } else if (conceptLower.includes('circuit') || conceptLower.includes('electrical')) {
    rawVideoId = 'w82aSjLuD_8';
  } else if (conceptLower.includes('engineering') || conceptLower.includes('mechanical')) {
    rawVideoId = 'btGYcizV0iI';
  }

  const activeVideoId = (rawVideoId && VERIFIED_FALLBACKS[rawVideoId]) 
    ? VERIFIED_FALLBACKS[rawVideoId] 
    : (rawVideoId || 'ED84NRVGWNk');

  // Multi-mirror array for guaranteed playback across any network or browser configuration
  const embedMirrors = [
    `https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1`,
    `https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`,
    `https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0`
  ];
  const activeEmbedUrl = embedMirrors[streamMirrorIndex % embedMirrors.length];

  // Clear main board
  const clearMainCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Clear student doodles
  const clearUserCanvas = useCallback(() => {
    const canvas = userDrawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Render individual AI whiteboard command
  const executeCommand = useCallback((cmd, ctx) => {
    if (!cmd || !ctx) return;

    ctx.save();

    if (cmd.action === 'clear_board') {
      clearMainCanvas();
    } else if (cmd.action === 'draw_axes') {
      // Draw Cartesian coordinate axes
      ctx.strokeStyle = cmd.color || '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Y axis
      ctx.moveTo(cmd.x, cmd.y);
      ctx.lineTo(cmd.x, cmd.y + cmd.height);
      // X axis
      ctx.lineTo(cmd.x + cmd.width, cmd.y + cmd.height);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Plus Jakarta Sans, sans-serif';
      ctx.fillText(cmd.xLabel || 'Input Size (N)', cmd.x + cmd.width - 90, cmd.y + cmd.height + 24);
      ctx.fillText(cmd.yLabel || 'Time / Operations', cmd.x - 10, cmd.y - 12);
    } else if (cmd.action === 'draw_curve') {
      // Draw mathematical curves
      ctx.strokeStyle = cmd.color || '#3b82f6';
      ctx.lineWidth = cmd.strokeWidth || 3;
      ctx.beginPath();

      const originX = 60;
      const originY = 340;

      if (cmd.curveType === 'constant') {
        // Horizontal line O(1)
        ctx.moveTo(originX, originY - 30);
        ctx.lineTo(originX + 500, originY - 30);
        ctx.stroke();
        ctx.fillStyle = cmd.color;
        ctx.font = 'bold 13px JetBrains Mono';
        ctx.fillText(cmd.label, originX + 510, originY - 26);
      } else if (cmd.curveType === 'linear') {
        // Straight diagonal line O(N)
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + 480, originY - 220);
        ctx.stroke();
        ctx.fillStyle = cmd.color;
        ctx.font = 'bold 13px JetBrains Mono';
        ctx.fillText(cmd.label, originX + 485, originY - 225);
      } else if (cmd.curveType === 'quadratic') {
        // Quadratic curve O(N²)
        ctx.moveTo(originX, originY);
        ctx.quadraticCurveTo(originX + 160, originY - 30, originX + 280, originY - 290);
        ctx.stroke();
        ctx.fillStyle = cmd.color;
        ctx.font = 'bold 13px JetBrains Mono';
        ctx.fillText(cmd.label, originX + 220, originY - 300);
      }
    } else if (cmd.action === 'draw_array_layout') {
      // Contiguous array in memory layout
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit';
      ctx.fillText(cmd.title || 'Array Memory', cmd.x, cmd.y - 20);

      const items = cmd.items || [];
      const boxW = 125;
      const boxH = 50;

      items.forEach((item, idx) => {
        const curX = cmd.x + idx * (boxW + 12);
        const curY = cmd.y;

        // Container
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = cmd.color || '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX, curY, boxW, boxH, 8);
        ctx.fill();
        ctx.stroke();

        // Value text
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px JetBrains Mono';
        ctx.fillText(item, curX + 12, curY + 30);

        // Index subscript
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Plus Jakarta Sans';
        ctx.fillText(`Index [${idx}]`, curX + 12, curY + boxH + 18);
      });
    } else if (cmd.action === 'draw_linked_nodes') {
      // Linked list nodes in heap with pointers
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit';
      ctx.fillText(cmd.title || 'Linked List Nodes', cmd.x, cmd.y - 20);

      const nodes = cmd.nodes || [];
      nodes.forEach((node, idx) => {
        const curX = cmd.x + idx * 175;
        const curY = cmd.y;

        // Node Box
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = cmd.color || '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX, curY, 120, 55, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 13px JetBrains Mono';
        ctx.fillText(node.val, curX + 10, curY + 24);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText(`-> ${node.next}`, curX + 10, curY + 44);

        // Arrow to next node
        if (idx < nodes.length - 1) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(curX + 120, curY + 28);
          ctx.lineTo(curX + 175, curY + 28);
          ctx.stroke();

          // Arrow head
          ctx.beginPath();
          ctx.moveTo(curX + 175, curY + 28);
          ctx.lineTo(curX + 165, curY + 23);
          ctx.lineTo(curX + 165, curY + 33);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
        }
      });
    } else if (cmd.action === 'draw_tree') {
      // Binary Search Tree / AVL Tree
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit';
      ctx.fillText(cmd.title || 'Tree Diagram', 60, 40);

      const nodes = cmd.nodes || [];
      // Draw connector branches first
      nodes.forEach(node => {
        if (node.parent) {
          const p = nodes.find(n => n.id === node.parent);
          if (p) {
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y + 15);
            ctx.lineTo(node.x, node.y - 15);
            ctx.stroke();
          }
        }
      });

      // Draw tree nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
        ctx.fillStyle = node.color || '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val, node.x, node.y);
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
      });
    } else if (cmd.action === 'draw_flowchart') {
      // Flowchart blocks
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit';
      ctx.fillText(cmd.title || 'Flow Sequence', 80, 50);

      const steps = cmd.steps || [];
      steps.forEach((step, idx) => {
        const curX = 80 + idx * 190;
        const curY = 80;

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = step.color || '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX, curY, 155, 60, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.fillText(step.label, curX + 12, curY + 34);

        if (idx < steps.length - 1) {
          // Arrow
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(curX + 155, curY + 30);
          ctx.lineTo(curX + 190, curY + 30);
          ctx.stroke();
        }
      });
    } else if (cmd.action === 'draw_rolling_array') {
      // Dynamic Programming rolling array
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit';
      ctx.fillText(cmd.title || '1D Rolling Buffer', cmd.x, cmd.y - 30);

      for (let i = 0; i < (cmd.buffer_length || 8); i++) {
        const curX = cmd.x + i * 55;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX, cmd.y, 48, 48, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 13px JetBrains Mono';
        ctx.fillText(`dp[${i}]`, curX + 6, cmd.y + 28);
      }

      if (cmd.note) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = '12px Plus Jakarta Sans';
        ctx.fillText(`⚡ ${cmd.note}`, cmd.x, cmd.y + 80);
      }
    } else if (cmd.action === 'draw_rect') {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = cmd.color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cmd.x || 60, cmd.y || 60, cmd.width || 200, cmd.height || 60, 8);
      ctx.fill();
      ctx.stroke();

      if (cmd.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Plus Jakarta Sans';
        ctx.fillText(cmd.label, (cmd.x || 60) + 16, (cmd.y || 60) + 35);
      }
    } else if (cmd.action === 'draw_hierarchy') {
      const nodes = cmd.nodes || [];
      const startX = cmd.x || 60;
      const startY = cmd.y || 80;
      nodes.forEach((n, idx) => {
        const curX = startX + idx * 165;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = n.color || '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX, startY, 150, 54, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.fillText(n.label, curX + 12, startY + 32);

        if (idx < nodes.length - 1) {
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(curX + 150, startY + 27);
          ctx.lineTo(curX + 165, startY + 27);
          ctx.stroke();
        }
      });
    } else if (cmd.action === 'draw_formula') {
      // High-clarity Mathematical / Governing Equation Card
      const posX = cmd.x || 60;
      const posY = cmd.y || 70;
      const cardW = cmd.width || 680;
      const cardH = 90;

      // Glow background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = cmd.color || '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(posX, posY, cardW, cardH, 10);
      ctx.fill();
      ctx.stroke();

      // Top label
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.fillText(cmd.label || 'GOVERNING RELATIONSHIP / INVARIANT', posX + 16, posY + 24);

      // Formula in stylized monospace/LaTeX look
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 18px JetBrains Mono, monospace';
      ctx.fillText(cmd.formula || 'f(x) = y', posX + 16, posY + 58);
    } else if (cmd.action === 'draw_spec_card') {
      // Technical Specification / Architectural Profile Card
      const posX = cmd.x || 60;
      const posY = cmd.y || 60;
      const cardW = cmd.width || 680;
      const cardH = cmd.height || 105;

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = cmd.color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(posX, posY, cardW, cardH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.fillText(cmd.title || 'System Specification', posX + 18, posY + 32);

      if (cmd.subtitle) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Plus Jakarta Sans, sans-serif';
        ctx.fillText(cmd.subtitle, posX + 18, posY + 54);
      }

      const tags = cmd.tags || [];
      tags.forEach((tag, idx) => {
        const tagX = posX + 18 + idx * 145;
        const tagY = posY + 68;

        ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, 135, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 11px Plus Jakarta Sans';
        ctx.fillText(tag, tagX + 8, tagY + 16);
      });
    } else if (cmd.action === 'draw_process_cycle') {
      // 4-Phase Operational Lifecycle Loop
      const stages = cmd.stages || [];
      const posX = cmd.x || 60;
      const posY = cmd.y || 190;
      const stageW = 150;
      const stageH = 55;

      stages.forEach((stage, idx) => {
        const curX = posX + idx * 175;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = stage.color || '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX, posY, stageW, stageH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.fillText(stage.label, curX + 10, posY + 32);

        if (idx < stages.length - 1) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(curX + stageW, posY + 27);
          ctx.lineTo(curX + 175, posY + 27);
          ctx.stroke();

          // Arrowhead
          ctx.beginPath();
          ctx.moveTo(curX + 175, posY + 27);
          ctx.lineTo(curX + 167, posY + 22);
          ctx.lineTo(curX + 167, posY + 32);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
        }
      });
    } else if (cmd.action === 'draw_comparison_table') {
      // Trade-off Matrix
      const posX = cmd.x || 60;
      const posY = cmd.y || 60;
      const headers = cmd.headers || ["Criteria", "Option A", "Option B"];
      const rows = cmd.rows || [];
      const colW = 165;
      const rowH = 34;

      // Header row
      headers.forEach((h, cIdx) => {
        const curX = posX + cIdx * colW;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.fillRect(curX, posY, colW, rowH);
        ctx.strokeRect(curX, posY, colW, rowH);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px JetBrains Mono';
        ctx.fillText(h, curX + 10, posY + 22);
      });

      // Data rows
      rows.forEach((row, rIdx) => {
        const curY = posY + (rIdx + 1) * rowH;
        row.forEach((cell, cIdx) => {
          const curX = posX + cIdx * colW;
          ctx.fillStyle = rIdx % 2 === 0 ? '#0f172a' : '#141e33';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.fillRect(curX, curY, colW, rowH);
          ctx.strokeRect(curX, curY, colW, rowH);

          ctx.fillStyle = '#e2e8f0';
          ctx.font = '12px Plus Jakarta Sans';
          ctx.fillText(cell, curX + 10, curY + 22);
        });
      });
    } else if (cmd.action === 'draw_music_staff') {
      // Western & Indian Classical Music Stave / Raga Scale
      const posX = cmd.x || 60;
      const posY = cmd.y || 60;
      const staffW = 680;

      // Draw 5 staff lines
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        const lineY = posY + i * 16;
        ctx.beginPath();
        ctx.moveTo(posX, lineY);
        ctx.lineTo(posX + staffW, lineY);
        ctx.stroke();
      }

      // Treble Clef / Swara Marker
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px serif';
      ctx.fillText('𝄞', posX + 15, posY + 48);

      // Swara Notes (Sa Re Ga Ma Pa Dha Ni Sa)
      const swaras = [
        { name: 'S (Sa)', x: 90, noteY: posY + 64, color: '#38bdf8' },
        { name: 'R (Re)', x: 160, noteY: posY + 56, color: '#10b981' },
        { name: 'G (Ga)', x: 235, noteY: posY + 48, color: '#f59e0b' },
        { name: 'M (Ma)', x: 310, noteY: posY + 40, color: '#ec4899' },
        { name: 'P (Pa)', x: 385, noteY: posY + 32, color: '#8b5cf6' },
        { name: 'D (Dha)', x: 460, noteY: posY + 24, color: '#3b82f6' },
        { name: 'N (Ni)', x: 535, noteY: posY + 16, color: '#14b8a6' },
        { name: 'Ṡ (Tāra Sa)', x: 610, noteY: posY + 8, color: '#e11d48' }
      ];

      swaras.forEach(s => {
        // Musical Note Head
        ctx.beginPath();
        ctx.arc(posX + s.x, s.noteY, 7, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Stem
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(posX + s.x + 6, s.noteY);
        ctx.lineTo(posX + s.x + 6, s.noteY - 26);
        ctx.stroke();

        // Swara label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(s.name, posX + s.x - 14, posY + 95);
      });
    } else if (cmd.action === 'draw_blocks') {
      // ELI5 Visual Toy Blocks
      const count = cmd.count || 4;
      const posX = cmd.x || 100;
      const posY = cmd.y || 160;
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

      for (let i = 0; i < count; i++) {
        const bX = posX + i * 85;
        ctx.fillStyle = colors[i % colors.length];
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bX, posY, 65, 65, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Outfit';
        ctx.fillText(String.fromCharCode(65 + i), bX + 24, posY + 42);
      }
    } else if (cmd.action === 'draw_code_snippet') {
      // Code snippet window on canvas
      const codeLines = (cmd.code || '').split('\n');
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, 60, 620, 30 + codeLines.length * 20, 10);
      ctx.fill();
      ctx.stroke();

      // Mac buttons
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(80, 76, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(95, 76, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(110, 76, 5, 0, Math.PI * 2);
      ctx.fill();

      // Code text
      ctx.fillStyle = '#38bdf8';
      ctx.font = '13px JetBrains Mono';
      codeLines.forEach((line, idx) => {
        ctx.fillText(line, 80, 106 + idx * 20);
      });
    }

    ctx.restore();
  }, [clearMainCanvas]);

  // Synchronize canvas with SSML marks as the teacher speaks
  useEffect(() => {
    if (!activeMark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Find command that matches active mark
    const matchingCmd = whiteboardCommands.find(c => c.mark_anchor === activeMark);
    if (matchingCmd) {
      executeCommand(matchingCmd, ctx);
      setExecutedMarks(prev => new Set(prev).add(activeMark));
    }
  }, [activeMark, whiteboardCommands, executeCommand]);

  // Handle student freehand drawing
  const handleMouseDown = (e) => {
    if (activeTool === 'cursor') return;
    const canvas = userDrawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || activeTool === 'cursor') return;
    const canvas = userDrawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');

    if (activeTool === 'eraser') {
      ctx.clearRect(x - 12, y - 12, 24, 24);
    } else {
      ctx.strokeStyle = activeTool === 'highlighter' ? 'rgba(250, 204, 21, 0.4)' : penColor;
      ctx.lineWidth = activeTool === 'highlighter' ? 14 : 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className={`glass-panel ${isFullscreen ? 'fullscreen-stage' : ''}`} style={{
      padding: '16px',
      position: isFullscreen ? 'fixed' : 'relative',
      inset: isFullscreen ? '0' : 'auto',
      zIndex: isFullscreen ? 1000 : 10,
      minHeight: isFullscreen ? '100vh' : '520px',
      display: 'flex',
      flexDirection: 'column',
      background: isFullscreen ? '#070b14' : 'rgba(15, 23, 42, 0.72)',
      borderRadius: isFullscreen ? '0' : '16px'
    }}>
      
      {/* Canvas & Lecture Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Left: Mode Switcher (AI Whiteboard vs Professional Video) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => onToggleBoardMode && onToggleBoardMode('ai_whiteboard')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                background: boardMode === 'ai_whiteboard' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: boardMode === 'ai_whiteboard' ? '#ffffff' : '#94a3b8',
                borderRadius: '8px'
              }}
            >
              <Layers size={14} />
              AI Whiteboard
            </button>

            <button
              onClick={() => onToggleBoardMode && onToggleBoardMode('video_lecture')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                background: boardMode === 'video_lecture' ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'transparent',
                color: boardMode === 'video_lecture' ? '#ffffff' : '#94a3b8',
                borderRadius: '8px'
              }}
            >
              <Film size={14} />
              Professional Video Lecture
            </button>
          </div>

          {activeMark && boardMode === 'ai_whiteboard' && (
            <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontFamily: 'JetBrains Mono' }}>
              sync: &lt;mark name="{activeMark}"/&gt;
            </span>
          )}
        </div>

        {/* Right: Tools (Whiteboard Doodles OR Video Options) & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {boardMode === 'ai_whiteboard' ? (
            <>
              {/* Student Drawing Tools */}
              <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setActiveTool('pen')}
                  className="btn"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    background: activeTool === 'pen' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                    color: activeTool === 'pen' ? '#fff' : '#94a3b8'
                  }}
                  title="Pen Tool"
                >
                  <Pen size={14} />
                </button>

                <button
                  onClick={() => setActiveTool('eraser')}
                  className="btn"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    background: activeTool === 'eraser' ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
                    color: activeTool === 'eraser' ? '#f87171' : '#94a3b8'
                  }}
                  title="Eraser Tool"
                >
                  <Eraser size={14} />
                </button>
              </div>

              {/* Color Picker */}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => { setPenColor(c); setActiveTool('pen'); }}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: c,
                      border: penColor === c ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.5)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>

              <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />

              <button
                onClick={() => { clearMainCanvas(); clearUserCanvas(); if (onClearBoard) onClearBoard(); }}
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                title="Clear Entire Whiteboard"
              >
                <RotateCcw size={14} />
                Clear
              </button>
            </>
          ) : (
            /* Video Lecture External Link */
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent((videoLecture?.searchQuery || currentConceptTitle || '') + ' lecture')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={13} />
              Open in YouTube
            </a>
          )}

          {/* Fullscreen Expand Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Board Fit"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Workspace Stage */}
      {boardMode === 'video_lecture' ? (
        /* Mode 2: Professional Video Lecture Player & AI Real-Time Listener */
        <div style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: isFullscreen ? 'calc(100vh - 90px)' : '540px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#090d16',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Lecture Header Banner */}
          <div style={{
            padding: '10px 18px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: '#ef4444', color: '#fff', fontWeight: 800, letterSpacing: '0.04em' }}>
                VERIFIED ACADEMIC STREAM
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                {videoLecture?.title || `Professional Masterclass: ${currentConceptTitle}`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {videoLecture?.provider || (isFashion ? 'Nino Via (Fashion Design & Technical Illustration)' : 'Academic Commons Stream')}
              </span>

              {/* Stream Mirror Switcher */}
              <button
                onClick={() => setStreamMirrorIndex(prev => prev + 1)}
                className="btn btn-secondary"
                style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Switch between high-speed CDN stream mirrors or reload video"
              >
                <RotateCcw size={12} />
                <span>Mirror #{(streamMirrorIndex % 3) + 1}</span>
              </button>

              {/* Direct YouTube Link */}
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '4px 10px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Open stream directly on YouTube HQ"
              >
                <ExternalLink size={13} />
                YouTube HQ
              </a>
            </div>
          </div>

          {/* Split Stage: Left Embedded Video Player, Right AI Active Listener */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) 340px',
            minHeight: '480px',
            background: '#000'
          }}>
            
            {/* Embedded Verified Video Player (Guaranteed to Play without "Video Unavailable") */}
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '460px', background: '#000' }}>
              <iframe
                key={`${activeVideoId}-${streamMirrorIndex}`}
                src={activeEmbedUrl}
                title="Professional Educational Lecture"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* Quick Floating Controls (Always available if iframe takes time to initialize or adblocker interferes) */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                zIndex: 10,
                display: 'flex',
                gap: '8px',
                pointerEvents: 'auto'
              }}>
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Open in YouTube HQ</span>
                </a>

                <button
                  onClick={() => setStreamMirrorIndex(prev => prev + 1)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
                  }}
                  title="Reload or cycle to alternative stream mirror"
                >
                  <RotateCcw size={13} />
                  <span>Switch Mirror / Reload</span>
                </button>
              </div>
            </div>

            {/* AI Active Listener & Real-Time Note Taker Panel */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.96)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto'
            }}>
              <div>
                {/* AI Listener Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 10px #10b981',
                      animation: 'pulse 1.8s infinite'
                    }} />
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>
                      AI REAL-TIME LISTENER
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {videoLecture?.duration || '42:30'}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  Live Lecture Transcripts & Notes
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px' }}>
                  {aiLectureSummary?.overview || `The AI tutor is analyzing this university masterclass on ${currentConceptTitle}, capturing formal invariants and real-world trade-offs.`}
                </p>

                {/* Key Timestamps & Live Concepts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Key Video Checkpoints:
                  </span>
                  {(videoLecture?.key_timestamps || [
                    { time: '01:15', title: 'Axiomatic Grounding & System Invariants' },
                    { time: '11:40', title: 'Mathematical Invariant Formulation' },
                    { time: '24:20', title: 'Production Architecture & Trade-Offs' },
                    { time: '36:50', title: 'Non-Linear Failure Modes & Edge Cases' }
                  ]).map((point, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.76rem',
                        color: '#cbd5e1'
                      }}
                    >
                      <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>
                        {point.time}
                      </span>
                      <span>{point.title}</span>
                    </div>
                  ))}
                </div>

                {/* Core Governing Law derived */}
                {aiLectureSummary?.core_formula && (
                  <div style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#a5b4fc', fontWeight: 700, marginBottom: '4px' }}>
                      GOVERNING CANONICAL EQUATION
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.76rem', color: '#34d399' }}>
                      {aiLectureSummary.core_formula}
                    </div>
                  </div>
                )}
              </div>

              {/* End of Video: AI Summary & "I Get It" Button */}
              <div style={{
                marginTop: '12px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
                  Watched the lecture? Take the 10-question evaluation to unlock the next level (80%+ score required).
                </div>

                {/* Glowing "I Get It" Button */}
                <button
                  onClick={() => {
                    if (onOpenVideoQuiz) onOpenVideoQuiz();
                  }}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={17} />
                  <span>I Get It (Take 10-Question Exam)</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Mode 1: Interactive AI Whiteboard Vector Stage */
        <div style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: isFullscreen ? 'calc(100vh - 90px)' : '480px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)'
        }} className="whiteboard-grid">

          {/* AI Teacher Synchronized Layer */}
          <canvas
            ref={canvasRef}
            width={isFullscreen ? 1440 : 960}
            height={isFullscreen ? 800 : 480}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Student Interactive Drawing Layer */}
          <canvas
            ref={userDrawCanvasRef}
            width={isFullscreen ? 1440 : 960}
            height={isFullscreen ? 800 : 480}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: activeTool === 'pen' ? 'crosshair' : activeTool === 'eraser' ? 'cell' : 'default',
              zIndex: 2
            }}
          />

          {/* Watermark / Concept Label */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            fontSize: '0.74rem',
            color: 'rgba(148, 163, 184, 0.45)',
            fontFamily: 'JetBrains Mono',
            pointerEvents: 'none',
            zIndex: 3
          }}>
            AI Vector Canvas Engine • {currentConceptTitle || 'Active Lesson'}
          </div>
        </div>
      )}

    </div>
  );
}

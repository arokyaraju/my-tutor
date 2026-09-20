import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Parses SSML text into speech chunks with synchronized mark anchors and pauses
 */
export function parseSSML(ssmlText) {
  if (!ssmlText) return { cleanText: '', timeline: [] };

  // Remove <speak> and </speak>
  let text = ssmlText.replace(/<\/?speak>/gi, '');
  
  // Regex to extract marks and breaks
  const timeline = [];
  let cleanText = '';
  let markMatch;
  const regex = /<mark\s+name=['"]([^'"]+)['"]\s*\/>|<break\s+time=['"](\d+)ms['"]\s*\/>|<emphasis[^>]*>|<\/emphasis>/gi;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const rawPreceding = text.substring(lastIndex, match.index);
    cleanText += rawPreceding;

    if (match[1]) {
      // It's a <mark name="...">
      timeline.push({
        type: 'mark',
        name: match[1],
        charOffset: cleanText.length
      });
    } else if (match[2]) {
      // It's a <break time="Xms">
      timeline.push({
        type: 'break',
        durationMs: parseInt(match[2], 10),
        charOffset: cleanText.length
      });
    }
    lastIndex = regex.lastIndex;
  }
  cleanText += text.substring(lastIndex);

  return { cleanText: cleanText.trim(), timeline };
}

export function useSpeechTutor({ onMarkReached, onSpeakingStateChange }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpenRatio, setMouthOpenRatio] = useState(0); // 0 (closed) to 1 (wide open)
  const [speakingEmotion, setSpeakingEmotion] = useState('explaining'); // neutral | explaining | attentive | warning | happy
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const utteranceRef = useRef(null);
  const animFrameRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load available speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setVoiceList(voices);
        // Default to high quality English voice (Google US English, Natural, or Microsoft David/Zira)
        const preferred = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en')));
        setSelectedVoice(preferred || voices[0] || null);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Initialize Speech Recognition for speech-to-speech / verbal interruptions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = false;
        recognizer.interimResults = false;
        recognizer.lang = 'en-US';
        recognitionRef.current = recognizer;
      }
    }
  }, []);

  // Animate mouth opening and speech waveforms while speaking
  const startLipSyncAnimation = useCallback(() => {
    let phase = 0;
    const animate = () => {
      phase += 0.35;
      // Synthesize dynamic natural mouth movement
      const open = Math.max(0.1, (Math.sin(phase) * 0.4 + Math.sin(phase * 2.3) * 0.3 + 0.5));
      setMouthOpenRatio(open);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const stopLipSyncAnimation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setMouthOpenRatio(0);
  }, []);

  // Speak SSML text with synchronized marker triggers
  const speakSSML = useCallback((ssmlString, emotion = 'explaining') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web Speech API not supported in this browser environment.');
      return;
    }

    // Cancel any existing speech utterance immediately
    window.speechSynthesis.cancel();
    stopLipSyncAnimation();

    const { cleanText, timeline } = parseSSML(ssmlString);
    if (!cleanText) return;

    setSpeakingEmotion(emotion);
    setIsSpeaking(true);
    if (onSpeakingStateChange) onSpeakingStateChange(true);
    startLipSyncAnimation();

    // Trigger marks that appear at the very start (charOffset == 0)
    timeline.filter(t => t.type === 'mark' && t.charOffset === 0).forEach(m => {
      if (onMarkReached) onMarkReached(m.name);
    });

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = 1.05;
    if (selectedVoice) utterance.voice = selectedVoice;

    let triggeredMarks = new Set();

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = event.charIndex;
        // Check timeline marks within range
        timeline.forEach(item => {
          if (item.type === 'mark' && !triggeredMarks.has(item.name)) {
            if (charIdx >= item.charOffset - 5) {
              triggeredMarks.add(item.name);
              if (onMarkReached) onMarkReached(item.name);
            }
          }
        });
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      stopLipSyncAnimation();
      setSpeakingEmotion('neutral');
      if (onSpeakingStateChange) onSpeakingStateChange(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
      stopLipSyncAnimation();
      setSpeakingEmotion('neutral');
      if (onSpeakingStateChange) onSpeakingStateChange(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, speechRate, onMarkReached, onSpeakingStateChange, startLipSyncAnimation, stopLipSyncAnimation]);

  // Instant interruption: aborts speech and switches tutor to attentive mode
  const interruptTeacher = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    stopLipSyncAnimation();
    setSpeakingEmotion('attentive');
    if (onSpeakingStateChange) onSpeakingStateChange(false);
  }, [onSpeakingStateChange, stopLipSyncAnimation]);

  // Start voice listening for student interruption
  const listenForStudentQuestion = useCallback((onResultCallback) => {
    if (!recognitionRef.current) {
      alert("Microphone speech recognition is not supported in this browser. You can type your question in the box instead!");
      return;
    }

    interruptTeacher();
    setIsListening(true);

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (onResultCallback) onResultCallback(transcript);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition already active", e);
    }
  }, [interruptTeacher]);

  return {
    isSpeaking,
    mouthOpenRatio,
    speakingEmotion,
    setSpeakingEmotion,
    voiceList,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate,
    speakSSML,
    interruptTeacher,
    isListening,
    listenForStudentQuestion
  };
}

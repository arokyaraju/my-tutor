import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook to track student engagement, tab switching, and idle time
 */
export function useSincerityTracker({
  enabled = true,
  inactivityThresholdMs = 180000, // 3 minutes default (can be toggled to 15s in demo)
  onAttentionBreached
}) {
  const [isLocked, setIsLocked] = useState(false);
  const [breachReason, setBreachReason] = useState(null); // 'user_switched_tabs' | 'user_inactive_afk'
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [fastDemoMode, setFastDemoMode] = useState(false);

  const inactivityTimerRef = useRef(null);

  const effectiveThreshold = fastDemoMode ? 15000 : inactivityThresholdMs;

  const triggerBreach = useCallback((reason) => {
    if (!enabled || isLocked) return;
    setIsLocked(true);
    setBreachReason(reason);
    if (onAttentionBreached) {
      onAttentionBreached(reason);
    }
  }, [enabled, isLocked, onAttentionBreached]);

  const resetInactivityTimer = useCallback(() => {
    setLastActiveTime(Date.now());
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (!enabled || isLocked) return;

    inactivityTimerRef.current = setTimeout(() => {
      triggerBreach('user_inactive_afk');
    }, effectiveThreshold);
  }, [enabled, isLocked, triggerBreach, effectiveThreshold]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Detect when user switches tabs or minimizes browser
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerBreach('user_switched_tabs');
      }
    };

    // 2. Track user inputs to detect AFK / looking away
    const handleActivity = () => {
      resetInactivityTimer();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    // Initial timer setup
    resetInactivityTimer();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [enabled, resetInactivityTimer, triggerBreach]);

  const unlockLesson = () => {
    setIsLocked(false);
    setBreachReason(null);
    resetInactivityTimer();
  };

  return {
    isLocked,
    breachReason,
    unlockLesson,
    fastDemoMode,
    setFastDemoMode,
    triggerManualBreach: () => triggerBreach('user_switched_tabs')
  };
}

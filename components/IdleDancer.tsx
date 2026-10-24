"use client";
import { useEffect, useRef, useState, cloneElement, isValidElement, type ReactElement } from "react";

/** Swaps "bob" for "dance" on the child's className after idleMs without interaction. */
export default function IdleDancer({
  children,
  enabled,
  idleMs = 20000,
}: {
  children: ReactElement<{ className?: string }>;
  enabled: boolean;
  idleMs?: number;
}) {
  const [dancing, setDancing] = useState(false);
  const lastActive = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    lastActive.current = Date.now();
    // Activity only stamps a timestamp; a single slow check decides when to dance.
    // This keeps pointer movement free of state updates and timers.
    const stamp = () => {
      lastActive.current = Date.now();
    };
    const events: (keyof WindowEventMap)[] = ["pointermove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, stamp, { passive: true }));
    const check = setInterval(() => {
      setDancing(Date.now() - lastActive.current >= idleMs);
    }, 1000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, stamp));
      clearInterval(check);
      setDancing(false);
    };
  }, [enabled, idleMs]);

  if (!enabled || !isValidElement(children)) return children;
  const className = dancing ? (children.props.className ?? "").replace("bob", "dance") : children.props.className;
  return cloneElement(children, { className });
}

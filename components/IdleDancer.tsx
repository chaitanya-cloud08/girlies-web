"use client";
import { useEffect, useRef, useState, cloneElement, isValidElement, type ReactElement } from "react";

/** Swaps "bob" for "dance" on the child's className after ~20s of no interaction. */
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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    function reset() {
      setDancing(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setDancing(true), idleMs);
    }
    reset();
    const events: (keyof WindowEventMap)[] = ["pointermove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset));
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [enabled, idleMs]);

  if (!enabled || !isValidElement(children)) return children;
  const className = dancing ? (children.props.className ?? "").replace("bob", "dance") : children.props.className;
  return cloneElement(children, { className });
}

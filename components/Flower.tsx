import type { FlowerId } from "@/lib/flowers";

const ring = (n: number) => Array.from({ length: n }, (_, i) => (360 / n) * i);

/** A single flower head drawn around (0,0), roughly 34px across. */
export function FlowerHead({ id }: { id: FlowerId }) {
  switch (id) {
    case "rose":
      return (
        <g>
          {ring(6).map((a) => (
            <ellipse key={a} cx={0} cy={-9} rx={8} ry={10} fill="#A51D36" transform={`rotate(${a})`} />
          ))}
          <circle r={11} fill="#C42A45" />
          <path d="M-6 -1 C-6 -8 6 -8 6 -1 C6 5 -3 6 -3 0 C-3 -3 2 -3 2 0" fill="none" stroke="#7E1428" strokeWidth={1.8} strokeLinecap="round" />
        </g>
      );
    case "sunflower":
      return (
        <g>
          {ring(14).map((a) => (
            <ellipse key={a} cx={0} cy={-12} rx={3.6} ry={7} fill="#F6C026" transform={`rotate(${a})`} />
          ))}
          <circle r={8} fill="#6B3E1F" />
          <circle r={5} fill="#4E2B14" />
        </g>
      );
    case "tulip":
      return (
        <g>
          <path d="M-11 -2 C-12 -14 -6 -18 -4 -12 C-2 -18 2 -18 4 -12 C6 -18 12 -14 11 -2 C10 8 -10 8 -11 -2 Z" fill="#E7779B" />
          <path d="M-4 -12 C-3 -2 3 -2 4 -12" fill="none" stroke="#C9567C" strokeWidth={1.4} />
        </g>
      );
    case "daisy":
      return (
        <g>
          {ring(12).map((a) => (
            <ellipse key={a} cx={0} cy={-10} rx={3.4} ry={7.5} fill="#FFFFFF" stroke="#EADFE2" strokeWidth={0.6} transform={`rotate(${a})`} />
          ))}
          <circle r={5} fill="#F4C430" />
        </g>
      );
    case "lavender":
      return (
        <g>
          <path d="M0 14 L0 -22" stroke="#6E8F5E" strokeWidth={1.6} />
          {[-20, -15, -10, -5, 0, 5, 10].map((y, i) => (
            <g key={y}>
              <ellipse cx={-3} cy={y} rx={3} ry={4} fill={i % 2 ? "#9B7BCB" : "#8A69BE"} />
              <ellipse cx={3} cy={y + 2} rx={3} ry={4} fill={i % 2 ? "#8A69BE" : "#A68BD1"} />
            </g>
          ))}
        </g>
      );
    case "cherry":
      return (
        <g>
          {ring(5).map((a) => (
            <path key={a} d="M0 0 C-7 -6 -6 -14 -2 -15 L0 -12 L2 -15 C6 -14 7 -6 0 0 Z" fill="#F8C8D6" stroke="#EFA3BA" strokeWidth={0.7} transform={`rotate(${a}) scale(1.05)`} />
          ))}
          <circle r={3} fill="#E0607F" />
        </g>
      );
    case "marigold":
      return (
        <g>
          {ring(12).map((a) => <circle key={`o${a}`} cx={0} cy={-11} r={5.5} fill="#E8820C" transform={`rotate(${a})`} />)}
          {ring(10).map((a) => <circle key={`m${a}`} cx={0} cy={-7} r={5} fill="#F59E1B" transform={`rotate(${a + 15})`} />)}
          {ring(7).map((a) => <circle key={`i${a}`} cx={0} cy={-3} r={4} fill="#FBBF3A" transform={`rotate(${a})`} />)}
        </g>
      );
    case "mogra":
      return (
        <g>
          {[
            [-7, 2],
            [7, 1],
            [0, -8],
          ].map(([x, y], j) => (
            <g key={j} transform={`translate(${x} ${y})`}>
              {ring(6).map((a) => (
                <ellipse key={a} cx={0} cy={-4.5} rx={2.4} ry={4.6} fill="#FFFFFF" stroke="#E7E1D4" strokeWidth={0.6} transform={`rotate(${a})`} />
              ))}
              <circle r={1.6} fill="#F1E6B8" />
            </g>
          ))}
        </g>
      );
    case "peony":
      return (
        <g>
          {ring(8).map((a) => <circle key={`a${a}`} cx={0} cy={-10} r={8} fill="#F1A1B9" transform={`rotate(${a})`} />)}
          {ring(6).map((a) => <circle key={`b${a}`} cx={0} cy={-5} r={7} fill="#F6BACB" transform={`rotate(${a + 20})`} />)}
          <circle r={5.5} fill="#FAD3DE" />
        </g>
      );
    case "forgetmenot":
      return (
        <g>
          {[
            [-7, -5],
            [6, -6],
            [-1, 5],
            [9, 6],
          ].map(([x, y], j) => (
            <g key={j} transform={`translate(${x} ${y})`}>
              {ring(5).map((a) => <circle key={a} cx={0} cy={-3.6} r={3.2} fill="#79A6E3" transform={`rotate(${a})`} />)}
              <circle r={1.7} fill="#F6D24A" />
            </g>
          ))}
        </g>
      );
    case "chococosmos":
      return (
        <g>
          {ring(8).map((a) => (
            <path key={a} d="M0 0 C-5 -5 -5 -14 0 -16 C5 -14 5 -5 0 0 Z" fill="#5A1F2C" transform={`rotate(${a})`} />
          ))}
          <circle r={4.5} fill="#3A1219" />
          <circle r={2} fill="#7A3A2A" />
        </g>
      );
    case "babysbreath":
      return (
        <g>
          <path d="M0 14 L0 0 M0 4 L-9 -8 M0 2 L8 -10 M0 -2 L-2 -15 M-4 -2 L-13 2 M3 -3 L12 0" stroke="#8BA67E" strokeWidth={1} fill="none" />
          {[
            [-9, -8], [8, -10], [-2, -15], [-13, 2], [12, 0], [-6, -12], [4, -14], [-11, -4], [10, -6], [0, -9], [-5, -5], [6, -3],
          ].map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r={2.4} fill="#FFFFFF" stroke="#E4E4E4" strokeWidth={0.5} />
          ))}
        </g>
      );
    case "kaleshpoppy":
      return (
        <g>
          {ring(4).map((a) => (
            <path key={a} d="M0 0 C-11 -3 -12 -16 0 -16 C12 -16 11 -3 0 0 Z" fill="#E2452B" stroke="#B92E18" strokeWidth={0.8} transform={`rotate(${a + 45})`} />
          ))}
          <circle r={4.5} fill="#1D1416" />
          {ring(8).map((a) => <circle key={`d${a}`} cx={0} cy={-6.5} r={0.9} fill="#1D1416" transform={`rotate(${a})`} />)}
        </g>
      );
  }
}

export function FlowerIcon({ id, size = 48 }: { id: FlowerId; size?: number }) {
  return (
    <svg viewBox="-22 -24 44 44" width={size} height={size} aria-hidden>
      <FlowerHead id={id} />
    </svg>
  );
}

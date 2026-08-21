import type { CSSProperties, PointerEvent } from "react";

type ContractCoreProps = {
  score: number;
  state: "healthy" | "degraded" | "repairing" | "recovered";
};

type CoreStyle = CSSProperties & {
  "--core-rotate-x": string;
  "--core-rotate-y": string;
};

const defaultStyle: CoreStyle = {
  "--core-rotate-x": "-8deg",
  "--core-rotate-y": "18deg",
};

export function ContractCore({ score, state }: ContractCoreProps) {
  function tilt(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.style.setProperty("--core-rotate-x", `${-8 - vertical * 18}deg`);
    event.currentTarget.style.setProperty("--core-rotate-y", `${18 + horizontal * 24}deg`);
  }

  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--core-rotate-x", defaultStyle["--core-rotate-x"]);
    event.currentTarget.style.setProperty("--core-rotate-y", defaultStyle["--core-rotate-y"]);
  }

  return (
    <div
      aria-label={`Three-dimensional data contract core. Health score ${score} out of 100, state ${state}.`}
      className={`contract-core ${state}`}
      onPointerLeave={reset}
      onPointerMove={tilt}
      role="img"
      style={defaultStyle}
    >
      <div className="core-halo" />
      <div className="core-scene">
        <div className="core-orbit orbit-schema"><i /><span>Schema</span></div>
        <div className="core-orbit orbit-volume"><i /><span>Volume</span></div>
        <div className="core-orbit orbit-freshness"><i /><span>Fresh</span></div>
        <div className="core-prism">
          <div className="core-face core-front" />
          <div className="core-face core-right" />
          <div className="core-face core-top" />
          <div className="core-light" />
        </div>
      </div>
      <div className="core-score"><strong>{score}</strong><span>Contract score</span></div>
      <div className="core-caption"><i /><span>{state === "degraded" ? "Breach isolated" : state === "repairing" ? "Candidate testing" : state === "recovered" ? "Canaries verified" : "All gates locked"}</span></div>
    </div>
  );
}

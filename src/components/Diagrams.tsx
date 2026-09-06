/* Hand-drawn architecture diagrams — recruiters and engineers both read these
   faster than a screenshot, and they leak no customer detail. */

const nodeStyle = {
  fill: "rgba(16,26,46,0.9)",
  stroke: "var(--line)",
  strokeWidth: 1,
} as const;

const accentNode = {
  fill: "rgba(94,234,212,0.08)",
  stroke: "var(--accent-line)",
  strokeWidth: 1,
} as const;

const title = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fill: "#dce7f7",
} as const;

const sub = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  fill: "#8ba0be",
} as const;

const chipText = {
  fontFamily: "var(--font-mono)",
  fontSize: 9.5,
  fill: "var(--accent)",
} as const;

const Arrow = ({ d }: { d: string }) => (
  <path d={d} stroke="var(--accent-line)" strokeWidth="1.2" fill="none" markerEnd="url(#ah)" strokeDasharray="0" />
);

const Defs = () => (
  <defs>
    <marker id="ah" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
      <path d="M0 0.5 L6 3 L0 5.5 z" fill="var(--accent)" opacity="0.75" />
    </marker>
  </defs>
);

export const GitOpsDiagram = () => (
  <svg viewBox="0 0 420 330" role="img" aria-label="GitOps flow: Git repository feeds GitHub Actions and Argo CD, which deploy to an Amazon EKS cluster behind Ingress NGINX and an AWS load balancer.">
    <Defs />

    <rect x="60" y="14" width="300" height="44" rx="9" {...accentNode} />
    <text x="210" y="33" textAnchor="middle" {...title}>Git repository</text>
    <text x="210" y="47" textAnchor="middle" {...sub}>app code + Kubernetes manifests</text>

    <Arrow d="M180 58 C 150 72, 130 78, 105 92" />
    <Arrow d="M240 58 C 270 72, 292 78, 315 92" />

    <rect x="12" y="96" width="186" height="46" rx="9" {...nodeStyle} />
    <text x="105" y="116" textAnchor="middle" {...title}>GitHub Actions</text>
    <text x="105" y="130" textAnchor="middle" {...sub}>build → test → push image</text>

    <rect x="222" y="96" width="186" height="46" rx="9" {...nodeStyle} />
    <text x="315" y="116" textAnchor="middle" {...title}>Argo CD</text>
    <text x="315" y="130" textAnchor="middle" {...sub}>watch → diff → sync</text>

    <Arrow d="M105 142 C 105 158, 118 162, 140 174" />
    <Arrow d="M315 142 C 315 158, 302 162, 280 174" />

    <rect x="30" y="178" width="360" height="76" rx="11" {...accentNode} />
    <text x="46" y="196" {...title}>Amazon EKS</text>
    <text x="374" y="196" textAnchor="end" {...sub}>provisioned by Terraform</text>
    <rect x="48" y="206" width="98" height="30" rx="7" {...nodeStyle} />
    <text x="97" y="225" textAnchor="middle" {...chipText}>service-a</text>
    <rect x="161" y="206" width="98" height="30" rx="7" {...nodeStyle} />
    <text x="210" y="225" textAnchor="middle" {...chipText}>service-b</text>
    <rect x="274" y="206" width="98" height="30" rx="7" {...nodeStyle} />
    <text x="323" y="225" textAnchor="middle" {...chipText}>service-c</text>

    <Arrow d="M210 254 L 210 270" />

    <rect x="60" y="274" width="300" height="42" rx="9" {...nodeStyle} />
    <text x="210" y="292" textAnchor="middle" {...title}>Ingress NGINX → AWS Load Balancer</text>
    <text x="210" y="306" textAnchor="middle" {...sub}>99% uptime across 3+ services</text>
  </svg>
);

export const CostOptDiagram = () => (
  <svg viewBox="0 0 420 312" role="img" aria-label="Cost optimisation flow: EventBridge triggers a Python Lambda that scans EC2, ELB and NAT Gateway resources, reporting to CloudWatch and cutting monthly spend.">
    <Defs />

    <rect x="112" y="12" width="196" height="42" rx="9" {...nodeStyle} />
    <text x="210" y="30" textAnchor="middle" {...title}>Amazon EventBridge</text>
    <text x="210" y="44" textAnchor="middle" {...sub}>scheduled scan</text>

    <Arrow d="M210 54 L 210 82" />

    <rect x="112" y="86" width="196" height="42" rx="9" {...accentNode} />
    <text x="210" y="104" textAnchor="middle" {...title}>AWS Lambda · Python</text>
    <text x="210" y="118" textAnchor="middle" {...sub}>boto3 · least-privilege IAM</text>

    <Arrow d="M210 128 L 210 156" />

    <rect x="14" y="160" width="392" height="70" rx="11" {...nodeStyle} />
    <text x="30" y="178" {...title}>Account sweep</text>
    <text x="390" y="178" textAnchor="end" {...sub}>idle / orphaned / untagged</text>
    <rect x="30" y="188" width="112" height="30" rx="7" {...accentNode} />
    <text x="86" y="207" textAnchor="middle" {...chipText}>idle EC2</text>
    <rect x="154" y="188" width="112" height="30" rx="7" {...accentNode} />
    <text x="210" y="207" textAnchor="middle" {...chipText}>orphaned ELB</text>
    <rect x="278" y="188" width="112" height="30" rx="7" {...accentNode} />
    <text x="334" y="207" textAnchor="middle" {...chipText}>unused NAT GW</text>

    <Arrow d="M140 230 C 140 244, 120 246, 108 258" />
    <Arrow d="M280 230 C 280 244, 300 246, 312 258" />

    <rect x="16" y="262" width="188" height="42" rx="9" {...nodeStyle} />
    <text x="110" y="280" textAnchor="middle" {...title}>CloudWatch report</text>
    <text x="110" y="294" textAnchor="middle" {...sub}>+ notification</text>

    <rect x="216" y="262" width="188" height="42" rx="9" {...accentNode} />
    <text x="310" y="280" textAnchor="middle" {...title}>25–30% lower spend</text>
    <text x="310" y="294" textAnchor="middle" {...sub}>month over month</text>
  </svg>
);

export const Diagram = ({ kind }: { kind: "gitops" | "costopt" }) =>
  kind === "gitops" ? <GitOpsDiagram /> : <CostOptDiagram />;

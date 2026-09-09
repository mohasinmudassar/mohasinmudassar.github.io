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
  fontSize: 12.5,
  fontWeight: 600,
  fill: "#eaf2ff",
} as const;

const sub = {
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  fill: "var(--txt-dim)",
} as const;

const chipText = {
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  fontWeight: 600,
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
    <text x="210" y="306" textAnchor="middle" {...sub}>health-checked across 3+ services</text>
  </svg>
);

export const CostOptDiagram = () => (
  <svg viewBox="0 0 420 416" role="img" aria-label="AWS idle governance flow: EventBridge triggers Lambda auditors that inspect EC2, load balancers and NAT gateways, record owned findings, notify people, and open a reviewed remediation pull request after a grace period.">
    <Defs />

    <rect x="112" y="12" width="196" height="42" rx="9" {...accentNode} />
    <text x="210" y="30" textAnchor="middle" {...title}>Amazon EventBridge</text>
    <text x="210" y="44" textAnchor="middle" {...sub}>daily governance schedule</text>

    <Arrow d="M210 54 L 210 76" />

    <rect x="30" y="80" width="360" height="62" rx="11" {...nodeStyle} />
    <text x="46" y="99" {...title}>Python Lambda auditors</text>
    <text x="374" y="99" textAnchor="end" {...sub}>boto3 · least-privilege IAM</text>
    <rect x="46" y="108" width="98" height="24" rx="6" {...accentNode} />
    <text x="95" y="124" textAnchor="middle" {...chipText}>EC2</text>
    <rect x="161" y="108" width="98" height="24" rx="6" {...accentNode} />
    <text x="210" y="124" textAnchor="middle" {...chipText}>Load balancers</text>
    <rect x="276" y="108" width="98" height="24" rx="6" {...accentNode} />
    <text x="325" y="124" textAnchor="middle" {...chipText}>NAT gateways</text>

    <Arrow d="M210 142 L 210 164" />

    <rect x="30" y="168" width="360" height="50" rx="10" {...accentNode} />
    <text x="46" y="188" {...title}>DynamoDB findings</text>
    <text x="374" y="188" textAnchor="end" {...sub}>owner + metric evidence</text>
    <text x="210" y="207" textAnchor="middle" {...chipText}>idle / low-traffic resources</text>

    <Arrow d="M130 218 C 105 232, 105 240, 105 252" />
    <Arrow d="M290 218 C 315 232, 315 240, 315 252" />

    <rect x="16" y="256" width="178" height="54" rx="9" {...nodeStyle} />
    <text x="105" y="278" textAnchor="middle" {...title}>Owner notification</text>
    <text x="105" y="296" textAnchor="middle" {...sub}>SES email + SNS digest</text>

    <rect x="226" y="256" width="178" height="54" rx="9" {...accentNode} />
    <text x="315" y="278" textAnchor="middle" {...title}>Grace period</text>
    <text x="315" y="296" textAnchor="middle" {...sub}>re-check stale=false</text>

    <Arrow d="M315 310 L 315 334" />

    <rect x="60" y="338" width="300" height="58" rx="10" {...accentNode} />
    <text x="210" y="360" textAnchor="middle" {...title}>Terraform remediation PR</text>
    <text x="210" y="378" textAnchor="middle" {...sub}>human review by default · delete is opt-in</text>
  </svg>
);

export const Diagram = ({ kind }: { kind: "gitops" | "costopt" }) =>
  kind === "gitops" ? <GitOpsDiagram /> : <CostOptDiagram />;

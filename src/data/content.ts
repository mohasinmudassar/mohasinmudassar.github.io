export const site = {
  name: "Mohasin Mudassar",
  shortName: "Mohasin",
  role: "Platform & SRE Engineer",
  location: "Bamberg, Germany",
  email: "mohasin.mudassar.official@gmail.com",
  phone: "+49 155 60494924",
  whatsapp: "https://wa.me/4915560494924",
  github: "https://github.com/mohasinmudassar",
  linkedin: "https://www.linkedin.com/in/mohasin-mudassar/",
  resume: "/Mohasin-Mudassar-Resume.pdf",
  url: "https://mohasinmudassar.github.io",
  description:
    "Platform and Site Reliability Engineer in Germany building observable AWS and Azure platforms with Terraform, Kubernetes, GitOps, and pragmatic automation.",
  tagline:
    "I build reliable cloud platforms, instrument them so teams can see what is happening, and automate the path from infrastructure change to production.",
};

export const typewriter = [
  "platforms teams can build on",
  "reliable services with clear SLOs",
  "monitoring that catches it early",
  "Terraform modules teams reuse",
  "GitOps pipelines with Argo CD",
];

export const stats = [
  { value: "3+", label: "years in cloud & DevOps" },
  { value: "10+", label: "environments standardised" },
  { value: "35%", label: "shorter release cycles" },
  { value: "25–30%", label: "AWS cost reduction" },
];

export const about = {
  paragraphs: [
    "I'm a Platform and DevOps Engineer based in Bamberg, Germany, with 3+ years of experience building and running production platforms on AWS and Azure. Most of my work sits where infrastructure, automation and reliability meet: writing the Terraform that provisions an environment, the pipeline that ships to it, and the monitoring that tells you when something is wrong before a customer does.",
    "I've worked directly with customers to design cloud architectures, migrated deployments onto Kubernetes with rolling and blue-green rollouts, and cut release cycle times by standardising CI/CD across teams. I care about least-privilege by default, runbooks that someone can actually follow at 3am, and post-incident reviews that change something.",
    "I'm also an AI enthusiast exploring how intelligent developer tools, automation and observability can help engineering teams move faster without compromising reliability. Right now I'm finishing a Master's in International Software Systems Science at the University of Bamberg while looking for my next full-time Platform Engineer or DevOps Engineer role in Germany, ideally with an English-speaking engineering team.",
  ],
  currently: [
    "AWS",
    "Terraform",
    "Kubernetes",
    "Argo CD",
    "GitHub Actions",
    "Python",
    "AI tooling",
    "Datadog",
    "Linux",
  ],
};

export type Job = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  url?: string;
  stack: string[];
  bullets: string[];
};

export const jobs: Job[] = [
  {
    id: "innovixia",
    company: "Innovixia",
    role: "Cloud & DevOps Engineer",
    period: "Sep 2024 — Jan 2026",
    location: "Remote, Germany",
    stack: ["AWS", "Azure", "Terraform", "Kubernetes", "Argo CD", "Datadog", "Keycloak"],
    bullets: [
      "Standardised AWS and Azure infrastructure with reusable Terraform modules for EC2, VPC, EKS and AKS across 10+ environments, cutting environment setup from hours to minutes.",
      "Accelerated delivery with CI/CD automation in GitHub Actions, Jenkins and GitOps workflows on Argo CD 35% shorter release cycles across 8+ environments.",
      "Built observability with Datadog and Grafana, reducing detection time by 40% and MTTR by 25% through custom alerting and dashboards.",
      "Investigated 15+ production incidents across the deployment and infrastructure layers, driving RCA, mitigation and long-term reliability fixes.",
    ],
  },
  {
    id: "xgrid",
    company: "Xgrid",
    role: "Software Systems & DevOps Engineer",
    period: "May 2023 — Jun 2024",
    location: "Islamabad, Pakistan",
    stack: ["AWS", "Terraform", "ECS", "Datadog", "Cassandra", "Control Tower"],
    bullets: [
      "Deployed and operated a production microservices platform (10+ services) on AWS with Terraform EC2, RDS, Cognito, Route 53 and ECS for repeatable infrastructure delivery.",
      "Engineered automated delivery pipelines with GitHub Actions and Jenkins supporting rolling and canary releases, shortening release cycles from 5 days to 3.",
      "Hit 99% SLO compliance with MTTA under 1 minute and MTTR under 1 hour by tuning Datadog, Sumo Logic and CloudWatch observability pipelines.",
      "Cut unplanned downtime by automating Cassandra recovery, backup and maintenance workflows manual recovery effort dropped from hours to minutes.",
      "Hardened AWS security and governance with least-privilege IAM, S3 encryption, VPC segmentation and multi-account controls via AWS Organizations and Control Tower.",
    ],
  },
  {
    id: "autosphere",
    company: "Autosphere",
    role: "Associate DevOps Engineer",
    period: "Jan 2023 — May 2023",
    location: "Islamabad, Pakistan",
    stack: ["Jenkins", "GitHub Actions", "Ansible", "Bash", "Zabbix"],
    bullets: [
      "Built and maintained CI/CD pipelines in Jenkins and GitHub Actions, automating deployments for 5+ services.",
      "Standardised configuration management with Ansible and Bash, reducing manual system setup effort by 25%.",
      "Integrated Zabbix monitoring, improving infrastructure visibility and enabling early detection of critical issues.",
      "Partnered with development and QA to automate deployments and keep environments consistent.",
    ],
  },
];

export type Project = {
  title: string;
  tagline: string;
  problem: string;
  bullets: string[];
  stack: string[];
  repo?: string;
  diagram: "gitops" | "costopt";
};

export const projects: Project[] = [
  {
    title: "Kubernetes GitOps Platform on AWS EKS",
    tagline: "Terraform · Argo CD · Ingress NGINX",
    problem:
      "I took AWS's open-source retail-store sample app a realistic multi-service workload as the payload and built the platform around it: the kind of environment that normally takes hours of manual console work to stand up, with no way to tell from Git what was actually running in the cluster.",
    bullets: [
      "My contribution was the infrastructure layer, not the sample app's services: the EKS cluster, networking and IAM are entirely mine, provisioned in Terraform and dropping environment setup from hours to under 30 minutes.",
      "Moved deployments to a GitOps model with Argo CD, so the Git repo is the source of truth and a rollback is a git revert, not a manual kubectl fix under pressure.",
      "Configured Ingress NGINX and an AWS load balancer in front of the app's services, with health checks wired up so a failed pod doesn't take traffic down with it.",
    ],
    stack: ["Terraform", "AWS EKS", "Argo CD", "Ingress NGINX", "Kubernetes", "GitHub Actions"],
    repo: "https://github.com/mohasinmudassar/retail-store-app-deployment",
    diagram: "gitops",
  },
  {
    title: "AWS Idle Governance",
    tagline: "Python · AWS Lambda · Terraform · CloudWatch",
    problem:
      "Idle EC2 instances, load balancers and NAT gateways are easy to detect but hard to remediate safely. This governance workflow connects detection to ownership, notification and a reviewable change.",
    bullets: [
      "Built scheduled Python Lambda auditors for EC2, load balancers and NAT gateways, using CloudWatch metrics plus tags or CloudTrail to resolve ownership.",
      "Stores findings in DynamoDB and notifies the owner through SES while sending operations a daily SNS digest, creating an accountable trail instead of a noisy alert.",
      "Waits through a configurable grace period, then re-checks the stale=false opt-out before opening a Terraform pull request by default; direct deletion is an explicit mode.",
    ],
    stack: ["Python", "AWS Lambda", "Terraform", "DynamoDB", "CloudWatch", "SES / SNS", "GitHub API"],
    repo: "https://github.com/mohasinmudassar/aws-idle-governance",
    diagram: "costopt",
  },
];

export const skills = [
  {
    title: "Cloud Platforms",
    icon: "cloud",
    items: [
      "AWS — EC2, S3, VPC, IAM, EKS, RDS, Lambda",
      "Azure — AKS, VMs, VNets, Storage",
    ],
  },
  {
    title: "Infrastructure as Code",
    icon: "code",
    items: ["Terraform", "Ansible", "Reusable modules", "Multi-environment layouts"],
  },
  {
    title: "CI/CD & GitOps",
    icon: "pipeline",
    items: ["GitHub Actions", "Jenkins", "Argo CD", "GitOps workflows"],
  },
  {
    title: "Containers & Orchestration",
    icon: "box",
    items: ["Docker", "Kubernetes", "Helm-style releases", "EKS / AKS"],
  },
  {
    title: "Observability & Reliability",
    icon: "pulse",
    items: [
      "Datadog, Grafana, CloudWatch, Zabbix",
      "PagerDuty, SLO/SLI monitoring",
      "Incident response, RCA, runbooks",
    ],
  },
  {
    title: "Security & IAM",
    icon: "shield",
    items: ["AWS IAM & least-privilege", "OAuth2, OIDC, Keycloak, SSO", "Multi-account governance"],
  },
  {
    title: "Deployment Strategies",
    icon: "rocket",
    items: ["Blue-green", "Canary", "Rolling releases"],
  },
  {
    title: "Programming & Systems",
    icon: "terminal",
    items: ["Python, Bash, YAML", "Linux, NGINX, TCP/IP", "PostgreSQL, MySQL, MongoDB, Cassandra"],
  },
];

export const certifications = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "March 2026",
    url: "https://www.credly.com/badges/b7b3f541-b2f5-40f9-bdf4-782ab35a58be/public_url",
  },
];

export const education = [
  {
    degree: "M.Sc. International Software Systems Science",
    school: "Otto-Friedrich-Universität Bamberg",
    period: "Apr 2024 — Mar 2027",
    location: "Bamberg, Germany",
    note: "Currently writing my thesis.",
  },
  {
    degree: "B.Sc. Computer Science",
    school: "COMSATS University Islamabad",
    period: "Aug 2018 — Oct 2022",
    location: "Islamabad, Pakistan",
  },
];

export const languages = [
  { name: "English", level: "Native", pct: 100 },
  { name: "German", level: "A2 — Conversational", pct: 40 },
];

export const nav = [
  { num: "01", label: "About", href: "#about" },
  { num: "02", label: "Experience", href: "#experience" },
  { num: "03", label: "Projects", href: "#projects" },
  { num: "04", label: "Skills", href: "#skills" },
  { num: "05", label: "Credentials", href: "#credentials" },
];

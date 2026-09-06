export const site = {
  name: "Mohasin Mudassar",
  shortName: "Mohasin",
  role: "Cloud & DevOps Engineer",
  location: "Bamberg, Germany",
  email: "mohasin.mudassar.official@gmail.com",
  phone: "+49 155 60494924",
  whatsapp: "https://wa.me/4915560494924",
  github: "https://github.com/mohasinmudassar",
  linkedin: "https://www.linkedin.com/in/mohasin-mudassar/",
  medium: "https://medium.com/@mohasinmudassar16",
  resume: "/Mohasin-Mudassar-Resume.pdf",
  url: "https://mohasinmudassar.github.io",
  tagline:
    "I build and operate cloud platforms on AWS and Azure — Terraform for the infrastructure, Kubernetes for the workloads, GitOps for everything in between.",
};

export const typewriter = [
  "cloud platforms on AWS & Azure",
  "Kubernetes clusters on EKS & AKS",
  "GitOps pipelines with Argo CD",
  "Terraform modules teams reuse",
  "observability that catches it early",
];

export const stats = [
  { value: "3+", label: "years in cloud & DevOps" },
  { value: "10+", label: "environments standardised" },
  { value: "35%", label: "faster release cycles" },
  { value: "25–30%", label: "AWS cost reduction" },
];

export const about = {
  paragraphs: [
    "I'm a Cloud & DevOps Engineer based in Bamberg, Germany, with 3+ years of experience building and running production platforms on AWS and Azure. Most of my work sits where infrastructure, automation and reliability meet: writing the Terraform that provisions an environment, the pipeline that ships to it, and the alerting that tells you when something is wrong before a customer does.",
    "I've worked directly with customers to design cloud architectures, migrated deployments onto Kubernetes with rolling and blue-green rollouts, and cut release cycle times by standardising CI/CD across teams. I care about least-privilege by default, runbooks that someone can actually follow at 3am, and post-incident reviews that change something.",
    "Right now I'm finishing a Master's in International Software Systems Science at the University of Bamberg while looking for my next full-time Cloud/DevOps role in Germany — ideally with an English-speaking engineering team.",
  ],
  currently: [
    "AWS",
    "Terraform",
    "Kubernetes",
    "Argo CD",
    "GitHub Actions",
    "Python",
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
      "Designed and shipped containerised applications on Kubernetes using rolling and blue-green deployments, improving release reliability across production.",
      "Accelerated delivery with CI/CD automation in GitHub Actions, Jenkins and GitOps workflows on Argo CD — 35% shorter release cycles across 8+ environments.",
      "Worked with 5+ customers to gather requirements and design scalable AWS and Azure architectures for production platforms.",
      "Built observability with Datadog and Grafana, reducing detection time by 40% and MTTR by 25% through custom alerting and dashboards.",
      "Implemented least-privilege IAM and Keycloak-based SSO across 6+ applications, tightening platform security and access governance.",
      "Investigated 15+ production incidents across the deployment and infrastructure layers, driving RCA, mitigation and long-term reliability fixes.",
      "Wrote operational runbooks, RCA reports and technical guides that improved on-call readiness and knowledge sharing.",
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
      "Deployed and operated a production microservices platform (10+ services) on AWS with Terraform — EC2, RDS, Cognito, Route 53 and ECS — for repeatable infrastructure delivery.",
      "Engineered automated delivery pipelines with GitHub Actions and Jenkins supporting rolling and canary releases, shortening release cycles from 5 days to 3.",
      "Hit 99% SLO compliance with MTTA under 1 minute and MTTR under 1 hour by tuning Datadog, Sumo Logic and CloudWatch observability pipelines.",
      "Cut unplanned downtime by automating Cassandra recovery, backup and maintenance workflows — manual recovery effort dropped from hours to minutes.",
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
      "Spinning up a production-shaped Kubernetes environment took hours of manual clicking, and nobody could tell from Git what was actually running in the cluster.",
    bullets: [
      "Provisioned an AWS EKS cluster entirely in Terraform, dropping provisioning time from hours to under 30 minutes.",
      "Moved deployments to a GitOps model with Argo CD, so the repo is the source of truth and rollbacks are a git revert.",
      "Configured Ingress NGINX and AWS load balancing for high availability across 3+ services, holding 99% uptime.",
    ],
    stack: ["Terraform", "AWS EKS", "Argo CD", "Ingress NGINX", "Kubernetes", "GitHub Actions"],
    repo: "https://github.com/mohasinmudassar/retail-store-app-deployment",
    diagram: "gitops",
  },
  {
    title: "Automated AWS Cost Optimization System",
    tagline: "Python · AWS Lambda · CloudWatch",
    problem:
      "Idle EC2 instances, orphaned load balancers and forgotten NAT Gateways were quietly burning budget every month, and nobody owned finding them.",
    bullets: [
      "Built a serverless Python + Lambda service that scans accounts on a schedule and flags or cleans idle EC2, ELB and NAT Gateway resources.",
      "Delivered a 25–30% reduction in monthly cloud spend while tightening tagging policy and resource ownership.",
      "Reports land in CloudWatch and notifications, so cost hygiene became a recurring signal instead of a quarterly surprise.",
    ],
    stack: ["Python", "AWS Lambda", "CloudWatch", "Boto3", "IAM", "EventBridge"],
    repo: "https://github.com/mohasinmudassar/Automated-AWS-Cost-Optimization-System",
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
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
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
  { name: "English", level: "C1 — Professional proficiency", pct: 90 },
  { name: "German", level: "A2 — Conversational", pct: 40 },
  { name: "Urdu", level: "Native", pct: 100 },
];

export const nav = [
  { num: "01", label: "About", href: "#about" },
  { num: "02", label: "Experience", href: "#experience" },
  { num: "03", label: "Projects", href: "#projects" },
  { num: "04", label: "Skills", href: "#skills" },
  { num: "05", label: "Credentials", href: "#credentials" },
];

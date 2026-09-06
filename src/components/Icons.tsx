type P = { size?: number; className?: string };
const base = (s = 18) => ({
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const GitHubIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.57A12 12 0 0 0 12 .5Z" />
  </svg>
);

export const LinkedInIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

export const MediumIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12ZM20.96 12c0 3.54-1.51 6.4-3.38 6.4-1.87 0-3.39-2.86-3.39-6.4s1.52-6.4 3.39-6.4 3.38 2.87 3.38 6.4ZM24 12c0 3.17-.53 5.75-1.19 5.75s-1.19-2.58-1.19-5.75.53-5.75 1.19-5.75S24 8.83 24 12Z" />
  </svg>
);

export const MailIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 7 8.2 5.6a1.5 1.5 0 0 0 1.6 0L21 7" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.57-.35ZM12.05 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.78 9.78 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.82-9.8a9.75 9.75 0 0 1 6.93 2.88 9.72 9.72 0 0 1 2.87 6.93c0 5.4-4.41 9.81-9.81 9.81ZM20.4 3.6A11.68 11.68 0 0 0 12.05 0C5.56 0 .28 5.28.28 11.77c0 2.07.54 4.1 1.57 5.88L.18 24l6.5-1.7a11.74 11.74 0 0 0 5.37 1.36h.01c6.48 0 11.76-5.28 11.76-11.77 0-3.15-1.22-6.1-3.44-8.32Z" />
  </svg>
);

export const DownloadIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M12 3v12" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M4 20h16" />
  </svg>
);

export const ExternalIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
  </svg>
);

export const ArrowIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M5 12h13" />
    <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
  </svg>
);

export const MenuIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const AwsBadgeIcon = ({ size = 30 }: P) => (
  <svg {...base(size)} strokeWidth={1.5}>
    <path d="M12 2.5 4 6v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6l-8-3.5Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </svg>
);

const skillPaths: Record<string, React.ReactNode> = {
  cloud: <path d="M6.5 18.5A4 4 0 0 1 6 10.6a5.5 5.5 0 0 1 10.6-1.2 4.3 4.3 0 0 1 .4 8.6l-.4.05H6.5Z" />,
  code: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5-3 14" />
    </>
  ),
  pipeline: (
    <>
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M7.1 7.2 10 10.4M14 13.6l2.9 3.2" />
    </>
  ),
  box: (
    <>
      <path d="M12 2.8 20 7v10l-8 4.2L4 17V7l8-4.2Z" />
      <path d="M4 7.2 12 11.5 20 7.2M12 11.5V21" />
    </>
  ),
  pulse: <path d="M2.5 12.5h4L9 6.5l3.5 11 2.4-5h6.6" />,
  shield: (
    <>
      <path d="M12 2.8 4.5 5.8v5.7c0 4.4 3.1 8.4 7.5 9.7 4.4-1.3 7.5-5.3 7.5-9.7V5.8L12 2.8Z" />
      <path d="M12 11v4" />
      <circle cx="12" cy="8.6" r=".6" fill="currentColor" />
    </>
  ),
  rocket: (
    <>
      <path d="M13.5 3.5c3.5 0 7 3.5 7 7-1.6 4.3-4.6 7-9 9L8 15.9 4.5 12.4c2-4.4 4.7-7.4 9-8.9Z" />
      <circle cx="14.5" cy="9.5" r="1.8" />
      <path d="M8 16c-1.6.6-2.6 2-3 4 2-.4 3.4-1.4 4-3" />
    </>
  ),
  terminal: (
    <>
      <rect x="2.8" y="4.5" width="18.4" height="15" rx="2.4" />
      <path d="m7 10 2.6 2.4L7 15M13 15h4" />
    </>
  ),
};

export const SkillIcon = ({ name, size = 22 }: { name: string; size?: number }) => (
  <svg {...base(size)}>{skillPaths[name] ?? skillPaths.terminal}</svg>
);

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found wrap">
      <p className="kicker">404</p>
      <h1>Page not found</h1>
      <p>This page may have moved. You can return to my portfolio below.</p>
      <Link className="btn" href="/">Back to home</Link>
    </main>
  );
}

import React, { useEffect, useState } from "react";

/**
 * Responsive portfolio (safe version)
 * - Fix: IntersectionObserver rootMargin uses explicit units ("-30% 0px -60% 0px")
 * - Robust resume download using public URL(s) only
 * - Shows ALL certifications
 */
export default function PortfolioApp() {
  // ---------------- THEME ----------------
  const THEME = {
    pageBg: "#f8fafc",
    text: "#0b1220",
    textMuted: "#475569",
    primary: "#2563eb",
    primaryDark: "#1e40af",
    gradientA: "#7c3aed",
    gradientB: "#06b6d4",
    card: "#ffffff",
    border: "#e5e7eb",
    soft: "#f1f5f9",
  };
  const border = (c = THEME.border) => `1px solid ${c}`;
  const shadow = "0 10px 25px rgba(2, 6, 23, .08)";

  // ---------------- BREAKPOINTS ----------------
  const BP = { sm: 480, md: 768, lg: 1024 };
  function useViewport() {
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
    useEffect(() => {
      const onResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", onResize, { passive: true });
      return () => window.removeEventListener("resize", onResize);
    }, []);
    return { width };
  }
  const { width } = useViewport();
  const isSM = width < BP.sm;
  const isMD = width < BP.md;
  const isLG = width < BP.lg;

  // ---------------- DATA ----------------
  const skills = [
    "Java", "SQL", "AWS", "Python", "Git",
    "Project Management", "Snowflake", "Prompt Engineering", "CI/CD", "Jenkins",
  ];

  const projects = [
    { title: "Environment Manager Plus (EM+)", description: "Manages installation of Cerner packages into domains using plan-driven workflows to streamline releases and reduce install time." },
    { title: "Environment Manager Migration (EMM)", description: "CLI tool to migrate Environment Manager data from Microsoft DB to Environment Manager Plus (Oracle) with integrity checks." },
    { title: "EMR Transformation", description: "Digitizes end-to-end hospital workflows from admission to discharge; enables electronic records and archival for future use." },
    { title: "Cardiovascular Solution", description: "Automates cardiology workflows, improves cardiac disease management, and streamlines diagnostic imaging operations." },
  ];

  const certifications = [
    { title: "Amazon Web Services Cloud Practitioner", logo: "/logos/aws.png" },
    { title: "Prompt Engineering for ChatGPT", logo: "/logos/coursera.png" },
    { title: "Python for Data Science and AI", logo: "/logos/coursera.png" },
    { title: "Data Science Methodology", logo: "/logos/coursera.png" },
    { title: "Open Source Tools for Data Science", logo: "/logos/coursera.png" },
    { title: "What is Data Science?", logo: "/logos/coursera.png" },
    { title: "nasscom Women Wizards Rule Tech (WWRT) Cohort 5 - Foundation Course", logo: "/logos/nasscom.png" }
  ];

  // ---------------- RESUME DOWNLOAD (public/ + BASE_URL only) ----------------
  const baseUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/";
  const RESUME_PATHS = [
    "/Manasapujha_Resume.pdf",
    `${baseUrl}Manasapujha_Resume.pdf`,
  ];

  async function resolveFirstWorkingUrl(candidates) {
    for (const url of candidates) {
      try {
        const head = await fetch(url, { method: "HEAD", credentials: "same-origin" });
        if (head.ok) return url;
      } catch {}
    }
    return null;
  }

  async function blobDownload(url, filename) {
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error(`GET ${url} => ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename || "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleResumeDownload(e) {
    e.preventDefault();
    try {
      const working = await resolveFirstWorkingUrl(RESUME_PATHS);
      if (!working) throw new Error("No working resume path found");
      await blobDownload(working, "Manasapujha_G_R_Resume.pdf");
    } catch (err) {
      // Fallback: open in a new tab if download fails
      const fallback = RESUME_PATHS[0];
      window.open(fallback, "_blank", "noopener,noreferrer");
    }
  }

  // ---------------- LAYOUT ----------------
  function Shell({ children }) {
    return (
      <div style={{ background: THEME.pageBg, minHeight: "100vh" }}>
        <Nav onResumeClick={handleResumeDownload} />
        <header style={{
          background: `radial-gradient(1100px 500px at 10% -20%, ${THEME.gradientA}22, transparent 60%),
                       radial-gradient(1100px 600px at 100% -40%, ${THEME.gradientB}22, transparent 60%)`,
          borderBottom: border("#e2e8f0"),
        }}>
          <Hero onResumeClick={handleResumeDownload} />
        </header>
        <main style={{ maxWidth: isLG ? 1000 : 1100, margin: "0 auto", padding: isMD ? "24px 16px 56px" : "32px 20px 64px" }}>
          {children}
        </main>
        <footer style={{ textAlign: "center", padding: isMD ? 16 : 20, borderTop: border(), color: THEME.textMuted }}>
          © 2025 Manasapujha G. R.
        </footer>
      </div>
    );
  }

  function Nav({ onResumeClick }) {
    const [activeId, setActiveId] = React.useState("");

    useEffect(() => {
      if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
      const ids = ["skills", "projects", "certifications"];
      const secs = ids.map((id) => document.getElementById(id)).filter(Boolean);
      const obs = new IntersectionObserver((entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis.length > 0) setActiveId(vis[0].target.id);
      }, { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] });
      secs.forEach((s) => obs.observe(s));
      return () => obs.disconnect();
    }, []);

    function NavLink({ href, label, onClick, title }) {
      const [hover, setHover] = React.useState(false);
      const targetId = href && href.startsWith("#") ? href.slice(1) : null;
      const isActive = targetId && activeId === targetId;

      const style = {
        color: THEME.text, textDecoration: "none",
        padding: isSM ? "8px 10px" : "8px 12px",
        borderRadius: 9999, transition: "background .15s ease, transform .15s ease, box-shadow .15s ease",
        background: isActive ? THEME.soft : hover ? THEME.soft : "transparent",
        transform: hover && !isSM ? "translateY(-2px)" : "none",
        boxShadow: isActive || (hover && !isSM) ? "0 8px 16px rgba(2,6,23,.10)" : "none",
        fontWeight: isActive ? 700 : 500, display: "inline-block",
      };

      function handleClick(e) {
        if (onClick) return onClick(e);
        if (targetId) {
          e.preventDefault();
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, "", "#" + targetId);
        }
      }

      return (
        <a href={href} title={title} style={style}
           onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={handleClick}>
          {label}
        </a>
      );
    }

    return (
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backdropFilter: "saturate(180%) blur(8px)", background: "rgba(255,255,255,.85)", borderBottom: border("#e2e8f0") }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isSM ? "8px 12px" : "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: isMD ? "wrap" : "nowrap" }}>
          <div />
          <div style={{ display: "flex", gap: isSM ? 6 : 8, flexWrap: "wrap" }}>
            <NavLink href="#skills" label="Skills" />
            <NavLink href="#projects" label="Projects" />
            <NavLink href="#certifications" label="Certifications" />
            <NavLink href="/Manasapujha_Resume.pdf" label="Resume" title="Download Resume" onClick={onResumeClick} />
          </div>
        </div>
      </nav>
    );
  }

  function Section({ id, title, subtitle, children }) {
    return (
      <section id={id} style={{ marginTop: isMD ? 32 : 42 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: isMD ? 22 : 26, fontWeight: 800, margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ margin: "6px 0 0", color: THEME.textMuted, fontSize: isMD ? 14 : 16 }}>{subtitle}</p>}
        </div>
        {children}
      </section>
    );
  }

  function Hero({ onResumeClick }) {
    const imgSize = isMD ? (isSM ? 110 : 140) : 180;
    const imgStyle = { width: imgSize, height: imgSize, borderRadius: "50%", objectFit: "cover", boxShadow: "0 10px 24px rgba(2,6,23,.18)", border: border("#e2e8f0"), margin: isMD ? "0 auto" : 0 };

    function HeroButton({ href, label, onClick }) {
      const [hover, setHover] = React.useState(false);
      const style = { background: hover ? "#ffffff" : THEME.soft, color: THEME.text, textDecoration: "none", padding: isSM ? "9px 12px" : "10px 14px", borderRadius: 10, border: border(), transition: "background .15s ease, transform .15s ease, box-shadow .15s ease", transform: hover && !isSM ? "translateY(-2px)" : "none", boxShadow: hover && !isSM ? "0 8px 16px rgba(2,6,23,.12)" : "none" };
      return (
        <a href={href} style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}>
          {label}
        </a>
      );
    }

    return (
      <div style={{ maxWidth: isLG ? 1000 : 1100, margin: "0 auto", padding: isMD ? "36px 16px 20px" : "60px 20px" }}>
        <div style={{ display: "grid", gap: isMD ? 18 : 24, alignItems: "center", gridTemplateColumns: isMD ? "1fr" : "1fr auto", textAlign: isMD ? "center" : "left" }}>
          <div>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 10px", borderRadius: 9999, background: "#ffffffa6", border: border("#e2e8f0") }}>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: THEME.primary }} />
              <span style={{ fontSize: isMD ? 11 : 12, color: THEME.text }}>
                Software Development Engineer Senior · CSG Systems International (India)
              </span>
            </div>
            <h1 style={{ fontSize: isMD ? (isSM ? 28 : 32) : 40, lineHeight: 1.2, margin: "16px 0 8px" }}>Manasapujha G. R.</h1>
            <p style={{ color: THEME.textMuted, fontSize: isMD ? 14 : 16, margin: 0 }}>Full-Stack Developer · Healthcare & Telecom · AWS</p>
            <div style={{ display: "flex", gap: 12, marginTop: 18, justifyContent: isMD ? "center" : "flex-start", flexWrap: "wrap" }}>
              <HeroButton href="#projects" label="View Projects" />
              <HeroButton href="/Manasapujha_Resume.pdf" label="Download Resume" onClick={onResumeClick} />
            </div>
          </div>
          <img src="/images/profile.jpg" alt="Manasapujha G. R." style={imgStyle} />
        </div>
      </div>
    );
  }

  function Skills() {
    return (
      <Section id="skills" title="Skills" subtitle="Languages, platforms & tooling I use to ship reliably">
        <div style={{ display: "flex", flexWrap: "wrap", gap: isSM ? 8 : 10 }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: isSM ? 12 : 13, padding: isSM ? "7px 10px" : "8px 12px", borderRadius: 9999, color: THEME.text, background: "#eef2ff", border: border("#e5e7eb") }}>{s}</span>
          ))}
        </div>
      </Section>
    );
  }

  function Projects() {
    return (
      <Section id="projects" title="Projects" subtitle="Selected work across healthcare IT and environment management">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: isMD ? 14 : 16 }}>
          {projects.map((p, i) => (
            <article key={i} style={{ background: THEME.card, border: border(), borderRadius: 16, padding: isMD ? 16 : 18, boxShadow: shadow }}>
              <h3 style={{ fontWeight: 800, fontSize: isMD ? 17 : 18, margin: 0 }}>{p.title}</h3>
              <p style={{ color: THEME.textMuted, lineHeight: 1.6, margin: "8px 0 12px", fontSize: isMD ? 14 : 15 }}>{p.description}</p>
              <div><a href="#contact" style={{ color: THEME.primaryDark, textDecoration: "none", fontWeight: 600 }}>Discuss →</a></div>
            </article>
          ))}
        </div>
      </Section>
    );
  }

  function Certifications() {
    return (
      <Section id="certifications" title="Certifications" subtitle="All verified courses and credentials">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: isMD ? 14 : 16 }}>
          {certifications.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: THEME.card, border: border(), borderRadius: 14, padding: isMD ? 12 : 14, boxShadow: shadow }}>
              <span style={{ fontWeight: 700, fontSize: isMD ? 14 : 15 }}>{c.title}</span>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  // ---------------- PAGE ----------------
  return (
    <Shell>
      <Skills />
      <Projects />
      <Certifications />
    </Shell>
  );
}

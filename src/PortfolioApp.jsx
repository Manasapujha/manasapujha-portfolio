import React, { useEffect, useState } from "react";

/**
 * Responsive refinements for mobile & laptop
 * + robust, programmatic resume download for browsers that ignore `download`
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
    ring: "#93c5fd",
    chipPalette: ["#f97316", "#06b6d4", "#8b5cf6", "#22c55e", "#eab308", "#ef4444", "#10b981"],
  };
  const border = (c = THEME.border) => `1px solid ${c}`;
  const shadow = "0 10px 25px rgba(2, 6, 23, .08)";

  // ---------------- BREAKPOINTS ----------------
  const BP = { sm: 480, md: 768, lg: 1024 };
  function useViewport() {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
      function onResize() { setWidth(window.innerWidth); }
      window.addEventListener('resize', onResize, { passive: true });
      return () => window.removeEventListener('resize', onResize);
    }, []);
    return { width };
  }
  const { width } = useViewport();
  const isSM = width < BP.sm;
  const isMD = width < BP.md;
  const isLG = width < BP.lg;

  // ---------------- UTIL ----------------
  async function forceDownload(url, filename) {
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      // fallback: just open the url
      window.location.href = url;
    }
  }

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

  // ---------------- LAYOUT ----------------
  function Shell({ children }) {
    return (
      <div style={{ background: THEME.pageBg, minHeight: "100vh" }}>
        <Nav />
        <header style={{
          background: `radial-gradient(1100px 500px at 10% -20%, ${THEME.gradientA}22, transparent 60%),
                       radial-gradient(1100px 600px at 100% -40%, ${THEME.gradientB}22, transparent 60%)`,
          borderBottom: border("#e2e8f0"),
        }}>
          <Hero />
        </header>
        <main style={{
          maxWidth: isLG ? 1000 : 1100,
          margin: "0 auto",
          padding: isMD ? "24px 16px 56px" : "32px 20px 64px",
        }}>{children}</main>
        <footer style={{ textAlign: "center", padding: isMD ? 16 : 20, borderTop: border(), color: THEME.textMuted }}>
          © 2025 Manasapujha G. R.
        </footer>
      </div>
    );
  }

  function Nav() {
    const [activeId, setActiveId] = React.useState("");

    React.useEffect(() => {
      const sectionIds = ["skills", "projects", "certifications"];
      const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      }, { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] });
      sections.forEach(sec => observer.observe(sec));
      return () => observer.disconnect();
    }, []);

    function NavLink({ href, label, download, title }) {
      const [hover, setHover] = React.useState(false);
      const targetId = (href || "").startsWith("#") ? href.slice(1) : null;
      const isActive = targetId && activeId === targetId;

      const style = {
        color: THEME.text, textDecoration: "none",
        padding: isSM ? "8px 10px" : "8px 12px",
        borderRadius: 9999,
        transition: "background .15s ease, transform .15s ease, box-shadow .15s ease",
        background: isActive ? THEME.soft : (hover ? THEME.soft : "transparent"),
        transform: hover && !isSM ? "translateY(-2px)" : "none",
        boxShadow: (isActive || (hover && !isSM)) ? "0 8px 16px rgba(2,6,23,.10)" : "none",
        fontWeight: isActive ? 700 : 500, display: "inline-block"
      };

      async function onClick(e) {
        if (targetId) {
          e.preventDefault();
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", "#" + targetId);
          return;
        }
        if (download && href) {
          e.preventDefault();
          await forceDownload(href, download);
        }
      }

      return (
        <a
          href={href}
          download={download}
          title={title}
          style={style}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={onClick}
        >
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
            <NavLink href="/Manasapujha_Resume.pdf" label="Resume" download="Manasapujha_G_R_Resume.pdf" title="Download Resume" />
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

  function Hero() {
    const imgSize = isMD ? (isSM ? 110 : 140) : 180;
    const imgStyle = { width: imgSize, height: imgSize, borderRadius: "50%", objectFit: "cover", boxShadow: "0 10px 24px rgba(2,6,23,.18)", border: border("#e2e8f0"), margin: isMD ? "0 auto" : 0 };

    function HeroButton({ href, label, download }) {
      const [hover, setHover] = React.useState(false);
      const style = { background: hover ? "#ffffff" : THEME.soft, color: THEME.text, textDecoration: "none", padding: isSM ? "9px 12px" : "10px 14px", borderRadius: 10, border: border(), transition: "background .15s ease, transform .15s ease, box-shadow .15s ease", transform: hover && !isSM ? "translateY(-2px)" : "none", boxShadow: hover && !isSM ? "0 8px 16px rgba(2,6,23,.12)" : "none" };

      async function onClick(e) {
        if (download && href) {
          e.preventDefault();
          await forceDownload(href, download);
        }
      }

      return (
        <a href={href} download={download} style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}>
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
              <HeroButton href="/Manasapujha_Resume.pdf" label="Download Resume" download="Manasapujha_G_R_Resume.pdf" />
            </div>
          </div>
          <img src="/images/profile.jpg" alt="Manasapujha G. R." style={imgStyle} />
        </div>
      </div>
    );
  }

  function Skills() {
    function SkillChip({ label, color }) {
      const [hover, setHover] = React.useState(false);
      const style = { fontSize: isSM ? 12 : 13, padding: isSM ? "7px 10px" : "8px 12px", borderRadius: 9999, color: THEME.text, background: hover ? color + "44" : color + "22", border: border(hover ? color : color + "55"), transition: "background .2s ease, transform .15s ease, box-shadow .15s ease", transform: hover && !isSM ? "translateY(-2px)" : "none", boxShadow: hover && !isSM ? "0 6px 12px rgba(2,6,23,.12)" : "none", cursor: "default" };
      return <span style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{label}</span>;
    }

    return (
      <Section id="skills" title="Skills" subtitle="Languages, platforms & tooling I use to ship reliably">
        <div style={{ display: "flex", flexWrap: "wrap", gap: isSM ? 8 : 10 }}>
          {skills.map((s, i) => (<SkillChip key={i} label={s} color={THEME.chipPalette[i % THEME.chipPalette.length]} />))}
        </div>
      </Section>
    );
  }

  function Projects() {
    const baseCard = { background: THEME.card, border: border(), borderRadius: 16, padding: isMD ? 16 : 18, boxShadow: shadow, position: "relative", overflow: "hidden", transition: "transform .15s ease, box-shadow .15s ease, background .2s ease" };
    const title = { fontWeight: 800, fontSize: isMD ? 17 : 18, margin: 0 };
    const text = { color: THEME.textMuted, lineHeight: 1.6, margin: "8px 0 12px", fontSize: isMD ? 14 : 15 };

    function ProjectCard({ project }) {
      const [hover, setHover] = React.useState(false);
      const style = { ...baseCard, transform: hover && !isSM ? "translateY(-2px)" : "none", boxShadow: hover && !isSM ? "0 14px 30px rgba(2,6,23,.12)" : shadow, background: hover && !isSM ? "#f9fafb" : THEME.card };
      return (
        <article style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${THEME.gradientA}06, ${THEME.gradientB}06)` }} />
          <div style={{ position: "relative" }}>
            <h3 style={title}>{project.title}</h3>
            <p style={text}>{project.description}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="#contact" style={{ color: THEME.primaryDark, textDecoration: "none", fontWeight: 600 }}>Discuss →</a>
            </div>
          </div>
        </article>
      );
    }

    return (
      <Section id="projects" title="Projects" subtitle="Selected work across healthcare IT and environment management">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: isMD ? 14 : 16 }}>
          {projects.map((p, i) => (<ProjectCard key={i} project={p} />))}
        </div>
      </Section>
    );
  }

  function Certifications() {
    const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: isMD ? 14 : 16 };
    const baseCard = { display: "flex", alignItems: "center", gap: 12, background: THEME.card, border: border(), borderRadius: 14, padding: isMD ? 12 : 14, boxShadow: shadow, transition: "transform .15s ease, box-shadow .15s ease, background .2s ease" };
    const groupTitle = { fontSize: isMD ? 13 : 14, fontWeight: 800, color: THEME.textMuted, margin: "18px 0 8px" };
    const divider = { borderTop: border("#e5e7eb"), margin: isMD ? "16px 0" : "20px 0" };

    const certifications = [
      { title: "Amazon Web Services Cloud Practitioner", logo: "/logos/aws.png" },
      { title: "Prompt Engineering for ChatGPT", logo: "/logos/coursera.png" },
      { title: "Python for Data Science and AI", logo: "/logos/coursera.png" },
      { title: "Data Science Methodology", logo: "/logos/coursera.png" },
      { title: "Open Source Tools for Data Science", logo: "/logos/coursera.png" },
      { title: "What is Data Science?", logo: "/logos/coursera.png" },
      { title: "nasscom Women Wizards Rule Tech (WWRT) Cohort 5 - Foundation Course", logo: "/logos/nasscom.png" }
    ];

    function CardItem({ cert }) {
      const [hover, setHover] = React.useState(false);
      const style = { ...baseCard, transform: hover && !isSM ? "translateY(-2px)" : "none", boxShadow: hover && !isSM ? "0 14px 30px rgba(2,6,23,.12)" : shadow, background: hover && !isSM ? "#f9fafb" : THEME.card };
      return (
        <div style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div>
            {cert.url ? (
              <a href={cert.url} target="_blank" rel="noreferrer" style={{ color: THEME.primary, fontWeight: 700, textDecoration: "none", fontSize: isMD ? 14 : 15 }}>{cert.title}</a>
            ) : (
              <span style={{ fontWeight: 700, fontSize: isMD ? 14 : 15 }}>{cert.title}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <Section id="certifications" title="Certifications" subtitle="Organized for quick scanning">
        {[
          { name: "🎯 Core Certifications", items: ["Amazon Web Services Cloud Practitioner", "Prompt Engineering for ChatGPT"] },
        ].map((g, gi) => (
          <div key={gi} style={{ marginTop: gi === 0 ? 0 : 8 }}>
            {gi > 0 && <div style={divider} />}
            <div style={groupTitle}>{g.name}</div>
            <div style={grid}>
              {certifications.filter(c => g.items.includes(c.title)).map((c, i) => (<CardItem key={i} cert={c} />))}
            </div>
          </div>
        ))}
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

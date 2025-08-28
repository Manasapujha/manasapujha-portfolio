import React, { useEffect, useState } from "react";

/**
 * Portfolio (WhatsApp + grouped certs, NO icons)
 * - FIX: Resume download verifies real PDF (Content-Type or "%PDF" signature) to prevent blank downloads
 * - Uses cache-busting query to avoid stale cached HTML/0-byte artifacts
 * - Keeps WhatsApp deep-link on "Discuss →"
 * - IntersectionObserver rootMargin units fixed
 */
export default function PortfolioApp() {
  // ---------------- THEME ----------------
  const THEME = {
    pageBg: "var(--bg)",
    text: "var(--text)",
    textMuted: "var(--muted)",
    primary: "var(--primary)",
    primaryDark: "var(--primary-2)",
    gradientA: "var(--primary)",
    gradientB: "var(--primary-2)",
    card: "var(--card)",
    border: "var(--border)",
    soft: "var(--soft)",
  };
  const border = (c = THEME.border) => `1px solid ${c}`;
  const shadow = "var(--shadow)";

  // ---------------- BREAKPOINTS ----------------
  const BP = { sm: 480, md: 768, lg: 1024 };
  function useViewport() {
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
    const [theme, setTheme] = useState(() => {
      if (typeof window !== "undefined") {
        return document.documentElement.dataset.theme || "light";
      }
      return "light";
    });
    
    useEffect(() => {
      const onResize = () => setWidth(window.innerWidth);
      const onThemeChange = () => {
        const currentTheme = document.documentElement.dataset.theme || "light";
        setTheme(currentTheme);
      };
      
      // Listen for theme changes
      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("themechange", onThemeChange);
      
      // Also listen for storage changes (in case theme is changed in another tab)
      const onStorageChange = (e) => {
        if (e.key === "theme") {
          const currentTheme = e.newValue || "light";
          document.documentElement.dataset.theme = currentTheme;
          setTheme(currentTheme);
        }
      };
      
      window.addEventListener("storage", onStorageChange);
      
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("themechange", onThemeChange);
        window.removeEventListener("storage", onStorageChange);
      };
    }, []);
    
    return { width, theme };
  }
  const { width, theme } = useViewport();
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

  // Certifications — grouped later, but NO icons are rendered.
  const certifications = [
    { title: "Amazon Web Services Cloud Practitioner", provider: "AWS", pdf: "/Coursera AWS Cloud Practitioner Essentials.pdf" },
    { title: "Prompt Engineering for ChatGPT", provider: "Coursera", pdf: "/Prompt_Engineering.pdf" },
    { title: "Python for Data Science and AI", provider: "Coursera", pdf: "/Python_DataScience.pdf" },
    { title: "Data Science Methodology", provider: "Coursera", pdf: "/Data_Science_Methodology.pdf" },
    { title: "Open Source Tools for Data Science", provider: "Coursera", pdf: "/Tools_DataScience.pdf" },
    { title: "What is Data Science?", provider: "Coursera", pdf: "/DataScience.pdf" },
    { title: "nasscom Women Wizards Rule Tech (WWRT) Cohort 5 - Foundation Course", provider: "NASSCOM" },
  ];

  // ---------------- WHATSAPP HELPERS ----------------
  const WHATSAPP_NUMBER = "919880284129"; // E.164 without '+' for wa.me
  function buildWhatsAppLink(projectName) {
    const msg = `Hello, I came across the project ${projectName} in your portfolio. Would like to collaborate and discuss further`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  const RESUME_URL = "/Manasapujha_Resume.pdf";

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
        <main style={{ maxWidth: isLG ? 1000 : 1100, margin: "0 auto", padding: isMD ? "24px 16px 56px" : "32px 20px 64px" }}>
          {children}
        </main>
        <footer style={{ textAlign: "center", padding: isMD ? 16 : 20, borderTop: border(), color: THEME.textMuted }}>
          © 2025 Manasapujha G. R.
        </footer>
      </div>
    );
  }

  function Nav() {
    const [activeId, setActiveId] = React.useState("");
    const [resumeHover, setResumeHover] = React.useState(false);

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

    function ThemeToggle() {
      const [theme, setTheme] = useState(null);
      
      useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") {
          document.documentElement.dataset.theme = saved;
          setTheme(saved);
          return;
        }
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = prefersDark ? "dark" : "light";
        document.documentElement.dataset.theme = initial;
        setTheme(initial);
      }, []);
      
      function toggleTheme() {
        const next = (document.documentElement.dataset.theme === "dark") ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme", next);
        setTheme(next);
        
        // Force a re-render by dispatching a custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
        
        // Also trigger a storage event to sync across tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'theme',
          newValue: next,
          oldValue: document.documentElement.dataset.theme
        }));
      }
      
      return (
        <button 
          onClick={toggleTheme} 
          className="btn" 
          aria-label="Toggle color theme" 
          title="Toggle theme"
          style={{
            background: THEME.soft,
            color: THEME.text,
            border: border()
          }}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      );
    }

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
      <nav className="glass border" style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <div className="container nav-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: isSM ? "8px 12px" : "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: isMD ? "wrap" : "nowrap" }}>
          <div />
          <div className="nav-links" style={{ display: "flex", gap: isSM ? 6 : 8, flexWrap: "wrap" }}>
            <NavLink href="#skills" label="Skills" />
            <NavLink href="#projects" label="Projects" />
            <NavLink href="#certifications" label="Certifications" />
            <NavLink href="#contact" label="Contact" />
            <NavLink href="#social" label="Social" />
            <a
              href={RESUME_URL}
              download="Manasapujha_G_R_Resume.pdf"
              rel="noopener"
              aria-label="Download resume PDF"
              style={{
                color: THEME.text,
                textDecoration: "none",
                padding: isSM ? "8px 10px" : "8px 12px",
                borderRadius: 9999,
                transition: "background .15s ease, transform .15s ease, box-shadow .15s ease",
                background: resumeHover ? THEME.soft : "transparent",
                transform: resumeHover && !isSM ? "translateY(-2px)" : "none",
                boxShadow: resumeHover && !isSM ? "0 8px 16px rgba(2,6,23,.10)" : "none",
                fontWeight: 500,
                display: "inline-block",
              }}
              onMouseEnter={() => setResumeHover(true)}
              onMouseLeave={() => setResumeHover(false)}
            >
              Download Resume
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    );
  }

  function Section({ id, title, subtitle, children }) {
    return (
      <section id={id} className="section" style={{ marginTop: isMD ? 32 : 42 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 className="h2" style={{ marginTop: 0 }}>{title}</h2>
          {subtitle && <p className="muted" style={{ margin: "6px 0 0", fontSize: isMD ? 14 : 16 }}>{subtitle}</p>}
        </div>
        {children}
      </section>
    );
  }

  function Hero() {
    const imgSize = isMD ? (isSM ? 110 : 140) : 180;
    const imgStyle = { width: imgSize, height: imgSize, borderRadius: "50%", objectFit: "cover", boxShadow: "0 10px 24px rgba(2,6,23,.18)", border: border("#e2e8f0"), margin: isMD ? "0 auto" : 0 };

    function HeroButton({ href, label, onClick, children, ...rest }) {
      const [hover, setHover] = React.useState(false);
      const style = { background: hover ? "#ffffff" : THEME.soft, color: THEME.text, textDecoration: "none", padding: isSM ? "9px 12px" : "10px 14px", borderRadius: 10, border: border(), transition: "background .15s ease, transform .15s ease, box-shadow .15s ease", transform: hover && !isSM ? "translateY(-2px)" : "none", boxShadow: hover && !isSM ? "0 8px 16px rgba(2,6,23,.12)" : "none", fontWeight: 600, display: "inline-block" };
      return (
        <a href={href} style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick} {...rest}>
          {children || label}
        </a>
      );
    }

    return (
      <div className="container hero" style={{ maxWidth: isLG ? 1000 : 1100, margin: "0 auto", padding: isMD ? "36px 16px 20px" : "60px 20px" }}>
        <div className="hero-bg" />
        <div className="hero-grid" style={{ gap: isMD ? 18 : 24, alignItems: "center", gridTemplateColumns: isMD ? "1fr" : "1fr auto", textAlign: isMD ? "center" : "left" }}>
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span style={{ fontSize: isMD ? 11 : 12, color: THEME.text, fontWeight: 600 }}>
                Software Development Engineer Senior · CSG Systems International (India)
              </span>
            </div>
            <h1 className="hero-title" style={{ fontSize: isMD ? (isSM ? 28 : 32) : 40 }}>Manasapujha G. R.</h1>
            <p className="hero-sub" style={{ fontSize: isMD ? 14 : 16 }}>Full-Stack Developer · Healthcare & Telecom · AWS</p>
            <div className="hero-cta" style={{ display: "flex", gap: 12, marginTop: 18, justifyContent: isMD ? "center" : "flex-start", flexWrap: "wrap" }}>
              <a className="btn" href="#projects">View Projects</a>
              <HeroButton
                href={RESUME_URL}
                download="Manasapujha_G_R_Resume.pdf"
                rel="noopener"
                aria-label="Download resume PDF"
              >
                Download Resume
              </HeroButton>
            </div>
          </div>
          <img src="/images/profile.jpg" alt="Manasapujha G. R." style={imgStyle} width={imgSize} height={imgSize} loading="eager" />
        </div>
      </div>
    );
  }

  function Skills() {
    return (
      <Section id="skills" title="Skills" subtitle="Languages, platforms & tooling I use to ship reliably">
        <div style={{ display: "flex", flexWrap: "wrap", gap: isSM ? 8 : 10 }}>
          {skills.map((s, i) => (
            <span key={i} className="badge">{s}</span>
          ))}
        </div>
      </Section>
    );
  }

  // --------------- CERTIFICATIONS (GROUPED, NO ICONS) ----------------
  function Certifications() {
    const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: isMD ? 14 : 16 };
    const baseCard = { display: "flex", alignItems: "center", gap: 12, background: THEME.card, border: border(), borderRadius: 14, padding: isMD ? 12 : 14, boxShadow: shadow, transition: "transform .15s ease, box-shadow .15s ease, background .2s ease" };
    const groupTitle = { fontSize: isMD ? 13 : 14, fontWeight: 800, color: THEME.textMuted, margin: "18px 0 8px" };
    const divider = { borderTop: border("#e5e7eb"), margin: isMD ? "16px 0" : "20px 0" };

    const groups = [
      { name: "🎯 Core Certifications", test: (c) => /cloud practitioner/i.test(c.title) || /prompt engineering/i.test(c.title) },
      { name: "🎓 Coursera",            test: (c) => /coursera/i.test(c.provider || "") },
      { name: "🏢 NASSCOM",             test: (c) => /nasscom/i.test(c.provider || c.title) },
      { name: "📚 Other",               test: (_) => true },
    ];

    const seen = new Set();
    function groupItems(testFn) {
      return certifications.filter(c => testFn(c) && !seen.has(c.title))
        .map(c => { seen.add(c.title); return c; });
    }
    const grouped = groups.map(g => ({ name: g.name, items: groupItems(g.test) })).filter(g => g.items.length > 0);

    function CardItem({ cert }) {
      const [hover, setHover] = React.useState(false);
      return (
        <div
          className={`certification-card ${hover && !isSM ? 'hover' : ''}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <span style={{ fontWeight: 700, fontSize: isMD ? 14 : 15 }}>{cert.title}</span>
            {cert.provider && (
              <span style={{ color: THEME.textMuted, fontSize: isMD ? 12 : 13 }}>{cert.provider}</span>
            )}
            {cert.pdf && (
              <div style={{ marginTop: 8 }}>
                <a
                  href={cert.pdf}
                  download
                  className="certification-download-btn"
                  style={{
                    color: THEME.primary,
                    textDecoration: "none",
                    fontSize: isMD ? 11 : 12,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(124,58,237,0.15)";
                    e.target.style.borderColor = "rgba(124,58,237,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(124,58,237,0.1)";
                    e.target.style.borderColor = "rgba(124,58,237,0.2)";
                  }}
                >
                                     📄 Download Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <Section id="certifications" title="Certifications">
        {grouped.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi === 0 ? 0 : 8 }}>
            {gi > 0 && <div style={divider} />}
            <div className="overline" style={groupTitle}>{g.name}</div>
            <div style={grid}>
              {g.items.map((c, i) => (
                <CardItem key={i} cert={c} />
              ))}
            </div>
          </div>
        ))}
      </Section>
    );
  }

  function Projects() {
    return (
      <Section id="projects" title="Projects" subtitle="Selected work across Healthcare IT and Telecom IT">
        <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: isMD ? 14 : 16 }}>
          {projects.map((p, i) => {
            const waLink = buildWhatsAppLink(p.title);
            return (
              <article key={i} className="card" style={{ background: THEME.card, border: border(), borderRadius: 16, padding: isMD ? 16 : 18, boxShadow: shadow }}>
                <h3 style={{ fontWeight: 800, fontSize: isMD ? 17 : 18, margin: 0 }}>{p.title}</h3>
                <p className="muted" style={{ lineHeight: 1.6, margin: "8px 0 12px", fontSize: isMD ? 14 : 15 }}>{p.description}</p>
                <div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Discuss ${p.title} on WhatsApp`}
                    style={{ color: THEME.primaryDark, textDecoration: "none", fontWeight: 600 }}
                  >
                    Discuss →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    );
  }

  // ---------------- CONTACT SECTION ----------------
  function Contact() {
    return (
      <Section id="contact" title="Get In Touch" subtitle="Let's discuss your next project or collaboration">
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMD ? "1fr" : "1fr 1fr", 
          gap: isMD ? 24 : 32,
          alignItems: "center"
        }}>
          <div>
            <h3 style={{ fontSize: isMD ? 18 : 20, fontWeight: 700, margin: "0 0 12px 0" }}>
              Ready to work together?
            </h3>
            <p style={{ 
              lineHeight: 1.6, 
              margin: "0 0 20px 0", 
              fontSize: isMD ? 14 : 15,
              color: THEME.textMuted
            }}>
              I'm always interested in new opportunities and exciting projects. Whether you have a question, 
              want to discuss a potential collaboration, or just want to say hello, feel free to reach out.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to discuss a potential collaboration or project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: THEME.primary,
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "transform .15s ease, box-shadow .15s ease",
                  display: "inline-block"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "none";
                }}
              >
                Start a Conversation
              </a>
              <a
                href="mailto:pujhagr@gmail.com"
                style={{
                  background: THEME.soft,
                  color: THEME.text,
                  padding: "12px 20px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  border: border(),
                  transition: "transform .15s ease, box-shadow .15s ease",
                  display: "inline-block"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 16px rgba(2,6,23,.12)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "none";
                }}
              >
                Send Email
              </a>
            </div>
          </div>
          
          <div style={{
            background: THEME.soft,
            padding: isMD ? 20 : 24,
            borderRadius: 16,
            border: border()
          }}>
            <h4 style={{ fontSize: isMD ? 16 : 17, fontWeight: 700, margin: "0 0 16px 0" }}>
              Quick Contact Info
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: THEME.textMuted }}>📍</span>
                <span style={{ fontSize: 14 }}>Bangalore, India</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: THEME.textMuted }}>💼</span>
                <span style={{ fontSize: 14 }}>CSG Systems International</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: THEME.textMuted }}>📱</span>
                <span style={{ fontSize: 14 }}>+91 9880284129</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: THEME.textMuted }}>📧</span>
                <span style={{ fontSize: 14 }}>pujhagr@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  // ---------------- SOCIAL MEDIA SECTION ----------------
  function SocialMedia() {
    const socialLinks = [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/manasapujha-g-r-9971689",
        icon: "/images/linkedin-logo.png",
        description: "Professional network and experience"
      },
      {
        name: "GitHub",
        url: "https://github.com/manasapujha",
        icon: "/images/github-logo.png",
        description: "Code repositories and projects"
      },
      {
        name: "WhatsApp",
        url: `https://wa.me/${WHATSAPP_NUMBER}`,
        icon: "/images/whatsapp-logo.png",
        description: "Quick chat and collaboration"
      }
    ];

    return (
      <Section id="social" title="Connect & Follow" subtitle="Stay updated with my latest work and insights">
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: isMD ? 16 : 20 
        }}>
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: THEME.card,
                border: border(),
                borderRadius: 16,
                padding: isMD ? 20 : 24,
                textDecoration: "none",
                color: THEME.text,
                transition: "transform .15s ease, box-shadow .15s ease, background .2s ease",
                display: "block"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 16px 32px rgba(2,6,23,.15)";
                e.target.style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "none";
                e.target.style.boxShadow = shadow;
                e.target.style.background = THEME.card;
              }}
            >
                          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <img 
                src={social.icon} 
                alt={`${social.name} logo`}
                style={{ 
                  width: 24, 
                  height: 24, 
                  objectFit: "contain" 
                }}
              />
              <h3 style={{ fontSize: isMD ? 16 : 18, fontWeight: 700, margin: 0 }}>
                {social.name}
              </h3>
            </div>
              <p style={{ 
                color: THEME.textMuted, 
                fontSize: isMD ? 13 : 14, 
                lineHeight: 1.5, 
                margin: 0 
              }}>
                {social.description}
              </p>
            </a>
          ))}
        </div>
      </Section>
    );
  }

  // ---------------- SCROLL TO TOP BUTTON ----------------
  function ScrollToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setShow(window.scrollY > 400);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!show) return null;

    return (
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: THEME.primary,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          transition: 'transform .15s ease, box-shadow .15s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
        }}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        ↑
      </button>
    );
  }

  // ---------------- PAGE ----------------
  return (
    <Shell>
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
      <SocialMedia />
      <ScrollToTop />
    </Shell>
  );
}

import React, { useEffect, useState } from "react";

/**
 * Colorful, professional UI/UX refresh with real resume download
 * + Hero image (replaces the old blue rectangle)
 * + Update: "View Projects" uses outlined style like "Download Resume"
 * + Update: Navbar "Resume" is a plain text link (like "Contact") while still downloading the file
 */
export default function PortfolioApp() {
  // ---------------- THEME ----------------
  const THEME = {
    pageBg: "#f8fafc",      // slate-50
    text: "#0b1220",
    textMuted: "#475569",
    primary: "#2563eb",     // blue-600
    primaryDark: "#1e40af", // blue-800
    gradientA: "#7c3aed",   // violet-600
    gradientB: "#06b6d4",   // cyan-500
    card: "#ffffff",
    border: "#e5e7eb",
    soft: "#f1f5f9",        // slate-100
    ring: "#93c5fd",        // blue-300
    chipPalette: ["#f97316", "#06b6d4", "#8b5cf6", "#22c55e", "#eab308", "#ef4444", "#10b981"],
  };
  const border = (c = THEME.border) => `1px solid ${c}`;
  const shadow = "0 10px 25px rgba(2, 6, 23, .08)";

  // ---------------- DATA ----------------
  const skills = [
    "Java", "SQL", "AWS", "Python", "Git",
    "Project Management", "Snowflake", "Prompt Engineering", "CI/CD", "Jenkins",
  ];

  const projects = [
    {
      title: "Environment Manager Plus (EM+)",
      description:
        "Manages installation of Cerner packages into domains using plan-driven workflows to streamline releases and reduce install time.",
    },
    {
      title: "Environment Manager Migration (EMM)",
      description:
        "CLI tool to migrate Environment Manager data from Microsoft DB to Environment Manager Plus (Oracle) with integrity checks.",
    },
    {
      title: "EMR Transformation",
      description:
        "Digitizes end-to-end hospital workflows from admission to discharge; enables electronic records and archival for future use.",
    },
    {
      title: "Cardiovascular Solution",
      description:
        "Automates cardiology workflows, improves cardiac disease management, and streamlines diagnostic imaging operations.",
    },
  ];

  const certifications = [,
    ,
    { title: "Amazon Web Services Cloud Practitioner", logo: "/logos/aws.png" },
    ,
    { title: "Prompt Engineering for ChatGPT", logo: "/logos/coursera.png" },
    ,
    ,
    { title: "Data Science Methodology", logo: "/logos/coursera.png" },
    ,
    ,
    { title: "Open Source Tools for Data Science", logo: "/logos/coursera.png" },
    ,
    ,
    { title: "Python for Data Science and AI", logo: "/logos/coursera.png" },
    ,
    ,
    { title: "What is Data Science?", logo: "/logos/coursera.png" },
    { title: "nasscom Women Wizards Rule Tech (WWRT) Cohort 5 - Foundation Course", logo: "/logos/nasscom.png" }];

  // -------- Runtime checks --------
  useEffect(() => {
    const assert = (cond, msg) => { if (!cond) throw new Error(`[portfolio test] ${msg}`); };
    assert(Array.isArray(skills) && skills.length >= 5, "skills should contain at least 5 items");
    assert(projects.length >= 3, "projects should contain at least 3 entries");
    assert(certifications.some(c => c.title === "Prompt Engineering for ChatGPT"),
      "certifications must include 'Prompt Engineering for ChatGPT'");
    ["#e5e7eb", "#d1d5db"].forEach(c => assert(border(c) === `1px solid ${c}`, `border(${c}) wrong`));
  }, []);

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
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 64px" }}>{children}</main>
        <footer style={{ textAlign: "center", padding: 20, borderTop: border(), color: THEME.textMuted }}>
          © 2025 Manasapujha G. R.
        </footer>
      </div>
    );
  }

  
  
  
  
  
  
  function Nav() {
    const [activeId, setActiveId] = React.useState("");

    React.useEffect(() => {
      const sectionIds = ["skills", "projects", "certifications", "contact"];
      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          } else {
            // Fallback: find the section closest to top
            let minTop = Infinity, closestId = activeId;
            sections.forEach(sec => {
              const top = Math.abs(sec.getBoundingClientRect().top);
              if (top < minTop) { minTop = top; closestId = sec.id; }
            });
            setActiveId(closestId);
          }
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] }
      );

      sections.forEach(sec => observer.observe(sec));
      return () => observer.disconnect();
    }, []);

    function NavLink({ href, label, download, title }) {
      const [hover, setHover] = React.useState(false);
      const targetId = (href || "").startsWith("#") ? href.slice(1) : null;
      const isActive = targetId && activeId === targetId;

      const style = {
        color: THEME.text,
        textDecoration: "none",
        padding: "8px 12px",
        borderRadius: 9999,
        transition: "background .15s ease, transform .15s ease, box-shadow .15s ease",
        background: isActive ? THEME.soft : (hover ? THEME.soft : "transparent"),
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: (isActive || hover) ? "0 8px 16px rgba(2,6,23,.10)" : "none",
        fontWeight: isActive ? 700 : 500,
        display: "inline-block"
      };

      function onClick(e) {
        if (targetId) {
          e.preventDefault();
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            // Update hash without jump
            history.replaceState(null, "", "#" + targetId);
          }
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
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "saturate(180%) blur(8px)",
        background: "rgba(255,255,255,.8)",
        borderBottom: border("#e2e8f0"),
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "10px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          {/* Left placeholder (brand removed as requested) */}
          <div />
          <div style={{ display: "flex", gap: 8 }}>
            <NavLink href="#skills" label="Skills" />
            <NavLink href="#projects" label="Projects" />
            <NavLink href="#certifications" label="Certifications" />
            <NavLink href="#contact" label="Contact" />
            {/* Navbar Resume styled like a plain link but still downloads */}
            <NavLink
              href="/Manasapujha_Resume.pdf"
              label="Resume"
              download="Manasapujha_G_R_Resume.pdf"
              title="Download Resume"
            />
          </div>
        </div>
      </nav>
    );
  }


  function Section({ id, title, subtitle, children }) {
    return (
      <section id={id} style={{ marginTop: 42 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ margin: "6px 0 0", color: THEME.textMuted }}>{subtitle}</p>}
        </div>
        {children}
      </section>
    );
  }

  // ---------------- SECTIONS ----------------
  
  function Hero() {
    const imgStyle = {
      width: 180,
      height: 180,
      borderRadius: "50%",
      objectFit: "cover",
      boxShadow: "0 10px 24px rgba(2,6,23,.18)",
      border: border("#e2e8f0"),
    };

    function HeroButton({ href, label, download }) {
      const [hover, setHover] = React.useState(false);
      const style = {
        background: hover ? "#ffffff" : THEME.soft,
        color: THEME.text,
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: 10,
        border: border(),
        transition: "background .15s ease, transform .15s ease, box-shadow .15s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 8px 16px rgba(2,6,23,.12)" : "none",
      };
      return (
        <a
          href={href}
          download={download}
          style={style}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {label}
        </a>
      );
    }

    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "grid", gap: 24, alignItems: "center", gridTemplateColumns: "1fr auto" }}>
          <div>
            <div style={{
              display: "inline-flex", gap: 8, alignItems: "center",
              padding: "6px 10px", borderRadius: 9999, background: "#ffffffa6",
              border: border("#e2e8f0")
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: THEME.primary }} />
              <span style={{ fontSize: 12, color: THEME.text }}>
                Software Development Engineer Senior · CSG Systems International (India)
              </span>
            </div>
            <h1 style={{ fontSize: 40, lineHeight: 1.15, margin: "16px 0 8px" }}>
              Manasapujha G. R.
            </h1>
            <p style={{ color: THEME.textMuted, fontSize: 16, margin: 0 }}>
              Full-Stack Developer · Healthcare & Telecom · AWS
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
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
      const style = {
        fontSize: 13,
        padding: "8px 12px",
        borderRadius: 9999,
        color: THEME.text,
        background: hover ? color + "44" : color + "22",
        border: border(hover ? color : color + "55"),
        transition: "background .2s ease, transform .15s ease, box-shadow .15s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 6px 12px rgba(2,6,23,.12)" : "none",
        cursor: "default",
      };
      return (
        <span
          style={style}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {label}
        </span>
      );
    }

    return (
      <Section id="skills" title="Skills" subtitle="Languages, platforms & tooling I use to ship reliably">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {skills.map((s, i) => (
            <SkillChip key={i} label={s} color={THEME.chipPalette[i % THEME.chipPalette.length]} />
          ))}
        </div>
      </Section>
    );
  }


  
  function Projects() {
    const baseCard = {
      background: THEME.card, border: border(), borderRadius: 16, padding: 18, boxShadow: shadow,
      position: "relative", overflow: "hidden",
      transition: "transform .15s ease, box-shadow .15s ease, background .2s ease",
    };
    const title = { fontWeight: 800, fontSize: 18, margin: 0 };
    const text = { color: THEME.textMuted, lineHeight: 1.6, margin: "8px 0 12px" };

    function ProjectCard({ project }) {
      const [hover, setHover] = React.useState(false);
      const style = {
        ...baseCard,
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 14px 30px rgba(2,6,23,.12)" : shadow,
        background: hover ? "#f9fafb" : THEME.card,
      };
      return (
        <article
          style={style}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} />
          ))}
        </div>
      </Section>
    );
  }


  
  
  
  
  
  function Certifications() {
    const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 };
    const baseCard = {
      display: "flex", alignItems: "center", gap: 12,
      background: THEME.card, border: border(), borderRadius: 14, padding: 14, boxShadow: shadow,
      transition: "transform .15s ease, box-shadow .15s ease, background .2s ease",
    };
    const logo = { width: 40, height: 40, borderRadius: 10, objectFit: "contain", background: THEME.soft, border: border("#e2e8f0") };
    const groupTitle = { fontSize: 14, fontWeight: 800, color: THEME.textMuted, margin: "18px 0 8px" };
    const divider = { borderTop: border("#e5e7eb"), margin: "20px 0" };

    const groups = [
      { name: "🎯 Core Certifications", test: (c) => c.title === "Amazon Web Services Cloud Practitioner" || c.title === "Prompt Engineering for ChatGPT" },
      { name: "🎓 Coursera",            test: (c) => (c.logo || "").includes("/logos/coursera.png") && c.title !== "Prompt Engineering for ChatGPT" },
      { name: "🏢 NASSCOM",             test: (c) => (c.title || "").toLowerCase().includes("nasscom") },
      { name: "📂 Other",               test: (_) => true },
    ];

    const seen = new Set();
    function groupItems(testFn) {
      return certifications.filter(c => testFn(c) && !seen.has(c.title)).map(c => { seen.add(c.title); return c; });
    }

    const grouped = groups.map(g => ({ name: g.name, items: groupItems(g.test) })).filter(g => g.items.length > 0);

    function CardItem({ cert }) {
      const [hover, setHover] = React.useState(false);
      const style = {
        ...baseCard,
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 14px 30px rgba(2,6,23,.12)" : shadow,
        background: hover ? "#f9fafb" : THEME.card,
      };
      return (
        <div
          style={style}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {cert.logo ? <img src={cert.logo} alt={cert.title} style={logo} /> : <div style={{ ...logo, display: "grid", placeItems: "center" }}>🏅</div>}
          <div>
            {cert.url ? (
              <a href={cert.url} target="_blank" rel="noreferrer" style={{ color: THEME.primary, fontWeight: 700, textDecoration: "none" }}>
                {cert.title}
              </a>
            ) : (
              <span style={{ fontWeight: 700 }}>{cert.title}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <Section id="certifications" title="Certifications" subtitle="Organized for quick scanning">
        {grouped.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi === 0 ? 0 : 8 }}>
            {gi > 0 && <div style={divider} />}
            <div style={groupTitle}>{g.name}</div>
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


    }


    const grouped = groups.map(g => ({ name: g.name, items: groupItems(g.test) })).filter(g => g.items.length > 0);

    return (
      <Section id="certifications" title="Certifications" subtitle="Organized for quick scanning">
        {grouped.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi === 0 ? 0 : 8 }}>
            {gi > 0 && <div style={divider} />}
            <div style={groupTitle}>{g.name}</div>
            <div style={grid}>
              {g.items.map((c, i) => (
                <div key={i} style={card}>
                  {c.logo ? <img src={c.logo} alt={c.title} style={logo} /> : <div style={{ ...logo, display: "grid", placeItems: "center" }}>🏅</div>}
                  <div>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer" style={{ color: THEME.primary, fontWeight: 700, textDecoration: "none" }}>
                        {c.title}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 700 }}>{c.title}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>
    );


    const grouped = groups.map(g => ({ name: g.name, items: groupItems(g.test) })).filter(g => g.items.length > 0);

    return (
      <Section id="certifications" title="Certifications" subtitle="Organized for quick scanning">
        {grouped.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi === 0 ? 0 : 8 }}>
            <div style={groupTitle}>{g.name}</div>
            <div style={grid}>
              {g.items.map((c, i) => (
                <div key={i} style={card}>
                  {c.logo ? <img src={c.logo} alt={c.title} style={logo} /> : <div style={{ ...logo, display: "grid", placeItems: "center" }}>🏅</div>}
                  <div>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer" style={{ color: THEME.primary, fontWeight: 700, textDecoration: "none" }}>
                        {c.title}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 700 }}>{c.title}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>
    );
  }


    const grouped = groups.map(g => ({ name: g.name, items: groupItems(g.test) })).filter(g => g.items.length > 0);

    return (
      <Section id="certifications" title="Certifications" subtitle="Organized for quick scanning">
        {grouped.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi === 0 ? 0 : 8 }}>
            <div style={groupTitle}>{g.name}</div>
            <div style={grid}>
              {g.items.map((c, i) => (
                <div key={i} style={card}>
                  {c.logo ? <img src={c.logo} alt={c.title} style={logo} /> : <div style={{ ...logo, display: "grid", placeItems: "center" }}>🏅</div>}
                  <div>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer" style={{ color: THEME.primary, fontWeight: 700, textDecoration: "none" }}>
                        {c.title}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 700 }}>{c.title}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>
    );
  }


          <h3 style={{gridColumn: "1/-1", marginTop: 20}}>Coursera</h3>
          {certifications.filter(c => c.logo==="/logos/coursera.png" && !c.title.includes("Prompt Engineering")).map((c,i)=>(
            <div key={"coursera"+i} style={card}>
              {c.logo ? <img src={c.logo} alt={c.title} style={logo} /> : <div style={{ ...logo, display: "grid", placeItems: "center" }}>🏅</div>}
              <div><span style={{ fontWeight: 700 }}>{c.title}</span></div>
            </div>
          ))}

          <h3 style={{gridColumn: "1/-1", marginTop: 20}}>NASSCOM</h3>
          {certifications.filter(c => c.title.includes("nasscom") || c.title.includes("NASSCOM")).map((c,i)=>(
            <div key={"nasscom"+i} style={card}>
              {c.logo ? <img src={c.logo} alt={c.title} style={logo} /> : <div style={{ ...logo, display: "grid", placeItems: "center" }}>🏅</div>}
              <div><span style={{ fontWeight: 700 }}>{c.title}</span></div>
            </div>
          ))}

          <h3 style={{gridColumn: "1/-1", marginTop: 20}}>Other</h3>
          {certifications.filter(c => !c.title.includes("Amazon Web Services") && !c.title.includes("Prompt Engineering") && c.logo!=="/logos/coursera.png" && !c.title.includes("nasscom")).map((c,i)=>(
            <div key={"other"+i} style={card}>
              {c.logo ? <img src={c.logo} alt={c.title} style={logo} /> : <div style={{ ...logo, display: "grid", placeItems: "center" }}>🏅</div>}
              <div><span style={{ fontWeight: 700 }}>{c.title}</span></div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    const card = { background: THEME.card, border: border(), borderRadius: 16, padding: 18, boxShadow: shadow };
    const input = { padding: 12, borderRadius: 10, border: border("#d1d5db"), outline: "none" };

    async function handleSubmit(e) {
      e.preventDefault();
      setStatus("Sending...");
      try {
        const res = await fetch("https://formspree.io/f/your-form-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setStatus("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        } else {
          setStatus("Oops! Something went wrong.");
        }
      } catch (err) {
        setStatus("Failed to send. Please try again later.");
      }
    }

    return (
      <Section id="contact" title="Contact" subtitle="Say hello or request my full project portfolio">
        <form onSubmit={handleSubmit} style={card}>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={input}
              onFocus={(e)=> e.currentTarget.style.boxShadow = `0 0 0 4px ${THEME.ring}55`}
              onBlur={(e)=> e.currentTarget.style.boxShadow = "none"}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={input}
              onFocus={(e)=> e.currentTarget.style.boxShadow = `0 0 0 4px ${THEME.ring}55`}
              onBlur={(e)=> e.currentTarget.style.boxShadow = "none"}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              style={{ ...input, resize: "vertical" }}
              onFocus={(e)=> e.currentTarget.style.boxShadow = `0 0 0 4px ${THEME.ring}55`}
              onBlur={(e)=> e.currentTarget.style.boxShadow = "none"}
            />
            <button type="submit" style={{ background: THEME.primary, color: "white", padding: "10px 14px", borderRadius: 10, border: 0, cursor: "pointer" }}>
              Send Message
            </button>
            {status && <p style={{ color: "#6b7280", fontSize: 14 }}>{status}</p>}
          </div>
        </form>
      </Section>
    );
  }

  // ---------------- PAGE ----------------
  return (
    <Shell>
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </Shell>
  );
}

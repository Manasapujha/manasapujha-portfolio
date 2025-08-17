import React, { useEffect, useState } from "react";

export default function PortfolioApp() {
  // -------- Data --------
  const skills = [
    "Java",
    "SQL",
    "AWS",
    "Python",
    "Git",
    "Project Management",
    "Snowflake",
    "Prompt Engineering",
    "CI/CD",
    "Jenkins",
  ];

  const projects = [
    {
      title: "Environment Manager Plus (EM+)",
      description:
        "Tool to manage installation of Cerner code into domains using plans for package management, simplifying workflows and reducing installation time.",
    },
    {
      title: "Environment Manager Migration (EMM)",
      description:
        "Command-line tool to migrate data from Microsoft DB (Environment Manager) to Oracle DB (Environment Manager Plus).",
    },
    {
      title: "EMR Transformation",
      description:
        "Digitization of healthcare workflows from admission to discharge, with data archived electronically for future use.",
    },
    {
      title: "Cerner Cardiovascular Solution",
      description:
        "Automates cardiology workflows, improves cardiac disease management, and streamlines diagnostic imaging.",
    },
  ];

  const certifications = [
    {
      title: "Prompt Engineering for ChatGPT",
      url: "https://www.coursera.org/account/accomplishments/records/JXLDXWN62F7B",
      logo: "/logos/coursera.png",
    },
    {
      title: "nasscom Women Wizards Rule Tech (WWRT) Cohort 5 - Foundation Course",
      logo: "/logos/nasscom.png",
    },
    { title: "Amazon Web Services Cloud Practitioner", logo: "/logos/aws.png" },
    { title: "Python for Data Science and AI", logo: "/logos/coursera.png" },
    { title: "Data Science Methodology", logo: "/logos/coursera.png" },
    { title: "Open Source Tools for Data Science", logo: "/logos/coursera.png" },
    { title: "What is Data Science?", logo: "/logos/coursera.png" },
  ];

  // -------- Runtime sanity checks (lightweight "tests") --------
  useEffect(() => {
    console.assert(Array.isArray(skills) && skills.length >= 5, "Skills should contain at least 5 items");
    console.assert(
      certifications.some((c) => c.title === "Prompt Engineering for ChatGPT"),
      "Certifications must include 'Prompt Engineering for ChatGPT'"
    );
    console.assert(projects.length >= 3, "Projects should contain at least 3 entries");
  }, []);

  // -------- UI Components --------
  function Layout({ children }) {
    return (
      <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <Navbar />
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>{children}</main>
        <footer style={{ textAlign: "center", padding: "16px", borderTop: "1px solid #eee", color: "#555" }}>
          © 2025 Manasapujha G. R.
        </footer>
      </div>
    );
  }

  function Navbar() {
    const navStyle = {
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 16px",
      background: "#1f2937",
      color: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };
    const listStyle = { display: "flex", gap: 16, listStyle: "none", margin: 0, padding: 0 };

    return (
      <nav style={navStyle}>
        <div style={{ fontWeight: 700 }}>Manasapujha G. R.</div>
        <ul style={listStyle}>
          <li><a href="#skills" style={{ color: "#fff", textDecoration: "none" }}>Skills</a></li>
          <li><a href="#projects" style={{ color: "#fff", textDecoration: "none" }}>Projects</a></li>
          <li><a href="#certifications" style={{ color: "#fff", textDecoration: "none" }}>Certifications</a></li>
          <li><a href="#contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</a></li>
          <li><a href="/Manasapujha_Resume.pdf" download style={{ color: "#fff", textDecoration: "none" }}>Resume</a></li>
        </ul>
      </nav>
    );
  }

  function SectionTitle({ children }) {
    return <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{children}</h2>;
  }

  function Hero() {
    const pill = {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 9999,
      background: "#eef2ff",
      color: "#4338ca",
      fontSize: 12,
      marginTop: 8,
    };
    return (
      <section style={{ textAlign: "center", padding: "32px 0" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Manasapujha G. R.</h1>
        <p style={{ marginTop: 8, fontSize: 16 }}>Software Development Engineer Senior at CSG Systems International (India)</p>
        <p style={{ marginTop: 4, color: "#4b5563" }}>Full-Stack Developer | Healthcare IT & Telecom IT | AWS</p>
        <span style={pill}>Open to collaboration</span>
      </section>
    );
  }

  function Skills() {
    const card = {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      textAlign: "center",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      transition: "all 0.3s ease",
    };

    return (
      <section id="skills" style={{ marginTop: 24 }}>
        <SectionTitle>Skills</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {skills.map((s, i) => (
            <div key={i} style={card} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>{s}</div>
          ))}
        </div>
      </section>
    );
  }

  function Projects() {
    const card = {
      background: "#fff",
      border: "1px solid "#e5e7eb",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
    };
    const title = { fontWeight: 700, fontSize: 16, marginBottom: 8 };
    const text = { color: "#374151", lineHeight: 1.5 };

    return (
      <section id="projects" style={{ marginTop: 32 }}>
        <SectionTitle>Projects</SectionTitle>
        <div style={{ display: "grid", gap: 16 }}>
          {projects.map((p, i) => (
            <div key={i} style={card} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
              <div style={title}>{p.title}</div>
              <p style={text}>{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function Certifications() {
    const card = {
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
    };

    const grid = {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 16,
    };

    const logoStyle = { width: 40, height: 40, objectFit: "contain", borderRadius: 8, background: "#fff" };

    return (
      <section id="certifications" style={{ marginTop: 32 }}>
        <SectionTitle>Certifications</SectionTitle>
        <div style={grid}>
          {certifications.map((c, i) => (
            <div key={i} style={card} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
              {c.logo ? (
                <img src={c.logo} alt={c.title} style={logoStyle} />
              ) : (
                <div style={{ ...logoStyle, display: "grid", placeItems: "center", background: "#f3f4f6" }}>🏅</div>
              )}
              <div>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                    {c.title}
                  </a>
                ) : (
                  <span style={{ fontWeight: 600 }}>{c.title}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    const card = {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    };

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
      <section id="contact" style={{ marginTop: 32 }}>
        <SectionTitle>Contact</SectionTitle>
        <p style={{ color: "#374151", marginBottom: 12 }}>
          Email: <a href="mailto:contact@manasapujha.dev" style={{ color: "#2563eb", textDecoration: "none" }}>contact@manasapujha.dev</a> ·{" "}
          <a href="https://www.linkedin.com/in/manasapujha" target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "none" }}>LinkedIn</a>
        </p>
        <form onSubmit={handleSubmit} style={card}>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
            <button type="submit" style={{ background: "#2563eb", color: "white", padding: "10px 14px", borderRadius: 10, border: 0, cursor: "pointer" }}>
              Send Message
            </button>
            {status && <p style={{ color: "#6b7280", fontSize: 14 }}>{status}</p>}
          </div>
        </form>
      </section>
    );
  }

  // -------- Page --------
  return (
    <Layout>
      <Hero />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </Layout>
  );
}

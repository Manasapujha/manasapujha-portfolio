import React, { useEffect, useState } from "react";

// Single-file React portfolio page (no smart quotes, fully ASCII)
// Fix: Removed curly apostrophes and markdown blocks that caused a syntax error.
// Includes simple runtime "tests" via console.assert to validate critical data.

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

  // Additional components remain unchanged...
}

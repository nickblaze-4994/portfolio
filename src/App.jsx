import { useState, useEffect, useRef } from "react";

const SECTIONS = ["Home", "About", "Experience", "Personal Projects", "Skills", "Contact"];

// Animated counter hook
function useCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return [count, ref];
}

// Fade-in on scroll component
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Floating particles background
function ParticleField() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: i % 3 === 0 ? "rgba(56, 189, 248, 0.4)" : "rgba(148, 163, 184, 0.15)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particleFloat ${8 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

// Navigation
function Nav({ active, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(8, 12, 21, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(56, 189, 248, 0.08)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "#38bdf8", letterSpacing: "-0.5px", cursor: "pointer" }}
          onClick={() => onNav("Home")}
        >
          Portfolio<span style={{ color: "#94a3b8" }}>.</span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {SECTIONS.filter(s => s !== "Home").map(s => (
            <span
              key={s}
              onClick={() => onNav(s)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: active === s ? "#38bdf8" : "#94a3b8",
                cursor: "pointer",
                letterSpacing: "0.5px",
                textTransform: "lowercase",
                transition: "color 0.3s",
                position: "relative",
                paddingBottom: 4,
              }}
              onMouseEnter={e => e.target.style.color = "#38bdf8"}
              onMouseLeave={e => { if (active !== s) e.target.style.color = "#94a3b8"; }}
            >
              {s}
              {active === s && (
                <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#38bdf8", borderRadius: 1 }} />
              )}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Hero section
function Hero({ onNav }) {
  const [typed, setTyped] = useState("");
  const fullText = "data science & ml engineering";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="Home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid pattern overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Gradient orb */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "-5%",
        width: 600,
        height: 600,
        background: "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%", position: "relative", zIndex: 1 }}>
        <FadeIn>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#38bdf8", marginBottom: 24, letterSpacing: "2px", textTransform: "uppercase" }}>
            <span style={{ opacity: 0.5 }}>// </span>welcome
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 400,
            color: "#f1f5f9",
            lineHeight: 1.05,
            margin: "0 0 24px 0",
            letterSpacing: "-2px",
          }}>
            Vijay<br />Sridhar
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(14px, 2vw, 18px)",
            color: "#64748b",
            marginBottom: 40,
            maxWidth: 560,
            lineHeight: 1.6,
          }}>
            <span style={{ color: "#38bdf8" }}>&gt; </span>
            {typed}
            <span style={{ animation: "blink 1s step-end infinite", color: "#38bdf8" }}>|</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 17,
            color: "#94a3b8",
            lineHeight: 1.75,
            maxWidth: 580,
            margin: "0 0 48px 0",
          }}>
            5+ years building large-scale data pipelines at Amazon. Currently pursuing an MS in Data Science at the University of South Florida. I architect systems that process billions of records for ML model training, data quality validation, and automated classification.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => onNav("Personal Projects")}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                padding: "14px 32px",
                background: "#38bdf8",
                color: "#0c1222",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
                letterSpacing: "0.5px",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.target.style.background = "#7dd3fc"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = "#38bdf8"; e.target.style.transform = "translateY(0)"; }}
            >
              view projects
            </button>
            <button
              onClick={() => onNav("Contact")}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                padding: "14px 32px",
                background: "transparent",
                color: "#94a3b8",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 500,
                letterSpacing: "0.5px",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.color = "#38bdf8"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(148, 163, 184, 0.2)"; e.target.style.color = "#94a3b8"; }}
            >
              get in touch
            </button>
          </div>
        </FadeIn>

        {/* Impact metrics */}
        <FadeIn delay={0.5}>
          <div
            className="stats-grid"
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            marginTop: 80,
            background: "rgba(148, 163, 184, 0.06)",
            borderRadius: 16,
            overflow: "hidden",
          }}>
            {[
              {
                value: 40, prefix: "$", suffix: "B",
                label: "GMV Impact",
                context: "FY 2023-24 pipeline contribution",
                color: "#38bdf8",
              },
              {
                value: 300, prefix: "$", suffix: "M",
                label: "Revenue Delta",
                context: "$2.7B → $3B YoY uplift driven",
                color: "#34d399",
              },
              {
                value: 40, prefix: "", suffix: "%",
                label: "Throughput Gain",
                context: "PySpark pipeline optimization",
                color: "#a78bfa",
              },
              {
                value: 1, prefix: "", suffix: "M+",
                label: "Entities Resolved",
                context: "taxonomy & classification at scale",
                color: "#fb923c",
              },
            ].map((stat, i) => {
              const [count, ref] = useCounter(stat.value, 1800);
              return (
                <div
                  key={i}
                  ref={ref}
                  style={{
                    background: "rgba(8, 12, 21, 0.7)",
                    padding: "32px 24px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "default",
                    transition: "background 0.4s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(15, 23, 42, 0.9)";
                    e.currentTarget.querySelector(".stat-bar").style.transform = "scaleX(1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(8, 12, 21, 0.7)";
                    e.currentTarget.querySelector(".stat-bar").style.transform = "scaleX(0.3)";
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    className="stat-bar"
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, height: 2,
                      background: stat.color,
                      transform: "scaleX(0.3)",
                      transformOrigin: "left",
                      transition: "transform 0.5s ease",
                    }}
                  />

                  {/* Number */}
                  <div style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 48,
                    color: "#f1f5f9",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}>
                    <span style={{ color: stat.color, fontSize: 32, fontFamily: "'JetBrains Mono', monospace", fontWeight: 400 }}>
                      {stat.prefix}
                    </span>
                    {count}
                    <span style={{ color: stat.color, fontSize: 28, fontFamily: "'JetBrains Mono', monospace", fontWeight: 400 }}>
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: 10,
                    fontWeight: 600,
                  }}>
                    {stat.label}
                  </div>

                  {/* Context line */}
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: "#475569",
                    lineHeight: 1.4,
                  }}>
                    {stat.context}
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// Experience section
function Experience() {
  const [openItems, setOpenItems] = useState({ 0: true, 1: true });
  const toggle = (i) => setOpenItems(prev => ({ ...prev, [i]: !prev[i] }));
  const jobs = [
    {
      title: "Program Manager",
      team: "Selection & Catalog Systems (ASCS)",
      company: "Amazon",
      period: "Jul 2022 – Aug 2024",
      impact: "$40B FY GMV contribution",
      bullets: [
        "Led development of scalable data extraction and enrichment pipelines on AWS, ingesting 22K+ seller profiles through automated classification workflows, driving 11% YoY revenue uplift ($2.7B to $3B).",
        "Architected AWS Glue ETL pipelines integrating external POS datasets (Nielsen, NPD), extracting and labeling 212K lead records with structured taxonomies for model scoring.",
        "Designed automated taxonomy and entity resolution pipeline across 1M+ entities, cutting classification defects and data labeling conflicts by 12%.",
        "Built data routing and classification pipeline processing 400K records across 5K+ seller segments, lifting lead-to-conversion accuracy 30% YoY.",
        "Developed annotation routing system to auto-classify 2.7K+ unstructured feedback records, eliminating manual review overhead.",
        "Built real-time data quality dashboards using OpenSearch and Kibana, achieving 7% MoM reduction in processing latency.",
      ],
    },
    {
      title: "Technical Operations Lead",
      team: "Selection & Catalog Systems (ASCS)",
      company: "Amazon",
      period: "Apr 2019 – Jun 2022",
      impact: "40% throughput improvement",
      bullets: [
        "Engineered secure pipeline orchestration layer using Lambda authorizers and API Gateway, enabling real-time KPI monitoring and quality tracking across distributed data extraction workflows.",
        "Led optimization of large-scale data processing pipeline, refactoring PySpark jobs and SQL joins to improve extraction and transformation throughput by 40%.",
        "Authored BRDs and PRFAQs for data pipeline initiatives, defining data schemas, extraction logic, quality acceptance criteria, and SLA thresholds across cross-functional engineering and operations teams.",
      ],
    },
  ];

  return (
    <section id="Experience" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <FadeIn>
          <SectionHeader label="02" title="Experience" />
        </FadeIn>

        <div style={{ marginTop: 64 }}>
          {jobs.map((job, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div
                style={{
                  borderLeft: `2px solid ${openItems[i] ? "#38bdf8" : "rgba(148, 163, 184, 0.1)"}`,
                  padding: "32px 0 32px 32px",
                  marginBottom: 8,
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                }}
                onClick={() => toggle(i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 28,
                      color: "#f1f5f9",
                      fontWeight: 400,
                      margin: 0,
                    }}>
                      {job.title}
                    </h3>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      color: "#64748b",
                      marginTop: 6,
                    }}>
                      {job.company} &middot; {job.team}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: "#38bdf8",
                      background: "rgba(56, 189, 248, 0.08)",
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: "1px solid rgba(56, 189, 248, 0.15)",
                    }}>
                      {job.impact}
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: "#64748b",
                    }}>
                      {job.period}
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      color: "#64748b",
                      transition: "transform 0.3s",
                      transform: openItems[i] ? "rotate(180deg)" : "rotate(0deg)",
                    }}>
                      ▾
                    </span>
                  </div>
                </div>

                <div style={{
                  maxHeight: openItems[i] ? 800 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.5s ease",
                }}>
                  <div style={{ paddingTop: 24 }}>
                    {job.bullets.map((b, j) => (
                      <div key={j} style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: 16,
                        alignItems: "flex-start",
                      }}>
                        <span style={{
                          color: "#38bdf8",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 12,
                          marginTop: 5,
                          flexShrink: 0,
                        }}>▸</span>
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 15,
                          color: "#94a3b8",
                          lineHeight: 1.7,
                        }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Projects section
function Projects() {
  const projects = [
    {
      title: "Retail Fraud Detection via Reinforcement Learning",
      description: "Built an RL model on SageMaker with PyTorch to detect fraudulent return patterns and optimize decision policies across large transaction datasets.",
      stats: ["62% Recall", "78% Precision"],
      tags: ["PyTorch", "SageMaker", "RL", "Fraud Detection"],
      icon: "🛡️",
    },
    {
      title: "Adaptive Route Optimization with Deep RL",
      description: "Implemented distributed model training with Ray RLlib on SageMaker RL to simulate and optimize last-mile delivery routing for logistics operations.",
      stats: ["22% Load Utilization ↑", "18% Delivery Time ↓"],
      tags: ["Ray RLlib", "SageMaker RL", "Deep RL", "Logistics"],
      icon: "🚚",
    },
  ];

  return (
    <section id="Personal Projects" style={{ padding: "120px 0", position: "relative" }}>
      {/* Subtle divider */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", maxWidth: 800, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <FadeIn>
          <SectionHeader label="03" title="Personal Projects" />
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: 32, marginTop: 64 }}>
          {projects.map((p, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(148, 163, 184, 0.08)",
                  borderRadius: 16,
                  padding: 40,
                  transition: "all 0.4s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.2)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(56, 189, 248, 0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Corner accent */}
                <div style={{
                  position: "absolute", top: -1, right: -1,
                  width: 80, height: 80,
                  background: "linear-gradient(135deg, rgba(56, 189, 248, 0.08), transparent)",
                  borderBottomLeftRadius: 80,
                }} />

                <div style={{ fontSize: 36, marginBottom: 24 }}>{p.icon}</div>

                <h3 style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 24,
                  color: "#f1f5f9",
                  fontWeight: 400,
                  margin: "0 0 16px 0",
                  lineHeight: 1.3,
                }}>
                  {p.title}
                </h3>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: "#94a3b8",
                  lineHeight: 1.7,
                  margin: "0 0 24px 0",
                }}>
                  {p.description}
                </p>

                {/* Stats */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                  {p.stats.map((s, j) => (
                    <span key={j} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: "#38bdf8",
                      background: "rgba(56, 189, 248, 0.08)",
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid rgba(56, 189, 248, 0.12)",
                      fontWeight: 600,
                    }}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {p.tags.map((t, j) => (
                    <span key={j} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: "#64748b",
                      padding: "4px 10px",
                      borderRadius: 4,
                      background: "rgba(148, 163, 184, 0.06)",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Skills section
function Skills() {
  const categories = [
    {
      name: "Programming",
      items: ["Python", "SQL", "Scala", "R", "PySpark", "SAS"],
    },
    {
      name: "ML & Model Training",
      items: ["PyTorch", "TensorFlow", "SageMaker", "Scikit-learn"],
    },
    {
      name: "Data Pipeline & Infra",
      items: ["AWS Glue", "Redshift", "S3", "EMR/Spark", "Hive", "Hadoop", "DynamoDB", "MySQL", "Airflow"],
    },
    {
      name: "Data Quality & Ops",
      items: ["Data Validation", "Annotation Routing", "Taxonomy Design", "SLA Monitoring", "OpenSearch", "Kibana", "Tableau"],
    },
    {
      name: "Cloud & DevOps",
      items: ["IAM", "Lambda", "API Gateway", "EC2", "CodePipeline", "CloudWatch", "CloudTrail"],
    },
  ];

  const certs = [
    { name: "AWS Certified Data Engineer – Associate", year: "2023" },
    { name: "AWS Certified Machine Learning – Associate", year: "2023" },
    { name: "AWS Cloud Practitioner", year: "2022" },
  ];

  return (
    <section id="Skills" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", maxWidth: 800, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <FadeIn>
          <SectionHeader label="04" title="Skills & Certifications" />
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 24, marginTop: 64 }}>
          {categories.map((cat, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px solid rgba(148, 163, 184, 0.06)",
                borderRadius: 12,
                padding: 28,
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#38bdf8",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: 20,
                }}>
                  {cat.name}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {cat.items.map((item, j) => (
                    <span
                      key={j}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: "#cbd5e1",
                        padding: "6px 14px",
                        borderRadius: 6,
                        background: "rgba(148, 163, 184, 0.06)",
                        border: "1px solid rgba(148, 163, 184, 0.08)",
                        transition: "all 0.3s",
                        cursor: "default",
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = "rgba(56, 189, 248, 0.3)"; e.target.style.color = "#38bdf8"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "rgba(148, 163, 184, 0.08)"; e.target.style.color = "#cbd5e1"; }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Certifications */}
        <FadeIn delay={0.3}>
          <div style={{ marginTop: 64 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              color: "#64748b",
              marginBottom: 24,
              letterSpacing: "0.5px",
            }}>
              <span style={{ color: "#38bdf8" }}>// </span>certifications
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {certs.map((c, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 20px",
                  background: "rgba(56, 189, 248, 0.04)",
                  border: "1px solid rgba(56, 189, 248, 0.1)",
                  borderRadius: 10,
                }}>
                  <span style={{ fontSize: 18 }}>🏅</span>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#e2e8f0", fontWeight: 500 }}>
                      {c.name}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#64748b", marginTop: 2 }}>
                      {c.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// Education section (part of About)
function About() {
  return (
    <section id="About" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", maxWidth: 800, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <FadeIn>
          <SectionHeader label="01" title="About" />
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 64, alignItems: "start" }}>
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              color: "#94a3b8",
              lineHeight: 1.8,
              margin: 0,
            }}>
              I specialize in building production-grade data extraction, labeling, and classification pipelines at massive scale. During my 5+ years at Amazon, I designed supervised workflows and automated systems that processed billions of records for data quality validation, ML model training, and dataset generation. My work spans data taxonomy design, entity resolution, annotation routing, anomaly detection modeling, and pipeline architecture.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              {/* Education */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: 24,
              }}>
                Education
              </div>

              {[
                {
                  school: "University of South Florida",
                  degree: "M.S. Data Science (Intelligence)",
                  period: "Aug 2024 – Aug 2026",
                  gpa: "GPA: 3.9/4",
                  location: "Tampa, FL",
                  detail: "Data Architecture, Distributed Systems, Big Data Analytics, Data Mining",
                },
                {
                  school: "Sastra University",
                  degree: "B.Tech, Electrical & Electronics Engineering",
                  period: "Jul 2014 – May 2018",
                  location: "India",
                },
              ].map((edu, i) => (
                <div key={i} style={{
                  padding: "20px 0",
                  borderBottom: i === 0 ? "1px solid rgba(148, 163, 184, 0.06)" : "none",
                }}>
                  <h4 style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 20,
                    color: "#f1f5f9",
                    fontWeight: 400,
                    margin: "0 0 6px 0",
                  }}>
                    {edu.school}
                  </h4>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#94a3b8" }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#64748b", marginTop: 6 }}>
                    {edu.period} &middot; {edu.location}
                    {edu.gpa && <span style={{ color: "#38bdf8" }}> &middot; {edu.gpa}</span>}
                  </div>
                  {edu.detail && (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b", marginTop: 8 }}>
                      Focus: {edu.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Contact section
function Contact() {
  return (
    <section id="Contact" style={{ padding: "120px 0 0", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", maxWidth: 800, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
        <FadeIn>
          <SectionHeader label="05" title="Get in Touch" centered />
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            color: "#94a3b8",
            lineHeight: 1.8,
            maxWidth: 560,
            margin: "40px auto 48px",
          }}>
            Open to opportunities in data science, ML engineering, and data platform roles. Whether you have a question or just want to connect, feel free to reach out.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Email", href: "mailto:vijaysridhar2012@gmail.com", icon: "✉" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/sridv", icon: "in" },
              { label: "GitHub", href: "https://github.com/nickblaze-4994", icon: "<>" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "#94a3b8",
                  padding: "14px 28px",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  borderRadius: 8,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.color = "#38bdf8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.15)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 16 }}>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* === THE PIPELINE FOOTER === */}
      <PipelineFooter />
    </section>
  );
}

// Live data pipeline footer
function PipelineFooter() {
  const [uptime, setUptime] = useState(0);
  const [packets, setPackets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const packetIdRef = useRef(0);
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const nodes = [
    { id: "ingest", label: "INGEST", x: 8, desc: "visitor.connect()", color: "#38bdf8" },
    { id: "validate", label: "VALIDATE", x: 28, desc: "auth.verify(intent)", color: "#34d399" },
    { id: "transform", label: "TRANSFORM", x: 50, desc: "match.interests()", color: "#a78bfa" },
    { id: "enrich", label: "ENRICH", x: 72, desc: "context.add(skills)", color: "#fb923c" },
    { id: "output", label: "OUTPUT", x: 92, desc: "response.send()", color: "#f472b6" },
  ];

  const logMessages = [
    { msg: "visitor session initialized", level: "INFO" },
    { msg: "loading portfolio modules...", level: "INFO" },
    { msg: "5 years experience data loaded", level: "OK" },
    { msg: "3M+ records processed metric verified", level: "OK" },
    { msg: "AWS certifications validated (3/3)", level: "OK" },
    { msg: "skills taxonomy indexed: 28 entries", level: "INFO" },
    { msg: "project embeddings generated", level: "INFO" },
    { msg: "connection pipeline: ready", level: "OK" },
    { msg: "location: San Francisco, USA", level: "INFO" },
    { msg: "status: open to opportunities", level: "OK" },
    { msg: "pipeline throughput: optimal", level: "OK" },
    { msg: "next batch: awaiting your message", level: "WAIT" },
    { msg: "SLA target: < 24hr response time", level: "INFO" },
    { msg: "running anomaly detection on visitor intent...", level: "INFO" },
    { msg: "result: genuine interest detected", level: "OK" },
    { msg: "routing to: vijaysridhar2012@gmail.com", level: "INFO" },
  ];

  // Visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Uptime counter
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(timer);
  }, [isVisible]);

  // Spawn data packets
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const id = packetIdRef.current++;
      setPackets(prev => [...prev.slice(-12), { id, progress: 0, born: Date.now() }]);
    }, 1800);
    return () => clearInterval(timer);
  }, [isVisible]);

  // Animate packets
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setPackets(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + 0.8 }))
          .filter(p => p.progress <= 100)
      );
    }, 50);
    return () => clearInterval(timer);
  }, [isVisible]);

  // Scrolling logs
  useEffect(() => {
    if (!isVisible) return;
    let idx = 0;
    const timer = setInterval(() => {
      const entry = logMessages[idx % logMessages.length];
      const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
      setLogs(prev => [...prev.slice(-6), { ...entry, ts, id: Date.now() }]);
      idx++;
    }, 2200);
    return () => clearInterval(timer);
  }, [isVisible]);

  const formatUptime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const mono = "'JetBrains Mono', monospace";

  return (
    <div
      ref={footerRef}
      style={{
        marginTop: 100,
        background: "linear-gradient(180deg, transparent 0%, rgba(2, 6, 14, 0.95) 15%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scan line effect */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56, 189, 248, 0.008) 2px, rgba(56, 189, 248, 0.008) 4px)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 40px", position: "relative", zIndex: 2 }}>

        {/* Header bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 32, flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#34d399",
              boxShadow: "0 0 8px rgba(52, 211, 153, 0.6)",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontFamily: mono, fontSize: 11, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>
              pipeline status: <span style={{ color: "#34d399" }}>operational</span>
            </span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 11, color: "#334155" }}>
            session uptime <span style={{ color: "#38bdf8" }}>{formatUptime(uptime)}</span>
          </div>
        </div>

        {/* === PIPELINE VISUALIZATION === */}
        <div style={{
          background: "rgba(8, 12, 21, 0.8)",
          border: "1px solid rgba(148, 163, 184, 0.06)",
          borderRadius: 12,
          padding: "40px 24px 32px",
          position: "relative",
          marginBottom: 24,
        }}>
          {/* Pipeline connection line */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "8%",
            right: "8%",
            height: 2,
            background: "rgba(148, 163, 184, 0.06)",
            transform: "translateY(-8px)",
          }}>
            {/* Animated glow on the line */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.15) 50%, transparent 100%)",
              animation: "linePulse 3s ease-in-out infinite",
            }} />
          </div>

          {/* Data packets flowing */}
          {packets.map(p => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                top: "50%",
                left: `${8 + (p.progress / 100) * 84}%`,
                transform: "translate(-50%, -8px)",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#38bdf8",
                boxShadow: "0 0 12px rgba(56, 189, 248, 0.8), 0 0 24px rgba(56, 189, 248, 0.3)",
                opacity: p.progress > 90 ? (100 - p.progress) / 10 : p.progress < 5 ? p.progress / 5 : 1,
                transition: "left 0.05s linear",
                zIndex: 3,
              }}
            />
          ))}

          {/* Pipeline nodes */}
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 4 }}>
            {nodes.map((node, i) => (
              <div
                key={node.id}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, cursor: "default" }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node circle */}
                <div style={{
                  width: hoveredNode === node.id ? 44 : 36,
                  height: hoveredNode === node.id ? 44 : 36,
                  borderRadius: "50%",
                  background: hoveredNode === node.id
                    ? `radial-gradient(circle, ${node.color}22, ${node.color}08)`
                    : "rgba(8, 12, 21, 0.95)",
                  border: `2px solid ${hoveredNode === node.id ? node.color : "rgba(148, 163, 184, 0.12)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: hoveredNode === node.id ? `0 0 20px ${node.color}30` : "none",
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: node.color,
                    opacity: hoveredNode === node.id ? 1 : 0.5,
                    transition: "opacity 0.3s",
                  }} />
                </div>

                {/* Label */}
                <div style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: hoveredNode === node.id ? node.color : "#475569",
                  letterSpacing: "1.5px",
                  fontWeight: 600,
                  transition: "color 0.3s",
                  marginBottom: 6,
                }}>
                  {node.label}
                </div>

                {/* Description on hover */}
                <div style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: node.color,
                  opacity: hoveredNode === node.id ? 0.7 : 0,
                  transform: hoveredNode === node.id ? "translateY(0)" : "translateY(-4px)",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}>
                  {node.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === LIVE LOG FEED === */}
        <div style={{
          background: "rgba(8, 12, 21, 0.8)",
          border: "1px solid rgba(148, 163, 184, 0.06)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 40,
          height: 180,
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Terminal header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 12, paddingBottom: 12,
            borderBottom: "1px solid rgba(148, 163, 184, 0.04)",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", opacity: 0.7 }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308", opacity: 0.7 }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", opacity: 0.7 }} />
            <span style={{ fontFamily: mono, fontSize: 10, color: "#334155", marginLeft: 8 }}>
              vs-pipeline-monitor ~ /var/log/visitor
            </span>
          </div>

          {/* Scrolling log entries */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 120 }}>
            {logs.map((log, i) => (
              <div
                key={log.id}
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  lineHeight: 1.8,
                  display: "flex",
                  gap: 12,
                  opacity: i === logs.length - 1 ? 1 : 0.4 + (i / logs.length) * 0.5,
                  animation: i === logs.length - 1 ? "logSlideIn 0.3s ease" : "none",
                }}
              >
                <span style={{ color: "#334155", flexShrink: 0 }}>{log.ts}</span>
                <span style={{
                  color: log.level === "OK" ? "#34d399" : log.level === "WAIT" ? "#eab308" : "#475569",
                  flexShrink: 0,
                  width: 36,
                }}>
                  [{log.level}]
                </span>
                <span style={{ color: "#64748b" }}>{log.msg}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ fontFamily: mono, fontSize: 11, color: "#334155" }}>
                initializing pipeline monitor...
              </div>
            )}
          </div>

          {/* Fade overlay at top */}
          <div style={{
            position: "absolute", top: 40, left: 0, right: 0, height: 40,
            background: "linear-gradient(180deg, rgba(8, 12, 21, 0.8), transparent)",
            pointerEvents: "none",
          }} />
        </div>

        {/* === BOTTOM ROW === */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 24, borderTop: "1px solid rgba(148, 163, 184, 0.04)",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: "#1e293b" }}>
            <span style={{ color: "#334155" }}>vijay_sridhar</span>
            <span style={{ color: "#1e293b" }}> @ </span>
            <span style={{ color: "#334155" }}>portfolio</span>
            <span style={{ color: "#1e293b" }}> : </span>
            <span style={{ color: "#38bdf8", opacity: 0.3 }}>~</span>
            <span style={{ color: "#1e293b" }}> $ </span>
            <span style={{ color: "#334155", animation: "blink 1s step-end infinite" }}>█</span>
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: "#1e293b" }}>
              records: <span style={{ color: "#334155" }}>3M+</span>
            </span>
            <span style={{ fontFamily: mono, fontSize: 10, color: "#1e293b" }}>
              latency: <span style={{ color: "#34d399" }}>12ms</span>
            </span>
            <span style={{ fontFamily: mono, fontSize: 10, color: "#1e293b" }}>
              v1.0.{new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section header component
function SectionHeader({ label, title, centered = false }) {
  return (
    <div style={{ textAlign: centered ? "center" : "left" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: "#38bdf8",
        marginBottom: 12,
        letterSpacing: "2px",
      }}>
        {label}
      </div>
      <h2 style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: "clamp(36px, 5vw, 56px)",
        color: "#f1f5f9",
        fontWeight: 400,
        margin: 0,
        letterSpacing: "-1px",
      }}>
        {title}
      </h2>
    </div>
  );
}

// Main App
export default function App() {
  const [activeSection, setActiveSection] = useState("Home");

  const handleNav = (section) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(section);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #080c15;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        ::selection {
          background: rgba(56, 189, 248, 0.3);
          color: #f1f5f9;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080c15; }
        ::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 3px; }

        @keyframes blink {
          50% { opacity: 0; }
        }

        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -20px); }
          50% { transform: translate(-5px, -40px); }
          75% { transform: translate(15px, -20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(52, 211, 153, 0.6); }
          50% { opacity: 0.5; box-shadow: 0 0 16px rgba(52, 211, 153, 0.3); }
        }

        @keyframes linePulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes logSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          #About > div > div { grid-template-columns: 1fr !important; gap: 40px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <ParticleField />
      <Nav active={activeSection} onNav={handleNav} />
      <Hero onNav={handleNav} />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}

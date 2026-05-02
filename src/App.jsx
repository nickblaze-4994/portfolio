import { useState, useEffect, useRef } from "react";

const RECENT_TICKETS = [
  { id: "T-100033", summary: "Enable USB Wall FAILED · SUR-64-01", site: "Site 027", category: "Security Policy", created: "2d", status: "Resolved" },
  { id: "T-100025", summary: "Enable USB Wall FAILED · SUR-8E-02", site: "Site 035", category: "Security Policy", created: "3d", status: "Resolved" },
  { id: "T-100057", summary: "Enable USB Wall FAILED · SUR-8A-02", site: "Site 033", category: "Security Policy", created: "4d", status: "Resolved" },
  { id: "T-100089", summary: "Outlook freezing for Jenna Morris", site: "Site 027", category: "Application", created: "4d", status: "Open" },
  { id: "T-100091", summary: "Enhance Security Logging FAILED", site: "Site 018", category: "Security Policy", created: "5d", status: "Resolved" },
  { id: "T-100094", summary: "Enable USB Wall FAILED · SUR-5D-02", site: "Site 023", category: "Security Policy", created: "5d", status: "Resolved" },
  { id: "T-100096", summary: "Enable USB Wall FAILED · SOO-K4-02", site: "Site 047", category: "Security Policy", created: "6d", status: "Resolved" },
  { id: "T-100098", summary: "Server Free Space < 5 GB · SOU-DC-01", site: "Site 014", category: "Server", created: "7d", status: "Resolved" },
  { id: "T-100102", summary: "Enable USB Wall FAILED · SUR-1B-01", site: "Site 002", category: "Security Policy", created: "7d", status: "Resolved" },
  { id: "T-100104", summary: "Enforce UAC FAILED", site: "Site 024", category: "Security Policy", created: "8d", status: "Resolved" },
];

const CUSTOMER_PROFILES = {
  "Company 005": {
    psa_company_id: "C-005", contract: "Managed IT Premium",
    email_platform: "Microsoft 365", mfa_method: "Microsoft Authenticator",
    sites: 52,
    primary_contacts: ["ops@company-005.com (Operations alias)", "it@company-005.com (IT Manager: Dave Reilly)"],
    known_users: {
      "jenna.morris@company-005.com": { name: "Jenna Morris", role: "VP Finance", site: "Site 027", device: "JM-LT-019" },
      "m.chen@company-005.com": { name: "Mark Chen", role: "Senior Analyst", site: "Site 035", device: "MC-LT-042" },
      "lisa.park@company-005.com": { name: "Lisa Park", role: "Account Manager", site: "Site 027", device: "LP-LT-038" },
      "reception@company-005.com": { name: "Reception (shared mailbox)", site: "Site 027" },
      "ops@company-005.com": { name: "Operations Team alias", site: "various" },
    },
    known_assets: {
      "Site 027 reception printer": "HP LaserJet M428fdn (asset RP-027-01)",
      "Site 014 file server": "SOU-DC-01 (Windows Server 2019, 500GB)",
      "Site 027 file server": "SOU-FS-01 (Windows Server 2019)",
    },
  },
};

const INTAKE_QUEUE = [
  { key: "uac", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Enforce UAC FAILED", age: "1m", raw: "TW - Enforce UAC FAILED for Company 005\\Site 032\\SOU-WHS-022:241533 -" },
  { key: "usb", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Enable USB Wall FAILED", age: "3m", raw: "TW - Enable USB Wall FAILED for Company 005\\Site 048\\SUR-9C-01:267412 -" },
  { key: "backup", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Veeam Backup Job FAILED", age: "6m", raw: "TW - Veeam Backup Job FAILED for Company 005\\Site 014\\SOU-DC-01:241200 - Retention policy violation, last successful backup 72hrs ago" },
  { key: "vague", source: "email", icon: "✉", sourceMeta: "ops@company-005.com", preview: "not working again. fix it.", age: "12m", raw: "not working again. fix it." },
  { key: "diskspace", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Server Free Space < 5GB", age: "18m", raw: "TW - Server Free Space < 5GB for Company 005\\Site 027\\SOU-FS-01:198432 - Drive D: 3.2GB free of 500GB" },
  { key: "password", source: "email", icon: "✉", sourceMeta: "m.chen@company-005.com", preview: "Locked out of email after password change", age: "22m", raw: "Hi, I'm locked out of my email after the password change yesterday. Can someone reset it? I'm working from home today, not in the office. Thanks, Mark" },
  { key: "printer", source: "email", icon: "✉", sourceMeta: "reception@company-005.com", preview: "Reception printer offline since yesterday", age: "35m", raw: "The printer on the reception desk hasn't been working since yesterday afternoon. We've tried turning it off and on. Multiple staff members can't print invoices. Site 027." },
  { key: "outlook", source: "email", icon: "✉", sourceMeta: "jenna.morris@company-005.com", preview: "Outlook keeps crashing - urgent, close week", age: "47m", raw: "Hi, my Outlook has been crashing every few minutes since this morning. I've restarted my laptop twice but no luck. I'm in the middle of quarter close so this is really urgent. I'm working from the Site 027 office today. Thanks, Jenna" },
  { key: "reboot", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Pending Reboot > 7 days", age: "1h", raw: "TW - Pending Reboot > 7 days for Company 005\\Site 035\\SUR-LT-08:267123 - Last reboot 12 days ago, security patches pending" },
  { key: "mfa", source: "email", icon: "✉", sourceMeta: "lisa.park@company-005.com", preview: "Got new phone, can't log into anything", age: "1h", raw: "I got a new phone yesterday and now I can't log into anything. The Microsoft Authenticator app is on my old phone. What do I do? I really need access to email today." },
];

const TECHS_BY_BOARD = {
  "Service Desk": ["Sarah Chen", "Mike Patel"],
  "Managed Service Alerts": ["Carlos Rivera", "Dave Reilly"],
  "Network Alerts": ["Carlos Rivera"],
  "Backups": ["Dave Reilly"],
  "Recurring (Proactive)": ["Mike Patel"],
};
const pickTech = (board, index) => {
  const pool = TECHS_BY_BOARD[board] || ["Sarah Chen"];
  return pool[index % pool.length];
};

// Mock AI results — replicates the JSON the live model would have returned.
// Distribution: 5 auto_route, 3 needs_review, 2 needs_input.
const MOCK_AI_RESULTS = {
  uac: {
    summary: "Enforce UAC FAILED · SOU-WHS-022",
    category: "Security Policy", sub_category: "UAC Enforcement",
    priority: "P3-Medium", board: "Managed Service Alerts",
    company: "Company 005", site: "Site 032", device: "SOU-WHS-022", contact_email: null,
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 1, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed from alert payload", category: "UAC → Security Policy", sub_category: null,
      priority: "routine policy alert → P3", board: "Automate alerts → MSA",
      company: "parsed: Company 005", site: "parsed: Site 032 from path", device: "parsed: SOU-WHS-022", contact_email: null,
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, routine alert",
  },
  usb: {
    summary: "Enable USB Wall FAILED · SUR-9C-01",
    category: "Security Policy", sub_category: "USB Wall",
    priority: "P3-Medium", board: "Managed Service Alerts",
    company: "Company 005", site: "Site 048", device: "SUR-9C-01", contact_email: null,
    clarifying_questions: [],
    duplicate_check: {
      is_likely_duplicate: true,
      matched_ticket_ids: ["T-100033", "T-100025", "T-100057", "T-100094", "T-100096", "T-100102"],
      pattern_count: 6,
      recommendation: "link to pattern",
    },
    field_confidence: { summary: "high", category: "high", priority: "medium" },
    field_reasoning: {
      summary: "parsed from alert payload", category: "USB → Security Policy", sub_category: null,
      priority: "duplicate pattern → escalate to human", board: "Automate alerts → MSA",
      company: "parsed: Company 005", site: "parsed: Site 048 from path", device: "parsed: SUR-9C-01", contact_email: null,
    },
    routing_decision: "needs_review",
    routing_reason: "duplicate of 6 recent tickets",
  },
  backup: {
    summary: "Veeam Backup Job FAILED · SOU-DC-01 · 72hrs since last success",
    category: "Backup", sub_category: "Veeam",
    priority: "P2-High", board: "Backups",
    company: "Company 005", site: "Site 014", device: "SOU-DC-01", contact_email: null,
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed from alert payload + retention details", category: "Veeam → Backup", sub_category: null,
      priority: "72hr retention breach → P2", board: "Backup alerts → Backups board",
      company: "parsed: Company 005", site: "parsed: Site 014", device: "profile: Site 014 file server", contact_email: null,
    },
    routing_decision: "needs_review",
    routing_reason: "P2 urgency, human approval",
  },
  vague: {
    summary: "Vague request from ops alias — needs context",
    category: "Incident", sub_category: null,
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: null, device: null, contact_email: "ops@company-005.com",
    clarifying_questions: [
      "Which system or device isn't working?",
      "Who's affected and which site are they at?",
    ],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "low", category: "low", priority: "medium" },
    field_reasoning: {
      summary: "no specifics in body", category: "no signal — fallback Incident", sub_category: null,
      priority: "default until clarified", board: "inbound email → Service Desk",
      company: "matched email domain", site: null, device: null, contact_email: "alias on file",
    },
    routing_decision: "needs_input",
    routing_reason: "input too vague to classify",
  },
  diskspace: {
    summary: "Server Free Space < 5 GB · SOU-FS-01 · D: 3.2 GB",
    category: "Server", sub_category: "Disk Space",
    priority: "P3-Medium", board: "Managed Service Alerts",
    company: "Company 005", site: "Site 027", device: "SOU-FS-01", contact_email: null,
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed alert + free-space details", category: "disk space → Server", sub_category: null,
      priority: "above critical threshold → P3", board: "Automate alerts → MSA",
      company: "parsed: Company 005", site: "parsed: Site 027", device: "profile: Site 027 file server", contact_email: null,
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, routine alert",
  },
  password: {
    summary: "Email lockout after password change — Mark Chen",
    category: "Account/Access", sub_category: "Password Reset",
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: "Site 035", device: "MC-LT-042", contact_email: "m.chen@company-005.com",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "Mark says locked out post-change", category: "password reset → Account/Access", sub_category: null,
      priority: "single user access → P3", board: "inbound email → Service Desk",
      company: "matched email domain", site: "profile: Mark at Site 035", device: "profile: Mark's laptop", contact_email: "from email header",
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, profile-enriched",
  },
  printer: {
    summary: "Reception printer offline — Site 027",
    category: "Hardware", sub_category: "Printer",
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: "Site 027", device: "RP-027-01", contact_email: "reception@company-005.com",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "reception printer down, multi-user impact", category: "printer offline → Hardware", sub_category: null,
      priority: "shared device, no workaround mentioned → P3", board: "inbound email → Service Desk",
      company: "matched email domain", site: "stated in body: Site 027", device: "profile: HP LaserJet M428fdn (RP-027-01)", contact_email: "from email header",
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, profile-enriched",
  },
  outlook: {
    summary: "Outlook crashing every few minutes — Jenna Morris",
    category: "Application", sub_category: "Outlook",
    priority: "P2-High", board: "Service Desk",
    company: "Company 005", site: "Site 027", device: "JM-LT-019", contact_email: "jenna.morris@company-005.com",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "Jenna reports repeated crashes despite restart", category: "Outlook → Application", sub_category: null,
      priority: "urgent + close-week impact → P2", board: "inbound email → Service Desk",
      company: "matched email domain", site: "profile: Jenna at Site 027", device: "profile: Jenna's laptop", contact_email: "from email header",
    },
    routing_decision: "needs_review",
    routing_reason: "P2 urgency, human approval",
  },
  reboot: {
    summary: "Pending Reboot > 7 days · SUR-LT-08 · 12 days",
    category: "Security Policy", sub_category: "Patch Management",
    priority: "P4-Low", board: "Recurring (Proactive)",
    company: "Company 005", site: "Site 035", device: "SUR-LT-08", contact_email: null,
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed alert + last-reboot details", category: "patch reboot → Security Policy", sub_category: null,
      priority: "non-urgent maintenance → P4", board: "proactive recurring → Recurring (Proactive)",
      company: "parsed: Company 005", site: "parsed: Site 035", device: "parsed: SUR-LT-08", contact_email: null,
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, routine alert",
  },
  mfa: {
    summary: "MFA reset — Lisa Park got new phone",
    category: "Account/Access", sub_category: "MFA Reset",
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: "Site 027", device: "LP-LT-038", contact_email: "lisa.park@company-005.com",
    clarifying_questions: [
      "Do you still have access to your old phone, or has it been wiped?",
      "Can we verify your identity via a callback to a number on file?",
    ],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "medium" },
    field_reasoning: {
      summary: "Lisa's authenticator on old phone", category: "MFA → Account/Access", sub_category: null,
      priority: "single user, urgent same-day → P3", board: "inbound email → Service Desk",
      company: "matched email domain", site: "profile: Lisa at Site 027", device: "profile: Lisa's laptop", contact_email: "from email header",
    },
    routing_decision: "needs_input",
    routing_reason: "identity verification required",
  },
};

const TIER_LABELS = {
  small: "Small MSP",
  mid: "Mid-market",
  enterprise: "Enterprise",
};

const AIIndicator = ({ confidence }) => {
  if (!confidence || confidence === "high") return null;
  const color = confidence === "medium" ? "bg-amber-400" : "bg-rose-400";
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1.5 ${color}`} title={`AI confidence: ${confidence}`} />;
};

const Field = ({ label, value, onChange, confidence, reason, readOnly }) => (
  <div>
    <div className="flex items-center text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
      {label}
      <AIIndicator confidence={confidence} />
    </div>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      readOnly={readOnly}
      placeholder="—"
      className={`w-full text-sm text-neutral-900 bg-transparent border-0 border-b border-neutral-200 ${readOnly ? "" : "hover:border-neutral-400 focus:border-neutral-900"} focus:outline-none transition-colors py-1`}
    />
    {reason && <p className="mt-1 text-xs text-neutral-400 leading-tight normal-case tracking-normal">{reason}</p>}
  </div>
);

const formatRelative = (ts) => {
  if (!ts) return "—";
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 30) return "just now";
  if (diffSec < 60) return "30s ago";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
};

// Resolves a mock result with a small randomized delay so the queue feels like
// a streaming API feed rather than an instant render.
const fetchMockResult = (key) =>
  new Promise((resolve) => {
    const delay = 80 + Math.floor(Math.random() * 120);
    setTimeout(() => resolve(MOCK_AI_RESULTS[key]), delay);
  });

export default function App() {
  const [items, setItems] = useState(
    INTAKE_QUEUE.map((item, idx) => ({ ...item, ai: null, bucket: null, idx, edits: null, ts: null }))
  );
  const [activeKey, setActiveKey] = useState(null);
  const [stage, setStage] = useState("loading");
  const [edits, setEdits] = useState({});
  const [answers, setAnswers] = useState({});
  const [submittedId, setSubmittedId] = useState(null);
  const [mspTier, setMspTier] = useState("mid");
  const [, setTick] = useState(0);

  const startedRef = useRef(false);

  const attention = items.filter((i) => i.bucket === "attention");
  const awaiting = items.filter((i) => i.bucket === "needs_input");
  const routed = items.filter((i) => i.bucket === "routed").sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const processedCount = items.filter((i) => i.bucket).length;
  const allDone = items.every((i) => i.bucket);
  const reviewedCount = items.filter((i) => i.humanReviewed).length;
  const pctAuto = processedCount === 0 ? 0 : Math.round((routed.length / processedCount) * 100);
  const minutesSaved = routed.length * 4 + reviewedCount * 1.5;

  const active = items.find((i) => i.key === activeKey);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const queue = [...INTAKE_QUEUE];
    const concurrency = 2;
    const runWorker = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item) await processItem(item);
      }
    };
    Promise.all(Array(concurrency).fill(null).map(runWorker));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (allDone && stage === "loading") {
      setStage("viewing");
      const firstAttention = items.find((i) => i.bucket === "attention");
      if (firstAttention) selectItem(firstAttention.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, stage]);

  const processItem = async (item) => {
    const parsed = await fetchMockResult(item.key);
    const bucket =
      parsed.routing_decision === "auto_route"
        ? "routed"
        : parsed.routing_decision === "needs_input"
        ? "needs_input"
        : "attention";
    const tech = pickTech(parsed.board, item.idx);
    const newId = `T-${100247 + item.idx}`;
    const sentAt = bucket === "needs_input" ? Date.now() : null;

    setItems((prev) =>
      prev.map((it) =>
        it.key === item.key
          ? {
              ...it,
              ai: parsed,
              bucket,
              ts: bucket === "routed" ? Date.now() : sentAt,
              ticketId: bucket === "routed" ? newId : null,
              tech: bucket === "routed" ? tech : null,
              clarificationSentAt: sentAt,
            }
          : it
      )
    );
  };

  const selectItem = (key) => {
    const item = items.find((i) => i.key === key);
    if (!item) return;
    setActiveKey(key);
    setSubmittedId(null);
    setAnswers({});
    if (item.ai) {
      setEdits({
        summary: item.edits?.summary ?? item.ai.summary,
        category: item.edits?.category ?? item.ai.category,
        sub_category: item.edits?.sub_category ?? item.ai.sub_category,
        priority: item.edits?.priority ?? item.ai.priority,
        board: item.edits?.board ?? item.ai.board,
        company: item.edits?.company ?? item.ai.company,
        site: item.edits?.site ?? item.ai.site,
        device: item.edits?.device ?? item.ai.device,
        contact_email: item.edits?.contact_email ?? item.ai.contact_email,
      });
    }
  };

  const updateEdit = (field, value) => setEdits((prev) => ({ ...prev, [field]: value }));

  const submitAttention = (linkedToTicketId = null) => {
    const item = items.find((i) => i.key === activeKey);
    if (!item) return;
    const newId = `T-${100247 + item.idx}`;
    const tech = pickTech(edits.board, item.idx);
    setSubmittedId(newId);

    setItems((prev) =>
      prev.map((it) =>
        it.key === activeKey
          ? {
              ...it,
              bucket: "routed",
              edits,
              ticketId: newId,
              tech,
              ts: Date.now(),
              linkedTo: linkedToTicketId,
              humanReviewed: true,
            }
          : it
      )
    );

    setTimeout(() => {
      setSubmittedId(null);
      const nextAttention = items.find((i) => i.bucket === "attention" && i.key !== activeKey);
      if (nextAttention) {
        selectItem(nextAttention.key);
      } else {
        setActiveKey(null);
      }
    }, 1200);
  };

  const handleLinkToPattern = () => {
    const matched = active?.ai?.duplicate_check?.matched_ticket_ids?.[0];
    if (matched) submitAttention(matched);
  };

  const reset = () => {
    startedRef.current = false;
    setItems(INTAKE_QUEUE.map((item, idx) => ({ ...item, ai: null, bucket: null, idx, edits: null, ts: null })));
    setActiveKey(null);
    setStage("loading");
    setEdits({});
    setSubmittedId(null);
    setTimeout(() => {
      startedRef.current = true;
      const queue = [...INTAKE_QUEUE];
      const concurrency = 2;
      const runWorker = async () => {
        while (queue.length > 0) {
          const item = queue.shift();
          if (item) await processItem(item);
        }
      };
      Promise.all(Array(concurrency).fill(null).map(runWorker));
    }, 100);
  };

  const matchedTicketIds = active?.ai?.duplicate_check?.matched_ticket_ids || [];
  const reasoning = active?.ai?.field_reasoning || {};
  const isAutoRouted = active?.bucket === "routed" && !active?.humanReviewed;
  const isAwaiting = active?.bucket === "needs_input";

  return (
    <div
      className="h-screen flex flex-col bg-neutral-100 antialiased text-neutral-900"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <header className="bg-white border-b border-neutral-200 flex-shrink-0">
        <div className="px-6 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-6 h-6 bg-neutral-900 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-medium">MSPbots</span>
            <span className="text-neutral-300">/</span>
            <span className="text-sm text-neutral-600">Intake</span>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 rounded-md p-0.5">
            {["small", "mid", "enterprise"].map((tier) => (
              <button
                key={tier}
                onClick={() => setMspTier(tier)}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${
                  mspTier === tier
                    ? "bg-white text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {TIER_LABELS[tier]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 text-xs ml-auto">
            {stage === "loading" ? (
              <span className="text-neutral-500">
                Processing intake · <span className="text-neutral-900 font-medium">{processedCount}</span>/{items.length}
              </span>
            ) : (
              <span className="text-neutral-500 flex items-center gap-3">
                <span><span className="text-neutral-900 font-medium">{pctAuto}%</span> auto</span>
                <span className="text-neutral-300">·</span>
                <span><span className="text-neutral-900 font-medium">{minutesSaved.toFixed(minutesSaved % 1 ? 1 : 0)}</span> min saved</span>
                <span className="text-neutral-300">·</span>
                <span><span className="text-neutral-900 font-medium">{processedCount}</span> in queue</span>
              </span>
            )}
            <button onClick={reset} className="text-neutral-400 hover:text-neutral-900" title="Reset">↻</button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-72 flex-shrink-0 border-r border-neutral-200 bg-white flex flex-col">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Needs your attention</span>
              <span className="text-xs text-neutral-400">{attention.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {stage === "loading" && attention.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <div className="w-4 h-4 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-neutral-400">Sorting incoming…</p>
                </div>
              )}
              {stage === "viewing" && attention.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium">All clear</p>
                  <p className="text-xs text-neutral-400 mt-0.5">AI handling new tickets in background</p>
                </div>
              )}
              {attention.map((item) => {
                const isActive = item.key === activeKey;
                const reasonShort = item.ai?.routing_reason || "needs review";
                return (
                  <button
                    key={item.key}
                    onClick={() => selectItem(item.key)}
                    className={`w-full text-left px-4 py-3 border-b border-neutral-100 transition-all ${
                      isActive
                        ? "bg-neutral-50 border-l-2 border-l-neutral-900"
                        : "hover:bg-neutral-50 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`text-sm mt-0.5 ${isActive ? "text-neutral-700" : "text-neutral-400"}`}>{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-xs font-medium truncate ${isActive ? "text-neutral-900" : "text-neutral-700"}`}>
                            {item.sourceMeta}
                          </span>
                          <span className="text-xs text-neutral-400 flex-shrink-0">{item.age}</span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-snug truncate mb-1">{item.preview}</p>
                        <p className="text-xs text-amber-700 leading-tight">{reasonShort}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {awaiting.length > 0 && (
              <div className="border-t border-neutral-100 flex-shrink-0">
                <div className="px-4 py-2 flex items-center justify-between bg-neutral-50">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Awaiting reply</span>
                  <span className="text-xs text-neutral-400">{awaiting.length}</span>
                </div>
                {awaiting.map((item) => {
                  const isActive = item.key === activeKey;
                  return (
                    <button
                      key={item.key}
                      onClick={() => selectItem(item.key)}
                      className={`w-full text-left px-4 py-2.5 border-b border-neutral-100 transition-all ${
                        isActive ? "bg-neutral-50 border-l-2 border-l-neutral-900" : "hover:bg-neutral-50 border-l-2 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5 gap-2">
                        <span className="text-xs font-medium text-neutral-700 truncate">{item.sourceMeta}</span>
                        <span className="text-xs text-neutral-400 flex-shrink-0">{formatRelative(item.clarificationSentAt)}</span>
                      </div>
                      <p className="text-xs text-blue-700 leading-tight truncate">{item.ai?.routing_reason || "asked for more info"}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t-2 border-neutral-200 flex flex-col flex-shrink-0" style={{ maxHeight: "45%" }}>
            <div className="px-4 py-3 border-b border-neutral-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto-routed</span>
                <span className="text-xs text-neutral-400">{routed.length}</span>
              </div>
              <p className="text-xs text-neutral-400">via Next Ticket Manager</p>
            </div>
            <div className="overflow-y-auto">
              {routed.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-neutral-400">{stage === "loading" ? "Sorting…" : "Nothing yet"}</p>
                </div>
              )}
              {routed.map((r) => {
                const isActive = r.key === activeKey;
                return (
                  <button
                    key={r.key}
                    onClick={() => selectItem(r.key)}
                    className={`w-full text-left px-4 py-2.5 border-b border-neutral-100 transition-all ${
                      isActive ? "bg-neutral-50 border-l-2 border-l-neutral-900" : "hover:bg-neutral-50 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-mono text-neutral-500 font-medium">{r.ticketId}</span>
                      <span className="text-xs text-neutral-400">{formatRelative(r.ts)}</span>
                    </div>
                    <p className="text-xs text-neutral-800 leading-snug truncate mb-1">{r.ai?.summary || r.preview}</p>
                    {r.linkedTo ? (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-neutral-400">↗</span>
                        <span className="text-neutral-600">Linked to</span>
                        <span className="font-mono text-neutral-700">{r.linkedTo}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs truncate">
                        <span className="text-neutral-400">→</span>
                        <span className="text-neutral-700 truncate">{r.tech}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto px-6 py-6 min-w-0">
          {stage === "loading" && (
            <div className="max-w-md mx-auto pt-16 text-center">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-neutral-900 font-medium mb-1">AI is sorting incoming tickets</p>
              <p className="text-xs text-neutral-500">{processedCount} of {items.length} processed</p>
              <div className="mt-6 max-w-xs mx-auto">
                <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 transition-all duration-300"
                    style={{ width: `${(processedCount / items.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {stage === "viewing" && !active && attention.length === 0 && (
            <div className="max-w-md mx-auto pt-16 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 text-xl">✓</span>
              </div>
              <p className="text-base font-medium text-neutral-900 mb-1">All caught up</p>
              <p className="text-sm text-neutral-500 mb-2">
                {routed.length} ticket{routed.length === 1 ? "" : "s"} routed.{" "}
                {reviewedCount} reviewed by you, {routed.length - reviewedCount} auto-routed by AI.
              </p>
              {awaiting.length > 0 && (
                <p className="text-xs text-neutral-500 mb-2">
                  {awaiting.length} ticket{awaiting.length === 1 ? "" : "s"} awaiting customer reply.
                </p>
              )}
              <p className="text-xs text-neutral-400 mb-6">AI is handling new incoming tickets in the background.</p>
              <button onClick={reset} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
                Reset
              </button>
            </div>
          )}

          {active && active.ai && (
            <div className="max-w-2xl mx-auto">
              {active.bucket === "attention" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-3 flex items-center gap-2">
                  <span className="text-amber-600 text-sm">⚠</span>
                  <p className="text-sm text-amber-900">
                    <span className="font-medium">Why you're seeing this:</span> {active.ai.routing_reason}
                  </p>
                </div>
              )}
              {isAutoRouted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-3 flex items-center gap-2">
                  <span className="text-emerald-600 text-sm">✓</span>
                  <p className="text-sm text-emerald-900">
                    <span className="font-medium">Auto-routed by AI:</span> {active.ai.routing_reason}
                    <span className="text-emerald-700"> · {active.ticketId} → {active.tech}</span>
                  </p>
                </div>
              )}
              {active.bucket === "routed" && active.humanReviewed && (
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-2.5 mb-3 flex items-center gap-2">
                  <span className="text-neutral-500 text-sm">✓</span>
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium">Reviewed and routed:</span> {active.ticketId} →{" "}
                    {active.linkedTo ? `linked to ${active.linkedTo}` : active.tech}
                  </p>
                </div>
              )}
              {isAwaiting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 mb-3 flex items-center gap-2">
                  <span className="text-blue-600 text-sm">✉</span>
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">Awaiting customer reply:</span> {active.ai.routing_reason}
                    <span className="text-blue-700"> · sent {formatRelative(active.clarificationSentAt)}</span>
                  </p>
                </div>
              )}

              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden mb-3">
                <div className="px-4 py-2 flex items-center gap-3 border-b border-neutral-100">
                  <span className="text-neutral-400 text-sm">{active.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-500">{active.source === "email" ? "Email from" : "Alert from"}</span>
                      <span className="text-neutral-900 font-medium truncate">{active.sourceMeta}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-neutral-400">{active.age} ago</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 font-mono text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed bg-neutral-50">
                  {active.raw}
                </div>
              </div>

              {isAwaiting ? (
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="px-5 py-4 border-b border-neutral-100">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                      Sent to {active.contact_email || active.sourceMeta}
                    </p>
                    <div className="space-y-2">
                      {active.ai.clarifying_questions.map((q, i) => (
                        <p key={i} className="text-sm text-neutral-700">{q}</p>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
                    <p className="text-xs text-neutral-500">Sent {formatRelative(active.clarificationSentAt)}. Ticket creates on reply.</p>
                    <button
                      onClick={() => {}}
                      className="text-xs px-3 py-1 bg-white border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50"
                    >
                      Resend
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                  {submittedId && (
                    <div className="p-12 text-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-emerald-600 text-lg">✓</span>
                      </div>
                      <p className="text-sm text-neutral-900 font-medium mb-1">Ticket {submittedId} created</p>
                      <p className="text-xs text-neutral-500">Routing via Next Ticket Manager…</p>
                    </div>
                  )}

                  {!submittedId && (
                    <>
                      {active.bucket === "attention" && active.ai.duplicate_check?.is_likely_duplicate && (
                        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <p className="text-sm text-amber-900">
                              <span className="font-medium">Looks like {active.ai.duplicate_check.pattern_count} similar recent tickets.</span>{" "}
                              Submit as new or link to the pattern.
                            </p>
                            <button
                              onClick={handleLinkToPattern}
                              className="text-xs px-2 py-1 bg-white border border-amber-300 rounded text-amber-900 hover:bg-amber-50 whitespace-nowrap font-medium"
                            >
                              Link to pattern
                            </button>
                          </div>
                          <div className="space-y-1 pt-3 border-t border-amber-200">
                            {RECENT_TICKETS.filter((t) => matchedTicketIds.includes(t.id))
                              .slice(0, 6)
                              .map((t) => (
                                <div key={t.id} className="flex items-center gap-2 text-xs">
                                  <span className="font-mono text-amber-700">{t.id}</span>
                                  <span className="text-amber-900 truncate">{t.summary}</span>
                                  <span className="text-amber-600 flex-shrink-0">· {t.site}</span>
                                </div>
                              ))}
                            {matchedTicketIds.length > 6 && (
                              <div className="text-xs text-amber-700 pt-1">+ {matchedTicketIds.length - 6} more</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="px-5 pt-5 pb-4">
                        <div className="flex items-center text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                          Summary
                          <AIIndicator confidence={active.ai.field_confidence?.summary} />
                        </div>
                        <input
                          type="text"
                          value={edits.summary || ""}
                          onChange={(e) => updateEdit("summary", e.target.value)}
                          readOnly={active.bucket === "routed"}
                          className="w-full text-base text-neutral-900 bg-transparent border-0 focus:outline-none font-medium"
                        />
                        {reasoning.summary && <p className="mt-1 text-xs text-neutral-400 leading-tight">{reasoning.summary}</p>}
                      </div>

                      <div className="px-5 pb-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-neutral-100 pt-5">
                        <Field label="Category" value={edits.category} onChange={(v) => updateEdit("category", v)} confidence={active.ai.field_confidence?.category} reason={reasoning.category} readOnly={active.bucket === "routed"} />
                        <Field label="Priority" value={edits.priority} onChange={(v) => updateEdit("priority", v)} confidence={active.ai.field_confidence?.priority} reason={reasoning.priority} readOnly={active.bucket === "routed"} />
                        <Field label="Sub-category" value={edits.sub_category} onChange={(v) => updateEdit("sub_category", v)} reason={reasoning.sub_category} readOnly={active.bucket === "routed"} />
                        <Field label="Board" value={edits.board} onChange={(v) => updateEdit("board", v)} reason={reasoning.board} readOnly={active.bucket === "routed"} />
                        <Field label="Company" value={edits.company} onChange={(v) => updateEdit("company", v)} reason={reasoning.company} readOnly={active.bucket === "routed"} />
                        <Field label="Site" value={edits.site} onChange={(v) => updateEdit("site", v)} reason={reasoning.site} readOnly={active.bucket === "routed"} />
                        <Field label="Device" value={edits.device} onChange={(v) => updateEdit("device", v)} reason={reasoning.device} readOnly={active.bucket === "routed"} />
                        <Field label="Contact" value={edits.contact_email} onChange={(v) => updateEdit("contact_email", v)} reason={reasoning.contact_email} readOnly={active.bucket === "routed"} />
                      </div>

                      {active.bucket === "attention" && active.ai.clarifying_questions?.length > 0 && (
                        <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-200">
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Worth asking the user</p>
                          <div className="space-y-3">
                            {active.ai.clarifying_questions.map((q, i) => (
                              <div key={i}>
                                <p className="text-sm text-neutral-700 mb-1">{q}</p>
                                <input
                                  type="text"
                                  value={answers[i] || ""}
                                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                                  placeholder="Optional"
                                  className="w-full text-sm bg-white border border-neutral-200 rounded px-3 py-1 focus:outline-none focus:border-neutral-900"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {active.bucket === "attention" && (
                        <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-end bg-neutral-50">
                          <button
                            onClick={() => submitAttention(null)}
                            className="px-4 py-1 bg-neutral-900 hover:bg-neutral-700 text-white text-sm rounded transition-colors"
                          >
                            Approve and route
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

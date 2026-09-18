/**
 * Emotional Support — Indian Localized Mock Database
 * Contains details for Indian support programs, articles, and FAQs
 */

export const services = [
  {
    id: "individual-counseling",
    title: "Individual Counseling",
    category: "individual",
    badgeLabel: "Individuals",
    badgeClass: "badge-individual",
    description: "Personalized support designed to help you navigate corporate IT burnout (e.g., tech shifts, long hours in Bengaluru/Gurugram), competitive academic stress (IIT, JEE, NEET, UPSC), anxiety, and personal growth.",
    features: [
      "One-on-one confidential sessions",
      "Cognitive Behavioral Therapy (CBT)",
      "UPSC/IIT academic stress regulation",
      "Corporate burnout coping plans"
    ],
    duration: "50 minutes",
    availability: "Mon – Sat (IST)"
  },
  {
    id: "couples-therapy",
    title: "Partners & Family Care",
    category: "partner",
    badgeLabel: "Partners",
    badgeClass: "badge-partner",
    description: "Facilitated relational counseling designed to resolve family friction, set healthy boundaries within joint family dynamics, navigate modern partnership transitions, and build emotional safety.",
    features: [
      "Joint relational assessment",
      "Gottman Method couples tools",
      "Joint family boundary strategies",
      "Pre-marital communication plans"
    ],
    duration: "60 minutes",
    availability: "Tue – Thu (IST)"
  },
  {
    id: "clinical-consultation",
    title: "Clinical Supervisor Consults",
    category: "clinician",
    badgeLabel: "Clinicians",
    badgeClass: "badge-clinician",
    description: "Professional case supervision and practice guidance reviews for counsellors, social workers, and clinical psychologists. Aligned to RCI, TISS, and NIMHANS clinical training frameworks.",
    features: [
      "Ethical clinical case consults",
      "RCI licensing guidelines review",
      "Case conceptualization reviews",
      "Monthly therapist circles"
    ],
    duration: "45 minutes",
    availability: "Wed – Fri (IST)"
  },
  {
    id: "mindfulness-coaching",
    title: "Mindfulness & Somatic Grounding",
    category: "individual",
    badgeLabel: "Individuals",
    badgeClass: "badge-individual",
    description: "Somatic training in nervous system regulation, deep box-breathing, and grounding techniques inspired by traditional Yoga Nidra principles to manage acute stress.",
    features: [
      "Yoga Nidra somatic grounding",
      "Guided box-breathing templates",
      "Nervous system regulation",
      "Daily mood logs and journal"
    ],
    duration: "30 minutes",
    availability: "Daily Online (IST)"
  },
  {
    id: "group-workshops",
    title: "Student & Peer Circles",
    category: "partner",
    badgeLabel: "Partners",
    badgeClass: "badge-partner",
    description: "Safe group therapy circles where students, competitive exam aspirants, and corporate professionals can share coping strategies, process burnout, and build supportive circles.",
    features: [
      "Facilitated group dialogues",
      "JEE/NEET aspirant peer circles",
      "Shared coping tool workshops",
      "Weekly weekend check-in calls"
    ],
    duration: "90 minutes",
    availability: "Saturdays (IST)"
  },
  {
    id: "professional-supervision",
    title: "Supervised Case Hours",
    category: "clinician",
    badgeLabel: "Clinicians",
    badgeClass: "badge-clinician",
    description: "Authorized clinical supervision hours logs, licensing checklists, and practice compliance management for associate counsellors and post-graduate interns.",
    features: [
      "Supervision hours verification",
      "Board-approved clinical supervisors",
      "Case conceptualization logs",
      "Diagnostic coaching seminars"
    ],
    duration: "60 minutes",
    availability: "Mon – Wed (IST)"
  }
];

export const articles = [
  {
    id: "understanding-anxiety",
    category: "articles",
    tag: "Exam Anxiety",
    gradientClass: "gradient-calm-1",
    readTime: "5 min read",
    title: "Coping with Academic and Competitive Exam Burnout",
    description: "A practical guide for JEE, NEET, and UPSC aspirants. Learn how high academic expectations trigger acute fight-or-flight, and discover somatic grounding drills."
  },
  {
    id: "box-breathing-benefits",
    category: "tools",
    tag: "Mindfulness",
    gradientClass: "gradient-calm-2",
    readTime: "4 min read",
    title: "The Science of Pranayama & Box Breathing",
    description: "Discover how traditional breathing rhythms (like box breathing) stimulate the vagus nerve, slow your heart rate, and regulate stress levels within minutes."
  },
  {
    id: "clinician-burnout",
    category: "articles",
    tag: "Clinician Care",
    gradientClass: "gradient-calm-3",
    readTime: "8 min read",
    title: "Ethics and Compliance for Indian Psychologists",
    description: "Navigating counseling ethics, client-record confidentiality, and secondary trauma boundaries under Rehabilitation Council of India (RCI) guidelines."
  },
  {
    id: "mood-journaling-guide",
    category: "tools",
    tag: "Grounding",
    gradientClass: "gradient-calm-1",
    readTime: "6 min read",
    title: "How Mood Diaries Reshape Cognitive Triggers",
    description: "Daily self-awareness. Learn how logging mood levels and thoughts helps dismantle automatic negative thoughts and builds emotional resilience."
  },
  {
    id: "couples-communication",
    category: "articles",
    tag: "Family Boundaries",
    gradientClass: "gradient-calm-2",
    readTime: "7 min read",
    title: "Setting Boundaries Within Joint Family Settings",
    description: "Relational safety. Learn communication frameworks to discuss boundaries, personal space, and mutual expectations with joint family members."
  },
  {
    id: "grounding-exercises-panic",
    category: "tools",
    tag: "Grounding",
    gradientClass: "gradient-calm-3",
    readTime: "3 min read",
    title: "Somatic Drills for Panic and Exam Distress",
    description: "A quick crisis manual. Five simple sensory drills (such as the 5-4-3-2-1 method) to anchor your awareness back into a safe present state."
  }
];

export const faqs = [
  {
    category: "general",
    question: "What is client-focused emotional support in India?",
    answer: "In India, emotional struggles often intersect with joint family expectations, high academic competition (IIT/JEE/UPSC pressure), and corporate IT burnouts. Our support services provide a non-judgmental, confidential space that respects your personal pacing, helps you build boundary-setting skills, and fosters emotional resilience."
  },
  {
    category: "booking",
    question: "How do I book a consultation slot?",
    answer: "You can choose a slot using our Contact calendar wizard, select a date/time, and input your details securely. All of our support services are 100% free of charge. Intake requests are saved to a local browser database and schedules run in Indian Standard Time (IST)."
  },
  {
    category: "privacy",
    question: "Are my consultation inquiries and session logs private?",
    answer: "We adhere strictly to client confidentiality guidelines and medical data privacy standards. Consultation requests are encrypted and secure. Self-help tools (Mood Tracker, Breathing timer) run entirely client-side, saving records only in your local browser cache (localStorage)."
  },
  {
    category: "clinicians",
    question: "Do your consulting programs align with RCI and NIMHANS?",
    answer: "Yes, our Clinical supervisor consults are structured to align with Rehabilitation Council of India (RCI) guidelines, NIMHANS clinical practice models, and TISS social work ethics, helping associate therapists track compliant supervisor hours."
  },
  {
    category: "crisis",
    question: "What emergency helplines are available in India?",
    answer: "If you are in immediate self-harm danger or psychiatric crisis, please do not wait for an appointment booking. Call Tele-MANAS (14416 or 1800-891-4416) or the Kiran Mental Health Helpline (1800-599-0019) immediately for 24/7 free, confidential support."
  }
];

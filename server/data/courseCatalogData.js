/**
 * Registry of all 24 Academic & Industry Domains and their Specialized Subcourses
 */

export const COURSE_DOMAINS = [
  {
    id: "domain-cs-tech",
    number: 1,
    name: "Computer & Information Sciences (Tech Stack)",
    shortName: "Computer & Tech",
    emoji: "💻",
    iconName: "Binary",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    accentColor: "#3b82f6",
    description: "Core algorithms, AI/ML, cloud architecture, cybersecurity, UX systems, and distributed computing.",
    courses: [
      {
        id: "cs-general-theory",
        title: "Computer Sciences (General Theory)",
        focus: "Automata theory, Turing machines, computability, algorithmic analysis, and discrete computational structures."
      },
      {
        id: "cs-ai-ml",
        title: "Artificial Intelligence and Machine Learning (AI & ML)",
        focus: "Deep neural networks, backpropagation, transformers, reinforcement learning, and loss minimization."
      },
      {
        id: "cs-data-science",
        title: "Data Science and Advanced Analytics",
        focus: "Exploratory data analysis, Bayesian inference, hypothesis testing, predictive modeling, and pipeline scaling."
      },
      {
        id: "cs-software-eng",
        title: "Software Engineering and System Architecture",
        focus: "Clean architecture, microservices, domain-driven design, design patterns, and fault-tolerant concurrency."
      },
      {
        id: "cs-cybersecurity",
        title: "Cybersecurity, Ethical Hacking & Digital Forensics",
        focus: "Cryptographic handshakes, penetration testing, threat modeling, SIEM telemetry, and packet memory forensics."
      },
      {
        id: "cs-it-cloud",
        title: "Information Technology and Cloud Computing Systems",
        focus: "Virtualization, infrastructure-as-code, multi-region failover, container orchestration, and serverless compute."
      },
      {
        id: "cs-networking",
        title: "Computer Systems Networking and Telecommunications",
        focus: "OSI 7-layer architecture, TCP/IP congestion control, BGP routing, SDN topologies, and packet encapsulation."
      },
      {
        id: "cs-hci-ux",
        title: "Human-Computer Interaction & UX/UI Design",
        focus: "Fitts's Law, cognitive load theory, heuristic evaluation, design tokens, and user behavioral ergonomics."
      },
      {
        id: "cs-db-bigdata",
        title: "Database Administration and Big Data Systems",
        focus: "ACID transactions, B-Tree index optimization, distributed consensus (Raft/Paxos), and query execution planners."
      },
      {
        id: "cs-graphics-vfx-game",
        title: "Computer Graphics, Visual Effects & Game Development",
        focus: "Rendering pipelines, rasterization vs ray-tracing, shader math (GLSL), physics engines, and GPU compute."
      },
      {
        id: "course-advanced-excel-mastery",
        title: "Advanced Microsoft Excel: Formulas, Functions, Lookup Systems & Dynamic Dashboards",
        focus: "How and WHY in Excel: Cell locking ($), VLOOKUP rules & limitations, INDEX MATCH vs VLOOKUP, XLOOKUP, nested IF/IFS, text parsing, COUNTIFS/SUMIFS with wildcards, Advanced Filter, Conditional Formatting formulas, INDIRECT, dependent drop-downs, Date/Time serial science, dynamic OFFSET charts, Pivots, and Slicers."
      }
    ]
  },
  {
    id: "domain-engineering-architecture",
    number: 2,
    name: "Engineering & Architecture (Design & Build)",
    shortName: "Engineering & Arch",
    emoji: "📐",
    iconName: "Compass",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    accentColor: "#f59e0b",
    description: "Thermodynamics, robotics, civil structures, avionics, bio-engineering, and urban architectural planning.",
    courses: [
      {
        id: "eng-mechanical-thermo",
        title: "Mechanical Engineering and Thermodynamics",
        focus: "Carnot cycles, entropy, heat exchangers, fluid dynamics, stress tensors, and finite element stress analysis."
      },
      {
        id: "eng-electrical-electronics",
        title: "Electrical and Electronics Engineering",
        focus: "Maxwell's equations, analog op-amps, digital logic synthesis, PCB transmission lines, and power grid stability."
      },
      {
        id: "eng-civil-structural",
        title: "Civil, Structural, and Urban Infrastructure Engineering",
        focus: "Structural beam bending moments, geotechnical soil mechanics, seismic retrofitting, and load distribution."
      },
      {
        id: "eng-chemical-process",
        title: "Chemical and Process Engineering",
        focus: "Mass & energy balances, reactor kinetics, distillation column separation, and chemical thermodynamics."
      },
      {
        id: "eng-aerospace",
        title: "Aerospace, Aeronautical, and Astronautical Engineering",
        focus: "Navier-Stokes aerodynamics, supersonic compressibility, orbital mechanics, rocket propulsion, and avionics."
      },
      {
        id: "eng-biomedical-genetic",
        title: "Biomedical and Genetic Engineering",
        focus: "Biomechanics, bio-instrumentation, CRISPR synthetic gene circuits, tissue scaffolds, and biosensors."
      },
      {
        id: "eng-computer-embedded",
        title: "Computer Engineering and Embedded Hardware Design",
        focus: "FPGA synthesis, Verilog/VHDL, ARM microcontrollers, RTOS scheduling, and memory-mapped I/O buses."
      },
      {
        id: "eng-environmental-sustainable",
        title: "Environmental and Sustainable Systems Engineering",
        focus: "Hydrological watershed modeling, carbon footprint remediation, renewable energy grids, and wastewater treatment."
      },
      {
        id: "eng-industrial-operations",
        title: "Industrial Engineering and Operations Management",
        focus: "Queuing theory, Six Sigma statistical process control, lean logistics, supply simulation, and ergonomics."
      },
      {
        id: "eng-architecture-urban",
        title: "Architecture, Landscape Architecture & Urban Planning",
        focus: "Spatial proportion, parametric facade modeling, bioclimatic design, zoning ordinances, and structural tectonics."
      }
    ]
  },
  {
    id: "domain-natural-sciences",
    number: 3,
    name: "Natural Sciences (Empirical Universe)",
    shortName: "Natural Sciences",
    emoji: "🧪",
    iconName: "Atom",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    accentColor: "#10b981",
    description: "Quantum physics, chemical syntheses, molecular genetics, marine biology, and astrophysics.",
    courses: [
      {
        id: "sci-physics",
        title: "Physics (Classical, Quantum, and Astrophysics)",
        focus: "Schrödinger wave mechanics, Hamiltonian dynamics, general relativity, quantum entanglement, and stellar nucleosynthesis."
      },
      {
        id: "sci-chemistry",
        title: "Chemistry (Organic, Inorganic, and Analytical)",
        focus: "Reaction mechanisms (SN1/SN2), coordination complexes, spectroscopy (NMR/MS), and thermodynamic equilibria."
      },
      {
        id: "sci-molecular-biology",
        title: "Molecular and Cellular Biology",
        focus: "DNA replication fidelity, transcription factors, mitochondrial bioenergetics, and cell signaling pathways."
      },
      {
        id: "sci-genetics-biotech",
        title: "Genetics, Evolutionary Biology, and Biotechnology",
        focus: "Mendelian inheritance, population genomics, recombinant DNA expression, and natural selection dynamics."
      },
      {
        id: "sci-neuroscience",
        title: "Neuroscience and Cognitive Biology",
        focus: "Action potential propagation, synaptic neurotransmission, neuroplasticity, sensory cortex processing, and memory."
      },
      {
        id: "sci-geology-earth",
        title: "Geology, Earth Sciences, and Mineralogy",
        focus: "Plate tectonics, petrology, crystallographic lattices, radiometric dating, and geomorphology."
      },
      {
        id: "sci-ecology-wildlife",
        title: "Ecology, Forestry, and Wildlife Conservation Sciences",
        focus: "Trophic cascades, biogeochemical nutrient cycles, biodiversity indices, and habitat restoration strategies."
      },
      {
        id: "sci-marine-ocean",
        title: "Marine Biology and Oceanography",
        focus: "Pelagic ecosystems, hydrothermal vent extremophiles, thermohaline circulation, and ocean acidification."
      },
      {
        id: "sci-astronomy-planetary",
        title: "Astronomy and Planetary Sciences",
        focus: "Orbital resonance, exoplanet atmospheres, HR diagram stellar evolution, and cosmic microwave background."
      },
      {
        id: "sci-meteorology-climate",
        title: "Meteorology, Atmospheric Sciences, and Climate Modeling",
        focus: "Coriolis tropospheric dynamics, radiative forcing, ENSO cycles, and climate circulation models."
      }
    ]
  },
  {
    id: "domain-math-stats",
    number: 4,
    name: "Mathematics & Statistics (Quantitative Data)",
    shortName: "Math & Statistics",
    emoji: "🧮",
    iconName: "Calculator",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    accentColor: "#8b5cf6",
    description: "Pure algebra, topology, computational probability, risk actuarial science, and cryptography.",
    courses: [
      {
        id: "math-pure",
        title: "Pure Mathematics (Algebra, Topology, Number Theory)",
        focus: "Abstract group rings, algebraic topology fundamental groups, modular forms, and prime number distribution."
      },
      {
        id: "math-applied-modeling",
        title: "Applied Mathematics and Mathematical Modeling",
        focus: "Partial differential equations (PDEs), Fourier analysis, perturbation methods, and dynamical systems bifurcation."
      },
      {
        id: "math-stats-prob",
        title: "Computational Statistics and Probability Theory",
        focus: "Markov chain Monte Carlo (MCMC), maximum likelihood estimators, Central Limit Theorem, and stochastic calculus."
      },
      {
        id: "math-actuarial-risk",
        title: "Actuarial Science and Quantitative Risk Assessment",
        focus: "Life tables, survival models, extreme value theory, copula risk modeling, and pension reserving."
      },
      {
        id: "math-operations-research",
        title: "Operations Research and Optimization Management",
        focus: "Simplex algorithm, dual linear programming, mixed-integer programming, and dynamic Bellman equations."
      },
      {
        id: "math-cryptography-security",
        title: "Cryptography and Mathematical Security Systems",
        focus: "Elliptic curve cryptography (ECC), lattice-based post-quantum algorithms, zero-knowledge proofs, and hashing."
      }
    ]
  },
  {
    id: "domain-medical-sciences",
    number: 5,
    name: "Medical Sciences & Clinical Practice",
    shortName: "Medical Sciences",
    emoji: "🏥",
    iconName: "Activity",
    gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    accentColor: "#ef4444",
    description: "Anatomy, clinical surgical medicine, pharmacology, immunology, and diagnostic imaging.",
    courses: [
      {
        id: "med-anatomy-pathology",
        title: "Human Anatomy, Physiology, and Pathology",
        focus: "Histopathology tissue architecture, cardiovascular hemodynamics, nephron filtration, and endocrine signaling."
      },
      {
        id: "med-general-surgery",
        title: "General Medicine, Surgery, and Clinical Practices",
        focus: "Differential diagnostics, surgical asepsis, hemodynamic resuscitation, acute triage, and clinical pharmacology."
      },
      {
        id: "med-nursing-critical",
        title: "Nursing Foundations and Critical Patient Care",
        focus: "Patient monitoring, arterial line management, ventilator waveforms, aseptic medication delivery, and triage."
      },
      {
        id: "med-pharmacology-toxicology",
        title: "Pharmacology, Toxicology, and Pharmaceutical Sciences",
        focus: "Pharmacokinetics (ADME), receptor binding affinities, cytochrome P450 metabolism, and antidote administration."
      },
      {
        id: "med-dentistry-maxillofacial",
        title: "Dentistry, Oral Maxillofacial Surgery, and Orthodontics",
        focus: "Craniofacial bone geometry, endodontic biomechanics, occlusal planes, and surgical flap management."
      },
      {
        id: "med-lab-imaging",
        title: "Medical Laboratory Technology and Diagnostic Imaging",
        focus: "MRI pulse sequences, CT Hounsfield attenuation, ELISA assays, flow cytometry, and hematology stains."
      },
      {
        id: "med-immunology-infectious",
        title: "Immunology and Infectious Disease Pathology",
        focus: "MHC class antigen presentation, cytokine storm pathways, viral replication kinetics, and antimicrobial resistance."
      },
      {
        id: "med-veterinary-diagnostics",
        title: "Veterinary Medicine and Animal Health Diagnostics",
        focus: "Comparative mammalian physiology, zoonotic disease vectors, clinical veterinary anesthesia, and radiography."
      }
    ]
  },
  {
    id: "domain-business-law",
    number: 6,
    name: "Business, Economics & Law (Commerce & Governance)",
    shortName: "Business, Econ & Law",
    emoji: "💼",
    iconName: "Briefcase",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    accentColor: "#0ea5e9",
    description: "Corporate finance, econometrics, venture capital, jurisprudence, IP, and constitutional law.",
    courses: [
      {
        id: "biz-admin-strategy",
        title: "Business Administration and Strategic Management",
        focus: "Porter's Five Forces, Blue Ocean strategy, resource-based competitive advantage, and executive governance."
      },
      {
        id: "biz-fin-engineering",
        title: "Financial Engineering, Corporate Finance, and Banking",
        focus: "Black-Scholes option pricing, WACC capital structure, DCF valuation modeling, and liquidity stress testing."
      },
      {
        id: "biz-macro-micro-econ",
        title: "Macroeconomics, Microeconomics, and Econometrics",
        focus: "IS-LM monetary equilibria, consumer utility elasticity, instrumental variable regression, and game theory."
      },
      {
        id: "biz-accounting-tax",
        title: "Financial Accounting and Advanced Taxation Audit",
        focus: "GAAP/IFRS reconciliation, deferred tax assets, revenue recognition standards, and forensic audit controls."
      },
      {
        id: "biz-intl-supply-chain",
        title: "International Business and Global Supply Chain Management",
        focus: "Incoterms, tariff impact models, bullwhip effect mitigation, and multimodal freight logistics."
      },
      {
        id: "biz-venture-capital",
        title: "Entrepreneurship, Venture Capital, and Corporate Innovation",
        focus: "Cap table dilution, term sheet covenants, unit economics (LTV/CAC), and disruptive market expansion."
      },
      {
        id: "law-jurisprudence-public",
        title: "Jurisprudence, Constitutional, and Public International Law",
        focus: "Stare decisis precedent, constitutional separation of powers, treaty jurisprudence, and human rights treaties."
      },
      {
        id: "law-corporate-ip-ma",
        title: "Corporate Law, Intellectual Property, and Mergers & Acquisitions",
        focus: "Patent validity claims, anti-trust statutory merger review, fiduciary duties, and cross-border M&A contracts."
      },
      {
        id: "law-criminal-trial",
        title: "Criminal Law, Judicial Studies, and Trial Advocacy",
        focus: "Mens rea/actus reus doctrine, rules of criminal evidence, cross-examination techniques, and sentencing standards."
      }
    ]
  },
  {
    id: "domain-psychology-behavioral",
    number: 7,
    name: "Psychology & Behavioural Sciences",
    shortName: "Psychology & Behaviour",
    emoji: "🧠",
    iconName: "Brain",
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    accentColor: "#ec4899",
    description: "Cognitive architecture, lifespan development, group social dynamics, and neuro-psychometrics.",
    courses: [
      {
        id: "psych-general-foundations",
        title: "General Psychology and Foundations of Behaviour",
        focus: "Operant conditioning, psycho-biological drives, sensory perception thresholds, and personality theories."
      },
      {
        id: "psych-cognitive-memory",
        title: "Cognitive Psychology, Memory & Perception",
        focus: "Working memory executive loops, semantic schemas, dual-process reasoning, and attentional bottlenecks."
      },
      {
        id: "psych-developmental-lifespan",
        title: "Developmental Psychology & Lifespan Progression",
        focus: "Piagetian cognitive stages, attachment styles, Eriksonian psychosocial crises, and aging cognitive trajectories."
      },
      {
        id: "psych-social-group",
        title: "Social Psychology and Human Group Dynamics",
        focus: "Cognitive dissonance, conformity pressure, implicit bias schemas, bystander effects, and in-group polarization."
      },
      {
        id: "psych-neuropsych-biological",
        title: "Neuropsychology & Biological Bases of Behaviour",
        focus: "Limbic system emotional circuits, frontal lobe inhibition, hemispheric lateralization, and brain lesion analysis."
      },
      {
        id: "psych-research-psychometrics",
        title: "Research Methodologies & Quantitative Psychometrics",
        focus: "Factor analysis, Cronbach's alpha reliability, construct validity, and double-blind experimental design."
      }
    ]
  },
  {
    id: "domain-clinical-psychology",
    number: 8,
    name: "Clinical Psychology & Therapeutic Interventions",
    shortName: "Clinical Psychology",
    emoji: "🏥",
    iconName: "HeartHandshake",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
    accentColor: "#14b8a6",
    description: "DSM-5 diagnostic criteria, CBT evidence-based protocols, child interventions, and psychopharmacology.",
    courses: [
      {
        id: "clin-psych-dsm5",
        title: "Psychopathology, Diagnostic Criteria & DSM-5-TR Frameworks",
        focus: "Axis I/II differential diagnosis, affective mood disorders, psychosis spectrum criteria, and symptom taxonomy."
      },
      {
        id: "clin-psych-assessment",
        title: "Clinical Assessment, Interviewing & Psychometric Testing",
        focus: "Structured clinical interviews (SCID), MMPI-3 inventory interpretation, Wechsler scales, and risk assessments."
      },
      {
        id: "clin-psych-cbt",
        title: "Cognitive Behavioural Therapy (CBT) & Evidence-Based Interventions",
        focus: "Cognitive restructuring, behavioral exposure hierarchies, Socratic questioning, and relapse prevention protocols."
      },
      {
        id: "clin-psych-child-adolescent",
        title: "Child & Adolescent Clinical Psychology",
        focus: "Neurodevelopmental disorders (ADHD/Autism), family systems dynamics, play therapy, and pediatric interventions."
      },
      {
        id: "clin-psych-pharmacology",
        title: "Psychopharmacology & Neurotransmitters in Mental Illness",
        focus: "SSRIs, dopaminergic receptor antagonists, GABA-A receptor modulation, and pharmacodynamic interactions."
      },
      {
        id: "clin-psych-counseling-trauma",
        title: "Counseling Psychology, Crisis Intervention & Trauma Informed Care",
        focus: "EMDR trauma processing, de-escalation protocols, somatic experiencing, and boundary ethics."
      }
    ]
  },
  {
    id: "domain-healthcare-management",
    number: 9,
    name: "Healthcare Systems & Medical Management",
    shortName: "Healthcare Mgmt",
    emoji: "🏥",
    iconName: "ShieldCheck",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
    accentColor: "#06b6d4",
    description: "Epidemiological models, hospital administration, health informatics, EHR security, and medical ethics.",
    courses: [
      {
        id: "hlth-epidemiology-public",
        title: "Epidemiology, Public Health Frameworks & Global Health Systems",
        focus: "Incidence/prevalence calculations, R0 transmission modeling, pandemic surveillance, and vaccine efficacy cohorts."
      },
      {
        id: "hlth-hospital-admin",
        title: "Healthcare Administration, Operational Logistics & Hospital Management",
        focus: "Emergency bed turnover optimization, surgical supply chain JIT, Joint Commission accreditation, and staffing ratios."
      },
      {
        id: "hlth-informatics-ehr",
        title: "Health Informatics, Electronic Health Records (EHR) & Digital Data Security",
        focus: "HL7/FHIR interoperability, HIPAA cryptographic protections, DICOM imaging servers, and clinical data warehouses."
      },
      {
        id: "hlth-quality-safety",
        title: "Healthcare Quality Assessment, Patient Safety & Clinical Audits",
        focus: "Root cause analysis (RCA), sentinel event tracking, hospital-acquired infection reduction, and lean care pathways."
      },
      {
        id: "hlth-ethics-jurisprudence",
        title: "Medical Ethics, Bioethics, and Healthcare Jurisprudence",
        focus: "Autonomy, beneficence, institutional review boards (IRB), surrogate consent, and medical malpractice law."
      },
      {
        id: "hlth-economics-insurance",
        title: "Health Economics, Insurance Models & Clinical Resource Allocation",
        focus: "QALY metrics, capitation vs fee-for-service, DRG reimbursement formulas, and pharmacy benefit economics."
      }
    ]
  },
  {
    id: "domain-hrm-culture",
    number: 10,
    name: "Human Resource Management & Organizational Culture",
    shortName: "HR & Culture",
    emoji: "👥",
    iconName: "Users",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
    accentColor: "#6366f1",
    description: "Workforce analytics, executive talent acquisition, compensation architectures, and labor law mediation.",
    courses: [
      {
        id: "hr-strategic-planning",
        title: "Strategic Human Resource Planning & Workforce Analytics",
        focus: "Headcount predictive modeling, skills gap matrix, employee attrition algorithms, and succession planning."
      },
      {
        id: "hr-talent-acquisition",
        title: "Talent Acquisition, Recruitment Mechanics & Candidate Onboarding",
        focus: "Competency-based behavioral interviewing, ATS optimization, employer branding, and 90-day ramp metrics."
      },
      {
        id: "hr-comp-benefits",
        title: "Compensation, Employee Benefits Architecture & Payroll Management",
        focus: "Total rewards design, Hay job grading, equity stock vesting schedules, statutory payroll taxes, and benefits."
      },
      {
        id: "hr-performance-kpis",
        title: "Performance Management Systems, KPIs & Employee Appraisals",
        focus: "OKRs vs KPIs calibration, 360-degree feedback loops, continuous coaching, and PIP remediations."
      },
      {
        id: "hr-labor-laws",
        title: "Labor Laws, Industrial Relations & Workplace Conflict Mediation",
        focus: "Collective bargaining, unfair labor practices, EEOC compliance, dispute arbitration, and union negotiations."
      },
      {
        id: "hr-org-behavior-dei",
        title: "Organizational Behaviour, Leadership Development & Diversity, Equity, and Inclusion (DEI)",
        focus: "Transformational leadership, psychological safety, cultural transformation, and systemic equity metrics."
      }
    ]
  },
  {
    id: "domain-digital-marketing",
    number: 11,
    name: "Digital Marketing & Growth Engineering",
    shortName: "Digital Marketing",
    emoji: "📈",
    iconName: "TrendingUp",
    gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    accentColor: "#f97316",
    description: "Search engine architectures, paid media ROAS funnels, CRO statistical testing, and viral growth loops.",
    courses: [
      {
        id: "mktg-seo-algorithms",
        title: "Search Engine Optimization (SEO Architectures & Core Algorithms)",
        focus: "Search engine crawl budgets, Core Web Vitals, semantic schema markup, backlink authority graphs, and SERP CTR."
      },
      {
        id: "mktg-ppc-paid-media",
        title: "Pay-Per-Click Advertising (PPC, Google Ads & Paid Media Funnels)",
        focus: "Auction bid algorithms (tCPA/tROAS), Quality Score mechanics, audience retargeting funnels, and creative fatigue."
      },
      {
        id: "mktg-social-media",
        title: "Social Media Marketing, Brand Positioning & Influencer Frameworks",
        focus: "Organic algorithmic reach, viral hook architectures, brand archetype positioning, and affiliate contract models."
      },
      {
        id: "mktg-cro-analytics",
        title: "Conversion Rate Optimization (CRO), A/B Testing & Web Analytics",
        focus: "Bayesian vs frequentist split-testing, user session heatmap analytics, checkout friction reduction, and cohorts."
      },
      {
        id: "mktg-growth-hacking",
        title: "Growth Hacking Foundations, Customer Acquisition & Retention Marketing",
        focus: "AARRR pirate funnels, product-led viral loops, cohort retention curves, churn prediction, and referral engines."
      },
      {
        id: "mktg-automation-crm",
        title: "Marketing Automation, Customer Relationship Management (CRM) Systems & Email Flows",
        focus: "Lead scoring matrix, behavioral trigger email sequences, webhook CRM sync, and deliverability reputation."
      }
    ]
  },
  {
    id: "domain-content-copywriting",
    number: 12,
    name: "Content Writing & Copywriting Arts",
    shortName: "Copywriting Arts",
    emoji: "✍️",
    iconName: "Feather",
    gradient: "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)",
    accentColor: "#e11d48",
    description: "Direct response persuasion, long-form SEO whitepapers, technical documentation, and UX microcopy.",
    courses: [
      {
        id: "copy-professional-direct",
        title: "Professional Copywriting, Persuasive Writing & Direct Response Advertising",
        focus: "AIDA & PAS emotional frameworks, headline psychological hooks, objection preemption, and call-to-action urgency."
      },
      {
        id: "copy-longform-whitepapers",
        title: "Long-form Content Writing (SEO Blogs, Whitepapers & Case Studies)",
        focus: "Deep research synthesis, narrative pacing, executive summary structure, and thought leadership journalism."
      },
      {
        id: "copy-technical-docs",
        title: "Technical Writing, Documentation Architecture & API Guide Construction",
        focus: "Diátaxis framework (tutorials, how-to, reference, explanation), OpenAPI specs, markdown schemas, and code clarity."
      },
      {
        id: "copy-scriptwriting-media",
        title: "Scriptwriting for Digital Media, Video Concepts & Narrative Storyboarding",
        focus: "Three-act video pacing, visual-auditory sync, high-retention opening hooks, and commercial dialogue delivery."
      },
      {
        id: "copy-editorial-brand",
        title: "Editorial Mechanics, Proofreading, Brand Voice & Style Guide Consistency",
        focus: "Chicago Manual of Style rules, corporate brand lexicon governance, syntactic flow, and zero-defect proofreading."
      },
      {
        id: "copy-ux-writing-microcopy",
        title: "UX Writing, Microcopy & App Interface Text Optimization",
        focus: "Cognitive error message empathy, onboarding tooltip reduction, empty states, and internationalized localized strings."
      }
    ]
  },
  {
    id: "domain-arts-humanities",
    number: 13,
    name: "Arts, Humanities & Design (Culture & Expression)",
    shortName: "Arts & Humanities",
    emoji: "🎨",
    iconName: "Palette",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
    accentColor: "#a855f7",
    description: "World historiography, classical epistemology, comparative linguistics, literature, and studio fine arts.",
    courses: [
      {
        id: "arts-world-history",
        title: "World History, Historiography, and Archeological Research",
        focus: "Primary source criticism, stratigraphic archaeological analysis, civilizations collapse dynamics, and global trade."
      },
      {
        id: "arts-philosophy-ethics",
        title: "Epistemology, Applied Ethics, and Classical Philosophy",
        focus: "Socratic inquiry, Kantian deontology vs utilitarianism, virtue ethics, and truth verification epistemologies."
      },
      {
        id: "arts-linguistics-phonetics",
        title: "Linguistics, Phonetics, and Comparative Language Structures",
        focus: "International Phonetic Alphabet (IPA), Chomskyan universal grammar, morphological parsing, and etymological drift."
      },
      {
        id: "arts-creative-writing",
        title: "Creative Writing, Literature, and Comparative Letters",
        focus: "Voice cadence, thematic subtext, worldbuilding consistency, metaphor construction, and poetic meter."
      },
      {
        id: "arts-journalism-media",
        title: "Journalism, Broadcast Media, and Strategic Mass Communication",
        focus: "Investigative source verification, libel defense, broadcast news structuring, and media ethics."
      },
      {
        id: "arts-fine-arts-painting",
        title: "Fine Arts, Studio Painting, and Sculpture Dynamics",
        focus: "Color theory (Munsell system), chiaroscuro value scales, human anatomical proportions, and spatial sculpture balance."
      }
    ]
  },
  {
    id: "domain-microsoft-workplace",
    number: 14,
    name: "Microsoft Modern Workplace & Office Productivity",
    shortName: "MS Modern Workplace",
    emoji: "🗂️",
    iconName: "FileSpreadsheet",
    gradient: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    accentColor: "#2563eb",
    description: "Word automation, Excel Power Query/VBA, PowerPoint visual storytelling, and Microsoft 365 administration.",
    courses: [
      {
        id: "ms-word-mastery",
        title: "Microsoft Word Mastery (Basic, Advanced Documents & Automation)",
        focus: "Style sheet hierarchies, XML field codes, automated cross-referencing, macro automations, and document security."
      },
      {
        id: "ms-excel-analytics",
        title: "Microsoft Excel Data Analytics (Formulas, PivotTables, Power Query & VBA)",
        focus: "XLOOKUP/INDEX-MATCH, dynamic array formulas, Power Query M-code transformations, DAX modeling, and VBA scripts."
      },
      {
        id: "ms-powerpoint-design",
        title: "Microsoft PowerPoint Design (Dynamic Presentations & Visual Storytelling)",
        focus: "Slide master layouts, vector shape boolean operations, custom morph transitions, and executive data presentation."
      },
      {
        id: "ms-access-database",
        title: "Microsoft Access Database Design (Relational Structuring & SQL Queries)",
        focus: "Third normal form (3NF), relational referential integrity, parameter queries, SQL view expressions, and form logic."
      },
      {
        id: "ms-outlook-efficiency",
        title: "Microsoft Outlook Efficiency (Advanced Communication & Time Management)",
        focus: "Exchange mail rules, Quick Steps automation, calendar time-blocking algorithms, and archive policy management."
      },
      {
        id: "ms-project-fundamentals",
        title: "Microsoft Project Fundamentals (Gantt Charts, Resource Allocation & Tracking)",
        focus: "Critical path method (CPM), work breakdown structures (WBS), resource leveling, and baseline earned value analysis."
      },
      {
        id: "ms-visio-architecture",
        title: "Microsoft Visio Architecture (Flowcharts, Process Mapping & Structural Schematics)",
        focus: "BPMN 2.0 notation, data-linked visual schematics, network topology diagrams, and custom stencil design."
      },
      {
        id: "ms-365-collaboration",
        title: "Microsoft 365 Collaboration Engine (Teams, SharePoint & OneDrive Administration)",
        focus: "Tenant identity management, SharePoint site collection architecture, retention DLP policies, and Teams governance."
      }
    ]
  },
  {
    id: "domain-azure-cloud",
    number: 15,
    name: "Microsoft Azure Cloud Infrastructure (AZ Solutions)",
    shortName: "Azure Cloud (AZ)",
    emoji: "☁️",
    iconName: "Cloud",
    gradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    accentColor: "#0284c7",
    description: "AZ-900 cloud core, AZ-104 administration, AZ-305 solutions architecting, AZ-500 security, and AZ-700 networking.",
    courses: [
      {
        id: "az-900-fundamentals",
        title: "Microsoft Azure Fundamentals (Cloud Concepts & Architecture — AZ-900)",
        focus: "IaaS/PaaS/SaaS trade-offs, Azure regions & availability zones, resource groups, SLA calculators, and TCO analysis."
      },
      {
        id: "az-104-administrator",
        title: "Microsoft Azure Administrator Core (Virtual Networks, Storage & Compute — AZ-104)",
        focus: "ARM templates, Azure VM scale sets, blob storage tiering, Azure AD RBAC permissions, and Azure Monitor alerts."
      },
      {
        id: "az-305-architect",
        title: "Microsoft Azure Solutions Architect Design (Enterprise Cloud Infrastructure — AZ-305)",
        focus: "Well-Architected Framework pillars, disaster recovery RTO/RPO designs, microservice patterns, and cost governance."
      },
      {
        id: "az-500-security",
        title: "Microsoft Azure Security Engineering (Identity, Threat Protection & Encryptions — AZ-500)",
        focus: "Microsoft Entra ID conditional access, Key Vault HSM key protection, Microsoft Defender for Cloud, and NSG rules."
      },
      {
        id: "az-700-networking",
        title: "Microsoft Azure Network Engineering (Hybrid Architectures & Routing Systems — AZ-700)",
        focus: "Azure ExpressRoute, Virtual WAN hubs, Application Gateway WAF, private endpoints, and BGP route peering."
      }
    ]
  },
  {
    id: "domain-microsoft-ai-data",
    number: 16,
    name: "Microsoft Data, AI & Copilot Systems (DP & AI Solutions)",
    shortName: "MS Data & Copilot",
    emoji: "🤖",
    iconName: "Cpu",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
    accentColor: "#7c3aed",
    description: "AI-900, AI-102 NLP/Vision pipelines, DP-203 Synapse/Fabric, PL-300 Power BI, and Microsoft Copilot Studio.",
    courses: [
      {
        id: "ai-900-fundamentals",
        title: "Microsoft Azure AI Fundamentals (Machine Learning & Cognitive Services — AI-900)",
        focus: "Computer vision classifiers, Azure OpenAI service basics, conversational agents, and responsible AI ethics."
      },
      {
        id: "ai-102-engineer",
        title: "Microsoft Azure AI Engineer Associate (Custom NLP & Computer Vision Pipelines — AI-102)",
        focus: "Azure AI Search semantic rankers, fine-tuning LLMs, Document Intelligence optical recognition, and vector stores."
      },
      {
        id: "dp-900-fundamentals",
        title: "Microsoft Azure Data Fundamentals (Relational & Non-Relational Storage — DP-900)",
        focus: "Azure Cosmos DB multi-model APIs, Azure SQL Database elastic pools, data lake storage architectures, and ingestion."
      },
      {
        id: "dp-203-engineering",
        title: "Microsoft Azure Data Engineering (Synapse Analytics, Fabric & Data Factory — DP-203)",
        focus: "Delta Lake parquet formats, PySpark transformations, Azure Synapse dedicated SQL pools, and medallion architectures."
      },
      {
        id: "dp-100-datascience",
        title: "Microsoft Azure Data Data Science Operations (Training & Deploying Models — DP-100)",
        focus: "Azure ML pipelines, MLflow model tracking, automated hyperparameter tuning, and containerized endpoint inference."
      },
      {
        id: "pl-300-powerbi",
        title: "Microsoft Power BI Data Analysis (Data Modeling & Interactive Dashboards — PL-300)",
        focus: "Star schema relationships, advanced DAX time-intelligence functions, row-level security (RLS), and dashboard UX."
      },
      {
        id: "ms-copilot-engineering",
        title: "Microsoft Copilot Engineering (Custom Agents & LLM Extensibility Studio)",
        focus: "Microsoft Copilot Studio declarative agents, plugin manifests, Microsoft Graph connectors, and ground truth RAG."
      }
    ]
  },
  {
    id: "domain-power-platform",
    number: 17,
    name: "Microsoft Power Platform & Dynamics 365 (Low-Code & ERP)",
    shortName: "Power Platform & ERP",
    emoji: "⚙️",
    iconName: "Settings",
    gradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    accentColor: "#d97706",
    description: "PL-900 innovation, PL-400 Canvas/Model-driven apps, PL-500 RPA automations, and Dynamics 365 ERP infrastructure.",
    courses: [
      {
        id: "pl-900-fundamentals",
        title: "Microsoft Power Platform Fundamentals (App Innovation Core — PL-900)",
        focus: "Dataverse business rules, Power Apps studio essentials, Power Pages external portals, and governance center."
      },
      {
        id: "pl-400-developer",
        title: "Microsoft Power Apps Developer (Custom Canvas & Model-Driven Solutions — PL-400)",
        focus: "PowerFX expressions, PCF custom TypeScript components, Dataverse plugins in C#, and Azure service bus integration."
      },
      {
        id: "pl-500-automate",
        title: "Microsoft Power Automate Engineering (Robotic Process Automation Workflow Solutions — PL-500)",
        focus: "Desktop RPA unattended flows, error catch scopes, optical UI element selectors, and scheduled cloud flow queues."
      },
      {
        id: "d365-supply-chain",
        title: "Microsoft Dynamics 365 Supply Chain Management (Enterprise Resource Planning)",
        focus: "Master planning MRP runs, warehouse management advanced routing, inventory valuation methods, and procurement."
      },
      {
        id: "d365-finance-ops",
        title: "Microsoft Dynamics 365 Finance and Operations Infrastructure",
        focus: "General ledger chart of accounts, multi-currency consolidations, X++ development, and lifecycle services (LCS)."
      }
    ]
  },
  {
    id: "domain-media-postproduction",
    number: 18,
    name: "Media Editing & Visual Post-Production",
    shortName: "Media & Post-Prod",
    emoji: "🎬",
    iconName: "Film",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    accentColor: "#ec4899",
    description: "NLE video cutting, color grading ACES workflows, After Effects motion graphics, and Nuke/Blender 3D VFX.",
    courses: [
      {
        id: "media-nle-editing",
        title: "Non-Linear Video Editing (Premiere Pro, DaVinci Resolve, Final Cut)",
        focus: "J-cut/L-cut narrative pacing, multi-track audio synchronization, three-point editing, and proxy workflow pipelines."
      },
      {
        id: "media-color-grading",
        title: "Advanced Color Grading, Color Science & Digital Intermediate (DI)",
        focus: "ACES color space management, logarithmic camera profiles, waveform/vectorscope balance, and LUT design."
      },
      {
        id: "media-motion-graphics",
        title: "Motion Graphics, Titling & Composition (After Effects)",
        focus: "Speed graph easing curves, kinetic typography, shape layer math expressions, and 3D camera tracker integration."
      },
      {
        id: "media-3d-vfx-compositing",
        title: "3D Visual Effects (VFX) & Green Screen Compositing (Nuke, Blender)",
        focus: "Node-based chromakeying, rotoscoping clean plates, point-cloud 3D matchmoving, and deep compositing passes."
      },
      {
        id: "media-multicam-broadcast",
        title: "Multi-Camera Production, Live Switching & Broadcast Technical Directing",
        focus: "ATEM video switchers, genlock synchronization, tally systems, intercom protocol, and broadcast transmission standards."
      },
      {
        id: "media-dit-codec",
        title: "Digital Imaging Technician (DIT) Workflows & Codec Optimization",
        focus: "Checksum verified offloading (Silverstack), RAW sensor debayering, ProRes vs H.265 compression, and bitrates."
      }
    ]
  },
  {
    id: "domain-sound-engineering",
    number: 19,
    name: "Sound Engineering & Audio Arts",
    shortName: "Sound & Audio Arts",
    emoji: "🎛️",
    iconName: "Sliders",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    accentColor: "#06b6d4",
    description: "Signal routing, studio acoustics, Pro Tools DAW mastery, mixing/mastering, Foley, and Dolby Atmos spatial audio.",
    courses: [
      {
        id: "audio-fundamentals-signal",
        title: "Audio Engineering Fundamentals & Signal Flow",
        focus: "Decibel sound pressure levels (SPL), balanced vs unbalanced impedance, gain staging, and Nyquist-Shannon sampling."
      },
      {
        id: "audio-studio-recording",
        title: "Studio Recording Techniques & Acoustic Engineering",
        focus: "Microphone polar patterns (Cardioid/Figure-8), Blumlein stereo pairs, room mode resonances, and bass traps."
      },
      {
        id: "audio-daw-mastery",
        title: "Digital Audio Workstations (DAW Mastery — Pro Tools, Logic Pro, Ableton Live)",
        focus: "MIDI routing automation, session management, low-latency audio buffer configuration, and plugin chain pipelines."
      },
      {
        id: "audio-mixing-mastering",
        title: "Audio Mixing & Audio Mastering Engineering",
        focus: "Parametric EQ subtractive carving, multiband dynamic compression, LUFS loudness standards, and stereo imaging."
      },
      {
        id: "audio-live-sound",
        title: "Live Sound Reinforcement & Concert PA Systems Tuning",
        focus: "Line array speaker dispersion, feedback notch filtering, front-of-house (FOH) console mixing, and delay towers."
      },
      {
        id: "audio-foley-film",
        title: "Foley Engineering, Sound Design & Audio Post-Production for Film",
        focus: "Prop sound synthesis, dialogue ADR synchronization, acoustic convolution reverbs, and ambient soundscapes."
      },
      {
        id: "audio-spatial-dolby",
        title: "Spatial Audio Creation (Dolby Atmos & Binaural VR Mixing)",
        focus: "3D audio bed tracks, 128-channel spatial panning objects, head-related transfer functions (HRTF), and binaural rendering."
      }
    ]
  },
  {
    id: "domain-communication-rhetoric",
    number: 20,
    name: "Professional Communication & Rhetoric",
    shortName: "Communication & Rhetoric",
    emoji: "🗣️",
    iconName: "Mic",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    accentColor: "#f43f5e",
    description: "Executive speaking delivery, high-stakes negotiation, cross-cultural dynamics, and crisis PR rhetoric.",
    courses: [
      {
        id: "comm-public-speaking",
        title: "Public Speaking, Stage Presentation & Rhetorical Delivery",
        focus: "Aristotelian ethos/pathos/logos, vocal inflection pacing, non-verbal stage kinesics, and persuasive storytelling."
      },
      {
        id: "comm-executive-business",
        title: "Executive Business Communication & Corporate Correspondence",
        focus: "Minto Pyramid principle, executive briefing summaries, stakeholder alignment diplomacy, and board memos."
      },
      {
        id: "comm-negotiation-conflict",
        title: "Negotiation Tactics, Conflict Resolution & Mediation Skills",
        focus: "Harvard principled negotiation (BATNA/ZOPA), tactical empathy, anchoring biases, and mediation frameworks."
      },
      {
        id: "comm-cross-cultural",
        title: "Cross-Cultural Communication & Global Workplace Dynamics",
        focus: "High-context vs low-context cultures, Hofstede dimensional index, indirect critique decoding, and global team cohesion."
      },
      {
        id: "comm-interpersonal-listening",
        title: "Interpersonal Dynamics & Active Listening Methodologies",
        focus: "Reflective paraphrasing, non-defensive inquiry, emotional intelligence micro-expressions, and psychological safety."
      },
      {
        id: "comm-technical-report",
        title: "Technical Report Writing & Complex Documentation Architecture",
        focus: "Information hierarchy, executive abstract formulation, statistical data visual labeling, and compliance documentation."
      },
      {
        id: "comm-crisis-pr",
        title: "Crisis Communication Management & Public Relations Rhetoric",
        focus: "Holding statement rapid response, reputational mitigation, media press briefing tactics, and transparent remediation."
      }
    ]
  },
  {
    id: "domain-fashion-design",
    number: 21,
    name: "Fashion Designing & Apparel Aesthetics",
    shortName: "Fashion & Apparel",
    emoji: "👗",
    iconName: "Sparkles",
    gradient: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
    accentColor: "#ec4899",
    description: "Concept illustration, textile science fiber chemistry, CLO 3D simulation, haute couture history, and merchandising.",
    courses: [
      {
        id: "fash-illustration-concept",
        title: "Fashion Illustration, Mood Board Curation & Concept Design",
        focus: "9-head croquis figure proportions, fabric drape rendering, seasonal color mood curation, and collection design."
      },
      {
        id: "fash-textile-science",
        title: "Textile Science, Fabric Manipulation & Fiber Properties",
        focus: "Weft/warp weave architectures, tensile fiber tensile strength, chemical dyeing bonds, smocking, and pleating mechanics."
      },
      {
        id: "fash-digital-clo3d",
        title: "Digital Fashion Design (CLO 3D, Adobe Illustrator for Apparel)",
        focus: "3D virtual avatar garment draping, virtual stress strain maps, vector tech pack flat sketches, and digital rendering."
      },
      {
        id: "fash-history-couture",
        title: "History of Global Fashion, Costume Evolution & Haute Couture",
        focus: "Historical silhouette timelines (Belle Époque to Modernism), couture atelier traditions, and subcultural fashion movements."
      },
      {
        id: "fash-merchandising-retail",
        title: "Fashion Merchandising, Trend Forecasting & Retail Management",
        focus: "WGSN trend forecasting frameworks, open-to-buy retail math, seasonal assortment matrices, and margin markups."
      },
      {
        id: "fash-sustainable-circular",
        title: "Sustainable Fashion Systems & Circular Material Economy",
        focus: "Life cycle assessment (LCA), closed-loop textile recycling, zero-waste cutting patterns, and organic certifications."
      }
    ]
  },
  {
    id: "domain-tailoring-patternmaking",
    number: 22,
    name: "Tailoring, Patternmaking & Garment Construction",
    shortName: "Tailoring & Patterns",
    emoji: "🗱",
    iconName: "Scissors",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    accentColor: "#8b5cf6",
    description: "Pattern drafting, bespoke hand-stitching, industrial sewing machines, grading systems, and formalwear construction.",
    courses: [
      {
        id: "tailor-pattern-drafting",
        title: "Pattern Drafting, Draping & Technical Garment Spec Architecture",
        focus: "Sloper/block drafting, dart rotation geometries, muslin dress form draping, and technical seam allowances."
      },
      {
        id: "tailor-bespoke-handstitch",
        title: "Bespoke Tailoring, Structural Interfacing & Fine Hand-Stitching",
        focus: "Floating horsehair canvas chest pieces, pad stitching lapels, pic stitching, hand-bound buttonholes, and sleeve head rolls."
      },
      {
        id: "tailor-industrial-machines",
        title: "Industrial Sewing Machine Operations & Garment Construction Physics",
        focus: "Lockstitch bobbin tension balance, overlock differential feed dogs, needle penetration physics, and presser foot calibrations."
      },
      {
        id: "tailor-sizing-grading",
        title: "Sizing Standardization, Grading Systems & Fit Optimization Analysis",
        focus: "Cartesian grade rule tables, multi-size nesting, posture asymmetry adjustments (swayback/sloping shoulder), and ease ratios."
      },
      {
        id: "tailor-alterations-repair",
        title: "Alterations Mechanics, Deconstruction & Structural Garment Repair",
        focus: "Jacket collar lowering, trouser crotch rise restructuring, lining replacement, and invisible mending techniques."
      },
      {
        id: "tailor-haute-couture-assembly",
        title: "Haute Couture Assembly & Formalwear Construction (Bridal/Suits)",
        focus: "Internal spiral steel boned corsetry, French seams, hand-applied organza underpinnings, and luxury garment construction."
      }
    ]
  },
  {
    id: "domain-western-music",
    number: 23,
    name: "Western Music Theory & Performance",
    shortName: "Western Music Theory",
    emoji: "🎼",
    iconName: "Music",
    gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
    accentColor: "#6366f1",
    description: "Classical notation, four-part voice leading, vocal opera, orchestral instruments, jazz harmony, and score analysis.",
    courses: [
      {
        id: "mus-classical-theory-notation",
        title: "Classical Western Music Theory, Notation & Solfège Dictation",
        focus: "Grand staff clefs, major/minor circle of fifths, rhythmic subdivisions, intervals, and movable-do solfège ear training."
      },
      {
        id: "mus-counterpoint-harmony",
        title: "Counterpoint Mechanics, Four-Part Harmony & Orchestral Composition",
        focus: "Species counterpoint rules, voice leading forbidden parallel fifths, roman numeral harmonic analysis, and modulation."
      },
      {
        id: "mus-vocal-performance-opera",
        title: "Western Vocal Performance, Opera Stylings & Choral Conducting",
        focus: "Appoggio diaphragmatic breath support, formant vowel placement, Bel Canto articulation, and choral conducting patterns."
      },
      {
        id: "mus-orchestral-instruments",
        title: "Orchestral Instrumentation (Piano, Violin, Woodwinds, Brass Mechanics)",
        focus: "Acoustic resonance physics, string bowing harmonics, brass valve lip mechanics, and orchestral timbral blend."
      },
      {
        id: "mus-contemporary-jazz-blues",
        title: "Contemporary Western Genres (Jazz Improvisation, Blues & Pop Performance)",
        focus: "ii-V-I progressions, tritone substitutions, modal interchange, altered scales, and blue note expressive microtones."
      },
      {
        id: "mus-score-analysis-directing",
        title: "Score Analysis, Sight-Reading Methodologies & Musical Directing",
        focus: "Full orchestral score transpositions, rehearsal conducting semantics, Schenkerian structural analysis, and sight-reading."
      }
    ]
  },
  {
    id: "domain-indian-classical-music",
    number: 24,
    name: "Indian Classical Musicology (Hindustani & Carnatic)",
    shortName: "Indian Classical Music",
    emoji: "🪕",
    iconName: "Radio",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    accentColor: "#f59e0b",
    description: "Raga and Thaat theory, Tala mathematical rhythmic cycles, Khayal, Carnatic Kritis, Sitar, and Tabla metric accents.",
    courses: [
      {
        id: "indmus-raga-theory-thaat",
        title: "Foundation of Raga Theory, Thaat Systems & Melakarta Taxonomies",
        focus: "Bhatkhande 10 Thaat system, 72 Melakarta scheme (Katapayadi sankhya), Vadi/Samvadi notes, Pakad phrases, and Arohana/Avarohana."
      },
      {
        id: "indmus-tala-layakari",
        title: "Tala Frameworks, Layakari Rhythms & Complex Metric Math Cycles",
        focus: "Teental 16-beat structure, Adi Tala, Sam/Khali dynamics, Layakari speeds (Vilambit, Madhyam, Drut), and Tihai mathematical formulas."
      },
      {
        id: "indmus-hindustani-vocal",
        title: "Hindustani Vocal Traditions (Khayal, Dhrupad, Thumri Styles)",
        focus: "Alaap improvisation, Bandish poetic composition, Meend glides, Gamak oscillations, and Dhrupad Nom-Tom syllables."
      },
      {
        id: "indmus-carnatic-vocal",
        title: "Carnatic Vocal Systems (Kriti, Varnam, Ragam Tanam Pallavi Compositions)",
        focus: "Thyagaraja/Dikshitar/Syama Sastri trinities, Kalpanaswaram calculations, Gamaka varieties (Kampita, Nokku), and Pallavi improvisation."
      },
      {
        id: "indmus-classical-instrumentation",
        title: "Classical Indian Instrumentation (Sitar, Sarod, Veena, Flute Performance)",
        focus: "Sympathetic resonance strings (Tarab), Meend fret bending up to 5 semitones, Jhala speed stroke techniques, and Bansuri blowing angles."
      },
      {
        id: "indmus-percussion-tabla-mridangam",
        title: "Percussion Mastery (Tabla Composition Analysis, Mridangam Metric Accents)",
        focus: "Dayan/Bayan Syllables (Dha, Dhin, Ge, Na), Peshkar, Kaida theme with variations, Rela cascades, and Mridangam Korvai mathematics."
      }
    ]
  },
  {
    id: "domain-languages-literature",
    number: 25,
    name: "Languages, Linguistics & Literature",
    shortName: "Languages & Literature",
    emoji: "📖",
    iconName: "BookOpen",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    accentColor: "#10b981",
    description: "Autobiographical narratives, literary prose, applied grammar (past tense, syntax), compound words, and note-making study skills.",
    courses: [
      {
        id: "course-lesson1-sunil-gavaskar",
        title: "Lesson 1: My First Steps - Sunil Gavaskar",
        focus: "Autobiographical analysis of Sunil Gavaskar's childhood, hospital mix-up at birth saved by Nan-kaka, playing tennis-ball cricket with his mother, compound words, simple past tense grammar, and note-making study skills."
      },
      {
        id: "lit-compound-words-morphology",
        title: "Applied Linguistics: Compound Words, Phonetics & Morphology",
        focus: "Open, hyphenated, and closed compound word structures, morphological derivation, and vocabulary enrichment."
      },
      {
        id: "lit-grammar-tenses-syntax",
        title: "English Grammar Mastery: Past Tense, Habitual 'Would/Used To' & Syntax",
        focus: "Regular and irregular past tense verbs, negative and interrogative transformations with 'did', and syntactic structure."
      },
      {
        id: "lit-study-skills-notemaking",
        title: "Advanced Study Skills: Note-Making, Abbreviations & Textual Summaries",
        focus: "Hierarchical numbering, indenting, standard abbreviations, and condensing prose into exam revision notes."
      }
    ]
  }
];

export function getAllCoursesFlat() {
  const list = [];
  COURSE_DOMAINS.forEach(domain => {
    domain.courses.forEach(c => {
      list.push({
        ...c,
        domainId: domain.id,
        domainName: domain.name,
        domainShortName: domain.shortName,
        emoji: domain.emoji,
        gradient: domain.gradient,
        accentColor: domain.accentColor
      });
    });
  });
  return list;
}

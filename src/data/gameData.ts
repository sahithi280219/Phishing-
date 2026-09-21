import { RoundInfo, PhishMessage, DialogueStep, EvidenceItem, EscapeMissionClue } from '../types';

export const EVENT_DETAILS = {
  name: 'PHISH HUNT',
  tagline: 'Spot the Trap. Stay Safe.',
  event: 'Cyber Awareness Phish Hunt',
  date: '28-09-2026',
  mode: 'Offline College Event',
  builtBy: 'SAHITHI',
  defaultEventCode: 'PHISH26',
};

export const ROUNDS_INFO: RoundInfo[] = [
  {
    number: 1,
    title: 'ROUND 1 — EASY',
    subtitle: 'Header Forensics & Indicator Spotting (Q1–Q8)',
    difficulty: '★★☆☆☆',
    durationSec: 300, // 5 minutes
    points: 80,
    description: 'Investigate 8 realistic messages (Q1–Q8) including fake internships, advance-fee scholarships, OTP chat requests, and Trojan executables. Identify the suspicious mistakes using keyword forensics (+10 correct / -5 wrong).',
  },
  {
    number: 2,
    title: 'ROUND 2 — MEDIUM',
    subtitle: 'Social Engineering & Authentication Traps (Q9–Q14)',
    difficulty: '★★★☆☆',
    durationSec: 420, // 7 minutes
    points: 120,
    description: 'Face 6 escalating scenarios (Q9–Q14) featuring cloned Microsoft 365 logins, hijacked friend emergency loans, fake cloud storage alerts, UPI refund collect-requests, and MFA push coercion (+20 correct / -10 wrong).',
  },
  {
    number: 3,
    title: 'ROUND 3 — MEDIUM → HARD',
    subtitle: 'Advanced Domain & Protocol Forensics (Q15–Q20)',
    difficulty: '★★★★☆',
    durationSec: 480, // 8 minutes
    points: 150,
    description: 'Analyze 6 deceptive vectors (Q15–Q20) including Aadhaar document verification scams, vishing calls, fest payment links, adversary-in-the-middle domain spoofing, malicious OAuth apps, and Reply-To header diverters (+20 to +30 pts).',
  },
  {
    number: 4,
    title: 'ROUND 4 — HARD / FINAL',
    subtitle: 'BEC, Session Hijacking & Coordinated Containment (Q21–Q25)',
    difficulty: '★★★★★',
    durationSec: 600, // 10 minutes
    points: 150,
    description: 'The master challenge (Q21–Q25): thwart unsolicited account recovery calls, macro-enabled .docm weaponized documents, session-token theft portals, Business Email Compromise (BEC), and contain a full coordinated multi-stage attack (+30 correct / -13 wrong).',
  },
];

// Advanced Round 1 Data: Realistic Scenarios with Multi-Indicator Analysis & Distractors
export interface AdvancedPhishScenario {
  id: string;
  title: string;
  category: string;
  senderDisplay: string;
  senderAddress: string;
  replyTo: string;
  returnPath: string;
  authResults: string;
  subject: string;
  receivedTime: string;
  isPhishing: boolean;
  scenarioContext: string;
  fullBodyHtml: string;
  // Multiple choice indicators with genuine threats and plausible distractors
  indicators: Array<{
    id: string;
    text: string;
    isCorrectIndicator: boolean;
    explanation: string;
  }>;
  // Forensic Risk Analysis Question
  primaryRiskQuestion: {
    question: string;
    options: Array<{ id: string; text: string }>;
    correctOptionId: string;
    explanation: string;
  };
  // Defensive Containment Action Question
  defensiveActionQuestion: {
    question: string;
    options: Array<{ id: string; text: string }>;
    correctOptionId: string;
    explanation: string;
  };
}

export const ADVANCED_ROUND_1_SCENARIOS: AdvancedPhishScenario[] = [
  {
    id: 'scen_1',
    title: 'Apex Bank KYC Re-Verification',
    category: 'Financial Credential Harvesting',
    senderDisplay: 'Apex National Bank Alerts',
    senderAddress: 'compliance-desk@apexbank-secure-auth.org',
    replyTo: 'no-reply@apexbank-secure-auth.org',
    returnPath: 'bounce-handler@mail-relay-node42.net',
    authResults: 'spf=softfail (sender IP 185.220.101.5 is not designated by apexbank.com) dkim=none',
    subject: 'URGENT: Temporary Hold on Account Ending in #4092 - Action Required',
    receivedTime: 'Today, 08:42 AM',
    isPhishing: true,
    scenarioContext: 'An authentic-looking banking alert citing an international IP login and a pending transaction freeze.',
    fullBodyHtml: `Dear Customer,\n\nOur automated fraud engine detected an unauthorized login attempt from IP 185.220.101.5 (Amsterdam, NL) accessing your NetBanking portal. A pending transaction of ₹48,500 has been flagged and placed on a 2-hour temporary hold.\n\nTo safeguard your funds and prevent permanent suspension of electronic debit services, RBI guidelines require immediate KYC re-validation via our encrypted emergency portal.\n\nPlease visit: http://apexbank.com.login-verify-account.xyz/auth/kyc to verify your registered credentials and debit card details within 120 minutes.\n\nRegards,\nCompliance & Risk Mitigation Cell\nApex National Bank (A Scheduled Commercial Bank)`,
    indicators: [
      {
        id: 'ind_1',
        text: 'The sender domain (@apexbank-secure-auth.org) is a lookalike domain, not the authentic domain (apexbank.com)',
        isCorrectIndicator: true,
        explanation: 'Attackers register lookalike domains with deceptive prefixes or suffixes to mimic financial institutions.',
      },
      {
        id: 'ind_2',
        text: 'The destination URL uses a deceptive subdomain structure (apexbank.com.login-verify-account.xyz) hosted on an insecure protocol',
        isCorrectIndicator: true,
        explanation: 'The actual domain is login-verify-account.xyz, using apexbank.com merely as a deceptive subdomain prefix.',
      },
      {
        id: 'ind_3',
        text: 'The SPF authentication check results in SOFTFAIL because the sending IP is not authorized for the bank',
        isCorrectIndicator: true,
        explanation: 'Email authentication headers show the sender failed SPF validation, confirming server impersonation.',
      },
      {
        id: 'ind_4',
        text: 'The email includes a standard corporate disclaimer stating Apex Bank is a Scheduled Commercial Bank',
        isCorrectIndicator: false,
        explanation: 'Distractor: Attackers routinely copy-paste authentic legal disclaimers and regulatory text to build superficial trust.',
      },
      {
        id: 'ind_5',
        text: 'The message references a specific pending amount (₹48,500) and an exact international IP address',
        isCorrectIndicator: false,
        explanation: 'Distractor: Specific details like transaction values and IPs are artificial pretexts designed to induce panic.',
      },
      {
        id: 'ind_6',
        text: 'Severe time constraint (120 minutes) forcing immediate action without contacting official branches',
        isCorrectIndicator: true,
        explanation: 'Artificial deadlines are psychological levers used to bypass deliberate verification and critical thinking.',
      },
    ],
    primaryRiskQuestion: {
      question: 'Which evidence provides the strongest technical reason to verify this banking alert independently?',
      options: [
        { id: 'A', text: 'The email headers indicate SPF Softfail from an unauthorized external IP (185.220.101.5) not designated by apexbank.com.' },
        { id: 'B', text: 'The alert cites an unauthorized login originating from an overseas data center in Amsterdam.' },
        { id: 'C', text: 'The email includes formal statutory banking disclaimers in the footer referencing Scheduled Commercial Bank status.' },
        { id: 'D', text: 'The notification subject line contains an emergency high-priority flag in the mail gateway.' },
      ],
      correctOptionId: 'A',
      explanation: 'Cryptographic email authentication failures (SPF Softfail) from unauthorized IP infrastructure definitively prove server impersonation.',
    },
    defensiveActionQuestion: {
      question: 'Which observation is suspicious, but technically insufficient by itself to confirm malicious intent?',
      options: [
        { id: 'A', text: 'The destination link routes users to an unencrypted plain HTTP protocol on an untrusted .xyz domain.' },
        { id: 'B', text: 'The notification imposes a tight 120-minute deadline, which genuine bank fraud algorithms occasionally enforce on frozen cards.' },
        { id: 'C', text: 'The sender display name is mapped to a newly registered non-banking TLD (.org).' },
        { id: 'D', text: 'The return-path address points to an unauthenticated offshore mail relay node.' },
      ],
      correctOptionId: 'B',
      explanation: 'Urgency alone is an indicator of pressure, but legitimate financial institutions also enforce strict freeze windows during active compromise investigations.',
    },
  },
  {
    id: 'scen_2',
    title: 'University Dean Office: Exam Clearance',
    category: 'Educational Malicious Attachment',
    senderDisplay: 'Office of Academic Affairs',
    senderAddress: 'dean-academic-office@campus-edu-portal.in',
    replyTo: 'dean-academic-office@campus-edu-portal.in',
    returnPath: 'bounce@vps-hosted-relay.ru',
    authResults: 'spf=pass (registered for campus-edu-portal.in) dkim=neutral dmarc=none',
    subject: 'Mandatory Clearance: Revised Semester Hall Ticket & Exam Dues Surcharge',
    receivedTime: 'Yesterday, 04:15 PM',
    isPhishing: true,
    scenarioContext: 'An official-looking notification warning students that their semester examination hall tickets are on hold until fee confirmation.',
    fullBodyHtml: `CIRCULAR TO ALL UNDERGRADUATE STUDENTS:\n\nFollowing the syndicate review committee meeting, an updated examination hall ticket clearance surcharge of ₹850 has been recorded for your registration number.\n\nStudents who fail to submit their fee acknowledgment before 11:59 PM today will be debarred from entering the examination hall for the forthcoming semester examinations.\n\nDownload and inspect the attached invoice document: HallTicket_Clearance_Notice_2026.pdf.exe to verify your seat assignment and payment status.\n\nOffice of the Academic Dean\nUniversity Syndicate Building`,
    indicators: [
      {
        id: 'ind_1',
        text: 'The attachment contains a dangerous double file extension (.pdf.exe) concealing an executable binary',
        isCorrectIndicator: true,
        explanation: 'Double extensions (.pdf.exe) trick users into believing a file is a harmless document when it is actually a compiled program.',
      },
      {
        id: 'ind_2',
        text: 'The sender domain (@campus-edu-portal.in) is not the official university domain (@campus.edu.in)',
        isCorrectIndicator: true,
        explanation: 'Lookalike academic domain configured to fool busy students into assuming it is internal university correspondence.',
      },
      {
        id: 'ind_3',
        text: 'Extreme penalty threat (debarred from semester examinations) to induce irrational panic',
        isCorrectIndicator: true,
        explanation: 'Threatening academic debarment exploits high anxiety surrounding exam eligibility to bypass caution.',
      },
      {
        id: 'ind_4',
        text: 'The email return-path originates from an offshore mail relay server (.ru VPS)',
        isCorrectIndicator: true,
        explanation: 'Return-path headers expose that the message bounced through an unrelated Russian VPS hosting service.',
      },
      {
        id: 'ind_5',
        text: 'The message mentions the university Syndicate Review Committee',
        isCorrectIndicator: false,
        explanation: 'Distractor: Citing real or plausible institutional bodies is standard social engineering pretexting.',
      },
      {
        id: 'ind_6',
        text: 'The email includes formal academic terminology like "Undergraduate Students"',
        isCorrectIndicator: false,
        explanation: 'Distractor: Standard administrative greeting formats do not authenticate the security of the payload.',
      },
    ],
    primaryRiskQuestion: {
      question: 'Which technical characteristic provides decisive proof that HallTicket_Clearance_Notice_2026.pdf.exe is hostile?',
      options: [
        { id: 'A', text: 'The file payload has a compressed byte size smaller than standard institutional PDF circulars.' },
        { id: 'B', text: 'The payload employs a deceptive double extension concealing a compiled PE32 Windows executable.' },
        { id: 'C', text: 'The document timestamp matches the close of university administrative business hours.' },
        { id: 'D', text: 'The file was transmitted over a network connection lacking end-to-end PGP signing.' },
      ],
      correctOptionId: 'B',
      explanation: 'Masking executable code (.exe) behind a decoy document extension (.pdf) is a classic malware delivery vector designed to execute trojan droppers.',
    },
    defensiveActionQuestion: {
      question: 'What is the only defensible protocol when encountering this suspicious academic circular?',
      options: [
        { id: 'A', text: 'Quarantine the message, notify the campus SOC, and cross-verify dues in person at the examination cell.' },
        { id: 'B', text: 'Rename the file extension from .exe to .pdf to inspect whether the rendered text is genuine.' },
        { id: 'C', text: 'Execute the file in an isolated sandbox browser tab to inspect whether it prompts for root access.' },
        { id: 'D', text: 'Forward the attachment to student council representatives on chat apps to test if their antivirus alerts.' },
      ],
      correctOptionId: 'A',
      explanation: 'Isolating the message, alerting security teams, and verifying in-person with the campus examination cell preserves system integrity.',
    },
  },
  {
    id: 'scen_3',
    title: 'Tier-1 Tech Placement Selection',
    category: 'Employment Scams & Identity Theft',
    senderDisplay: 'CogniSys Global Talent Acquisition',
    senderAddress: 'careers-recruitment@cognisys-talent-careers.com',
    replyTo: 'hr.direct@fastmail.com',
    returnPath: 'mailer@shared-cpanel-host.org',
    authResults: 'spf=pass dkim=pass (domain cognisys-talent-careers.com)',
    subject: 'Offer of Employment: Selected for Software Engineer Intern (₹65,000/Month Stipend)',
    receivedTime: 'Today, 10:04 AM',
    isPhishing: true,
    scenarioContext: 'An unsolicited lucrative internship offer bypassing technical evaluations and requesting immediate advance fee clearance.',
    fullBodyHtml: `Dear Candidate,\n\nFollowing your profile review on campus technical placement registries, the CogniSys Global Selection Board has approved your direct appointment as a Cybersecurity Research Intern.\n\nStipend: ₹65,000 / month + Laptop Allowance\nJoining Mode: Hybrid / Campus Remote\n\nTo lock your employee ID and dispatch your corporate laptop package before onboarding closes at 5:00 PM, please complete the candidate registration form: http://cognisys-careers-portal.net/verify-identity.\n\nNote: You must submit your 12-digit Aadhaar card scan and clear the ₹950 refundable background verification badge fee.\n\nTalent Operations Team\nCogniSys Technologies International`,
    indicators: [
      {
        id: 'ind_1',
        text: 'The reply-to address (hr.direct@fastmail.com) directs responses to a free webmail service rather than corporate mail',
        isCorrectIndicator: true,
        explanation: 'Enterprise recruiters communicate through authenticated enterprise email infrastructure, not consumer Fastmail accounts.',
      },
      {
        id: 'ind_2',
        text: 'Request for upfront monetary payment ("₹950 refundable background fee") before employment begins',
        isCorrectIndicator: true,
        explanation: 'Legitimate employers never require job candidates to pay fees for background checks, laptops, or interview slots.',
      },
      {
        id: 'ind_3',
        text: 'Direct job offer with an unusually high stipend without any prior technical interviews or campus recruitment rounds',
        isCorrectIndicator: true,
        explanation: 'Too-good-to-be-true offers skipping evaluations are classic bait techniques designed to bypass skepticism.',
      },
      {
        id: 'ind_4',
        text: 'Demands unredacted government identity (full 12-digit Aadhaar scan) via an untrusted third-party web form',
        isCorrectIndicator: true,
        explanation: 'Unsolicited identity harvesting leads to identity impersonation, fraudulent loan applications, and SIM swaps.',
      },
      {
        id: 'ind_5',
        text: 'The message specifies both Hybrid and Campus Remote options',
        isCorrectIndicator: false,
        explanation: 'Distractor: Desirable modern work options are standard psychological lures to increase engagement.',
      },
      {
        id: 'ind_6',
        text: 'The email includes polite phrasing like "Talent Operations Team"',
        isCorrectIndicator: false,
        explanation: 'Distractor: Professional copywriting is easily generated or scraped from genuine job postings.',
      },
    ],
    primaryRiskQuestion: {
      question: 'Which combination of clues indicates an employment credential and advance-fee scam?',
      options: [
        { id: 'A', text: 'A hybrid work option offered alongside standard full-time campus recruitment terms.' },
        { id: 'B', text: 'Formal corporate copywriting paired with an interview scheduling request during business hours.' },
        { id: 'C', text: 'Unsolicited appointment skipping technical interviews, upfront fee solicitation, and a personal webmail reply-to.' },
        { id: 'D', text: 'A software engineering intern title combined with an industry-standard stipend estimate.' },
      ],
      correctOptionId: 'C',
      explanation: 'The convergence of unearned appointment, advance-fee demand, and personal consumer mail routing defines fraudulent recruitment operations.',
    },
    defensiveActionQuestion: {
      question: 'Which verification action must be conducted before submitting any student identity documents?',
      options: [
        { id: 'A', text: 'Confirm with the college Training & Placement Officer whether CogniSys conducted an authorized recruitment drive.' },
        { id: 'B', text: 'Submit an arbitrary 12-digit number into the online form to check if their JavaScript validates Aadhaar Verhoeff checksums.' },
        { id: 'C', text: 'Request an itemized tax invoice receipt for the ₹950 verification badge from the Fastmail recruiter.' },
        { id: 'D', text: 'Transfer the fee from a digital wallet that does not reveal bank account numbers.' },
      ],
      correctOptionId: 'A',
      explanation: 'Official college TPOs maintain the definitive master roster of authorized recruitment partners and campus drives.',
    },
  },
  {
    id: 'scen_4',
    title: 'SpeedPost Postal Consignment Hold',
    category: 'Smishing / Logistic Impersonation',
    senderDisplay: 'SpeedPost Delivery Logistics',
    senderAddress: 'tracking-update@speedpost-logistics-desk.net',
    replyTo: 'support@speedpost-logistics-desk.net',
    returnPath: 'dispatch@unmonitored-server-node.biz',
    authResults: 'spf=neutral dkim=none',
    subject: 'Action Required: Consignment #SP-99201 Return to Hub Due to Missing House Number',
    receivedTime: 'Today, 11:24 AM',
    isPhishing: true,
    scenarioContext: 'An alert claiming an urgent courier consignment is stranded and will be destroyed within 24 hours unless a nominal redelivery fee is paid.',
    fullBodyHtml: `SpeedPost Tracking Notification\n\nConsignment Number: SP-88492019-IN\nStatus: HELD AT REGIONAL SORTING FACILITY\n\nYour package cannot be delivered because the sender omitted the building/apartment number on the shipping label. The delivery courier was unable to locate your premises.\n\nPlease update your complete postal delivery address and pay the nominal ₹25 redelivery dispatch charge at: http://speedpost-parcels-readdress.info/trace\n\nIMPORTANT: Packages unverified after 24 hours will be scheduled for permanent destruction or auctioned as unclaimed freight under postal bylaws.`,
    indicators: [
      {
        id: 'ind_1',
        text: 'The sender domain (@speedpost-logistics-desk.net) is a fake commercial domain mimicking India Post (indiapost.gov.in)',
        isCorrectIndicator: true,
        explanation: 'National postal services operate exclusively on official government domains (.gov.in), never generic .net or .info domains.',
      },
      {
        id: 'ind_2',
        text: 'The tracking link (http://speedpost-parcels-readdress.info/trace) uses HTTP on an untrusted .info domain',
        isCorrectIndicator: true,
        explanation: 'Phishing infrastructure uses disposable TLDs like .info or .xyz to host payment-harvesting clones.',
      },
      {
        id: 'ind_3',
        text: 'Threat of permanent parcel destruction within 24 hours to create panic',
        isCorrectIndicator: true,
        explanation: 'Artificial urgency forces victims to hastily submit payment cards without verifying whether they ordered anything.',
      },
      {
        id: 'ind_4',
        text: 'The nominal charge of ₹25 is designed to bypass psychological payment resistance while stealing full card details and OTPs',
        isCorrectIndicator: true,
        explanation: 'Low-friction payment traps (₹25 or $1) trick victims into entering CVVs and OTPs which are hijacked in real time.',
      },
      {
        id: 'ind_5',
        text: 'The notification includes a long tracking number formatted as SP-88492019-IN',
        isCorrectIndicator: false,
        explanation: 'Distractor: Fabricated consignment IDs are generated randomly by phishing kits to appear authentic.',
      },
      {
        id: 'ind_6',
        text: 'The message mentions "regional sorting facility"',
        isCorrectIndicator: false,
        explanation: 'Distractor: Plausible logistical vocabulary is standard text filler in delivery smishing campaigns.',
      },
    ],
    primaryRiskQuestion: {
      question: 'What is the primary technical objective of the nominal ₹25 redelivery dispatch form?',
      options: [
        { id: 'A', text: 'Executing a DNS amplification reflection payload against regional sorting servers.' },
        { id: 'B', text: 'Injecting local storage cookies to exhaust browser session cache memory.' },
        { id: 'C', text: 'Operating a reverse-proxy gateway to capture complete payment cards, CVVs, and real-time OTPs.' },
        { id: 'D', text: 'Initiating an automated airfreight logistics reroute request through postal databases.' },
      ],
      correctOptionId: 'C',
      explanation: 'The nominal ₹25 form is a real-time proxy gateway that captures complete payment credentials and triggers high-value unauthorized debits.',
    },
    defensiveActionQuestion: {
      question: 'What is the recommended verification step before interacting with package alerts?',
      options: [
        { id: 'A', text: 'Submit a virtual card with a zero balance to test whether the payment gateway accepts it.' },
        { id: 'B', text: 'Inspect order histories on legitimate e-commerce accounts and query the tracking ID on indiapost.gov.in.' },
        { id: 'C', text: 'Call the local courier delivery agent who delivered a package to your residence last week.' },
        { id: 'D', text: 'Open the tracking URL in an incognito session to inspect the postal sorting hub address.' },
      ],
      correctOptionId: 'B',
      explanation: 'Verifying on authentic government/e-commerce tracking portals confirms whether a real consignment exists.',
    },
  },
  {
    id: 'scen_5',
    title: 'Campus IT Infrastructure Maintenance',
    category: 'Legitimate System Communication',
    senderDisplay: 'Campus Information Technology Center',
    senderAddress: 'it-support@campus.edu.in',
    replyTo: 'it-support@campus.edu.in',
    returnPath: 'it-support@campus.edu.in',
    authResults: 'spf=pass (IP 203.110.242.18 matches campus.edu.in) dkim=pass (signature verified) dmarc=pass',
    subject: 'Notice: Scheduled Core Wireless Network Maintenance on Saturday (02:00 AM - 04:00 AM)',
    receivedTime: 'Yesterday, 02:30 PM',
    isPhishing: false,
    scenarioContext: 'An authentic campus IT circular regarding scheduled hardware firmware updates requiring zero action from students.',
    fullBodyHtml: `Dear Students, Faculty, and Staff,\n\nPlease be advised that the Campus Information Technology Center will perform scheduled firmware maintenance and switch redundancy testing on the Block-C and Hostel-4 wireless network controllers this Saturday, 28th September 2026, between 02:00 AM and 04:00 AM.\n\nImpact:\n- Wi-Fi access in Block-C and Hostel-4 may experience intermittent 5-minute outages during this maintenance window.\n- Wired LAN access in all computer laboratories will remain fully functional.\n\nAction Required: NONE. Our systems will automatically reconnect your devices upon maintenance completion.\n\nNo passwords, account credentials, or configuration changes are required. For any inquiries, please contact the IT Helpdesk at extension 404 or consult the official status dashboard at: https://it.campus.edu.in/status.\n\nCampus IT Infrastructure Operations\nCentral Computing Facility`,
    indicators: [
      {
        id: 'ind_1',
        text: 'The email originates from the verified institutional domain (@campus.edu.in) and passes SPF, DKIM, and DMARC checks',
        isCorrectIndicator: true,
        explanation: 'Complete alignment across institutional sender domains, cryptographic DKIM signatures, and strict SPF passes verifies authenticity.',
      },
      {
        id: 'ind_2',
        text: 'The communication explicitly confirms that NO user action, credential entry, or software installation is required',
        isCorrectIndicator: true,
        explanation: 'Legitimate infrastructure notices clearly disclaim requests for passwords, links, or emergency actions.',
      },
      {
        id: 'ind_3',
        text: 'The link points to the official university HTTPS subdomain (https://it.campus.edu.in/status) without redirects',
        isCorrectIndicator: true,
        explanation: 'Authentic links use secure HTTPS certificates hosted on established university subdomains.',
      },
      {
        id: 'ind_4',
        text: 'The maintenance window is scheduled during off-peak hours (02:00 AM to 04:00 AM) with realistic operational details',
        isCorrectIndicator: true,
        explanation: 'Professional IT operations schedule disruption during minimum-usage windows with documented redundancy.',
      },
      {
        id: 'ind_5',
        text: 'The message warns about intermittent 5-minute outages',
        isCorrectIndicator: false,
        explanation: 'Distractor: Anticipated operational downtime is standard transparency in genuine maintenance notices.',
      },
      {
        id: 'ind_6',
        text: 'The email does not contain attachments or urgency countdown timers',
        isCorrectIndicator: true,
        explanation: 'Absence of artificial pressure, payment traps, and executables strongly supports benign status.',
      },
    ],
    primaryRiskQuestion: {
      question: 'Based on cryptographic authentication headers and message semantics, what is the threat profile of this message?',
      options: [
        { id: 'A', text: 'High Risk: A stealth spear-phishing attack attempting to harvest active Wi-Fi handshake keys.' },
        { id: 'B', text: 'Benign / Legitimate: An authentic administrative notice that does not harvest credentials or deploy malware.' },
        { id: 'C', text: 'Medium Risk: A watering hole staging attack preparing a malicious DNS redirect mirror.' },
        { id: 'D', text: 'Critical Risk: Ransomware staging campaign targeting campus core network switches.' },
      ],
      correctOptionId: 'B',
      explanation: 'Cryptographic DKIM/SPF/DMARC validation combined with benign semantic structure confirms legitimate institutional communication.',
    },
    defensiveActionQuestion: {
      question: 'What is the appropriate action upon reading this authentic IT circular?',
      options: [
        { id: 'A', text: 'Report the sender address to the national CERT coordination center as potential spam.' },
        { id: 'B', text: 'Acknowledge the notice for your awareness; no defensive containment or credential modification is required.' },
        { id: 'C', text: 'Reset all personal student portal passwords across all connected devices immediately.' },
        { id: 'D', text: 'Disconnect campus Ethernet cables to prevent firmware updates from modifying network adapters.' },
      ],
      correctOptionId: 'B',
      explanation: 'Because the communication is genuine and demands no action, simply acknowledging the scheduled window is sufficient.',
    },
  },
];

// Round 2 Data: Realistic Multi-Step Progressive Social Engineering Dialogue
export interface AdvancedDialogueScenario {
  id: number;
  stageTitle: string;
  callerProfile: string;
  messageText: string;
  // What is the attacker's active manipulation technique?
  activeTactic: 'AUTHORITY' | 'URGENCY' | 'TRUST_BUILDING' | 'FEAR' | 'REWARD' | 'IMPERSONATION' | 'VERIFICATION_PRESSURE';
  tacticExplanation: string;
  // At which point does the request become unsafe?
  isSafeStage: boolean;
  unsafeTriggerReason: string;
  // Which information should NOT be shared?
  sensitiveInfoAtRisk: string;
  // What is the safest next action? (VERIFY, REFUSE, REPORT, OFFICIAL_CHANNEL)
  safestAction: 'VERIFY' | 'REFUSE' | 'REPORT' | 'OFFICIAL_CHANNEL';
  actionOptions: Array<{
    id: 'VERIFY' | 'REFUSE' | 'REPORT' | 'OFFICIAL_CHANNEL';
    label: string;
    consequence: string;
    isOptimal: boolean;
  }>;
}

export const ADVANCED_ROUND_2_STEPS: AdvancedDialogueScenario[] = [
  {
    id: 1,
    stageTitle: 'Stage 01: Initial Polite Contact & Role Pretexting',
    callerProfile: 'Rajesh Sharma // Calling from alleged "University Central Placement Desk"',
    messageText: '"Good afternoon! Am I speaking with the team lead for the senior cybersecurity cohort? I am calling directly from the Central University Placement Cell regarding the Tier-1 campus placement verification drive. Are you available for a brief 2-minute status confirmation?"',
    activeTactic: 'TRUST_BUILDING',
    tacticExplanation: 'The caller uses polite, professional greetings and establishes a familiar administrative pretext without immediately demanding data.',
    isSafeStage: true,
    unsafeTriggerReason: 'The caller has not yet requested sensitive information, but their identity has not yet been authenticated.',
    sensitiveInfoAtRisk: 'None at this moment; premature disclosure of personal schedules or team rosters should be avoided.',
    safestAction: 'VERIFY',
    actionOptions: [
      {
        id: 'VERIFY',
        label: 'VERIFY CALLER IDENTITY',
        consequence: 'Optimal: Ask the caller for their official faculty extension and verify their name on the campus portal directory.',
        isOptimal: true,
      },
      {
        id: 'OFFICIAL_CHANNEL',
        label: 'OFFICIAL CHANNEL REDIRECT',
        consequence: 'Good: Politely state that you will connect through the official placement office in person.',
        isOptimal: false,
      },
      {
        id: 'REFUSE',
        label: 'ABRUPTLY HANG UP',
        consequence: 'Sub-optimal: Premature hostility without confirming whether this is a legitimate communication.',
        isOptimal: false,
      },
      {
        id: 'REPORT',
        label: 'REPORT AS EMERGENCY FRAUD',
        consequence: 'Sub-optimal: Reporting before any malicious request occurs overwhelms security incident handlers.',
        isOptimal: false,
      },
    ],
  },
  {
    id: 2,
    stageTitle: 'Stage 02: Reward & Flattery Pretext',
    callerProfile: 'Rajesh Sharma // Calling from alleged "University Central Placement Desk"',
    messageText: '"Congratulations are in order! The recruitment board for FortifySec Technologies reviewed your college internal hackathon results and shortlisted your squad for an exclusive direct technical assessment with a ₹65,000 monthly stipend. Only 3 student squads across the university were chosen for this fast-track opportunity."',
    activeTactic: 'REWARD',
    tacticExplanation: 'The attacker uses flattering praise, exclusive opportunities, and lucrative financial rewards to lower psychological defenses.',
    isSafeStage: true,
    unsafeTriggerReason: 'Still within pretexting; the attacker is grooming the candidate by generating excitement and anticipation.',
    sensitiveInfoAtRisk: 'Do not confirm private team member phone numbers or personal project repositories.',
    safestAction: 'VERIFY',
    actionOptions: [
      {
        id: 'VERIFY',
        label: 'REQUEST FORMAL CIRCULAR REFERENCE',
        consequence: 'Optimal: Request the official placement circular notice number or official email dispatch to cross-verify on the university portal.',
        isOptimal: true,
      },
      {
        id: 'OFFICIAL_CHANNEL',
        label: 'CONSULT FACULTY COORDINATOR',
        consequence: 'Good: Inform the caller you will confirm through your departmental placement coordinator.',
        isOptimal: false,
      },
      {
        id: 'REFUSE',
        label: 'DECLINE THE INTERNSHIP OFFER',
        consequence: 'Sub-optimal: Unnecessary refusal before confirming whether the opportunity has an authentic departmental basis.',
        isOptimal: false,
      },
      {
        id: 'REPORT',
        label: 'IMMEDIATELY TERMINATE CALL',
        consequence: 'Sub-optimal: While caution is warranted, obtaining verification details is more constructive.',
        isOptimal: false,
      },
    ],
  },
  {
    id: 3,
    stageTitle: 'Stage 03: Verification Scarcity & Time Pressure',
    callerProfile: 'Rajesh Sharma // Calling from alleged "University Central Placement Desk"',
    messageText: '"Here is the urgency: the partner company’s London HQ is closing the interview slot allocation portal in exactly 15 minutes. If we don’t confirm your squad registry right now, the slot automatically rolls over to the waiting list candidates from the state engineering institute. I need your University Roll Number, date of birth, and registered personal email right now."',
    activeTactic: 'URGENCY',
    tacticExplanation: 'The attacker manufactures acute time scarcity (15 minutes) to induce panic and compel hasty surrender of personal identity data.',
    isSafeStage: false,
    unsafeTriggerReason: 'The conversation is now unsafe: the caller is demanding personally identifiable information (PII) under artificial time pressure.',
    sensitiveInfoAtRisk: 'Full student registration ID, Date of Birth, and registered email address (used for password reset exploits).',
    safestAction: 'REFUSE',
    actionOptions: [
      {
        id: 'REFUSE',
        label: 'REFUSE TO SHARE PII OVER PHONE',
        consequence: 'Optimal: Explicitly refuse to provide personal identifiers over an unsolicited incoming phone call, regardless of the deadline.',
        isOptimal: true,
      },
      {
        id: 'OFFICIAL_CHANNEL',
        label: 'OFFER IN-PERSON VERIFICATION AT DESK',
        consequence: 'Good: Offer to walk to the physical placement office in the admin block within 5 minutes.',
        isOptimal: false,
      },
      {
        id: 'VERIFY',
        label: 'ASK CALLER TO REPEAT DEADLINE',
        consequence: 'Sub-optimal: Engaging with artificial pressure gives the attacker psychological leverage to escalate intimidation.',
        isOptimal: false,
      },
      {
        id: 'REPORT',
        label: 'SILENTLY HANG UP',
        consequence: 'Partial: Terminates call but misses documenting the high-pressure identity harvesting attempt.',
        isOptimal: false,
      },
    ],
  },
  {
    id: 4,
    stageTitle: 'Stage 04: Escalated Intimidation & Coercive Authority',
    callerProfile: 'Rajesh Sharma // Calling from alleged "University Central Placement Desk"',
    messageText: '"Listen to me carefully. I am the Joint Director of the Academic Placement Cell. If you act uncooperative, I will personally file an official disciplinary non-compliance report with the Dean’s Office, which will result in your squad being blacklisted from all on-campus and off-campus recruitment drives for the entire academic year!"',
    activeTactic: 'AUTHORITY',
    tacticExplanation: 'Frustrated by resistance, the attacker shifts to coercive intimidation, threatening academic blacklisting and abusing fabricated authority.',
    isSafeStage: false,
    unsafeTriggerReason: 'Hostile intimidation and disciplinary threats violate professional university operating procedures and reveal malicious intent.',
    sensitiveInfoAtRisk: 'Any submission to authority intimidation compromises personal boundaries and organizational defense posture.',
    safestAction: 'REPORT',
    actionOptions: [
      {
        id: 'REPORT',
        label: 'TERMINATE & REPORT TO CAMPUS SECURITY',
        consequence: 'Optimal: Document the caller’s number, terminate the interaction, and report the impersonation and extortion attempt to campus cyber authorities.',
        isOptimal: true,
      },
      {
        id: 'OFFICIAL_CHANNEL',
        label: 'DIRECT COMPLAINT TO DEAN OF PLACEMENT',
        consequence: 'Good: File an official complaint with the real Dean of Placement regarding someone impersonating faculty.',
        isOptimal: false,
      },
      {
        id: 'REFUSE',
        label: 'ARGUE WITH THE CALLER',
        consequence: 'Sub-optimal: Arguing with social engineers wastes time and reveals personal emotional vulnerabilities.',
        isOptimal: false,
      },
      {
        id: 'VERIFY',
        label: 'APOLOGIZE AND ASK FOR IDENTIFICATION',
        consequence: 'Critical Failure: Backing down signals compliance, inviting the attacker to close in on credential theft.',
        isOptimal: false,
      },
    ],
  },
  {
    id: 5,
    stageTitle: 'Stage 05: The Critical Payoff — Live OTP Demand',
    callerProfile: 'Rajesh Sharma // Calling from alleged "University Central Placement Desk"',
    messageText: '"I am giving you one final chance to save your careers. I have just triggered an urgent 6-digit candidate allocation token to your phone via SMS. Read that 6-digit OTP aloud to me on this phone call in the next 30 seconds so my server can authenticate your examination slot, or you are permanently deregistered!"',
    activeTactic: 'VERIFICATION_PRESSURE',
    tacticExplanation: 'The core attack objective: manipulating the victim into relaying a multi-factor authentication (MFA) OTP to execute account takeover.',
    isSafeStage: false,
    unsafeTriggerReason: 'Direct demand for a real-time one-time password (OTP). Legitimate organizations never request OTPs over voice calls or chat.',
    sensitiveInfoAtRisk: 'The 6-digit authentication OTP granting unauthorized access to the student’s portal or registered email account.',
    safestAction: 'OFFICIAL_CHANNEL',
    actionOptions: [
      {
        id: 'REPORT',
        label: 'IMMEDIATELY FLAG OTP THEFT & QUARANTINE',
        consequence: 'Optimal: Immediately terminate the call, do not share the OTP, lock your account, and report the real-time account takeover attempt to SOC.',
        isOptimal: true,
      },
      {
        id: 'OFFICIAL_CHANNEL',
        label: 'CONTACT UNIVERSITY SECURITY HELPDESK',
        consequence: 'Good: Alert IT administration and forward the SMS header to the cyber response unit.',
        isOptimal: false,
      },
      {
        id: 'REFUSE',
        label: 'GIVE A FAKE 6-DIGIT NUMBER',
        consequence: 'Sub-optimal: Feeding fake OTPs may delay the attacker but fails to initiate formal incident response.',
        isOptimal: false,
      },
      {
        id: 'VERIFY',
        label: 'ASK WHY THE OTP TEXT SAYS "DO NOT SHARE"',
        consequence: 'Sub-optimal: Questioning an overt attack instead of terminating and reporting leaves accounts vulnerable.',
        isOptimal: false,
      },
    ],
  },
];

// Round 3 Data: Advanced Correlated Case File with Clue Board
export interface AdvancedEvidenceItem {
  id: string;
  type: 'EMAIL' | 'CHAT' | 'WEBSITE' | 'ATTACHMENT' | 'SMS';
  title: string;
  channelName: string;
  summary: string;
  fullDetails: Record<string, string>;
  discoveredClue: {
    id: string;
    clueName: string;
    evidenceCategory: 'SUSPICIOUS_DOMAIN' | 'FAKE_SUPPORT_IDENTITY' | 'URGENCY' | 'CREDENTIAL_REQUEST' | 'ACCOUNT_TAKEOVER_ATTEMPT';
    forensicDeduction: string;
  };
}

export const ADVANCED_ROUND_3_EVIDENCE: AdvancedEvidenceItem[] = [
  {
    id: 'ev_email',
    type: 'EMAIL',
    title: 'Faculty Urgent Password Expiry Notice',
    channelName: 'Corporate Email Gateway',
    summary: 'Sender: support@campus-portal-auth.in | Claims institutional Single Sign-On passwords expire today.',
    fullDetails: {
      'From': 'IT Identity Support <support@campus-portal-auth.in>',
      'To': 'cs-faculty-all@campus.edu.in',
      'Date': 'Today, 09:12:04 IST',
      'Subject': 'CRITICAL: University SSO Password Expiration within 4 Hours',
      'Header-SPF': 'SOFTFAIL (Domain campus-portal-auth.in does not designate 194.26.29.11)',
      'Action-URL': 'http://login.campus-portal-auth.in/auth/reset',
      'Body-Excerpt': 'All faculty and student accounts must validate their current credentials to prevent loss of grading and course registration privileges.',
    },
    discoveredClue: {
      id: 'clue_domain',
      clueName: 'Lookalike Infrastructure: campus-portal-auth.in',
      evidenceCategory: 'SUSPICIOUS_DOMAIN',
      forensicDeduction: 'The domain was registered 72 hours ago via an anonymous registrar, completely separate from the authentic university domain campus.edu.in.',
    },
  },
  {
    id: 'ev_chat',
    type: 'CHAT',
    title: 'Helpdesk WhatsApp Impersonation',
    channelName: 'Mobile Messaging App',
    summary: 'Unknown number (+91 98765 01234) claiming to be "Campus Helpdesk Lead Engineer Vikram".',
    fullDetails: {
      'Sender-Profile': 'Vikram R. // Senior Systems Admin (+91 98765 01234)',
      'Profile-Photo': 'Official IT Helpdesk badge logo copied from university public webpage',
      'Message 1': 'Hello Professor, our network monitoring system detected sync errors on your account.',
      'Message 2': 'I am the on-duty engineer handling the password reset queue today.',
      'Message 3': 'Please click the reset link emailed to you, or share your temporary access token directly with me so I can manually synchronize your account.',
    },
    discoveredClue: {
      id: 'clue_identity',
      clueName: 'Impersonated Helpdesk Support Engineer',
      evidenceCategory: 'FAKE_SUPPORT_IDENTITY',
      forensicDeduction: 'Attacker pairs the phishing email with a live chat persona on WhatsApp to reassure suspicious victims and guide them into the trap.',
    },
  },
  {
    id: 'ev_website',
    type: 'WEBSITE',
    title: 'Cloned Campus Single Sign-On Portal',
    channelName: 'Web Browser Telemetry',
    summary: 'URL: http://login.campus-portal-auth.in/auth/reset | Harvests username, password, and security answer.',
    fullDetails: {
      'Destination-URL': 'http://login.campus-portal-auth.in/auth/reset',
      'SSL/TLS Status': 'INSECURE (Plain-text HTTP, No Valid Certificate)',
      'HTML Form Action': 'POST http://194.26.29.11/collector/harvest.php',
      'Form Fields': 'Username, Current Password, Mother Maiden Name, Security Answer',
      'Visual Inspection': 'Pixel-perfect replica of real university authentication portal, CSS copied verbatim from CDN.',
    },
    discoveredClue: {
      id: 'clue_harvest',
      clueName: 'Form Exfiltration to Remote IP (194.26.29.11)',
      evidenceCategory: 'CREDENTIAL_REQUEST',
      forensicDeduction: 'Form action directly exfiltrates plaintext usernames, passwords, and security challenge answers to a malicious remote server.',
    },
  },
  {
    id: 'ev_sms',
    type: 'SMS',
    title: 'Emergency SMS Smishing Blast',
    channelName: 'Cellular SMS Network',
    summary: 'Sender Header: VK-CAMPUS-AUTH | Urgent warning of imminent account termination.',
    fullDetails: {
      'Sender-ID': 'VK-CAMPUS-AUTH',
      'Timestamp': '09:14 AM (2 minutes after email)',
      'Message Body': 'ALERT: Campus account #9940 flagged for immediate termination due to expired security certificate. Rectify within 30 minutes at http://campus-portal-auth.in',
      'Correlation': 'Dispatched within 120 seconds of the email to create an overwhelming sense of urgency across multiple devices.',
    },
    discoveredClue: {
      id: 'clue_urgency',
      clueName: 'Multi-Channel Panic Induction',
      evidenceCategory: 'URGENCY',
      forensicDeduction: 'The attacker uses a coordinated multi-channel blitz (Email + SMS + WhatsApp) to prevent the victim from pausing to reflect.',
    },
  },
  {
    id: 'ev_attachment',
    type: 'ATTACHMENT',
    title: 'Malicious Synchronizer Payload Archive',
    channelName: 'Email Attachment Sandbox',
    summary: 'File: Campus_SSO_Synchronizer_v2.zip containing Campus_SSO_Synchronizer.pdf.vbs',
    fullDetails: {
      'Archive Name': 'Campus_SSO_Synchronizer_v2.zip (182 KB)',
      'Internal Binary': 'Campus_SSO_Synchronizer.pdf.vbs (VBScript Executable)',
      'Behavioral Analysis': 'Executes PowerShell command to establish reverse TCP shell to 194.26.29.11:4444 and dump local Chrome saved credentials.',
      'Antivirus Evasion': 'Disguised with Adobe Acrobat PDF icon and trailing space padding.',
    },
    discoveredClue: {
      id: 'clue_takeover',
      clueName: 'Credential Stealer & Host Foothold',
      evidenceCategory: 'ACCOUNT_TAKEOVER_ATTEMPT',
      forensicDeduction: 'If the web credential harvester fails, the attacker uses the weaponized attachment to establish persistent remote access and dump browser passwords.',
    },
  },
];

// Round 4 Data: Expert-Level Escape the Phish with 10 Nuanced Clues & Attack Chain
export const EXPERT_ROUND_4_CLUES: EscapeMissionClue[] = [
  {
    id: 'c1',
    title: 'Header Mismatch & Lookalike Domain',
    category: 'Email Header Forgery',
    description: 'The email claims to originate from the National Scholarship Directorate, but the actual envelope sender is: scholarship-awards@central-grant-gov.in.net.',
    evidenceSnippet: 'scholarship-awards@central-grant-gov.in.net',
    securityImpact: 'Domain mimics government portal by appending a deceptive trailing .net top-level domain.',
  },
  {
    id: 'c2',
    title: 'Inconsistent Reply-To Route',
    category: 'Routing Manipulation',
    description: 'Replies are directed to reply-tracker@portal-admissions-desk.com rather than the sender address.',
    evidenceSnippet: 'Reply-To: reply-tracker@portal-admissions-desk.com',
    securityImpact: 'Ensures responses bypass institutional monitoring and land directly in the attacker’s inbox.',
  },
  {
    id: 'c3',
    title: 'Suspicious Transmission Timestamp',
    category: 'Message Timing',
    description: 'Official government announcement email dispatched at 03:22 AM on a Sunday morning.',
    evidenceSnippet: 'Date: Sun, 27 Sep 2026 03:22:18 +0530',
    securityImpact: 'Government scholarship offices do not issue automated grant disbursement decrees during dead-of-night weekend hours.',
  },
  {
    id: 'c4',
    title: 'Artificial 3-Hour Deadline',
    category: 'Psychological Urgency',
    description: 'Mandates recipient claim funds within 3 hours or award is permanently forfeited to waitlisted candidates.',
    evidenceSnippet: 'Claim entitlement within 180 minutes or your allocation will be irreversibly cancelled.',
    securityImpact: 'Creates overwhelming emotional urgency to bypass consultation with faculty advisors.',
  },
  {
    id: 'c5',
    title: 'Insecure Cloned Portal Link',
    category: 'Hyperlink Obfuscation',
    description: 'The claim button points to an unencrypted HTTP link: http://merit-scholarship-disbursement.xyz/claim.',
    evidenceSnippet: 'http://merit-scholarship-disbursement.xyz/claim',
    securityImpact: 'Unsecured HTTP destination hosted on a disposable .xyz domain known for credential theft.',
  },
  {
    id: 'c6',
    title: 'Self-Signed Invalid TLS Certificate',
    category: 'Cryptographic Failure',
    description: 'Security scan reveals the destination website presents a self-signed certificate issued to "localhost.test".',
    evidenceSnippet: 'Issuer: CN=localhost.test, Self-Signed, Untrusted Root CA',
    securityImpact: 'Proves the site is not verified by recognized public certificate authorities.',
  },
  {
    id: 'c7',
    title: 'Weaponized Application Form Attachment',
    category: 'Malware Payload',
    description: 'Mandatory offline application form is named: Scholarship_Clearance_Form_v4.pdf.scr.',
    evidenceSnippet: 'Attachment: Scholarship_Clearance_Form_v4.pdf.scr',
    securityImpact: 'Disguised Windows screensaver (.scr) executable delivering a spyware keylogger upon opening.',
  },
  {
    id: 'c8',
    title: 'Demands Full Unmasked Aadhaar Card',
    category: 'Identity Exfiltration',
    description: 'Demands unmasked 12-digit Aadhaar number plus high-resolution color scans of both front and back.',
    evidenceSnippet: 'Upload front & rear scans of unredacted 12-digit Aadhaar card',
    securityImpact: 'Enables identity fraud, unauthorized loan origination, and SIM-swap exploitation.',
  },
  {
    id: 'c9',
    title: 'Direct Bank Account & NetBanking Harvest',
    category: 'Financial Credential Theft',
    description: 'Requires student to input bank account number, IFSC code, and active NetBanking Customer User ID.',
    evidenceSnippet: 'Enter Bank Account Number, Branch IFSC, and NetBanking Customer Login ID',
    securityImpact: 'Harvests sensitive banking coordinates required to execute unauthorized debit transactions.',
  },
  {
    id: 'c10',
    title: 'Free Consumer Gmail Helpdesk Contact',
    category: 'Domain Discrepancy',
    description: 'Official inquiry helpdesk listed as national.scholarship.helpdesk@gmail.com instead of a .gov.in domain.',
    evidenceSnippet: 'Inquiries: national.scholarship.helpdesk@gmail.com',
    securityImpact: 'Official government departments never administer scholarship disputes through free consumer Google accounts.',
  },
];

export interface InvestigationQuestion {
  id: string;
  questionNumber: number;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  explanation: string;
}

export const ROUND_3_INVESTIGATION_QUESTIONS: InvestigationQuestion[] = [
  {
    id: 'r3_q1',
    questionNumber: 1,
    question: 'What was the initial attack vector that initiated this coordinated campaign?',
    options: [
      { id: 'A', text: 'An emergency SMS blast claiming imminent account termination within 30 minutes.' },
      { id: 'B', text: 'A spoofed email dispatch warning faculty of an SSO password expiration within 4 hours.' },
      { id: 'C', text: 'A direct WhatsApp voice call requesting a real-time multi-factor authentication token.' },
      { id: 'D', text: 'A weaponized attachment distributed via shared campus network folder drives.' },
    ],
    correctOptionId: 'B',
    explanation: 'The timeline telemetry shows the email was dispatched first at 09:12:04 IST, establishing the premise before the SMS and chat were launched.',
  },
  {
    id: 'r3_q2',
    questionNumber: 2,
    question: 'What was the attacker’s primary strategic objective across these correlated channels?',
    options: [
      { id: 'A', text: 'Disrupting campus web server availability through distributed denial-of-service floods.' },
      { id: 'B', text: 'Modifying student semester grade transcripts directly inside relational database tables.' },
      { id: 'C', text: 'Harvesting institutional Single Sign-On credentials and establishing persistent internal network access.' },
      { id: 'D', text: 'Deploying disk-wiping ransomware across student personal mobile devices over cellular towers.' },
    ],
    correctOptionId: 'C',
    explanation: 'The cloned SSO form directly captures usernames/passwords, while the backup VBS script establishes a reverse TCP shell to dump browser vaults.',
  },
  {
    id: 'r3_q3',
    questionNumber: 3,
    question: 'Which piece of evidence definitively confirms an active credential harvesting operation rather than an administrative glitch?',
    options: [
      { id: 'A', text: 'The cloned portal form action explicitly submits plaintext credentials via HTTP POST to external IP 194.26.29.11.' },
      { id: 'B', text: 'The SMS notification was delivered 120 seconds after the email was received by faculty inboxes.' },
      { id: 'C', text: 'The WhatsApp profile picture uses the publicly accessible university IT helpdesk emblem.' },
      { id: 'D', text: 'The email message employs an urgent subject line demanding compliance within four hours.' },
    ],
    correctOptionId: 'A',
    explanation: 'Direct exfiltration of credentials to an untrusted external server IP (194.26.29.11) constitutes conclusive technical proof of active harvesting.',
  },
  {
    id: 'r3_q4',
    questionNumber: 4,
    question: 'Which observed piece of evidence is suspicious, but technically inconclusive by itself to prove malicious intent?',
    options: [
      { id: 'A', text: 'The registration of domain campus-portal-auth.in completely outside authorized university nameservers.' },
      { id: 'B', text: 'The VBScript payload configured to launch a reverse TCP shell to port 4444.' },
      { id: 'C', text: 'The HTML login form actions routing plain-text passwords to remote IP 194.26.29.11.' },
      { id: 'D', text: 'The emergency SMS sender ID using the generic alphanumeric header VK-CAMPUS-AUTH.' },
    ],
    correctOptionId: 'D',
    explanation: 'SMS sender IDs like VK-CAMPUS-AUTH can be used by both legitimate telecom gateway aggregators and smishing fraudsters; header names alone are inconclusive.',
  },
  {
    id: 'r3_q5',
    questionNumber: 5,
    question: 'What specific sensitive information is being targeted across these multiple communication channels?',
    options: [
      { id: 'A', text: 'Single Sign-On usernames, passwords, security challenge answers, and local browser-cached credentials.' },
      { id: 'B', text: 'Student attendance roll numbers and hostel residential block allocation registers.' },
      { id: 'C', text: 'Campus Wi-Fi radio frequency channel maps and switch hardware MAC addresses.' },
      { id: 'D', text: 'Library book reservation histories and cafeteria digital meal plan balances.' },
    ],
    correctOptionId: 'A',
    explanation: 'The form fields specifically harvest usernames, current passwords, mother’s maiden name, and the VBScript dumps Chrome password stores.',
  },
  {
    id: 'r3_q6',
    questionNumber: 6,
    question: 'What would happen next in the attack chain if a victim inputs their credentials on the cloned portal?',
    options: [
      { id: 'A', text: 'The user’s workstation operating system is automatically updated to the latest vendor build.' },
      { id: 'B', text: 'The campus border firewall immediately shuts down all internet traffic to the college.' },
      { id: 'C', text: 'Credentials stored on 194.26.29.11 are used by adversaries to access authentic university SSO systems and internal databases.' },
      { id: 'D', text: 'The attacker’s command-and-control server terminates itself because its mission is fulfilled.' },
    ],
    correctOptionId: 'C',
    explanation: 'Captured credentials are systematically fed into authentic authentication endpoints to execute account takeover and pivot into sensitive campus assets.',
  },
  {
    id: 'r3_q7',
    questionNumber: 7,
    question: 'What immediate incident response containment action should the Security Operations Center (SOC) take?',
    options: [
      { id: 'A', text: 'Advise all faculty members to delete their WhatsApp application and restart their phones.' },
      { id: 'B', text: 'Block IP 194.26.29.11 and domain campus-portal-auth.in at perimeter firewalls/DNS, revoke active SSO session tokens, and mandate an out-of-band password reset.' },
      { id: 'C', text: 'Reply to support@campus-portal-auth.in requesting the sender provide their faculty identity card.' },
      { id: 'D', text: 'Wait 24 hours to observe whether additional departments report similar communications.' },
    ],
    correctOptionId: 'B',
    explanation: 'Proper SOC containment requires isolating threat infrastructure (IP/DNS blocking), invalidating existing tokens to prevent session hijacking, and forcing password resets.',
  },
];

export const ROUND_4_FINAL_QUESTIONS: InvestigationQuestion[] = [
  {
    id: 'r4_q1',
    questionNumber: 1,
    question: 'Which three pieces of evidence together provide the strongest indication that this is a credential-harvesting attack?',
    options: [
      { id: 'A', text: 'The 03:22 AM dispatch timestamp, the formal institutional greeting, and the PDF extension badge.' },
      { id: 'B', text: 'The unencrypted HTTP form, the demand for NetBanking login credentials, and the unmasked Aadhaar request.' },
      { id: 'C', text: 'The 180-minute deadline, the scholarship grant valuation, and the national directorate seal.' },
      { id: 'D', text: 'The presence of a consumer helpdesk email address, the student enrollment context, and the subject line.' },
    ],
    correctOptionId: 'B',
    explanation: 'The combination of unencrypted HTTP transport, full NetBanking credentials, and unmasked government ID represents undeniable credential-harvesting infrastructure.',
  },
  {
    id: 'r4_q2',
    questionNumber: 2,
    question: 'Which clue alone would not prove the message is malicious, but becomes significant when combined with the timeline?',
    options: [
      { id: 'A', text: 'The transmission timestamp at 03:22 AM on a Sunday morning.' },
      { id: 'B', text: 'The use of an executable .scr screensaver extension on an application form.' },
      { id: 'C', text: 'The self-signed SSL certificate issued to "localhost.test".' },
      { id: 'D', text: 'The direct harvesting of NetBanking user customer identifiers.' },
    ],
    correctOptionId: 'A',
    explanation: 'An email sent at 03:22 AM is not inherently hostile by itself, but for an official government scholarship decree paired with a 3-hour deadline, it exposes deliberate panic timing.',
  },
  {
    id: 'r4_q3',
    questionNumber: 3,
    question: 'What is the attacker’s most likely objective based on the complete evidence chain?',
    options: [
      { id: 'A', text: 'Flooding government scholarship portal databases with synthetic student application forms.' },
      { id: 'B', text: 'Harvesting financial NetBanking credentials and government identity documents while deploying a secondary RAT backdoor via the .scr attachment.' },
      { id: 'C', text: 'Conducting an academic demographic survey on student funding needs across technical universities.' },
      { id: 'D', text: 'Testing the filtering resilience of institutional campus mail gateways against high-volume relays.' },
    ],
    correctOptionId: 'B',
    explanation: 'The attacker deploys dual-threat monetization: direct credential theft via the web form plus host compromise via the trojanized screensaver binary.',
  },
  {
    id: 'r4_q4',
    questionNumber: 4,
    question: 'Which action should the team take first, and why?',
    options: [
      { id: 'A', text: 'Download the attached .scr form into a temporary folder to inspect its header byte signatures.' },
      { id: 'B', text: 'Notify the college scholarship cell and verify on the official portal scholarships.gov.in without clicking links, eliminating all threat exposure.' },
      { id: 'C', text: 'Send an email inquiry to national.scholarship.helpdesk@gmail.com requesting verified digital signature certificates.' },
      { id: 'D', text: 'Forward the email to fellow students to warn them that the scholarship quota is filling up.' },
    ],
    correctOptionId: 'B',
    explanation: 'Zero-trust verification through known, out-of-band authoritative channels (official portal and campus cell) eliminates risk of payload execution or credential compromise.',
  },
  {
    id: 'r4_q5',
    questionNumber: 5,
    question: 'Which information should NOT be provided even if the sender claims it is required for verification?',
    options: [
      { id: 'A', text: 'The student’s full name and department engineering branch.' },
      { id: 'B', text: 'The college institution name and academic year of enrollment.' },
      { id: 'C', text: 'NetBanking credentials, OTPs, and unredacted government identification cards.' },
      { id: 'D', text: 'The official campus academic semester calendar and examination schedule.' },
    ],
    correctOptionId: 'C',
    explanation: 'Authentication secrets (NetBanking logins, OTPs) and unredacted government IDs must never be surrendered to unsolicited requests under any pretext.',
  },
  {
    id: 'r4_q6',
    questionNumber: 6,
    question: 'Which independent verification method would best confirm whether the scholarship opportunity is legitimate?',
    options: [
      { id: 'A', text: 'Replying to the email to request a certified copy of the government gazette disbursement decree.' },
      { id: 'B', text: 'Navigating directly to the official National Scholarship Portal (scholarships.gov.in) via a clean browser session and consulting the college scholarship nodal officer.' },
      { id: 'C', text: 'Calling the telephone number listed on the cloned website’s contact us page.' },
      { id: 'D', text: 'Checking whether fellow students on social media groups received the identical award notification.' },
    ],
    correctOptionId: 'B',
    explanation: 'Authentic government schemes are officially cataloged on scholarships.gov.in and administered through designated institutional nodal officers.',
  },
];


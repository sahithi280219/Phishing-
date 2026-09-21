export interface HuntQuestion {
  id: string; // "q1" ... "q25"
  questionNumber: number; // 1 to 25
  round: 1 | 2 | 3 | 4;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'MEDIUM → HARD' | 'HARD / FINAL';
  type: 'EMAIL' | 'CHAT' | 'CALL' | 'OAUTH' | 'AUTHENTICATOR' | 'BROWSER' | 'DOCUMENT' | 'FINAL_ATTACK';
  artifact: {
    from?: string;
    sender?: string;
    subject?: string;
    body?: string;
    contact?: string;
    number?: string;
    caller?: string;
    url?: string;
    addressBar?: string;
    attachment?: string;
    displayedSender?: string;
    replyTo?: string;
    options?: string[];
    browserAppList?: string[];
    notificationText?: string;
    callerNumber?: string;
  };
  task: string;
  exampleAnswer: string;
  requiredKeywordCount: number;
  correctPoints: number;
  wrongPenalty: number;
  acceptedKeywords: string[];
  suggestedChips?: string[];
  explanation: string;
  realWorldExample?: string;
  preventionTip?: string;
}

export const HUNT_QUESTIONS: HuntQuestion[] = [
  // ==========================================
  // ROUND 1 — EASY (Questions 1–8)
  // Scoring: Correct +10, Wrong -5
  // ==========================================
  {
    id: 'q1',
    questionNumber: 1,
    round: 1,
    title: 'Fake Internship Offer Email',
    difficulty: 'EASY',
    type: 'EMAIL',
    artifact: {
      from: 'SRM Placement Cell',
      sender: 'placement.srm@gmail.com',
      subject: 'Urgent Internship Offer — Expires Soon',
      body: 'You have been selected for an internship paying ₹45,000 per month. Click the link below and enter your college email password within 15 minutes:\n\nhttps://srm-internship-verify.example.com',
      url: 'https://srm-internship-verify.example.com',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'sender email not official',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'sender email not official',
      'unofficial sender',
      'gmail',
      'gmail address',
      'placement.srm@gmail.com',
      'fake sender',
      'not official email',
      'asking college password',
      'college email password',
      'password request',
      'fake domain',
      'external email',
    ],
    suggestedChips: [
      'sender email not official',
      'asking college password',
      'urgent 15 minutes',
      'high salary ₹45,000',
      'valid placement link',
    ],
    explanation: 'Official university placement cells never use public @gmail.com addresses to dispatch offers, nor do they request your email account password via external links.',
  },
  {
    id: 'q2',
    questionNumber: 2,
    round: 1,
    title: 'Scholarship Email',
    difficulty: 'EASY',
    type: 'EMAIL',
    artifact: {
      from: 'National Scholarship Support',
      sender: 'scholarship-help@outlook.com',
      subject: 'Final Reminder — Scholarship Payment Pending',
      body: 'A scholarship payment of ₹25,000 is ready. Use the link to submit your bank details and pay a ₹499 verification fee. Complete the process immediately to avoid cancellation.',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'verification fee',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'verification fee',
      'pay fee',
      'advance fee',
      'paying verification fee',
      'fee to receive scholarship',
      'asking fee',
      'fee request',
      'outlook email',
      'outlook sender',
      'fee',
    ],
    suggestedChips: [
      'verification fee',
      'outlook sender email',
      'urgent cancellation threat',
      'asking bank details',
      'authentic government portal',
    ],
    explanation: 'Legitimate scholarships and government schemes never demand an upfront processing or verification fee to disburse grant funds.',
  },
  {
    id: 'q3',
    questionNumber: 3,
    round: 1,
    title: 'IT Support ChatApp',
    difficulty: 'EASY',
    type: 'CHAT',
    artifact: {
      contact: 'SRM IT Helpdesk',
      number: '+91 98765 43210',
      body: 'Your account will be deactivated within 30 minutes. Send us the six-digit OTP you just received so we can verify your identity. Do not share this message with anyone.',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'asks for OTP',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'asks for otp',
      'asks otp',
      'otp request',
      'asking otp',
      'sharing otp',
      'requesting otp',
      'six-digit otp',
      'otp',
      'deactivation threat',
      'mobile number',
    ],
    suggestedChips: [
      'asks for OTP',
      '30 min deactivation urgency',
      'secrecy instruction',
      'unofficial mobile number',
      'standard IT verification',
    ],
    explanation: 'Legitimate IT support will NEVER request your one-time password (OTP). OTPs are secret authentication credentials strictly for user verification.',
  },
  {
    id: 'q4',
    questionNumber: 4,
    round: 1,
    title: 'Fake Internship Website Email',
    difficulty: 'EASY',
    type: 'EMAIL',
    artifact: {
      from: 'Tech Careers India',
      sender: 'hr@techcareers-india.com',
      subject: 'You Have Been Selected for a Cybersecurity Internship',
      body: 'You have been selected for a six-month cybersecurity internship. Log in within 20 minutes:\n\nhttps://techcareers-india.com.verify-student.example/login',
      url: 'https://techcareers-india.com.verify-student.example/login',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'real domain suspicious',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'real domain suspicious',
      'fake domain',
      'suspicious domain',
      'subdomain spoofing',
      'verify-student.example',
      'spoofed url',
      'not real domain',
      'domain deceptive',
      'subdomain trick',
      'fake url',
    ],
    suggestedChips: [
      'real domain suspicious',
      'subdomain spoofing',
      '20 minute timer',
      'unsolicited internship selection',
      'official techcareers domain',
    ],
    explanation: 'The link looks like techcareers-india.com, but the actual registered root domain is "verify-student.example" using subdomain spoofing to trick unsuspecting users.',
  },
  {
    id: 'q5',
    questionNumber: 5,
    round: 1,
    title: 'Fake Bank KYC ChatApp',
    difficulty: 'EASY',
    type: 'CHAT',
    artifact: {
      contact: 'SBI Customer Care',
      number: '+91 91234 56789',
      body: 'Your KYC expires today and your account will be blocked. Update your details here:\n\nhttps://sbi-kyc-update.example.com\n\nThe form asks for your ATM PIN, CVV, and OTP.',
      url: 'https://sbi-kyc-update.example.com',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'asks ATM PIN/OTP',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'asks atm pin/otp',
      'asks atm pin',
      'asks otp',
      'atm pin and otp',
      'atm pin/otp',
      'atm pin',
      'cvv and pin',
      'asking pin',
      'bank asking pin',
      'asking atm pin',
      'pin request',
    ],
    suggestedChips: [
      'asks ATM PIN/OTP',
      'account block threat',
      'external kyc url',
      'whatsapp/sms kyc update',
      'bank standard protocol',
    ],
    explanation: 'Banks never conduct KYC over WhatsApp or third-party links, and RBI guidelines explicitly prohibit asking for ATM PIN, CVV, or OTP.',
  },
  {
    id: 'q6',
    questionNumber: 6,
    round: 1,
    title: 'Fake Placement Coordinator ChatApp',
    difficulty: 'EASY',
    type: 'CHAT',
    artifact: {
      contact: 'Placement Coordinator',
      number: '+91 87654 32109',
      body: 'You have been shortlisted for a 12 LPA cybersecurity role. Send your college ID, Aadhaar, email password, and complete the process within 10 minutes. Do not contact the placement office.',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'asks for email password',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'asks for email password',
      'asks email password',
      'asking password',
      'email password',
      'password request',
      'do not contact placement office',
      'bypassing placement office',
      'secrecy demand',
      'asking for password',
    ],
    suggestedChips: [
      'asks for email password',
      'do not contact placement office',
      '10 minute artificial urgency',
      'sensitive aadhaar request',
      'verified 12 LPA role',
    ],
    explanation: 'No placement officer will ever ask for your private email password or forbid you from verifying the opportunity through official department channels.',
  },
  {
    id: 'q7',
    questionNumber: 7,
    round: 1,
    title: 'Suspicious File Attachment Email',
    difficulty: 'EASY',
    type: 'EMAIL',
    artifact: {
      from: 'College Examination Cell',
      sender: 'examcell.notice@protonmail.com',
      subject: 'Internal Assessment Mark List',
      attachment: 'Internal_Marks_2026.exe',
      body: 'Open the attached file, Internal_Marks_2026.exe, today. Your marks will be marked absent if you do not open it.',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'executable attachment',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'executable attachment',
      '.exe attachment',
      'exe file',
      'executable file',
      'malicious executable',
      '.exe',
      'exe',
      'attachment is exe',
      'protonmail sender',
      'absent marks threat',
    ],
    suggestedChips: [
      'executable attachment',
      'protonmail sender address',
      'absent marks coercion',
      'mark list in .exe format',
      'standard college memo',
    ],
    explanation: 'Mark sheets are always published as PDF or spreadsheet documents. An .exe executable file is a Trojan horse payload designed to install malware.',
  },
  {
    id: 'q8',
    questionNumber: 8,
    round: 1,
    title: 'Student Reward QR ChatApp',
    difficulty: 'EASY',
    type: 'CHAT',
    artifact: {
      contact: 'Student Benefits Team',
      number: '+91 99887 66554',
      body: 'You have won a ₹2,000 student reward. Scan the QR code and enter your bank account number, debit card details, and UPI PIN. Rewards are limited.',
    },
    task: 'Identify the most suspicious mistake using short keywords only.',
    exampleAnswer: 'UPI PIN to receive money',
    requiredKeywordCount: 1,
    correctPoints: 10,
    wrongPenalty: -5,
    acceptedKeywords: [
      'upi pin to receive money',
      'upi pin to receive',
      'upi pin for reward',
      'entering upi pin to receive',
      'upi pin required',
      'upi pin',
      'pin to receive',
      'debit card details',
      'qr code scam',
    ],
    suggestedChips: [
      'UPI PIN to receive money',
      'debit card details for reward',
      'unsolicited cash reward',
      'limited reward rush',
      'official upi reward',
    ],
    explanation: 'Fundamental UPI principle: You NEVER enter your UPI PIN to receive money. Entering your PIN authorizes money being deducted from your account.',
  },

  // ==========================================
  // ROUND 2 — MEDIUM (Questions 9–14)
  // Scoring: Correct +20, Wrong -10
  // ==========================================
  {
    id: 'q9',
    questionNumber: 9,
    round: 2,
    title: 'Fake Microsoft 365 Login Email',
    difficulty: 'MEDIUM',
    type: 'EMAIL',
    artifact: {
      from: 'Microsoft Account Security',
      sender: 'security-alert@microsoft-support.example.org',
      subject: 'Unusual Login Detected — Account Lock in 15 Minutes',
      body: 'A login from Chennai was detected. Verify your account here:\n\nhttps://login.microsoft.com.security-check.example.org/verify\n\nThe page asks for your email password and latest MFA code. Your browser warns that the link came from an external email.',
      url: 'https://login.microsoft.com.security-check.example.org/verify',
    },
    task: 'Identify the most important security mistake using short keywords only.',
    exampleAnswer: 'actual domain not Microsoft',
    requiredKeywordCount: 1,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'actual domain not microsoft',
      'domain not microsoft',
      'fake domain',
      'fake microsoft domain',
      'security-check.example.org',
      'domain spoofing',
      'subdomain trick',
      'asking password and mfa',
      'browser external warning',
    ],
    suggestedChips: [
      'actual domain not Microsoft',
      'asking password & MFA code',
      '15 min account lock urgency',
      'external email origin warning',
      'legitimate Microsoft alert',
    ],
    explanation: 'The domain ends in "security-check.example.org", not "microsoft.com". Attackers prepend legitimate names as subdomains to deceive hurried users.',
  },
  {
    id: 'q10',
    questionNumber: 10,
    round: 2,
    title: 'Compromised Friend ChatApp',
    difficulty: 'MEDIUM',
    type: 'CHAT',
    artifact: {
      contact: 'Arun (College Friend)',
      body: 'I urgently need ₹3,500 for a hospital payment. Please send it to:\n\narun.help@ok-example\n\nDo not call me right now. Send me a screenshot after you pay.',
    },
    task: 'Identify the strongest sign of a social-engineering scam using short keywords only.',
    exampleAnswer: 'urgency and refusing phone call',
    requiredKeywordCount: 1,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'urgency and refusing phone call',
      'refusing phone call',
      'do not call me',
      'avoiding phone call',
      'refusing call',
      'preventing voice verification',
      'urgency and no call',
      'compromised account',
      'fake emergency',
    ],
    suggestedChips: [
      'urgency and refusing phone call',
      'unusual UPI handle',
      'immediate screenshot demand',
      'hospital emergency pretext',
      'genuine friend distress',
    ],
    explanation: 'The explicit instruction "Do not call me" is designed to block out-of-band verification that would immediately expose the hacked account.',
  },
  {
    id: 'q11',
    questionNumber: 11,
    round: 2,
    title: 'Fake Cloud Storage Alert',
    difficulty: 'MEDIUM',
    type: 'EMAIL',
    artifact: {
      from: 'Google Drive Support',
      sender: 'storage-alert@google-drive-notify.example.com',
      subject: 'Your Storage Is Full — Files Deleted in 24 Hours',
      body: 'Confirm your account here:\n\nhttps://drive.google.com.account-confirm.example.net/secure\n\nThe page asks for your Google password and an identity document.',
      url: 'https://drive.google.com.account-confirm.example.net/secure',
    },
    task: 'Identify two suspicious signs using short keywords only.',
    exampleAnswer: 'fake domain; identity document request',
    requiredKeywordCount: 2,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'fake domain',
      'identity document request',
      'account-confirm.example.net',
      'asking password',
      'asking google password',
      '24 hour file deletion threat',
      'deletion threat',
      'sensitive id request',
    ],
    suggestedChips: [
      'fake domain',
      'identity document request',
      'asking Google password',
      '24hr deletion threat',
      'google-drive-notify sender',
      'official storage manager',
    ],
    explanation: 'Sign 1: Spoofed root domain "account-confirm.example.net". Sign 2: Google Drive never requests government identity documents or re-entry of passwords via unsolicited links.',
  },
  {
    id: 'q12',
    questionNumber: 12,
    round: 2,
    title: 'Fake UPI Refund ChatApp',
    difficulty: 'MEDIUM',
    type: 'CHAT',
    artifact: {
      contact: 'Online Store Support',
      number: '+91 93456 78901',
      body: 'Your cancelled order worth ₹1,299 is eligible for a refund. Open the UPI payment request and enter your UPI PIN to receive the refund. If you reject it, your refund will be cancelled. Complete within 10 minutes.',
    },
    task: 'Identify the dangerous mistake using short keywords only.',
    exampleAnswer: 'UPI PIN required to receive refund',
    requiredKeywordCount: 1,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'upi pin required to receive refund',
      'upi pin to receive refund',
      'entering upi pin to receive refund',
      'upi pin for refund',
      'upi pin to receive',
      'upi pin debit request',
      'collect request scam',
    ],
    suggestedChips: [
      'UPI PIN required to receive refund',
      '10 minute rejection threat',
      'collect request sent instead of refund',
      'unofficial customer support',
      'valid e-commerce refund',
    ],
    explanation: 'Scammers send a "Collect / Pay" UPI request while claiming it is a refund. Entering your PIN transfers funds TO the scammer.',
  },
  {
    id: 'q13',
    questionNumber: 13,
    round: 2,
    title: 'Suspicious Login Approval',
    difficulty: 'MEDIUM',
    type: 'AUTHENTICATOR',
    artifact: {
      notificationText: 'Microsoft Authenticator notification:\nLogin approval requested\nAccount: College email\nLocation: Bengaluru\nDevice: Windows PC\nTime: 4:12 PM',
      body: 'A friend messages: “Approve quickly or your placement registration will fail.”',
      options: ['Deny', 'Approve'],
    },
    task: 'Identify the suspicious sign using short keywords only.',
    exampleAnswer: 'unexpected login approval request',
    requiredKeywordCount: 1,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'unexpected login approval request',
      'unexpected login approval',
      'unsolicited login approval',
      'mfa fatigue',
      'mfa push fatigue',
      'login prompt without logging in',
      'friend coercing approval',
      'mismatched location',
    ],
    suggestedChips: [
      'unexpected login approval request',
      'peer pressure to approve MFA',
      'mismatched login location',
      'MFA fatigue attack',
      'legitimate placement check',
    ],
    explanation: 'This is an MFA Push Fatigue attack combined with social engineering coercion. If you did not initiate a login yourself, approving it grants the attacker full account access.',
  },
  {
    id: 'q14',
    questionNumber: 14,
    round: 2,
    title: 'Fake College IT Password Reset Email',
    difficulty: 'MEDIUM',
    type: 'EMAIL',
    artifact: {
      from: 'SRM IT Service Desk',
      sender: 'it-support@srm-reset.example.net',
      subject: 'Password Expires Today',
      body: 'Your password expires today. Reset it within 30 minutes:\n\nhttps://srm-reset.example.net/portal\n\nThe form asks for your current password, new password, and OTP.',
      url: 'https://srm-reset.example.net/portal',
    },
    task: 'Identify two suspicious signs using short keywords only.',
    exampleAnswer: 'external domain; asks current password',
    requiredKeywordCount: 2,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'external domain',
      'asks current password',
      'srm-reset.example.net',
      'asking current password',
      'asking otp',
      'fake domain',
      '30 minutes urgency',
      'credential harvesting',
    ],
    suggestedChips: [
      'external domain',
      'asks current password',
      'requesting OTP with password',
      '30 minute expiration pressure',
      'sender address not college edu',
      'official IT maintenance',
    ],
    explanation: 'Sign 1: External domain "srm-reset.example.net" rather than the verified institution domain. Sign 2: The portal harvests your CURRENT active password and OTP.',
  },

  // ==========================================
  // ROUND 3 — MEDIUM → HARD (Questions 15–20)
  // Scoring: Q15-17: +20 / -10; Q18-20: +30 / -13
  // ==========================================
  {
    id: 'q15',
    questionNumber: 15,
    round: 3,
    title: 'Fake Internship Document Verification Email',
    difficulty: 'MEDIUM → HARD',
    type: 'EMAIL',
    artifact: {
      from: 'Talent Acquisition Team',
      sender: 'recruitment@career-opportunities.example.com',
      subject: 'Final Internship Verification',
      body: 'You have been selected for a cybersecurity internship. Upload your Aadhaar, PAN, college ID, and bank statement using the link below. Do not tell the placement department. Complete this today.',
    },
    task: 'Identify two suspicious signs using short keywords only.',
    exampleAnswer: 'sensitive document request; secrecy instruction',
    requiredKeywordCount: 2,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'sensitive document request',
      'secrecy instruction',
      'do not tell placement department',
      'sensitive documents',
      'asking aadhaar and pan',
      'secrecy demand',
      'bypassing placement cell',
      'bank statement request',
    ],
    suggestedChips: [
      'sensitive document request',
      'secrecy instruction',
      'bypassing college placement cell',
      'excessive financial documents',
      'unverified external domain',
      'legitimate corporate HR',
    ],
    explanation: 'Sign 1: Excessive collection of sensitive identity & financial credentials (Aadhaar, PAN, bank statements) without prior interviews. Sign 2: Demanding secrecy from the university placement cell.',
  },
  {
    id: 'q16',
    questionNumber: 16,
    round: 3,
    title: 'Fake Account Security Call',
    difficulty: 'MEDIUM → HARD',
    type: 'CALL',
    artifact: {
      caller: 'College/Email Security Department',
      number: '+91 88990 11223',
      body: 'The caller says suspicious activity was detected on your account. They ask you to approve a phone verification request and read out the six-digit code. They threaten to suspend your account.',
    },
    task: 'Identify two suspicious signs using short keywords only.',
    exampleAnswer: 'unexpected approval request; asks security code',
    requiredKeywordCount: 2,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'unexpected approval request',
      'asks security code',
      'asking six-digit code',
      'reading out verification code',
      'threat of suspension',
      'account suspension threat',
      'vishing attack',
      'voice phishing',
    ],
    suggestedChips: [
      'unexpected approval request',
      'asks security code',
      'threat of immediate suspension',
      'inbound call asking credentials',
      'phone number not official desk',
      'standard security audit',
    ],
    explanation: 'Sign 1: Unsolicited incoming call asking you to trigger or approve an authentication action. Sign 2: Asking you to read out your 6-digit security code while applying suspension threats.',
  },
  {
    id: 'q17',
    questionNumber: 17,
    round: 3,
    title: 'Suspicious Payment Link Email',
    difficulty: 'MEDIUM → HARD',
    type: 'EMAIL',
    artifact: {
      from: 'Campus Events Team',
      sender: 'campus.events@event-registration.example.org',
      subject: 'Registration Incomplete — Seat Cancelled in 10 Minutes',
      body: 'You must pay ₹99 again to complete event registration. If you already paid, enter your UPI PIN to receive a refund.',
    },
    task: 'Identify two suspicious signs using short keywords only.',
    exampleAnswer: 'UPI PIN request; payment urgency',
    requiredKeywordCount: 2,
    correctPoints: 20,
    wrongPenalty: -10,
    acceptedKeywords: [
      'upi pin request',
      'payment urgency',
      'upi pin to receive refund',
      'upi pin for refund',
      '10 minutes cancellation',
      'urgent 10 minutes',
      'double payment request',
      'refund via upi pin',
    ],
    suggestedChips: [
      'UPI PIN request',
      'payment urgency',
      'double charging registration fee',
      'claiming refund via UPI PIN',
      'external event domain',
      'routine fest ticketing',
    ],
    explanation: 'Sign 1: Demanding a UPI PIN to process a supposed refund. Sign 2: Artificial urgency ("Seat Cancelled in 10 Minutes") to induce impulsive compliance.',
  },
  {
    id: 'q18',
    questionNumber: 18,
    round: 3,
    title: 'Advanced Domain Investigation',
    difficulty: 'MEDIUM → HARD',
    type: 'BROWSER',
    artifact: {
      addressBar: 'https://login.microsoftonline.com.security-auth.example.net/verify',
      body: 'You open a Microsoft 365 verification page from an email.\nThe page requests your password and MFA code. Your browser warns that the link came from an external email.',
    },
    task: 'Identify TWO security mistakes using short keywords only.',
    exampleAnswer: 'fake registered domain; credential harvesting',
    requiredKeywordCount: 2,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'fake registered domain',
      'credential harvesting',
      'security-auth.example.net',
      'fake domain',
      'subdomain spoofing',
      'password and mfa harvesting',
      'browser external warning',
      'harvesting credentials',
    ],
    suggestedChips: [
      'fake registered domain',
      'credential harvesting',
      'subdomain prefix deception',
      'browser external email warning',
      'MFA token interception',
      'official Microsoft tenant',
    ],
    explanation: 'Mistake 1: The host domain is "security-auth.example.net", disguised with "login.microsoftonline.com" as subdomains. Mistake 2: The landing page acts as an adversary-in-the-middle credential harvester.',
  },
  {
    id: 'q19',
    questionNumber: 19,
    round: 3,
    title: 'Malicious OAuth Permission Email',
    difficulty: 'MEDIUM → HARD',
    type: 'OAUTH',
    artifact: {
      from: 'College Internship Portal',
      sender: 'career.portal@internship-connect.example.com',
      subject: 'Connect Your College Account to Resume Scanner',
      options: ['Read emails', 'Send emails', 'View contacts'],
      body: 'The Resume Scanner requests these permissions:\n• Read emails\n• Send emails\n• View contacts\n\nThe recruiter says: “Approve all permissions immediately. Your interview slot expires in 5 minutes.”',
    },
    task: 'Identify two major mistakes using short keywords only.',
    exampleAnswer: 'excessive OAuth permissions; artificial urgency',
    requiredKeywordCount: 2,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'excessive oauth permissions',
      'artificial urgency',
      'excessive permissions',
      '5 minutes urgency',
      'send emails permission',
      'reading and sending emails',
      'malicious permissions',
      'unnecessary scope',
    ],
    suggestedChips: [
      'excessive OAuth permissions',
      'artificial urgency',
      'send emails permission for scanner',
      'access to personal contacts',
      'unverified app developer',
      'standard resume parser',
    ],
    explanation: 'Mistake 1: Excessive OAuth permissions (a resume scanner does not need rights to read and send emails on your behalf). Mistake 2: Artificial urgency forcing approval in 5 minutes.',
  },
  {
    id: 'q20',
    questionNumber: 20,
    round: 3,
    title: 'Email Header and Reply-To Trap',
    difficulty: 'MEDIUM → HARD',
    type: 'EMAIL',
    artifact: {
      displayedSender: 'Google Security Team',
      from: 'no-reply@accounts.google.com',
      replyTo: 'security-verification@google-account-help.example.net',
      body: 'The message asks for your current password, backup email, and six-digit code. It threatens account suspension within 15 minutes.',
    },
    task: 'Identify two mistakes using short keywords only.',
    exampleAnswer: 'Reply-To mismatch; credential harvesting',
    requiredKeywordCount: 2,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'reply-to mismatch',
      'credential harvesting',
      'mismatched reply-to',
      'reply-to not google',
      'google-account-help.example.net',
      'asking password and code',
      'asking password and backup email',
      'suspension threat',
    ],
    suggestedChips: [
      'Reply-To mismatch',
      'credential harvesting',
      'display name spoofing',
      'requesting backup email & code',
      '15-minute suspension threat',
      'authentic Google notification',
    ],
    explanation: 'Mistake 1: Reply-To header diverts replies away from authentic Google servers to an attacker-controlled external domain. Mistake 2: Soliciting sensitive account recovery secrets under threat.',
  },

  // ==========================================
  // ROUND 4 — HARD / FINAL (Questions 21–25)
  // Scoring: Correct +30, Wrong -13
  // ==========================================
  {
    id: 'q21',
    questionNumber: 21,
    round: 4,
    title: 'Fake Account Recovery Call',
    difficulty: 'HARD / FINAL',
    type: 'CALL',
    artifact: {
      caller: 'College IT Recovery Team',
      number: '+91 94444 22110',
      body: 'The caller says a recovery request has been initiated. They ask you to read a security link and provide a six-digit code. They tell you not to open the email or contact IT.\n\nPhone notification:\nAccount Recovery Request\nYour recovery phone number is being changed.\nOptions: Approve / Deny',
      options: ['Approve', 'Deny'],
    },
    task: 'Identify two social-engineering or account-security mistakes using short keywords only.',
    exampleAnswer: 'unsolicited recovery call; approval manipulation',
    requiredKeywordCount: 2,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'unsolicited recovery call',
      'approval manipulation',
      'unsolicited recovery',
      'reading security code',
      'do not contact it',
      'telling not to contact it',
      'recovery phone number changed',
      'account takeover',
    ],
    suggestedChips: [
      'unsolicited recovery call',
      'approval manipulation',
      'prohibiting contact with IT',
      'unauthorized phone change',
      'requesting six-digit recovery code',
      'verified college helpdesk',
    ],
    explanation: 'Mistake 1: An unsolicited inbound call regarding account recovery when the student never requested one. Mistake 2: Coercing approval of an unauthorized phone number transfer while forbidding IT contact.',
  },
  {
    id: 'q22',
    questionNumber: 22,
    round: 4,
    title: 'Malicious Document and Macro Trap',
    difficulty: 'HARD / FINAL',
    type: 'DOCUMENT',
    artifact: {
      from: 'SRM Internship Verification Office',
      sender: 'verification@srm-career-office.example.org',
      subject: 'Internship Offer Verification — Expires in 10 Minutes',
      attachment: 'SRM_Internship_Offer_2026.docm',
      body: 'The message asks you to open the file, click Enable Editing, and then click Enable Content. The file requests macros and tries to open an external website.',
    },
    task: 'Identify two mistakes using short keywords only.',
    exampleAnswer: 'macro execution; urgency pressure',
    requiredKeywordCount: 2,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'macro execution',
      'urgency pressure',
      'enable content',
      'enable editing',
      '.docm file',
      'macro enabled document',
      'external website connection',
      '10 minute urgency',
      'malicious macros',
    ],
    suggestedChips: [
      'macro execution',
      'urgency pressure',
      '.docm macro-enabled format',
      'prompting to Enable Content',
      'unsolicited external connection',
      'standard word document',
    ],
    explanation: 'Mistake 1: The document uses a macro-enabled format (.docm) and tricks the user to Enable Content to execute embedded malicious VBA code. Mistake 2: False 10-minute expiry pressure.',
  },
  {
    id: 'q23',
    questionNumber: 23,
    round: 4,
    title: 'Fake IT Portal and Session Hijacking',
    difficulty: 'HARD / FINAL',
    type: 'BROWSER',
    artifact: {
      contact: 'SRM IT Security Team (ChatApp Alert)',
      url: 'https://srm-security.example.com/verify?session=8f42a1',
      body: 'Verify your account immediately:\nhttps://srm-security.example.com/verify?session=8f42a1\n\nThe page asks for your college email and password, requests that you copy your browser session token, and tells you to disable browser protection. Your session expires in 60 seconds.',
    },
    task: 'Identify two mistakes using short keywords only.',
    exampleAnswer: 'session token theft; fake domain',
    requiredKeywordCount: 2,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'session token theft',
      'fake domain',
      'copying session token',
      'session hijacking',
      'disable browser protection',
      'disabling protection',
      '60 seconds expiry',
      'srm-security.example.com',
    ],
    suggestedChips: [
      'session token theft',
      'fake domain',
      'disabling browser protection',
      'stealing session cookie/token',
      '60-second expiration pressure',
      'official session refresher',
    ],
    explanation: 'Mistake 1: Demanding browser session tokens enables adversary session hijacking (bypassing password & MFA). Mistake 2: Fake domain hosted outside official institutional infrastructure.',
  },
  {
    id: 'q24',
    questionNumber: 24,
    round: 4,
    title: 'Business Email Compromise',
    difficulty: 'HARD / FINAL',
    type: 'EMAIL',
    artifact: {
      from: 'Placement Office — Internship Coordinator',
      sender: 'placement.coordinator@college.edu',
      subject: 'Urgent Update — Internship Payment Account',
      body: 'Please deposit ₹2,500 to this new UPI ID:\n\ninternship.confirm@ok-example\n\nDo not contact the placement office. Reply with a transaction screenshot.\n\nThe displayed sender looks official, but the original internship notice listed a different payment account.',
    },
    task: 'Identify two mistakes using short keywords only.',
    exampleAnswer: 'payment account change; independent verification bypass',
    requiredKeywordCount: 2,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'payment account change',
      'independent verification bypass',
      'change of payment account',
      'different payment account',
      'bypassing verification',
      'do not contact placement office',
      'compromised email',
      'new upi id',
      'bec attack',
    ],
    suggestedChips: [
      'payment account change',
      'independent verification bypass',
      'instructing not to contact office',
      'discrepancy with original notice',
      'personal UPI ID for college fee',
      'authorized placement update',
    ],
    explanation: 'Classic Business Email Compromise (BEC): An internal email account was hijacked to redirect fee deposits to an attacker UPI handle while blocking out-of-band verification.',
  },
  {
    id: 'q25',
    questionNumber: 25,
    round: 4,
    title: 'Final Attack — Stop the Coordinated Scam',
    difficulty: 'HARD / FINAL',
    type: 'FINAL_ATTACK',
    artifact: {
      body: 'Security Alert: Multiple students have reported suspicious internship emails. Arun clicked a link and has now received three login approval requests. Someone is asking him to approve one of them.\n\nCollege IT Security email:\nFrom: security-team@college.edu\n"There is unusual access to several student accounts. Do not approve unexpected login requests. We are investigating a suspicious application connected to student email accounts."',
      browserAppList: [
        '1. Internship Resume Scanner — Read emails, send emails',
        '2. Student Verification Tool — Read profile, access contacts',
        '3. College Security Portal — Official college application',
      ],
    },
    task: 'Identify THREE critical security mistakes or actions needed to stop the attack. Use short keywords only.',
    exampleAnswer: 'Malicious OAuth app; deny login approval; revoke access',
    requiredKeywordCount: 3,
    correctPoints: 30,
    wrongPenalty: -13,
    acceptedKeywords: [
      'malicious oauth app',
      'deny login approval',
      'revoke access',
      'revoke permissions',
      'malicious app',
      'deny login',
      'mfa fatigue',
      'compromised token',
      'stop attack',
      'remove connected app',
    ],
    suggestedChips: [
      'Malicious OAuth app',
      'deny login approval',
      'revoke access',
      'MFA fatigue exploitation',
      'compromised email password',
      'approve prompt to test system',
      'safe official college app',
    ],
    explanation: 'Action 1: Identify the "Internship Resume Scanner" as a malicious OAuth application. Action 2: Immediately deny the unsolicited login approval prompts. Action 3: Revoke app permissions from connected applications.',
  },
];

// Helper functions for scoring and questions filtering
export function getQuestionsForRound(roundNumber: 1 | 2 | 3 | 4): HuntQuestion[] {
  return HUNT_QUESTIONS.filter((q) => q.round === roundNumber);
}

export interface QuestionDebriefInfo {
  correctAnswer: string;
  explanation: string;
  realWorldExample: string;
  preventionTip: string;
}

export const QUESTION_DEBRIEFS: Record<string, QuestionDebriefInfo> = {
  q1: {
    correctAnswer: 'sender email not official (or asking college password)',
    explanation: 'Official university placement cells never use public @gmail.com addresses to dispatch offers, nor do they request your email account password via external links.',
    realWorldExample: 'Attackers register free Gmail accounts imitating university placement departments to harvest university single sign-on (SSO) credentials before campus recruitment season.',
    preventionTip: 'Always check the full sender email header domain. Real campus communication comes strictly from verified institutional domains (@srmist.edu.in), never public webmail services.',
  },
  q2: {
    correctAnswer: 'verification fee (or paying fee to receive scholarship)',
    explanation: 'Legitimate scholarships and government schemes never demand an upfront processing or verification fee to disburse grant funds.',
    realWorldExample: 'The classic "advance-fee fraud" promises large government payouts (₹25,000–₹50,000) conditioned on a small ₹499–₹999 fee, siphoning thousands of payments before disappearing.',
    preventionTip: 'Never pay money to receive a grant or scholarship. Verified scholarships disburse funds directly to institution or verified beneficiary bank accounts.',
  },
  q3: {
    correctAnswer: 'asks for OTP (or deactivation urgency / sharing OTP)',
    explanation: 'Legitimate IT support will NEVER request your one-time password (OTP). OTPs are secret authentication credentials strictly for user verification.',
    realWorldExample: 'Social engineers impersonating university sysadmins send urgent WhatsApp messages during maintenance windows to intercept login OTPs and take over student email accounts.',
    preventionTip: 'Treat OTPs as confidential passwords. Never share OTPs with anyone over WhatsApp, phone call, or email, even if the sender claims to be official IT staff.',
  },
  q4: {
    correctAnswer: 'real domain suspicious (subdomain spoofing / verify-student.example)',
    explanation: 'The link looks like techcareers-india.com, but the actual registered root domain is "verify-student.example" using subdomain spoofing to trick unsuspecting users.',
    realWorldExample: 'Adversaries register deceptive domains like "target-company.com.attacker-controlled.net" to pass casual visual checks and trick applicants into entering login credentials.',
    preventionTip: 'Look at the domain name right before the first single slash (/); that is the actual root domain being visited. When in doubt, search for the official website independently.',
  },
  q5: {
    correctAnswer: 'asks ATM PIN/OTP (or bank asking PIN / CVV and PIN)',
    explanation: 'Banks never conduct KYC over WhatsApp or third-party links, and RBI guidelines explicitly prohibit asking for ATM PIN, CVV, or OTP.',
    realWorldExample: 'Widespread phishing SMS/WhatsApp scams create fake urgency around "expired KYC" to harvest ATM PINs and CVVs, draining victim accounts within minutes.',
    preventionTip: 'Bank KYC is never completed via third-party web forms or WhatsApp messages. Visit your local branch or use the bank\'s official mobile banking application.',
  },
  q6: {
    correctAnswer: 'asks for email password (or do not contact placement office / secrecy demand)',
    explanation: 'No placement officer will ever ask for your private email password or forbid you from verifying the opportunity through official department channels.',
    realWorldExample: 'Scammers pose as coordinators offering elite high-package roles, demanding passwords and requiring secrecy to prevent candidates from verifying with real faculty.',
    preventionTip: 'Demands for secrecy ("Do not contact placement office") are an immediate red flag. Always verify recruitment notices directly with your department coordinator.',
  },
  q7: {
    correctAnswer: 'executable attachment (.exe file / protonmail sender)',
    explanation: 'Mark sheets are always published as PDF or spreadsheet documents. An .exe executable file is a Trojan horse payload designed to install malware.',
    realWorldExample: 'Targeted campus spear-phishing campaigns disguise keyloggers or ransomware inside filenames like "Exam_Schedule.exe" or "Fee_Structure.scr".',
    preventionTip: 'Never execute or download .exe, .scr, or .bat file attachments from unsolicited emails. Institutional documents are distributed as read-only PDFs or through the student portal.',
  },
  q8: {
    correctAnswer: 'UPI PIN to receive money (or entering UPI PIN for reward)',
    explanation: 'Fundamental UPI principle: You NEVER enter your UPI PIN to receive money. Entering your PIN authorizes money being deducted from your account.',
    realWorldExample: 'Fraudsters on student buy/sell groups send "cashback" QR codes claiming to credit prize money, but scanning and entering your PIN instantly debits your bank account.',
    preventionTip: 'Remember the golden rule of UPI: UPI PIN is ONLY entered when paying money out. Receiving funds requires no PIN entry whatsoever.',
  },
  q9: {
    correctAnswer: 'actual domain not Microsoft (subdomain spoofing / security-check.example.org)',
    explanation: 'The domain ends in "security-check.example.org", not "microsoft.com". Attackers prepend legitimate names as subdomains to deceive hurried users.',
    realWorldExample: 'Adversary-in-the-Middle (AiTM) phishing kits clone the exact Microsoft 365 login screen on lookalike subdomains to intercept session cookies and credentials.',
    preventionTip: 'Verify the browser address bar reads "login.microsoftonline.com" or your organization\'s exact tenant URL before submitting corporate credentials.',
  },
  q10: {
    correctAnswer: 'urgency and refusing phone call (do not call me / avoiding call)',
    explanation: 'The explicit instruction "Do not call me" is designed to block out-of-band verification that would immediately expose the hacked account.',
    realWorldExample: 'Account takeover fraud involves hackers compromising an Instagram or WhatsApp account, then messaging all contacts claiming a hospital emergency while refusing voice calls.',
    preventionTip: 'When a friend asks for money under urgent circumstances and refuses voice/video calls, call their known phone number or reach them through an alternate mutual contact.',
  },
  q11: {
    correctAnswer: 'fake domain; identity document request (or account-confirm.example.net; asking password)',
    explanation: 'Sign 1: Spoofed root domain "account-confirm.example.net". Sign 2: Google Drive never requests government identity documents or re-entry of passwords via unsolicited links.',
    realWorldExample: 'Phishing campaigns exploit storage anxiety ("Files deleted in 24 hours") to harvest Google workspace accounts and steal identity documents for secondary identity theft.',
    preventionTip: 'Check your cloud storage quota by opening drive.google.com or one.google.com directly in your browser rather than clicking email warning links.',
  },
  q12: {
    correctAnswer: 'UPI PIN required to receive refund (collect request scam)',
    explanation: 'Scammers send a "Collect / Pay" UPI request while claiming it is a refund. Entering your PIN transfers funds TO the scammer.',
    realWorldExample: 'E-commerce customer support impersonators send UPI collect requests disguised as refunds for failed food deliveries or ride cancellations.',
    preventionTip: 'True e-commerce refunds are credited automatically back to the original payment source. Any instruction to "accept" a payment by typing your PIN is a scam.',
  },
  q13: {
    correctAnswer: 'unexpected login approval request (MFA fatigue attack)',
    explanation: 'This is an MFA Push Fatigue attack combined with social engineering coercion. If you did not initiate a login yourself, approving it grants the attacker full account access.',
    realWorldExample: 'High-profile cyber intrusions (such as the Uber and Cisco breaches) occurred when attackers bombarded employees with MFA push prompts until one was accidentally approved.',
    preventionTip: 'Always tap "Deny" or "No, it\'s not me" for any push notification you did not trigger personally, and report the event immediately to your security helpdesk.',
  },
  q14: {
    correctAnswer: 'external domain; asks current password (or srm-reset.example.net; asking password and OTP)',
    explanation: 'Sign 1: External domain "srm-reset.example.net" rather than the verified institution domain. Sign 2: The portal harvests your CURRENT active password and OTP.',
    realWorldExample: 'Attackers routinely set up phishing pages harvesting both existing passwords and 2FA tokens under the guise of mandatory password expiration policies.',
    preventionTip: 'Official password change portals never require your old password and an OTP on an external domain. Change passwords only via the verified campus IT portal.',
  },
  q15: {
    correctAnswer: 'sensitive document request; secrecy instruction (asking Aadhaar/PAN; do not tell placement department)',
    explanation: 'Sign 1: Excessive collection of sensitive identity & financial credentials (Aadhaar, PAN, bank statements) without prior interviews. Sign 2: Demanding secrecy from the university placement cell.',
    realWorldExample: 'Fraud syndicates harvest student identity proofs (Aadhaar cards and bank statements) to open fraudulent mule bank accounts or register rogue SIM cards in their names.',
    preventionTip: 'Never provide unmasked Aadhaar or bank statements to unverified recruiters. Verify all job offers with the campus placement office before sharing identity documents.',
  },
  q16: {
    correctAnswer: 'unexpected approval request; asks security code (asking six-digit code; threat of suspension)',
    explanation: 'Sign 1: Unsolicited incoming call asking you to trigger or approve an authentication action. Sign 2: Asking you to read out your 6-digit security code while applying suspension threats.',
    realWorldExample: 'Vishing (voice phishing) agents impersonate IT security staff to trick panic-stricken employees into providing MFA codes generated by the attacker\'s simultaneous login attempt.',
    preventionTip: 'Security personnel will never ask you to dictate an authentication code over the phone. Hang up and call the official IT service desk back directly.',
  },
  q17: {
    correctAnswer: 'UPI PIN request; payment urgency (refund via UPI PIN; 10 minutes cancellation)',
    explanation: 'Sign 1: Demanding a UPI PIN to process a supposed refund. Sign 2: Artificial urgency ("Seat Cancelled in 10 Minutes") to induce impulsive compliance.',
    realWorldExample: 'Fake college fest ticketing pages double-charge registration fees and exploit student panic with a 10-minute cancellation countdown.',
    preventionTip: 'Never enter your UPI PIN on payment forms claiming to refund excess charges. Check the official fest portal or contact the student organizing committee in person.',
  },
  q18: {
    correctAnswer: 'fake registered domain; credential harvesting (security-auth.example.net; subdomain spoofing)',
    explanation: 'Mistake 1: The host domain is "security-auth.example.net", disguised with "login.microsoftonline.com" as subdomains. Mistake 2: The landing page acts as an adversary-in-the-middle credential harvester.',
    realWorldExample: 'Adversaries deploy Evilginx and reverse-proxy phishing kits on domain structures that mimic Microsoft SSO, intercepting credentials and session tokens in real time.',
    preventionTip: 'Inspect the Effective Top-Level Domain (eTLD+1) in the browser address bar. Browser security warning banners on external links should never be ignored.',
  },
  q19: {
    correctAnswer: 'excessive OAuth permissions; artificial urgency (reading and sending emails; 5 minutes urgency)',
    explanation: 'Mistake 1: Excessive OAuth permissions (a resume scanner does not need rights to read and send emails on your behalf). Mistake 2: Artificial urgency forcing approval in 5 minutes.',
    realWorldExample: 'Illicit Consent Grants (OAuth phishing) trick users into granting third-party apps permissions to read their mailboxes and send spam from their corporate identity.',
    preventionTip: 'Carefully inspect all requested permissions before clicking "Consent" or "Accept". A simple utility tool should never require full read/write mailbox access.',
  },
  q20: {
    correctAnswer: 'Reply-To mismatch; credential harvesting (mismatched reply-to; asking password and backup email)',
    explanation: 'Mistake 1: Reply-To header diverts replies away from authentic Google servers to an attacker-controlled external domain. Mistake 2: Soliciting sensitive account recovery secrets under threat.',
    realWorldExample: 'Spammers forge the "From" display name as "Google Security" but set the "Reply-To" header to an external address so any user response goes straight to the attacker.',
    preventionTip: 'Inspect full email headers when receiving security alerts. Look for mismatches between the displayed sender, Return-Path, and Reply-To headers.',
  },
  q21: {
    correctAnswer: 'unsolicited recovery call; approval manipulation (unsolicited recovery; forbidding IT contact)',
    explanation: 'Mistake 1: An unsolicited inbound call regarding account recovery when the student never requested one. Mistake 2: Coercing approval of an unauthorized phone number transfer while forbidding IT contact.',
    realWorldExample: 'SIM-swap and account takeover operators initiate self-service password recovery, then phone the victim pretending to be helpdesk engineers canceling the breach.',
    preventionTip: 'Never approve recovery notifications that appear out of the blue. If your recovery phone number is being changed without your knowledge, contact IT immediately.',
  },
  q22: {
    correctAnswer: 'macro execution; urgency pressure (Enable Content prompt; .docm macro document)',
    explanation: 'Mistake 1: The document uses a macro-enabled format (.docm) and tricks the user to Enable Content to execute embedded malicious VBA code. Mistake 2: False 10-minute expiry pressure.',
    realWorldExample: 'Threat actors deliver malware droppers (e.g., Emotet, Qakbot) disguised as official job offers or invoices that instruct users to bypass Word\'s Protected View.',
    preventionTip: 'Never click "Enable Content" or "Enable Macros" on Office documents received via email. Legitimate offer letters do not require code execution.',
  },
  q23: {
    correctAnswer: 'session token theft; fake domain (copying session token; disable browser protection)',
    explanation: 'Mistake 1: Demanding browser session tokens enables adversary session hijacking (bypassing password & MFA). Mistake 2: Fake domain hosted outside official institutional infrastructure.',
    realWorldExample: 'Infostealers and session-theft portals instruct victims to paste code into Developer Tools or copy session cookies, allowing attackers to clone authenticated sessions.',
    preventionTip: 'Never copy browser tokens, cookies, or paste scripts into your browser console. Legitimate websites never ask users to disable browser protection or extract tokens.',
  },
  q24: {
    correctAnswer: 'payment account change; independent verification bypass (change of payment account; do not contact office)',
    explanation: 'Classic Business Email Compromise (BEC): An internal email account was hijacked to redirect fee deposits to an attacker UPI handle while blocking out-of-band verification.',
    realWorldExample: 'Attackers compromise a legitimate professor or coordinator\'s email and send modified banking instructions for tuition or fee deposits, costing institutions millions.',
    preventionTip: 'Always independently verify any unexpected changes to payment instructions or bank accounts using an established, trusted phone number or in-person check.',
  },
  q25: {
    correctAnswer: 'Malicious OAuth app; deny login approval; revoke access (Internship Resume Scanner; deny prompts; revoke permissions)',
    explanation: 'Action 1: Identify the "Internship Resume Scanner" as a malicious OAuth application. Action 2: Immediately deny the unsolicited login approval prompts. Action 3: Revoke app permissions from connected applications.',
    realWorldExample: 'Modern advanced persistent threat (APT) campaigns combine OAuth consent abuse, credential phishing, and MFA fatigue to establish persistent footholds.',
    preventionTip: 'Audit third-party connected apps in your account settings regularly. Immediately revoke permissions for unknown applications and report unauthorized access.',
  },
};

export function getQuestionDebrief(question: HuntQuestion): QuestionDebriefInfo {
  const debrief = QUESTION_DEBRIEFS[question.id];
  if (debrief) return debrief;

  return {
    correctAnswer: question.exampleAnswer,
    explanation: question.explanation,
    realWorldExample: 'Attackers frequently exploit social engineering, brand impersonation, and artificial urgency to manipulate victims before they can verify details.',
    preventionTip: 'Always verify suspicious communications through independent official channels. Never share passwords, PINs, or session tokens.',
  };
}

// Clean and normalize strings for matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[;,\-–—_/|.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function evaluateQuestionAnswer(
  question: HuntQuestion,
  rawAnswer: string
): { isCorrect: boolean; score: number; matchedKeywords: string[]; message: string } {
  if (!rawAnswer || !rawAnswer.trim()) {
    return {
      isCorrect: false,
      score: 0,
      matchedKeywords: [],
      message: 'Unanswered',
    };
  }

  const normalizedInput = normalizeText(rawAnswer);
  const matched = new Set<string>();

  // Check each accepted keyword
  for (const accepted of question.acceptedKeywords) {
    const normalizedAccepted = normalizeText(accepted);
    // Check direct inclusion or key word overlap
    if (normalizedInput.includes(normalizedAccepted)) {
      matched.add(accepted);
      continue;
    }

    // Check significant word stems
    const acceptedWords = normalizedAccepted.split(' ').filter((w) => w.length > 2);
    if (acceptedWords.length >= 2) {
      const allFound = acceptedWords.every((w) => normalizedInput.includes(w));
      if (allFound) {
        matched.add(accepted);
      }
    }
  }

  const matchedCount = matched.size;
  const isSatisfied = matchedCount >= question.requiredKeywordCount;

  if (isSatisfied) {
    return {
      isCorrect: true,
      score: question.correctPoints,
      matchedKeywords: Array.from(matched),
      message: `CORRECT (+${question.correctPoints} PTS)`,
    };
  }

  // Partial match check for 2-keyword or 3-keyword questions
  if (question.requiredKeywordCount > 1 && matchedCount > 0) {
    const partialScore = Math.round((matchedCount / question.requiredKeywordCount) * question.correctPoints);
    return {
      isCorrect: true,
      score: partialScore,
      matchedKeywords: Array.from(matched),
      message: `PARTIAL MATCH (+${partialScore} PTS // Matched ${matchedCount}/${question.requiredKeywordCount})`,
    };
  }

  return {
    isCorrect: false,
    score: question.wrongPenalty,
    matchedKeywords: [],
    message: `INCORRECT (${question.wrongPenalty} PTS)`,
  };
}

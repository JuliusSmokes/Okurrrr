#!/usr/bin/env node
/**
 * build-free-resources.js
 * Reads 3 existing JSON files + Courses/CTFs/Labs, merges, re-indexes, and writes free-resources.json
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "data", "free-resources.json");

// --- Courses (fr001-fr021) ---
const COURSES = [
  { name: "MIT OCW Computer Systems Security", provider: "MIT", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/", description: "Graduate-level course covering exploitation techniques, sandboxing, web security, and network protocols.", level: "Intermediate", cisspDomains: "cissp-d3/d8", niceCategories: "Protect and Defend", tags: ["MIT", "exploitation", "web security", "graduate"] },
  { name: "MIT OCW Network and Computer Security", provider: "MIT", url: "https://ocw.mit.edu/courses/6-857-network-and-computer-security-spring-2014/", description: "Graduate course on cryptographic protocols, network security, and secure system design.", level: "Intermediate", cisspDomains: "cissp-d3/d4", niceCategories: "Protect and Defend", tags: ["MIT", "cryptography", "network security"] },
  { name: "Stanford Cryptography I", provider: "Stanford/Coursera", url: "https://www.coursera.org/learn/crypto", description: "Free audit of Dan Boneh's landmark cryptography course covering stream ciphers, block ciphers, and public-key crypto.", level: "Intermediate", cisspDomains: "cissp-d3", niceCategories: "Securely Provision", tags: ["Coursera", "Stanford", "cryptography", "audit"] },
  { name: "Carnegie Mellon OLI", provider: "Carnegie Mellon", url: "https://oli.cmu.edu/", description: "Free open learning courses including Information Security and Computing fundamentals.", level: "Beginner", cisspDomains: "cissp-d1/d7", niceCategories: "Oversee and Govern", tags: ["OLI", "open learning", "fundamentals"] },
  { name: "CISA Free Training", provider: "CISA", url: "https://www.cisa.gov/cybersecurity-training-exercises", description: "Free cybersecurity training and exercises from the Cybersecurity and Infrastructure Security Agency.", level: "Beginner", cisspDomains: "cissp-d1/d7", niceCategories: "Protect and Defend", tags: ["CISA", "government", "training"] },
  { name: "SANS Cyber Aces", provider: "SANS", url: "https://www.sans.org/cyberaces/", description: "Free introductory courses in operating systems, networking, and system administration security.", level: "Beginner", cisspDomains: "cissp-d7", niceCategories: "Operate and Maintain", tags: ["SANS", "networking", "OS", "introductory"] },
  { name: "Professor Messer CompTIA Security+", provider: "Professor Messer", url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/", description: "Free video training series covering all CompTIA Security+ SY0-701 exam objectives.", level: "Beginner", cisspDomains: "cissp-d1/d3/d7", niceCategories: "Protect and Defend", tags: ["CompTIA", "Security+", "video", "certification"] },
  { name: "Professor Messer CompTIA Network+", provider: "Professor Messer", url: "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-comptia-network-plus-course/", description: "Free video series covering all CompTIA Network+ N10-009 exam objectives.", level: "Beginner", cisspDomains: "cissp-d4", niceCategories: "Operate and Maintain", tags: ["CompTIA", "Network+", "video", "networking"] },
  { name: "Cybrary Free Tier", provider: "Cybrary", url: "https://www.cybrary.it/", description: "Free cybersecurity courses and virtual labs with career paths and skill assessments.", level: "Beginner", cisspDomains: "cissp-d1/d7", niceCategories: "Protect and Defend", tags: ["Cybrary", "courses", "labs", "career paths"] },
  { name: "Coursera Cybersecurity Specialization (Georgia Tech)", provider: "Georgia Tech/Coursera", url: "https://www.coursera.org/specializations/intro-cyber-security", description: "Free audit of Georgia Tech's cybersecurity specialization covering network security, crypto, and systems security.", level: "Intermediate", cisspDomains: "cissp-d3/d4", niceCategories: "Protect and Defend/Securely Provision", tags: ["Coursera", "Georgia Tech", "specialization", "audit"] },
  { name: "Splunk Fundamentals 1", provider: "Splunk", url: "https://education.splunk.com/learningpath/splunk-fundamentals-1", description: "Free foundational course on Splunk search, reporting, dashboards, and the SPL query language.", level: "Beginner", cisspDomains: "cissp-d7", niceCategories: "Investigate/Analyze", tags: ["Splunk", "SPL", "SIEM", "dashboards"] },
  { name: "Microsoft Learn Security", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/training/browse/?terms=security", description: "Free Microsoft Learn modules covering Azure security, Microsoft 365 security, and identity management.", level: "Beginner", cisspDomains: "cissp-d5/d7", niceCategories: "Protect and Defend", tags: ["Microsoft", "Azure", "identity", "cloud"] },
  { name: "AWS Security Learning Path", provider: "AWS", url: "https://aws.amazon.com/training/learn-about/security/", description: "Free AWS training covering cloud security fundamentals, IAM, encryption, and compliance.", level: "Beginner", cisspDomains: "cissp-d3/d5", niceCategories: "Securely Provision", tags: ["AWS", "cloud security", "IAM", "encryption"] },
  { name: "Google Cybersecurity Certificate", provider: "Google/Coursera", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", description: "Free audit of Google's entry-level cybersecurity certificate covering Linux, Python, SQL, and SIEM.", level: "Beginner", cisspDomains: "cissp-d1/d7", niceCategories: "Protect and Defend", tags: ["Coursera", "Google", "certificate", "entry-level"] },
  { name: "fast.ai", provider: "fast.ai", url: "https://www.fast.ai/", description: "Free deep learning courses with practical approach covering neural networks, NLP, and computer vision.", level: "Intermediate", cisspDomains: "cissp-d8", niceCategories: "Securely Provision", tags: ["ML", "deep learning", "NLP", "practical"] },
  { name: "Google ML Crash Course", provider: "Google", url: "https://developers.google.com/machine-learning/crash-course", description: "Free machine learning crash course with TensorFlow covering ML concepts, data prep, and model training.", level: "Beginner", cisspDomains: "cissp-d8", niceCategories: "Securely Provision", tags: ["ML", "TensorFlow", "crash course", "Google"] },
  { name: "Khan Academy Cryptography", provider: "Khan Academy", url: "https://www.khanacademy.org/computing/computer-science/cryptography", description: "Free interactive cryptography course covering ciphers, modular arithmetic, and Diffie-Hellman.", level: "Beginner", cisspDomains: "cissp-d3", niceCategories: "Protect and Defend", tags: ["Khan Academy", "cryptography", "interactive", "ciphers"] },
  { name: "FedVTE", provider: "CISA", url: "https://fedvte.usalearning.gov/", description: "Federal Virtual Training Environment with 800+ hours of free cybersecurity training.", level: "Beginner", cisspDomains: "cissp-d1/d7", niceCategories: "Protect and Defend", tags: ["CISA", "federal", "government", "training"] },
  { name: "edX Cybersecurity MicroMasters (RIT)", provider: "RIT/edX", url: "https://www.edx.org/micromasters/ritx-cybersecurity", description: "Free audit of RIT's MicroMasters covering network security, forensics, and risk management.", level: "Intermediate", cisspDomains: "cissp-d4/d6", niceCategories: "Protect and Defend/Investigate", tags: ["edX", "RIT", "MicroMasters", "forensics"] },
  { name: "Cisco Networking Academy", provider: "Cisco", url: "https://www.netacad.com/courses/cybersecurity", description: "Free cybersecurity courses including Introduction to Cybersecurity and Cybersecurity Essentials.", level: "Beginner", cisspDomains: "cissp-d4/d7", niceCategories: "Operate and Maintain", tags: ["Cisco", "NetAcad", "networking", "essentials"] },
  { name: "TCM Security Academy Free Content", provider: "TCM Security", url: "https://academy.tcm-sec.com/", description: "Free cybersecurity courses on ethical hacking, OSINT, and Active Directory.", level: "Beginner", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend/Investigate", tags: ["TCM Security", "ethical hacking", "OSINT", "Active Directory"] },
];

// --- CTFs (fr022-fr036) ---
const CTFS = [
  { name: "picoCTF", provider: "Carnegie Mellon", url: "https://picoctf.org/", description: "Free beginner-friendly CTF platform with year-round challenges covering web exploitation, forensics, and crypto.", level: "Beginner", cisspDomains: "cissp-d6/d8", niceCategories: "Protect and Defend", tags: ["CTF", "beginner", "web", "forensics"] },
  { name: "EC-Council CodeRed", provider: "EC-Council", url: "https://codered.eccouncil.org/", description: "Free cybersecurity courses and CTF challenges from EC-Council covering ethical hacking and defense.", level: "Beginner", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend", tags: ["EC-Council", "CTF", "ethical hacking"] },
  { name: "TryHackMe Free Rooms", provider: "TryHackMe", url: "https://tryhackme.com/", description: "Guided cybersecurity training with browser-based virtual machines and free beginner rooms.", level: "Beginner", cisspDomains: "cissp-d6/d7", niceCategories: "Protect and Defend", tags: ["TryHackMe", "CTF", "guided", "VMs"] },
  { name: "Hack The Box Free Tier", provider: "Hack The Box", url: "https://www.hackthebox.com/", description: "Hands-on hacking platform with free machines, challenges, and competitive CTF environments.", level: "Intermediate", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend/Investigate", tags: ["Hack The Box", "CTF", "machines", "pentesting"] },
  { name: "OverTheWire", provider: "OverTheWire", url: "https://overthewire.org/wargames/", description: "Wargames teaching security concepts including Bandit (Linux), Natas (web), and Leviathan (exploitation).", level: "Beginner", cisspDomains: "cissp-d7/d8", niceCategories: "Protect and Defend", tags: ["wargames", "Bandit", "Natas", "Linux"] },
  { name: "pwn.college", provider: "ASU", url: "https://pwn.college/", description: "Free cybersecurity education platform from Arizona State University with hands-on binary exploitation challenges.", level: "Intermediate", cisspDomains: "cissp-d8", niceCategories: "Protect and Defend", tags: ["ASU", "binary exploitation", "pwn", "education"] },
  { name: "CryptoHack", provider: "CryptoHack", url: "https://cryptohack.org/", description: "Free interactive platform for learning modern cryptography through gamified challenges.", level: "Beginner", cisspDomains: "cissp-d3", niceCategories: "Analyze/Protect and Defend", tags: ["cryptography", "CTF", "gamified", "interactive"] },
  { name: "Cryptopals (Matasano)", provider: "NCC Group", url: "https://cryptopals.com/", description: "Eight sets of practical cryptographic exercises teaching real-world attacks on crypto implementations.", level: "Intermediate", cisspDomains: "cissp-d3/d6", niceCategories: "Analyze", tags: ["Cryptopals", "cryptography", "exercises", "attacks"] },
  { name: "SANS Holiday Hack / KringleCon", provider: "SANS", url: "https://www.holidayhackchallenge.com/", description: "Annual free CTF event by SANS covering offensive and defensive security with creative challenges.", level: "Intermediate", cisspDomains: "cissp-d6/d7", niceCategories: "Protect and Defend", tags: ["SANS", "KringleCon", "annual", "holiday"] },
  { name: "National Cyber League", provider: "National Cyber League", url: "https://nationalcyberleague.org/", description: "CTF-style competition for students covering OSINT, cryptography, log analysis, and network traffic.", level: "Beginner", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend", tags: ["NCL", "students", "competition", "OSINT"] },
  { name: "RingZer0 CTF", provider: "RingZer0", url: "https://ringzer0ctf.com/", description: "Online CTF platform with 500+ challenges covering crypto, web, forensics, and reverse engineering.", level: "Intermediate", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend/Investigate", tags: ["RingZer0", "CTF", "forensics", "RE"] },
  { name: "CTFtime.org", provider: "CTFtime", url: "https://ctftime.org/", description: "Global CTF event tracker and team ranking platform listing upcoming and past CTF competitions.", level: "Beginner", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend", tags: ["CTFtime", "tracker", "competitions", "ranking"] },
  { name: "Gandalf (Lakera)", provider: "Lakera", url: "https://gandalf.lakera.ai/", description: "Interactive prompt injection challenge where you try to extract secrets from an AI guardian.", level: "Beginner", cisspDomains: "cissp-d8", niceCategories: "Protect and Defend", tags: ["prompt injection", "AI security", "LLM", "challenge"] },
  { name: "HackAPrompt", provider: "Learn Prompting", url: "https://www.aicrowd.com/challenges/hackaprompt-2023", description: "Prompt injection CTF challenge for learning about LLM vulnerabilities and adversarial prompting.", level: "Intermediate", cisspDomains: "cissp-d8", niceCategories: "Protect and Defend", tags: ["HackAPrompt", "prompt injection", "LLM", "AI security"] },
  { name: "DEF CON AI Village", provider: "AI Village", url: "https://aivillage.org/", description: "Resources and CTF events focused on adversarial machine learning and AI security from DEF CON.", level: "Expert", cisspDomains: "cissp-d8", niceCategories: "Analyze", tags: ["DEF CON", "AI Village", "adversarial ML", "AI security"] },
];

// --- Labs (fr037-fr055) ---
const LABS = [
  { name: "GOAD (Game of Active Directory)", provider: "Orange CyberDefense", url: "https://github.com/Orange-Cyberdefense/GOAD", description: "Vulnerable Active Directory lab with 5 VMs, 2 forests, and 3 domains for pentesting practice.", level: "Expert", cisspDomains: "cissp-d5/d6", niceCategories: "Investigate", tags: ["Active Directory", "lab", "pentesting", "VMs"] },
  { name: "DetectionLab", provider: "Chris Long", url: "https://github.com/clong/DetectionLab", description: "Pre-built lab environment with Splunk, osquery, and Sysmon for testing detection and response.", level: "Intermediate", cisspDomains: "cissp-d7", niceCategories: "Protect and Defend", tags: ["lab", "Splunk", "Sysmon", "detection"] },
  { name: "Splunk Attack Range", provider: "Splunk", url: "https://github.com/splunk/attack_range", description: "Automated lab for simulating attacks against Windows, generating telemetry, and testing Splunk detections.", level: "Intermediate", cisspDomains: "cissp-d7", niceCategories: "Protect and Defend/Investigate", tags: ["Splunk", "attack simulation", "Windows", "detection"] },
  { name: "DVWA", provider: "DVWA", url: "https://github.com/digininja/DVWA", description: "Damn Vulnerable Web Application for practicing web attacks in a legal, intentionally insecure PHP/MySQL app.", level: "Beginner", cisspDomains: "cissp-d6/d8", niceCategories: "Protect and Defend", tags: ["DVWA", "web", "vulnerable", "OWASP"] },
  { name: "VulnHub", provider: "VulnHub", url: "https://www.vulnhub.com/", description: "Collection of vulnerable virtual machine images for offline penetration testing practice.", level: "Intermediate", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend", tags: ["VulnHub", "VMs", "pentesting", "vulnerable"] },
  { name: "Metasploitable", provider: "Rapid7", url: "https://docs.rapid7.com/metasploit/metasploitable-2/", description: "Intentionally vulnerable Linux VM designed for Metasploit training and security testing practice.", level: "Beginner", cisspDomains: "cissp-d6", niceCategories: "Protect and Defend/Investigate", tags: ["Metasploit", "vulnerable", "Linux", "VM"] },
  { name: "CloudGoat", provider: "Rhino Security Labs", url: "https://github.com/RhinoSecurityLabs/cloudgoat", description: "Vulnerable-by-design AWS deployment for learning cloud penetration testing and exploitation.", level: "Intermediate", cisspDomains: "cissp-d3/d6", niceCategories: "Protect and Defend", tags: ["AWS", "cloud", "vulnerable", "pentesting"] },
  { name: "Flaws.cloud", provider: "Scott Piper", url: "http://flaws.cloud/", description: "CTF-style challenges teaching common AWS security misconfigurations through progressive levels.", level: "Beginner", cisspDomains: "cissp-d3/d5", niceCategories: "Protect and Defend", tags: ["AWS", "CTF", "misconfiguration", "cloud"] },
  { name: "Flaws2.cloud", provider: "Scott Piper", url: "http://flaws2.cloud/", description: "Sequel to Flaws.cloud with both attacker and defender perspectives on AWS security issues.", level: "Intermediate", cisspDomains: "cissp-d3/d5", niceCategories: "Protect and Defend", tags: ["AWS", "Flaws", "attacker", "defender"] },
  { name: "GCPGoat", provider: "INE Security", url: "https://github.com/ine-labs/GCPGoat", description: "Vulnerable Google Cloud infrastructure for practicing GCP-specific penetration testing.", level: "Intermediate", cisspDomains: "cissp-d3/d6", niceCategories: "Protect and Defend", tags: ["GCP", "cloud", "vulnerable", "pentesting"] },
  { name: "AzureGoat", provider: "INE Security", url: "https://github.com/ine-labs/AzureGoat", description: "Vulnerable Azure infrastructure with OWASP Top 10 and cloud misconfigurations for pentesting.", level: "Intermediate", cisspDomains: "cissp-d3/d6", niceCategories: "Protect and Defend", tags: ["Azure", "cloud", "OWASP", "pentesting"] },
  { name: "Kubernetes Goat", provider: "Madhu Akula", url: "https://github.com/madhuakula/kubernetes-goat", description: "Intentionally vulnerable Kubernetes cluster environment for learning container security.", level: "Intermediate", cisspDomains: "cissp-d3/d8", niceCategories: "Protect and Defend", tags: ["Kubernetes", "containers", "vulnerable", "security"] },
  { name: "Damn Vulnerable LLM Application", provider: "OWASP", url: "https://github.com/OWASP/www-project-vulnerable-llm-application", description: "Vulnerable AI application for learning OWASP LLM Top 10 vulnerabilities including prompt injection.", level: "Intermediate", cisspDomains: "cissp-d8", niceCategories: "Protect and Defend", tags: ["OWASP", "LLM", "vulnerable", "prompt injection"] },
  { name: "OWASP Juice Shop", provider: "OWASP", url: "https://owasp.org/www-project-juice-shop/", description: "Insecure web application covering all OWASP Top 10 vulnerabilities with gamified challenge tracking.", level: "Beginner", cisspDomains: "cissp-d6/d8", niceCategories: "Protect and Defend", tags: ["OWASP", "Juice Shop", "web security", "Top 10"] },
  { name: "OWASP WebGoat", provider: "OWASP", url: "https://owasp.org/www-project-webgoat/", description: "Deliberately insecure Java application for learning web security flaws with built-in lessons.", level: "Beginner", cisspDomains: "cissp-d8", niceCategories: "Protect and Defend/Securely Provision", tags: ["OWASP", "WebGoat", "web security", "Java"] },
  { name: "Malware Unicorn RE Workshops", provider: "Amanda Rousseau", url: "https://malwareunicorn.org/#/workshops", description: "Free reverse engineering workshops with hands-on exercises for malware analysis beginners.", level: "Intermediate", cisspDomains: "cissp-d7", niceCategories: "Investigate", tags: ["reverse engineering", "malware", "workshops", "RE"] },
  { name: "Cisco Modeling Labs", provider: "Cisco", url: "https://developer.cisco.com/modeling-labs/", description: "Network simulation platform for designing and testing network topologies with real Cisco images.", level: "Intermediate", cisspDomains: "cissp-d4", niceCategories: "Operate and Maintain", tags: ["Cisco", "network simulation", "topology"] },
  { name: "Eve-NG Community", provider: "Eve-NG", url: "https://www.eve-ng.net/", description: "Free network emulation platform supporting multi-vendor images for lab environments.", level: "Intermediate", cisspDomains: "cissp-d4", niceCategories: "Operate and Maintain", tags: ["Eve-NG", "network emulation", "lab"] },
  { name: "ServiceNow Developer Instance", provider: "ServiceNow", url: "https://developer.servicenow.com/", description: "Free personal developer instance of ServiceNow for learning ITSM, security operations, and automation.", level: "Beginner", cisspDomains: "cissp-d7/d1", niceCategories: "Operate and Maintain", tags: ["ServiceNow", "ITSM", "developer", "instance"] },
];

function parseCisspDomains(s) {
  if (!s) return [];
  return s.split("/").map((d) => {
    d = d.trim();
    if (d && !d.startsWith("cissp-")) d = "cissp-" + d;
    return d;
  }).filter(Boolean);
}

function parseNiceCategories(s) {
  if (!s) return [];
  return s.split("/").map((c) => c.trim()).filter(Boolean);
}

function toResource(entry, category, tags) {
  return {
    id: "", // will be set during re-index
    name: entry.name,
    provider: entry.provider,
    url: entry.url,
    description: entry.description,
    category,
    tags: tags || entry.tags,
    level: entry.level,
    cisspDomains: Array.isArray(entry.cisspDomains) ? entry.cisspDomains : parseCisspDomains(entry.cisspDomains),
    niceCategories: Array.isArray(entry.niceCategories) ? entry.niceCategories : parseNiceCategories(entry.niceCategories),
    relatedCertIds: [],
  };
}

function buildNewEntries() {
  const out = [];
  COURSES.forEach((e) => out.push(toResource(e, "Courses", e.tags)));
  CTFS.forEach((e) => out.push(toResource(e, "CTFs", e.tags)));
  LABS.forEach((e) => out.push(toResource(e, "Labs", e.tags)));
  return out;
}

function main() {
  const freeCyb = JSON.parse(fs.readFileSync(path.join(ROOT, "free-cybersecurity-resources.json"), "utf8"));
  const cybRes = JSON.parse(fs.readFileSync(path.join(ROOT, "cybersecurity-resources.json"), "utf8"));
  const cybResAlt = JSON.parse(fs.readFileSync(path.join(ROOT, "cybersecurity_resources.json"), "utf8"));

  const newEntries = buildNewEntries();
  const merged = [...newEntries, ...freeCyb, ...cybRes, ...cybResAlt];

  // Re-index IDs sequentially (fr001, fr002, ...)
  merged.forEach((item, i) => {
    item.id = "fr" + String(i + 1).padStart(3, "0");
  });

  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(merged, null, 2), "utf8");
  console.log(`Wrote ${OUTPUT} with ${merged.length} entries.`);
}

main();

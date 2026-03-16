const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'free-resources.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const newEntries = [
  {
    name: "Phrack Magazine",
    provider: "Phrack",
    url: "https://archives.phrack.org/issues/",
    description: "Legendary hacker e-zine published since 1985. Deep technical articles on exploitation, reverse engineering, telephony, and the hacker underground.",
    category: "Research",
    tags: ["hacker culture", "exploitation", "reverse engineering", "classic"],
    level: "Expert",
    cisspDomains: ["cissp-d3", "cissp-d8"],
    niceCategories: ["Analyze", "Protect and Defend"],
    relatedCertIds: []
  },

  // ── Shells and Terminal Multiplexers ──
  {
    name: "GNU Bash Reference Manual",
    provider: "GNU Project",
    url: "https://www.gnu.org/software/bash/manual/bash.html",
    description: "Complete reference for the Bourne Again Shell, the default shell on most Linux distributions.",
    category: "Command Shells and CLI Tools",
    tags: ["shell", "bash", "scripting", "Linux"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "Zsh Documentation",
    provider: "Zsh Project",
    url: "https://zsh.sourceforge.io/Doc/",
    description: "Documentation for Zsh, a powerful shell with advanced completion, globbing, and plugin ecosystems.",
    category: "Command Shells and CLI Tools",
    tags: ["shell", "zsh", "scripting"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "PowerShell Documentation",
    provider: "Microsoft",
    url: "https://learn.microsoft.com/en-us/powershell/",
    description: "Official documentation for PowerShell, the cross-platform task automation and configuration management framework.",
    category: "Command Shells and CLI Tools",
    tags: ["PowerShell", "Windows", "scripting", "automation"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "Fish Shell Documentation",
    provider: "Fish Shell",
    url: "https://fishshell.com/docs/current/",
    description: "User-friendly shell with auto-suggestions, syntax highlighting, and sane defaults out of the box.",
    category: "Command Shells and CLI Tools",
    tags: ["shell", "fish", "user-friendly"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "tmux Wiki",
    provider: "tmux",
    url: "https://github.com/tmux/tmux/wiki",
    description: "Terminal multiplexer that lets you switch between programs in one terminal, detach and reattach sessions.",
    category: "Command Shells and CLI Tools",
    tags: ["terminal", "multiplexer", "sessions"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },

  // ── Network Tools ──
  {
    name: "Nmap Reference Guide",
    provider: "Nmap Project",
    url: "https://nmap.org/book/man.html",
    description: "The definitive network scanner for host discovery, port scanning, service detection, and OS fingerprinting.",
    category: "Command Shells and CLI Tools",
    tags: ["network", "scanning", "reconnaissance", "nmap"],
    level: "Beginner",
    cisspDomains: ["cissp-d4", "cissp-d6"],
    niceCategories: ["Protect and Defend", "Analyze"],
    relatedCertIds: []
  },
  {
    name: "Netcat (ncat) Guide",
    provider: "Nmap Project",
    url: "https://nmap.org/ncat/guide/",
    description: "The Swiss army knife of networking. Read/write data across TCP/UDP connections for debugging, file transfer, and reverse shells.",
    category: "Command Shells and CLI Tools",
    tags: ["network", "netcat", "TCP", "reverse shell"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Wireshark / tshark User Guide",
    provider: "Wireshark Foundation",
    url: "https://www.wireshark.org/docs/wsug_html_chunked/",
    description: "Packet capture and protocol analysis. tshark is the CLI counterpart for scriptable traffic analysis.",
    category: "Command Shells and CLI Tools",
    tags: ["packet capture", "wireshark", "tshark", "protocol analysis"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d7"],
    niceCategories: ["Protect and Defend", "Analyze"],
    relatedCertIds: []
  },
  {
    name: "tcpdump Manual",
    provider: "tcpdump.org",
    url: "https://www.tcpdump.org/manpages/tcpdump.1.html",
    description: "Command-line packet analyzer. Capture and display network packets with powerful BPF filtering.",
    category: "Command Shells and CLI Tools",
    tags: ["packet capture", "tcpdump", "BPF", "network"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "curl Documentation",
    provider: "curl Project",
    url: "https://curl.se/docs/",
    description: "Transfer data with URLs. Supports HTTP, HTTPS, FTP, and dozens of other protocols. Essential for API testing.",
    category: "Command Shells and CLI Tools",
    tags: ["HTTP", "API", "curl", "data transfer"],
    level: "Beginner",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "OpenSSL Command Reference",
    provider: "OpenSSL Project",
    url: "https://www.openssl.org/docs/man3.0/man1/",
    description: "CLI toolkit for TLS/SSL, certificate management, encryption, hashing, and key generation.",
    category: "Command Shells and CLI Tools",
    tags: ["TLS", "SSL", "certificates", "cryptography", "openssl"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "dig / nslookup (BIND 9 Utilities)",
    provider: "ISC",
    url: "https://bind9.readthedocs.io/en/latest/manpages.html",
    description: "DNS query tools for domain resolution, record lookups, and DNS debugging.",
    category: "Command Shells and CLI Tools",
    tags: ["DNS", "dig", "nslookup", "resolution"],
    level: "Beginner",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "ss / netstat Quick Reference",
    provider: "Linux man-pages",
    url: "https://man7.org/linux/man-pages/man8/ss.8.html",
    description: "Socket statistics utility. Investigate network connections, listening ports, and socket states.",
    category: "Command Shells and CLI Tools",
    tags: ["sockets", "connections", "ss", "netstat"],
    level: "Beginner",
    cisspDomains: ["cissp-d4", "cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "iptables / nftables Documentation",
    provider: "netfilter.org",
    url: "https://wiki.nftables.org/wiki-nftables/index.php/Main_Page",
    description: "Linux firewall frameworks for packet filtering, NAT, and traffic control.",
    category: "Command Shells and CLI Tools",
    tags: ["firewall", "iptables", "nftables", "packet filtering"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },

  // ── Forensics and Recon ──
  {
    name: "Volatility 3 Documentation",
    provider: "Volatility Foundation",
    url: "https://volatility3.readthedocs.io/en/latest/",
    description: "Advanced memory forensics framework for analyzing RAM dumps and extracting artifacts from Windows, Linux, and macOS.",
    category: "Command Shells and CLI Tools",
    tags: ["memory forensics", "volatility", "DFIR", "RAM analysis"],
    level: "Expert",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "Autopsy Digital Forensics",
    provider: "Sleuth Kit",
    url: "https://www.autopsy.com/documentation/",
    description: "Open-source digital forensics platform with disk imaging, timeline analysis, and keyword search.",
    category: "Command Shells and CLI Tools",
    tags: ["disk forensics", "autopsy", "DFIR", "imaging"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "binwalk Firmware Analysis",
    provider: "binwalk",
    url: "https://github.com/ReFirmLabs/binwalk",
    description: "Firmware analysis tool for scanning, extracting, and reverse engineering embedded file systems and binary blobs.",
    category: "Command Shells and CLI Tools",
    tags: ["firmware", "reverse engineering", "binwalk", "IoT"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d8"],
    niceCategories: ["Analyze"],
    relatedCertIds: []
  },
  {
    name: "strings / file / xxd (GNU Coreutils & Forensics)",
    provider: "GNU Project",
    url: "https://www.gnu.org/software/coreutils/manual/coreutils.html",
    description: "Essential file inspection: extract printable strings, identify file types, and perform hex dumps.",
    category: "Command Shells and CLI Tools",
    tags: ["strings", "file", "hex", "binary analysis"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "lsof Reference",
    provider: "Linux man-pages",
    url: "https://man7.org/linux/man-pages/man8/lsof.8.html",
    description: "List open files and the processes using them. Critical for identifying which process holds a port or file.",
    category: "Command Shells and CLI Tools",
    tags: ["lsof", "open files", "processes", "troubleshooting"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "strace / ltrace Reference",
    provider: "Linux man-pages",
    url: "https://man7.org/linux/man-pages/man1/strace.1.html",
    description: "Trace system calls and library calls made by a process. Invaluable for debugging and malware analysis.",
    category: "Command Shells and CLI Tools",
    tags: ["strace", "ltrace", "system calls", "debugging"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7", "cissp-d8"],
    niceCategories: ["Analyze"],
    relatedCertIds: []
  },

  // ── Pentesting and Exploitation ──
  {
    name: "Metasploit Framework Documentation",
    provider: "Rapid7",
    url: "https://docs.metasploit.com/",
    description: "The most widely used penetration testing framework. Exploits, payloads, post-exploitation, and auxiliary modules.",
    category: "Command Shells and CLI Tools",
    tags: ["Metasploit", "exploitation", "pentest", "msfconsole"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend", "Analyze"],
    relatedCertIds: []
  },
  {
    name: "sqlmap Usage Guide",
    provider: "sqlmap Project",
    url: "https://github.com/sqlmapproject/sqlmap/wiki/Usage",
    description: "Automatic SQL injection detection and exploitation tool. Supports multiple DBMS backends.",
    category: "Command Shells and CLI Tools",
    tags: ["SQL injection", "sqlmap", "database", "exploitation"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Nikto Web Scanner",
    provider: "CIRT.net",
    url: "https://github.com/sullo/nikto",
    description: "Open-source web server scanner that tests for dangerous files, outdated software, and misconfigurations.",
    category: "Command Shells and CLI Tools",
    tags: ["web scanner", "nikto", "vulnerability", "HTTP"],
    level: "Beginner",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Gobuster / ffuf (Web Fuzzing)",
    provider: "Open Source",
    url: "https://github.com/OJ/gobuster",
    description: "Directory and DNS brute-forcing tools for web content discovery. ffuf is the alternative with advanced filtering.",
    category: "Command Shells and CLI Tools",
    tags: ["fuzzing", "gobuster", "ffuf", "directory busting"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Hashcat Documentation",
    provider: "Hashcat",
    url: "https://hashcat.net/wiki/",
    description: "GPU-accelerated password recovery tool supporting 300+ hash types. The gold standard for offline cracking.",
    category: "Command Shells and CLI Tools",
    tags: ["password cracking", "hashcat", "GPU", "hashes"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "John the Ripper",
    provider: "Openwall",
    url: "https://www.openwall.com/john/doc/",
    description: "Classic password cracker supporting many formats. Combines dictionary, brute-force, and hybrid attacks.",
    category: "Command Shells and CLI Tools",
    tags: ["password cracking", "john", "brute force"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Hydra (THC)",
    provider: "THC",
    url: "https://github.com/vanhauser-thc/thc-hydra",
    description: "Fast online password brute-forcing tool supporting SSH, FTP, HTTP, SMB, and many other protocols.",
    category: "Command Shells and CLI Tools",
    tags: ["brute force", "hydra", "online cracking", "credentials"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5", "cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Aircrack-ng Documentation",
    provider: "Aircrack-ng",
    url: "https://www.aircrack-ng.org/documentation.html",
    description: "Complete suite for WiFi security auditing: monitoring, attacking, testing, and cracking WEP/WPA.",
    category: "Command Shells and CLI Tools",
    tags: ["wireless", "WiFi", "WPA", "aircrack"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Responder",
    provider: "SpiderLabs",
    url: "https://github.com/SpiderLabs/Responder",
    description: "LLMNR/NBT-NS/mDNS poisoner for credential capture on internal networks. Staple of internal pentests.",
    category: "Command Shells and CLI Tools",
    tags: ["LLMNR", "credential capture", "internal pentest", "Responder"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Impacket",
    provider: "Fortra (SecureAuth)",
    url: "https://github.com/fortra/impacket",
    description: "Collection of Python classes for working with network protocols. Essential for SMB, Kerberos, and LDAP attacks.",
    category: "Command Shells and CLI Tools",
    tags: ["Impacket", "SMB", "Kerberos", "Active Directory"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d5"],
    niceCategories: ["Protect and Defend", "Analyze"],
    relatedCertIds: []
  },

  // ── DFIR and Log Analysis ──
  {
    name: "journalctl Reference",
    provider: "systemd",
    url: "https://www.freedesktop.org/software/systemd/man/latest/journalctl.html",
    description: "Query and display logs from the systemd journal. Filter by service, priority, time range, and boot.",
    category: "Command Shells and CLI Tools",
    tags: ["logs", "journalctl", "systemd", "DFIR"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "auditd / auditctl Reference",
    provider: "Linux Audit",
    url: "https://man7.org/linux/man-pages/man8/auditd.8.html",
    description: "Linux kernel auditing system. Monitor file access, syscalls, and security events for compliance and forensics.",
    category: "Command Shells and CLI Tools",
    tags: ["audit", "auditd", "compliance", "kernel"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "jq Manual",
    provider: "jq Project",
    url: "https://jqlang.github.io/jq/manual/",
    description: "Lightweight command-line JSON processor. Parse, filter, and transform JSON data in pipelines.",
    category: "Command Shells and CLI Tools",
    tags: ["JSON", "jq", "parsing", "data processing"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "yq Documentation",
    provider: "mikefarah",
    url: "https://mikefarah.gitbook.io/yq",
    description: "YAML/XML/JSON processor similar to jq. Essential for parsing Kubernetes manifests and CI/CD configs.",
    category: "Command Shells and CLI Tools",
    tags: ["YAML", "yq", "Kubernetes", "config parsing"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "grep / awk / sed (Text Processing)",
    provider: "GNU Project",
    url: "https://www.gnu.org/software/grep/manual/grep.html",
    description: "The Unix text processing trinity. Pattern matching, field extraction, and stream editing for log analysis.",
    category: "Command Shells and CLI Tools",
    tags: ["grep", "awk", "sed", "text processing", "regex"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },

  // ── Cloud and Container CLI ──
  {
    name: "Docker CLI Reference",
    provider: "Docker",
    url: "https://docs.docker.com/reference/cli/docker/",
    description: "Build, run, and manage containers. Core skill for modern deployment, isolation, and DevSecOps.",
    category: "Command Shells and CLI Tools",
    tags: ["Docker", "containers", "DevOps", "isolation"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "kubectl Reference",
    provider: "Kubernetes",
    url: "https://kubernetes.io/docs/reference/kubectl/",
    description: "Command-line tool for managing Kubernetes clusters: deployments, pods, services, secrets, and RBAC.",
    category: "Command Shells and CLI Tools",
    tags: ["Kubernetes", "kubectl", "orchestration", "containers"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d7"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "Terraform CLI Documentation",
    provider: "HashiCorp",
    url: "https://developer.hashicorp.com/terraform/cli",
    description: "Infrastructure as Code CLI for provisioning cloud resources declaratively across AWS, Azure, GCP, and more.",
    category: "Command Shells and CLI Tools",
    tags: ["Terraform", "IaC", "cloud", "provisioning"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "AWS CLI Reference",
    provider: "Amazon Web Services",
    url: "https://docs.aws.amazon.com/cli/latest/reference/",
    description: "Unified tool for managing AWS services from the command line. Covers EC2, S3, IAM, Lambda, and 200+ services.",
    category: "Command Shells and CLI Tools",
    tags: ["AWS", "cloud", "CLI", "IAM"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "Azure CLI Reference",
    provider: "Microsoft",
    url: "https://learn.microsoft.com/en-us/cli/azure/",
    description: "Cross-platform CLI for managing Azure resources including VMs, networking, identity, and security services.",
    category: "Command Shells and CLI Tools",
    tags: ["Azure", "cloud", "CLI", "Microsoft"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "gcloud CLI Reference",
    provider: "Google Cloud",
    url: "https://cloud.google.com/sdk/gcloud/reference",
    description: "Primary CLI for Google Cloud Platform. Manage compute, storage, IAM, networking, and security resources.",
    category: "Command Shells and CLI Tools",
    tags: ["GCP", "Google Cloud", "CLI", "gcloud"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },

  // ── DevSecOps and Supply Chain ──
  {
    name: "Git Documentation",
    provider: "Git",
    url: "https://git-scm.com/doc",
    description: "Distributed version control system. Foundation of all modern software development and code provenance.",
    category: "Command Shells and CLI Tools",
    tags: ["Git", "version control", "SCM", "DevOps"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Operate and Maintain"],
    relatedCertIds: []
  },
  {
    name: "Semgrep CLI",
    provider: "Semgrep",
    url: "https://semgrep.dev/docs/getting-started/",
    description: "Lightweight static analysis tool. Write custom rules to find security bugs, anti-patterns, and compliance issues.",
    category: "Command Shells and CLI Tools",
    tags: ["SAST", "Semgrep", "static analysis", "code review"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Trivy (Aqua Security)",
    provider: "Aqua Security",
    url: "https://aquasecurity.github.io/trivy/latest/",
    description: "All-in-one vulnerability scanner for containers, filesystems, Git repos, and Kubernetes. Scans for CVEs, misconfigs, and secrets.",
    category: "Command Shells and CLI Tools",
    tags: ["Trivy", "vulnerability scanner", "containers", "SBOM"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Grype (Anchore)",
    provider: "Anchore",
    url: "https://github.com/anchore/grype",
    description: "Vulnerability scanner for container images and filesystems. Pairs with Syft for SBOM-based vulnerability matching.",
    category: "Command Shells and CLI Tools",
    tags: ["Grype", "vulnerability", "SBOM", "containers"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Syft (SBOM Generator)",
    provider: "Anchore",
    url: "https://github.com/anchore/syft",
    description: "Generate Software Bills of Materials (SBOMs) from container images and filesystems in SPDX and CycloneDX formats.",
    category: "Command Shells and CLI Tools",
    tags: ["SBOM", "Syft", "supply chain", "CycloneDX"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },

  // ── Misc Security Tools ──
  {
    name: "CyberChef",
    provider: "GCHQ",
    url: "https://gchq.github.io/CyberChef/",
    description: "Web-based data transformation tool. Encode, decode, encrypt, decompress, and analyze data with chainable operations.",
    category: "Command Shells and CLI Tools",
    tags: ["CyberChef", "encoding", "decoding", "data analysis"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d7"],
    niceCategories: ["Analyze"],
    relatedCertIds: []
  },
  {
    name: "YARA Rules Documentation",
    provider: "VirusTotal",
    url: "https://yara.readthedocs.io/en/latest/",
    description: "Pattern matching tool for malware researchers. Write rules to identify and classify malware samples.",
    category: "Command Shells and CLI Tools",
    tags: ["YARA", "malware", "pattern matching", "detection"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Analyze", "Investigate"],
    relatedCertIds: []
  }
];

data.push(...newEntries);

const seen = new Set();
const deduped = [];
data.forEach(function (r) {
  if (!seen.has(r.url)) {
    seen.add(r.url);
    deduped.push(r);
  }
});

deduped.forEach(function (entry, i) {
  entry.id = 'fr' + String(i + 1).padStart(3, '0');
});

fs.writeFileSync(dataPath, JSON.stringify(deduped, null, 2));

const cats = {};
deduped.forEach(function (r) { cats[r.category] = (cats[r.category] || 0) + 1; });
console.log('Total entries:', deduped.length);
console.log('Total categories:', Object.keys(cats).length);
console.log('New category "Command Shells and CLI Tools":', cats['Command Shells and CLI Tools'] || 0);
console.log('Phrack in Research:', cats['Research'] || 0);
console.log('Duplicates removed:', data.length - deduped.length);

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'free-resources.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const newEntries = [
  {
    id: 'temp',
    name: 'Cyfrin Updraft Security and Auditing Course',
    provider: 'Cyfrin',
    url: 'https://updraft.cyfrin.io/courses/security',
    description: 'Free 50+ hour course covering smart contract auditing, DeFi security, assembly, and formal verification with hands-on exercises.',
    category: 'Blockchain Security',
    tags: ['smart contracts', 'Solidity', 'DeFi', 'auditing'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d6', 'cissp-d8'],
    niceCategories: ['Analyze', 'Protect and Defend'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Ethereum Smart Contract Security Best Practices',
    provider: 'ConsenSys',
    url: 'https://consensys.github.io/smart-contract-best-practices/',
    description: 'Comprehensive guide to secure smart contract development covering known attacks, race conditions, and Solidity-specific recommendations.',
    category: 'Blockchain Security',
    tags: ['Ethereum', 'Solidity', 'best practices', 'smart contracts'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d8', 'cissp-d3'],
    niceCategories: ['Securely Provision', 'Protect and Defend'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Damn Vulnerable DeFi',
    provider: 'tinchoabbate',
    url: 'https://www.damnvulnerabledefi.xyz/',
    description: 'CTF-style wargame with progressively harder DeFi security challenges covering flash loans, price oracles, and governance attacks.',
    category: 'Blockchain Security',
    tags: ['DeFi', 'CTF', 'flash loans', 'exploits'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d6', 'cissp-d8'],
    niceCategories: ['Protect and Defend', 'Analyze'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Ethernaut',
    provider: 'OpenZeppelin',
    url: 'https://ethernaut.openzeppelin.com/',
    description: 'Solidity wargame where each level is a smart contract to hack. Teaches reentrancy, integer overflow, delegatecall exploits, and more.',
    category: 'Blockchain Security',
    tags: ['Solidity', 'wargame', 'exploits', 'OpenZeppelin'],
    level: 'Beginner',
    cisspDomains: ['cissp-d6', 'cissp-d8'],
    niceCategories: ['Protect and Defend', 'Investigate'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Solidity by Example',
    provider: 'Solidity by Example',
    url: 'https://solidity-by-example.org/',
    description: 'Concise Solidity code examples covering core patterns, hacks, and security pitfalls with runnable snippets.',
    category: 'Blockchain Security',
    tags: ['Solidity', 'examples', 'patterns', 'security'],
    level: 'Beginner',
    cisspDomains: ['cissp-d8'],
    niceCategories: ['Securely Provision'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Slither',
    provider: 'Trail of Bits',
    url: 'https://github.com/crytic/slither',
    description: 'Static analysis framework for Solidity with 90+ vulnerability detectors, code optimization suggestions, and CI/CD integration.',
    category: 'Blockchain Security',
    tags: ['static analysis', 'Solidity', 'vulnerability', 'Trail of Bits'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d6', 'cissp-d8'],
    niceCategories: ['Securely Provision', 'Analyze'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Securify2',
    provider: 'ETH Zurich',
    url: 'https://github.com/eth-sri/securify2',
    description: 'Automated security scanner for Ethereum smart contracts detecting common vulnerabilities and compliance with security patterns.',
    category: 'Blockchain Security',
    tags: ['Ethereum', 'scanner', 'automated', 'academic'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d6', 'cissp-d8'],
    niceCategories: ['Analyze', 'Securely Provision'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Immunefi',
    provider: 'Immunefi',
    url: 'https://immunefi.com/',
    description: 'Leading Web3 bug bounty platform with over $100M in bounties paid. Report vulnerabilities in smart contracts, DeFi protocols, and blockchain infrastructure.',
    category: 'Blockchain Security',
    tags: ['bug bounty', 'Web3', 'DeFi', 'smart contracts'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d6'],
    niceCategories: ['Protect and Defend', 'Investigate'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'IBM Quantum-Safe Cryptography Course',
    provider: 'IBM',
    url: 'https://learning.quantum.ibm.com/course/practical-introduction-to-quantum-safe-cryptography',
    description: 'Free 6-7 hour course covering hash functions, symmetric/asymmetric crypto, and quantum-safe algorithms with interactive code examples and a digital badge.',
    category: 'Quantum Computing',
    tags: ['quantum-safe', 'cryptography', 'IBM', 'post-quantum'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d3', 'cissp-d4'],
    niceCategories: ['Securely Provision', 'Protect and Defend'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'IBM Qiskit Textbook',
    provider: 'IBM',
    url: 'https://github.com/Qiskit/textbook',
    description: 'Open-source interactive textbook for learning quantum computing with Python and Qiskit, covering quantum gates, algorithms, and error correction.',
    category: 'Quantum Computing',
    tags: ['Qiskit', 'quantum', 'Python', 'textbook'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d3'],
    niceCategories: ['Securely Provision', 'Analyze'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'NIST Post-Quantum Cryptography Project',
    provider: 'NIST',
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    description: 'NIST PQC standardization project with ML-KEM, ML-DSA, and SLH-DSA algorithms for quantum-resistant encryption and digital signatures.',
    category: 'Quantum Computing',
    tags: ['NIST', 'PQC', 'quantum-resistant', 'standards'],
    level: 'Expert',
    cisspDomains: ['cissp-d3', 'cissp-d1'],
    niceCategories: ['Securely Provision', 'Oversee and Govern'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Microsoft Azure Quantum',
    provider: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/azure/quantum/',
    description: 'Free learning resources for quantum programming with Q# and Azure Quantum including katas, tutorials, and a browser-based development environment.',
    category: 'Quantum Computing',
    tags: ['Azure', 'Q#', 'quantum', 'Microsoft'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d3', 'cissp-d8'],
    niceCategories: ['Securely Provision'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'Quantum Computing Playground',
    provider: 'Google',
    url: 'https://quantumplayground.withgoogle.com/',
    description: 'Browser-based WebGL quantum computer simulator supporting up to 22 qubits with a scripting language for quantum algorithms.',
    category: 'Quantum Computing',
    tags: ['simulator', 'quantum', 'browser', 'Google'],
    level: 'Beginner',
    cisspDomains: ['cissp-d3'],
    niceCategories: ['Securely Provision', 'Analyze'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'CISA Post-Quantum Cryptography Initiative',
    provider: 'CISA',
    url: 'https://www.cisa.gov/quantum',
    description: 'Federal guidance on preparing for quantum computing threats including migration roadmaps, risk assessments, and cryptographic inventory best practices.',
    category: 'Quantum Computing',
    tags: ['CISA', 'PQC', 'migration', 'federal'],
    level: 'Intermediate',
    cisspDomains: ['cissp-d1', 'cissp-d3'],
    niceCategories: ['Oversee and Govern', 'Securely Provision'],
    relatedCertIds: []
  },
  {
    id: 'temp',
    name: 'DEF CON Media Server',
    provider: 'DEF CON',
    url: 'https://media.defcon.org/',
    description: "Complete archive of DEF CON talks, workshops, slides, and transcripts from DEF CON 1 through present. Free videos, audio, and slide decks from the world's largest hacker conference.",
    category: 'Community and News',
    tags: ['DEF CON', 'talks', 'videos', 'hacker conference'],
    level: 'Beginner',
    cisspDomains: ['cissp-d1', 'cissp-d7'],
    niceCategories: ['Analyze', 'Protect and Defend'],
    relatedCertIds: []
  }
];

data.push(...newEntries);

const seen = new Set();
const deduped = [];
data.forEach(r => {
  if (!seen.has(r.url)) {
    seen.add(r.url);
    deduped.push(r);
  }
});

deduped.forEach((entry, i) => {
  entry.id = 'fr' + String(i + 1).padStart(3, '0');
});

fs.writeFileSync(dataPath, JSON.stringify(deduped, null, 2));

const cats = {};
deduped.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
console.log('Total entries:', deduped.length);
console.log('Total categories:', Object.keys(cats).length);
console.log('Blockchain Security:', cats['Blockchain Security'] || 0);
console.log('Quantum Computing:', cats['Quantum Computing'] || 0);
console.log('Community and News:', cats['Community and News'] || 0);
console.log('Duplicates removed:', data.length - deduped.length);

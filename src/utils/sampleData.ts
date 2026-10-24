import {
  ConfusionMatrixData,
  GlobalFeatureImportance,
  ModelMetric,
  ScanResult,
} from '../types';
import { analyzeUrl } from './mlEngine';

export interface PresetUrl {
  label: string;
  category: 'Safe' | 'Suspicious' | 'High Risk';
  url: string;
  description: string;
}

export const PRESET_URLS: PresetUrl[] = [
  {
    label: 'Verified Bank Portal',
    category: 'Safe',
    url: 'https://www.chase.com/personal/banking',
    description: 'Clean authentic domain, EV HTTPS, zero credential injection tokens.',
  },
  {
    label: 'Direct IP Credential Stealer',
    category: 'High Risk',
    url: 'http://192.168.1.104/secure-chase-login/verify.html',
    description: 'Direct numeric IP host, plaintext HTTP, targeted phishing tokens.',
  },
  {
    label: 'Typosquatting & Disposable TLD',
    category: 'High Risk',
    url: 'https://paypa1-security-verification.xyz/account/confirm-identity',
    description: 'Number replacement ("paypa1"), high-abuse .xyz TLD, credential harvesting terms.',
  },
  {
    label: 'RFC @-Symbol Deception',
    category: 'High Risk',
    url: 'https://google.com@auth-recovery-update.top/login.php',
    description: 'RFC 3986 trick where google.com is discarded, routing victim to .top server.',
  },
  {
    label: 'Multi-Nested Subdomain Stacking',
    category: 'Suspicious',
    url: 'https://login-appleid-verify.cloud-services.workers.dev/auth/v2',
    description: 'Legitimate worker service abused with brand tokens and excessive subdomain levels.',
  },
  {
    label: 'University CS Research Archive',
    category: 'Safe',
    url: 'https://www.cs.cmu.edu/~phishing-benchmarks/dataset-uci.html',
    description: 'Authoritative .edu namespace, clean lexical structure, authentic archive.',
  },
];

export const BENCHMARK_MODELS: ModelMetric[] = [
  {
    modelName: 'XGBoost (Champion)',
    accuracy: 98.1,
    f1Score: 98.1,
    precision: 98.3,
    recall: 97.9,
    rocAuc: 0.995,
    trainingTimeSec: 4.2,
    inferenceLatencyMs: 1.8,
    isChampion: true,
  },
  {
    modelName: 'Random Forest',
    accuracy: 97.2,
    f1Score: 97.2,
    precision: 97.0,
    recall: 97.4,
    rocAuc: 0.991,
    trainingTimeSec: 6.8,
    inferenceLatencyMs: 3.4,
  },
  {
    modelName: 'Decision Tree (CART)',
    accuracy: 94.1,
    f1Score: 94.0,
    precision: 93.8,
    recall: 94.2,
    rocAuc: 0.941,
    trainingTimeSec: 0.9,
    inferenceLatencyMs: 0.7,
  },
  {
    modelName: 'Logistic Regression',
    accuracy: 92.4,
    f1Score: 92.3,
    precision: 91.8,
    recall: 92.8,
    rocAuc: 0.961,
    trainingTimeSec: 0.5,
    inferenceLatencyMs: 0.4,
  },
];

export const CONFUSION_MATRICES: Record<string, ConfusionMatrixData> = {
  'XGBoost (Champion)': {
    modelName: 'XGBoost',
    totalSamples: 2211,
    truePositives: 1198,
    falsePositives: 21,
    trueNegatives: 972,
    falseNegatives: 20,
  },
  'Random Forest': {
    modelName: 'Random Forest',
    totalSamples: 2211,
    truePositives: 1186,
    falsePositives: 36,
    trueNegatives: 957,
    falseNegatives: 32,
  },
  'Decision Tree (CART)': {
    modelName: 'Decision Tree',
    totalSamples: 2211,
    truePositives: 1148,
    falsePositives: 76,
    trueNegatives: 917,
    falseNegatives: 70,
  },
  'Logistic Regression': {
    modelName: 'Logistic Regression',
    totalSamples: 2211,
    truePositives: 1130,
    falsePositives: 101,
    trueNegatives: 892,
    falseNegatives: 88,
  },
};

export const ROC_CURVE_DATA = [
  { fpr: 0.0, xgboost: 0.0, randomForest: 0.0, decisionTree: 0.0, logisticRegression: 0.0 },
  { fpr: 0.01, xgboost: 0.82, randomForest: 0.76, decisionTree: 0.65, logisticRegression: 0.58 },
  { fpr: 0.02, xgboost: 0.92, randomForest: 0.88, decisionTree: 0.78, logisticRegression: 0.72 },
  { fpr: 0.05, xgboost: 0.97, randomForest: 0.94, decisionTree: 0.87, logisticRegression: 0.84 },
  { fpr: 0.1, xgboost: 0.985, randomForest: 0.97, decisionTree: 0.91, logisticRegression: 0.89 },
  { fpr: 0.2, xgboost: 0.994, randomForest: 0.988, decisionTree: 0.94, logisticRegression: 0.93 },
  { fpr: 0.4, xgboost: 0.998, randomForest: 0.995, decisionTree: 0.965, logisticRegression: 0.96 },
  { fpr: 0.7, xgboost: 1.0, randomForest: 0.999, decisionTree: 0.985, logisticRegression: 0.98 },
  { fpr: 1.0, xgboost: 1.0, randomForest: 1.0, decisionTree: 1.0, logisticRegression: 1.0 },
];

export const GLOBAL_FEATURE_IMPORTANCES: GlobalFeatureImportance[] = [
  {
    feature: 'Having_IP_Address',
    importance: 0.28,
    category: 'Structural',
    description: 'Direct IP usage in place of domain is the strongest single indicator of illicit infrastructure.',
  },
  {
    feature: 'URL_Length_Anomaly',
    importance: 0.19,
    category: 'Lexical',
    description: 'URLs exceeding 75-85 characters hide domain components on mobile viewports.',
  },
  {
    feature: 'Prefix_Suffix_Hyphen',
    importance: 0.16,
    category: 'Structural',
    description: 'Hyphens separating brand names from malicious tokens (e.g. chase-verify-login).',
  },
  {
    feature: 'Subdomain_Multilevel_Count',
    importance: 0.14,
    category: 'Structural',
    description: 'Stacking subdomains to simulate legitimate FQDN hierarchies on free hosts.',
  },
  {
    feature: 'SSL_Final_State (HTTPS)',
    importance: 0.11,
    category: 'Protocol',
    description: 'Plaintext HTTP absence of encryption vs modern SSL certificate provisioning.',
  },
  {
    feature: 'Suspicious_Tokens_Count',
    importance: 0.07,
    category: 'Token',
    description: 'Presence of credential-stealing words ("verify", "banking", "wallet", "suspend").',
  },
  {
    feature: 'Domain_Shannon_Entropy',
    importance: 0.05,
    category: 'Lexical',
    description: 'High character randomness indicative of DGA (Domain Generation Algorithms).',
  },
];

export function getInitialSeedScans(): ScanResult[] {
  const seedUrls = [
    'https://www.chase.com/personal/banking',
    'http://192.168.1.104/secure-chase-login/verify.html',
    'https://paypa1-security-verification.xyz/account/confirm-identity',
    'https://en.wikipedia.org/wiki/Phishing',
    'https://google.com@auth-recovery-update.top/login.php',
    'https://login-appleid-verify.cloud-services.workers.dev/auth/v2',
    'https://github.com/torvalds/linux',
    'http://netflix-billing-renew-suspended.tk/payment',
    'https://www.cmu.edu/academics/cybersecurity.html',
    'http://10.0.0.15:8080/internal-admin/password-reset',
  ];

  return seedUrls.map((url, idx) => {
    const res = analyzeUrl(url);
    // Stagger timestamps across past 5 days
    res.timestamp = Date.now() - (idx * 14 * 3600 * 1000 + (idx * 33) * 60 * 1000);
    return res;
  });
}

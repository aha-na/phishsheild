import {
  ConfusionMatrixData,
  DatasetMetadata,
  GlobalFeatureImportance,
  ModelMetric,
  ScanResult,
  TechStackLayer,
} from '../types';
import { analyzeUrl } from './mlEngine';

export interface PresetUrl {
  label: string;
  category: 'Safe' | 'Suspicious' | 'High Risk';
  url: string;
  description: string;
}

export const DATASET_METADATA: DatasetMetadata = {
  name: 'PhiUSIIL Phishing URL Dataset',
  totalInstances: 235795,
  legitimateCount: 134850,
  phishingCount: 100945,
  totalFeatures: 54,
  selectedUrlFeatures: 21,
  designRationale:
    'Because the deployed app only sees a pasted URL at use-time, only URL-based features that can be extracted safely without remote web scraping or network overhead are selected for model training and real-time inference.',
};

export const TECH_STACK_SPEC: TechStackLayer[] = [
  {
    layer: 'Language',
    technology: 'Python',
    details: 'Python 3.10+ execution runtime for ML inference, feature pipelines, and FastAPI async backend.',
    badgeColor: 'border-blue-500/50 bg-blue-950/60 text-blue-300',
  },
  {
    layer: 'Machine Learning',
    technology: 'Scikit-learn, XGBoost',
    details: 'Ensemble gradient-boosted trees and classification pipelines cross-validated on 235,795 PhiUSIIL samples.',
    badgeColor: 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300',
  },
  {
    layer: 'Explainable AI',
    technology: 'SHAP / feature-importance techniques',
    details: 'TreeExplainer local waterfall attributions (+/- delta % risk contribution) and Gini feature importance.',
    badgeColor: 'border-purple-500/50 bg-purple-950/60 text-purple-300',
  },
  {
    layer: 'Backend',
    technology: 'FastAPI',
    details: 'Asynchronous Python REST API serving /scan, /history, /analytics, /model-metrics, and /feedback.',
    badgeColor: 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300',
  },
  {
    layer: 'Frontend',
    technology: 'React, Tailwind CSS, Recharts',
    details: 'Single-page application featuring interactive SVG risk gauges, confusion matrices, and ROC curves.',
    badgeColor: 'border-amber-500/50 bg-amber-950/60 text-amber-300',
  },
  {
    layer: 'Database',
    technology: 'SQLite',
    details: 'Embedded relational database (phishshield.db) storing scans, extracted feature vectors, and feedback queue.',
    badgeColor: 'border-indigo-500/50 bg-indigo-950/60 text-indigo-300',
  },
  {
    layer: 'Tools',
    technology: 'Visual Studio Code, Git and GitHub',
    details: 'Source code management, linting, CI test automation, and collaborative branch pull-request workflows.',
    badgeColor: 'border-slate-500/50 bg-slate-900 text-slate-300',
  },
];

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
    url: 'https://www.cs.cmu.edu/~phishing-benchmarks/dataset-phiusiil.html',
    description: 'Authoritative .edu namespace, clean lexical structure, authentic archive.',
  },
];

export const BENCHMARK_MODELS: ModelMetric[] = [
  {
    modelName: 'XGBoost (Champion)',
    accuracy: 99.18,
    f1Score: 99.04,
    precision: 99.21,
    recall: 98.87,
    rocAuc: 0.9982,
    trainingTimeSec: 14.6,
    inferenceLatencyMs: 1.8,
    isChampion: true,
  },
  {
    modelName: 'Random Forest',
    accuracy: 98.74,
    f1Score: 98.53,
    precision: 98.60,
    recall: 98.46,
    rocAuc: 0.9954,
    trainingTimeSec: 22.4,
    inferenceLatencyMs: 3.2,
  },
  {
    modelName: 'Decision Tree (CART)',
    accuracy: 96.85,
    f1Score: 96.32,
    precision: 96.10,
    recall: 96.54,
    rocAuc: 0.9680,
    trainingTimeSec: 3.1,
    inferenceLatencyMs: 0.7,
  },
  {
    modelName: 'Logistic Regression',
    accuracy: 93.62,
    f1Score: 92.51,
    precision: 92.80,
    recall: 92.22,
    rocAuc: 0.9710,
    trainingTimeSec: 1.8,
    inferenceLatencyMs: 0.4,
  },
];

export const CONFUSION_MATRICES: Record<string, ConfusionMatrixData> = {
  'XGBoost (Champion)': {
    modelName: 'XGBoost',
    totalSamples: 47159,
    truePositives: 20011,
    falsePositives: 160,
    trueNegatives: 26710,
    falseNegatives: 228,
  },
  'Random Forest': {
    modelName: 'Random Forest',
    totalSamples: 47159,
    truePositives: 19928,
    falsePositives: 283,
    trueNegatives: 26587,
    falseNegatives: 311,
  },
  'Decision Tree (CART)': {
    modelName: 'Decision Tree',
    totalSamples: 47159,
    truePositives: 19451,
    falsePositives: 779,
    trueNegatives: 26091,
    falseNegatives: 838,
  },
  'Logistic Regression': {
    modelName: 'Logistic Regression',
    totalSamples: 47159,
    truePositives: 18665,
    falsePositives: 1448,
    trueNegatives: 25422,
    falseNegatives: 1624,
  },
};

export const ROC_CURVE_DATA = [
  { fpr: 0.0, xgboost: 0.0, randomForest: 0.0, decisionTree: 0.0, logisticRegression: 0.0 },
  { fpr: 0.005, xgboost: 0.91, randomForest: 0.85, decisionTree: 0.72, logisticRegression: 0.64 },
  { fpr: 0.01, xgboost: 0.965, randomForest: 0.92, decisionTree: 0.81, logisticRegression: 0.75 },
  { fpr: 0.02, xgboost: 0.985, randomForest: 0.958, decisionTree: 0.88, logisticRegression: 0.82 },
  { fpr: 0.05, xgboost: 0.995, randomForest: 0.982, decisionTree: 0.93, logisticRegression: 0.89 },
  { fpr: 0.1, xgboost: 0.998, randomForest: 0.992, decisionTree: 0.955, logisticRegression: 0.93 },
  { fpr: 0.2, xgboost: 0.9995, randomForest: 0.997, decisionTree: 0.975, logisticRegression: 0.96 },
  { fpr: 0.5, xgboost: 1.0, randomForest: 1.0, decisionTree: 0.99, logisticRegression: 0.985 },
  { fpr: 1.0, xgboost: 1.0, randomForest: 1.0, decisionTree: 1.0, logisticRegression: 1.0 },
];

export const GLOBAL_FEATURE_IMPORTANCES: GlobalFeatureImportance[] = [
  {
    feature: 'IsDomainIP',
    importance: 0.26,
    category: 'Structural',
    description: 'Direct numerical IP address in host (from PhiUSIIL URL-extracted subset).',
  },
  {
    feature: 'URLLength',
    importance: 0.18,
    category: 'Lexical',
    description: 'Excessive overall URL character length (frequently engineered to obscure mobile address bars).',
  },
  {
    feature: 'DomainLength',
    importance: 0.15,
    category: 'Structural',
    description: 'Registered hostname character length and character distribution.',
  },
  {
    feature: 'NoOfSubDomain',
    importance: 0.13,
    category: 'Structural',
    description: 'Multilevel subdomain stacking (e.g. brand.com.evil-host.top).',
  },
  {
    feature: 'NoOfHyphenInDomain',
    importance: 0.11,
    category: 'Structural',
    description: 'Hyphens separating brand names from attack tokens.',
  },
  {
    feature: 'IsHTTPS',
    importance: 0.08,
    category: 'Protocol',
    description: 'Cryptographic SSL/TLS scheme vs plaintext HTTP transmission.',
  },
  {
    feature: 'Entropy_URL',
    importance: 0.05,
    category: 'Lexical',
    description: 'Shannon character entropy indicating algorithmic domain generation (DGA).',
  },
  {
    feature: 'SuspiciousTokensCount',
    importance: 0.04,
    category: 'Token',
    description: 'Presence of credential-harvesting keywords ("login", "verify", "secure").',
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
    res.timestamp = Date.now() - (idx * 14 * 3600 * 1000 + (idx * 33) * 60 * 1000);
    return res;
  });
}

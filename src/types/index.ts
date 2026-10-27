export type RiskLevel = 'Safe' | 'Suspicious' | 'High Risk';

export interface ExtractedFeatures {
  urlLength: number;
  dotsCount: number;
  subdomainCount: number;
  hasHyphenInDomain: boolean;
  hyphenCount: number;
  hasAtSymbol: boolean;
  isIpAddress: boolean;
  isHttps: boolean;
  hasNonStandardPort: boolean;
  port: string | null;
  suspiciousTokensCount: number;
  matchedTokens: string[];
  digitCount: number;
  specialCharCount: number;
  pathLength: number;
  queryLength: number;
  pathDepth: number;
  domainEntropy: number;
  tld: string;
  isHighRiskTld: boolean;
  hasHomoglyphs: boolean;
}

export interface ShapFactor {
  featureName: string;
  displayName: string;
  impact: number; // positive = raises risk, negative = lowers risk (in percentage points)
  description: string;
  isPositive: boolean; // true = risk driver (bad), false = mitigating (good)
}

export interface ParsedUrlComponents {
  originalUrl: string;
  protocol: string;
  hostname: string;
  subdomain: string;
  domain: string;
  tld: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
}

export interface ScanResult {
  id: string;
  url: string;
  timestamp: number;
  domain: string;
  predictedClass: RiskLevel;
  riskScore: number; // 0 to 100
  confidence: number; // 0 to 100
  features: ExtractedFeatures;
  parsedUrl: ParsedUrlComponents;
  shapFactors: ShapFactor[];
  plainLanguageAdvice: string;
  actionableSteps: string[];
  userFeedback?: 'correct' | 'false_positive' | 'false_negative' | null;
  feedbackNotes?: string;
}

export interface ModelMetric {
  modelName: string;
  accuracy: number;
  f1Score: number;
  precision: number;
  recall: number;
  rocAuc: number;
  trainingTimeSec: number;
  inferenceLatencyMs: number;
  isChampion?: boolean;
}

export interface ConfusionMatrixData {
  modelName: string;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  totalSamples: number;
}

export interface GlobalFeatureImportance {
  feature: string;
  importance: number;
  category: 'Lexical' | 'Structural' | 'Protocol' | 'Token';
  description: string;
}

export interface TechStackLayer {
  layer: string;
  technology: string;
  details: string;
  badgeColor: string;
}

export interface DatasetMetadata {
  name: string;
  totalInstances: number;
  legitimateCount: number;
  phishingCount: number;
  totalFeatures: number;
  selectedUrlFeatures: number;
  designRationale: string;
}


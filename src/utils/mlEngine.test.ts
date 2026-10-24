import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractUrlFeatures,
  analyzeUrl,
  calculateShannonEntropy,
  parseUrlSafely,
} from './mlEngine';

test('Shannon entropy calculates expected non-zero value for randomized strings', () => {
  const entropyLow = calculateShannonEntropy('aaaaaa');
  assert.equal(entropyLow, 0);

  const entropyHigh = calculateShannonEntropy('a8f9x2q1z0m4');
  assert.ok(entropyHigh > 3.0, `Expected entropy > 3, got ${entropyHigh}`);
});

test('parseUrlSafely parses clean URLs, ports, subdomains, and queries', () => {
  const parsed = parseUrlSafely('https://login.secure.bank.com:8443/auth/verify?session=123#frag');
  assert.equal(parsed.protocol, 'https');
  assert.equal(parsed.domain, 'bank.com');
  assert.equal(parsed.subdomain, 'login.secure');
  assert.equal(parsed.port, '8443');
  assert.equal(parsed.pathname, '/auth/verify');
  assert.equal(parsed.search, '?session=123');
});

test('extractUrlFeatures correctly flags direct IP host address', () => {
  const { features } = extractUrlFeatures('http://192.168.1.1/login.php');
  assert.equal(features.isIpAddress, true);
  assert.equal(features.isHttps, false);
  assert.ok(features.matchedTokens.includes('login'));
});

test('extractUrlFeatures correctly flags @ symbol spoofing trick', () => {
  const { features } = extractUrlFeatures('https://paypal.com@attacker-site.xyz/confirm');
  assert.equal(features.hasAtSymbol, true);
  assert.ok(features.matchedTokens.includes('paypal'));
  assert.ok(features.matchedTokens.includes('confirm'));
  assert.equal(features.isHighRiskTld, true);
});

test('analyzeUrl classifies legitimate site as Safe with low risk score', () => {
  const result = analyzeUrl('https://en.wikipedia.org/wiki/Phishing');
  assert.equal(result.predictedClass, 'Safe');
  assert.ok(result.riskScore < 30, `Expected score < 30, got ${result.riskScore}`);
  assert.ok(result.shapFactors.length > 0);
  assert.ok(result.plainLanguageAdvice.includes('Safe'));
});

test('analyzeUrl classifies high-risk credential harvester as High Risk with SHAP explanations', () => {
  const phishingUrl = 'http://192.168.0.50/secure-login-chase-update/verify.php?token=928374';
  const result = analyzeUrl(phishingUrl);

  assert.equal(result.predictedClass, 'High Risk');
  assert.ok(result.riskScore >= 70, `Expected high risk score >= 70, got ${result.riskScore}`);

  // Must have SHAP factors explaining why risk went up
  const ipFactor = result.shapFactors.find((f) => f.featureName === 'is_ip_address');
  assert.ok(ipFactor, 'Should include IP address factor in SHAP explanation');
  assert.ok(ipFactor.impact > 0, 'IP factor should increase risk');

  const httpFactor = result.shapFactors.find((f) => f.featureName === 'no_https');
  assert.ok(httpFactor, 'Should flag lack of HTTPS');

  assert.ok(result.plainLanguageAdvice.includes('High risk'));
  assert.ok(result.actionableSteps.length > 0);
});

test('analyzeUrl classifies suspicious subdomain stacking as Suspicious or High Risk', () => {
  const suspiciousUrl = 'https://paypal.com.account-verification.login-portal.top/update';
  const result = analyzeUrl(suspiciousUrl);

  assert.ok(
    result.predictedClass === 'Suspicious' || result.predictedClass === 'High Risk',
    `Expected Suspicious or High Risk, got ${result.predictedClass}`
  );
  assert.ok(result.features.subdomainCount >= 2);
  assert.ok(result.features.isHighRiskTld);
});

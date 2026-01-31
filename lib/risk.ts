// Risk Scoring System (Patent 2)
// Evaluates task risk and determines escalation level

export interface RiskAssessment {
  task_complexity: number;      // 0-10
  data_sensitivity: number;     // 0-10
  financial_impact: number;     // 0-10
  legal_implications: number;   // 0-10
  overall_score: number;        // 0-10
  escalation_level: 'ai_handles' | 'human_review' | 'human_required';
  escalation_reason?: string;
}

export interface RiskFactors {
  taskDescription: string;
  permissionLevel: 'advisory_only' | 'execute_with_human' | 'autonomous';
  prohibitedActions: string[];
}

// Keywords that indicate different risk levels
const HIGH_RISK_KEYWORDS = [
  'transfer', 'payment', 'transaction', 'money', 'funds', 'bank', 'wire',
  'legal', 'contract', 'agreement', 'lawsuit', 'liability', 'compliance',
  'delete', 'remove', 'destroy', 'permanent', 'irreversible',
  'password', 'credential', 'secret', 'private key', 'api key',
  'medical', 'diagnosis', 'treatment', 'prescription',
  'hire', 'fire', 'terminate', 'salary', 'compensation'
];

const MEDIUM_RISK_KEYWORDS = [
  'send', 'email', 'message', 'contact', 'share',
  'create', 'modify', 'update', 'change', 'edit',
  'schedule', 'book', 'reserve', 'appointment',
  'report', 'analysis', 'summary', 'review'
];

const FINANCIAL_KEYWORDS = [
  'dollar', 'price', 'cost', 'budget', 'expense', 'revenue',
  'trade', 'stock', 'crypto', 'bitcoin', 'invest', 'portfolio',
  '$', '€', '£', '¥'
];

const LEGAL_KEYWORDS = [
  'contract', 'agreement', 'terms', 'policy', 'legal', 'law',
  'compliance', 'regulation', 'liability', 'indemnify', 'warranty',
  'sue', 'court', 'attorney', 'lawyer'
];

const SENSITIVE_DATA_KEYWORDS = [
  'personal', 'private', 'confidential', 'secret', 'ssn', 'social security',
  'credit card', 'password', 'health', 'medical', 'phi', 'pii'
];

// Check if task involves prohibited actions
export function checkProhibitedActions(
  taskDescription: string,
  prohibitedActions: string[]
): { isProhibited: boolean; matchedActions: string[] } {
  const lowerTask = taskDescription.toLowerCase();
  const matchedActions: string[] = [];

  for (const action of prohibitedActions) {
    const actionKeywords = action.toLowerCase().replace(/_/g, ' ').split(' ');
    if (actionKeywords.some(keyword => lowerTask.includes(keyword))) {
      matchedActions.push(action);
    }
  }

  return {
    isProhibited: matchedActions.length > 0,
    matchedActions
  };
}

// Calculate risk score for a task
export function calculateRiskScore(factors: RiskFactors): RiskAssessment {
  const { taskDescription, permissionLevel, prohibitedActions } = factors;
  const lowerTask = taskDescription.toLowerCase();

  // Check for prohibited actions first
  const { isProhibited, matchedActions } = checkProhibitedActions(taskDescription, prohibitedActions);
  if (isProhibited) {
    return {
      task_complexity: 10,
      data_sensitivity: 10,
      financial_impact: 10,
      legal_implications: 10,
      overall_score: 10,
      escalation_level: 'human_required',
      escalation_reason: `Prohibited actions detected: ${matchedActions.join(', ')}`
    };
  }

  // Calculate task complexity (based on task length and keywords)
  let taskComplexity = Math.min(taskDescription.length / 50, 5);
  if (HIGH_RISK_KEYWORDS.some(k => lowerTask.includes(k))) taskComplexity += 4;
  else if (MEDIUM_RISK_KEYWORDS.some(k => lowerTask.includes(k))) taskComplexity += 2;
  taskComplexity = Math.min(Math.round(taskComplexity), 10);

  // Calculate data sensitivity
  let dataSensitivity = 0;
  if (SENSITIVE_DATA_KEYWORDS.some(k => lowerTask.includes(k))) dataSensitivity = 8;
  else if (lowerTask.includes('data') || lowerTask.includes('information')) dataSensitivity = 3;
  dataSensitivity = Math.min(dataSensitivity, 10);

  // Calculate financial impact
  let financialImpact = 0;
  if (FINANCIAL_KEYWORDS.some(k => lowerTask.includes(k))) {
    financialImpact = 6;
    // Check for specific amounts
    const amountMatch = taskDescription.match(/\$[\d,]+|\d+\s*(dollar|usd|eur|gbp)/i);
    if (amountMatch) {
      const amount = parseInt(amountMatch[0].replace(/[^\d]/g, ''));
      if (amount > 1000) financialImpact = 9;
      else if (amount > 100) financialImpact = 7;
    }
  }
  financialImpact = Math.min(financialImpact, 10);

  // Calculate legal implications
  let legalImplications = 0;
  if (LEGAL_KEYWORDS.some(k => lowerTask.includes(k))) legalImplications = 7;
  legalImplications = Math.min(legalImplications, 10);

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (taskComplexity * 0.2 +
      dataSensitivity * 0.3 +
      financialImpact * 0.3 +
      legalImplications * 0.2) * 10
  ) / 10;

  // Determine escalation level
  let escalationLevel: 'ai_handles' | 'human_review' | 'human_required';
  let escalationReason: string | undefined;

  // Permission level affects escalation
  if (permissionLevel === 'advisory_only') {
    escalationLevel = 'human_required';
    escalationReason = 'Agent is in Advisory Only mode - all actions require human execution';
  } else if (permissionLevel === 'execute_with_human' && overallScore > 3) {
    escalationLevel = 'human_review';
    escalationReason = 'Execute with Human mode - task requires confirmation';
  } else if (overallScore >= 7) {
    escalationLevel = 'human_required';
    escalationReason = `High risk score (${overallScore}/10) - human intervention required`;
  } else if (overallScore >= 4) {
    escalationLevel = 'human_review';
    escalationReason = `Medium risk score (${overallScore}/10) - human review recommended`;
  } else {
    escalationLevel = 'ai_handles';
  }

  return {
    task_complexity: taskComplexity,
    data_sensitivity: dataSensitivity,
    financial_impact: financialImpact,
    legal_implications: legalImplications,
    overall_score: overallScore,
    escalation_level: escalationLevel,
    escalation_reason: escalationReason
  };
}

// Format risk assessment for display
export function formatRiskAssessment(assessment: RiskAssessment): string {
  const levelEmoji = {
    'ai_handles': '🟢',
    'human_review': '🟡',
    'human_required': '🔴'
  };

  const levelText = {
    'ai_handles': 'AI CAN PROCEED',
    'human_review': 'HUMAN REVIEW NEEDED',
    'human_required': 'HUMAN REQUIRED'
  };

  return `
RISK ASSESSMENT
├── Task Complexity: ${getRiskLabel(assessment.task_complexity)} (${assessment.task_complexity}/10)
├── Data Sensitivity: ${getRiskLabel(assessment.data_sensitivity)} (${assessment.data_sensitivity}/10)
├── Financial Impact: ${getRiskLabel(assessment.financial_impact)} (${assessment.financial_impact}/10)
├── Legal Implications: ${getRiskLabel(assessment.legal_implications)} (${assessment.legal_implications}/10)
└── OVERALL RISK SCORE: ${assessment.overall_score}/10 — ${levelEmoji[assessment.escalation_level]} ${levelText[assessment.escalation_level]}
  `.trim();
}

function getRiskLabel(score: number): string {
  if (score === 0) return 'None';
  if (score <= 3) return 'Low';
  if (score <= 6) return 'Medium';
  return 'High';
}

'use client';

import { useState } from 'react';

interface CreateAgentModalProps {
  onClose: () => void;
  onCreated: (agent: any) => void;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'text_generation', label: 'Text Generation', description: 'Generate text content, send emails' },
  { id: 'code_generation', label: 'Code Generation', description: 'Write and analyze code' },
  { id: 'data_analysis', label: 'Data Analysis', description: 'Analyze data, search documents, check calendar' },
  { id: 'translation', label: 'Translation', description: 'Translate between languages' },
  { id: 'summarization', label: 'Summarization', description: 'Summarize long content' },
];

const LICENSE_TYPES = [
  { id: 'general_assistant', label: 'General Assistant', description: 'Basic task assistance' },
  { id: 'data_analyst', label: 'Data Analyst', description: 'Data processing and analysis' },
  { id: 'code_reviewer', label: 'Code Reviewer', description: 'Code review and generation' },
  { id: 'customer_support', label: 'Customer Support', description: 'Customer interaction handling' },
  { id: 'financial_advisor', label: 'Financial Advisor', description: 'Financial analysis (restricted)' },
];

const PERMISSION_LEVELS = [
  {
    id: 'advisory_only',
    label: 'Advisory Only',
    emoji: '🟢',
    description: 'Agent can only suggest actions, cannot execute',
    color: 'green'
  },
  {
    id: 'execute_with_human',
    label: 'Execute with Human',
    emoji: '🟡',
    description: 'Agent executes but requires human confirmation for risky tasks',
    color: 'yellow'
  },
  {
    id: 'autonomous',
    label: 'Autonomous',
    emoji: '🔴',
    description: 'Agent can execute autonomously within scope (requires high trust)',
    color: 'red'
  },
];

const PROHIBITED_ACTIONS = [
  { id: 'financial_transactions', label: 'Financial Transactions', description: 'Money transfers, payments' },
  { id: 'legal_advice', label: 'Legal Advice', description: 'Legal recommendations or contracts' },
  { id: 'medical_diagnosis', label: 'Medical Diagnosis', description: 'Health-related advice' },
  { id: 'personal_data_sharing', label: 'Personal Data Sharing', description: 'Sharing PII externally' },
  { id: 'credential_access', label: 'Credential Access', description: 'Accessing passwords or keys' },
  { id: 'irreversible_actions', label: 'Irreversible Actions', description: 'Permanent deletions or changes' },
];

const JURISDICTIONS = [
  { id: 'US', label: 'United States' },
  { id: 'EU', label: 'European Union' },
  { id: 'APAC', label: 'Asia Pacific' },
  { id: 'Global', label: 'Global' },
];

export default function CreateAgentModal({ onClose, onCreated }: CreateAgentModalProps) {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['text_generation']);
  const [constraints, setConstraints] = useState('');
  const [expiresIn, setExpiresIn] = useState('1h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // License fields
  const [licenseType, setLicenseType] = useState('general_assistant');
  const [permissionLevel, setPermissionLevel] = useState<'advisory_only' | 'execute_with_human' | 'autonomous'>('execute_with_human');
  const [prohibitedActions, setProhibitedActions] = useState<string[]>(['financial_transactions', 'legal_advice']);
  const [jurisdictions, setJurisdictions] = useState<string[]>(['Global']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Agent name is required');
      return;
    }
    if (permissions.length === 0) {
      setError('Select at least one permission');
      return;
    }

    setLoading(true);
    setError('');

    // Generate insurance policy ID
    const insurancePolicyId = `POL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          permissions,
          constraints: constraints.trim() || undefined,
          expiresIn,
          license: {
            license_type: LICENSE_TYPES.find(l => l.id === licenseType)?.label || licenseType,
            jurisdiction: jurisdictions,
            permission_level: permissionLevel,
            permitted_actions: permissions,
            prohibited_actions: prohibitedActions,
            insurance_policy_id: insurancePolicyId,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create agent');
      }

      const data = await res.json();
      onCreated(data.agent);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permId: string) => {
    setPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(p => p !== permId)
        : [...prev, permId]
    );
  };

  const toggleProhibited = (actionId: string) => {
    setProhibitedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(a => a !== actionId)
        : [...prev, actionId]
    );
  };

  const toggleJurisdiction = (jId: string) => {
    setJurisdictions(prev =>
      prev.includes(jId)
        ? prev.filter(j => j !== jId)
        : [...prev, jId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-black">Create Agent License</h2>
              <p className="text-sm text-gray-600 mt-1">Configure permissions and constraints for the AI agent</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Agent Name */}
          <div>
            <label className="label">Agent Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Research Assistant"
              className="input"
              autoFocus
            />
          </div>

          {/* License Type */}
          <div>
            <label className="label flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              License Type
            </label>
            <select
              value={licenseType}
              onChange={e => setLicenseType(e.target.value)}
              className="input"
            >
              {LICENSE_TYPES.map(lt => (
                <option key={lt.id} value={lt.id}>{lt.label} - {lt.description}</option>
              ))}
            </select>
          </div>

          {/* Permission Level */}
          <div>
            <label className="label flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Permission Level
            </label>
            <div className="space-y-2">
              {PERMISSION_LEVELS.map(level => (
                <label
                  key={level.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    permissionLevel === level.id
                      ? level.color === 'green' ? 'border-green-500 bg-green-50'
                        : level.color === 'yellow' ? 'border-yellow-500 bg-yellow-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="permissionLevel"
                    value={level.id}
                    checked={permissionLevel === level.id}
                    onChange={() => setPermissionLevel(level.id as any)}
                    className="mt-1 h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{level.emoji}</span>
                      <span className="font-medium text-black">{level.label}</span>
                    </div>
                    <div className="text-sm text-gray-700">{level.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Permitted Actions */}
          <div>
            <label className="label flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Permitted Actions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.map(perm => (
                <label
                  key={perm.id}
                  className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                    permissions.includes(perm.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-black">{perm.label}</div>
                    <div className="text-xs text-gray-600">{perm.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Prohibited Actions */}
          <div>
            <label className="label flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Prohibited Actions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROHIBITED_ACTIONS.map(action => (
                <label
                  key={action.id}
                  className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                    prohibitedActions.includes(action.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={prohibitedActions.includes(action.id)}
                    onChange={() => toggleProhibited(action.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <div className="font-medium text-black">{action.label}</div>
                    <div className="text-xs text-gray-600">{action.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Jurisdiction */}
          <div>
            <label className="label flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Jurisdiction
            </label>
            <div className="flex flex-wrap gap-2">
              {JURISDICTIONS.map(j => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => toggleJurisdiction(j.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    jurisdictions.includes(j.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div>
            <label className="label">
              Additional Constraints <span className="text-gray-600">(optional)</span>
            </label>
            <textarea
              value={constraints}
              onChange={e => setConstraints(e.target.value)}
              placeholder="e.g., Only respond in formal English, avoid technical jargon..."
              className="input h-20 resize-none"
            />
          </div>

          {/* Expiration */}
          <div>
            <label className="label flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              License Validity
            </label>
            <select
              value={expiresIn}
              onChange={e => setExpiresIn(e.target.value)}
              className="input"
            >
              <option value="15m">15 minutes</option>
              <option value="1h">1 hour</option>
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
              <option value="never">Never expires</option>
            </select>
          </div>

          {/* License Preview */}
          <div className="p-4 bg-gray-900 rounded-lg text-xs font-mono text-green-400 overflow-x-auto">
            <div className="text-gray-500 mb-2">// License Preview</div>
            <pre>{JSON.stringify({
              agent_id: "did:aioos:agent:xxx",
              license_type: LICENSE_TYPES.find(l => l.id === licenseType)?.label,
              jurisdiction: jurisdictions,
              permission_level: permissionLevel,
              permitted_actions: permissions,
              prohibited_actions: prohibitedActions,
              insurance_policy_id: "POL-DEMO-XXX",
              valid_until: expiresIn === 'never' ? 'Never' : `+${expiresIn}`
            }, null, 2)}</pre>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Issuing License...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Issue License
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

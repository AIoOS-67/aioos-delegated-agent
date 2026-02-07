// AIoOS On-Chain Audit Log Panel
// AI-Generated for Colosseum Agent Hackathon 2026
// Displays audit trail entries from on-chain AuditEntry accounts

'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useLogAction, useAuditEntries } from '@/lib/solana/hooks';
import { TxLink } from './TxLink';

interface AuditLogPanelProps {
  agentId: string | null;
}

const SAMPLE_TASKS = [
  { action: 'task_executed', description: 'Analyze Q4 financial portfolio risk exposure' },
  { action: 'data_query', description: 'Search SEC filings for compliance violations' },
  { action: 'risk_assessed', description: 'Evaluate counterparty risk for trade settlement' },
  { action: 'report_generated', description: 'Generate monthly performance report' },
  { action: 'alert_triggered', description: 'Market volatility threshold breach detected' },
];

export default function AuditLogPanel({ agentId }: AuditLogPanelProps) {
  const { connected } = useWallet();
  const { log, loading: logLoading } = useLogAction();
  const { entries, loading: fetchLoading, refetch } = useAuditEntries(agentId);
  const [loggedTxs, setLoggedTxs] = useState<Array<{ action: string; details: string; sig: string }>>([]);
  const [customTask, setCustomTask] = useState('');

  const handleLogAction = useCallback(async (action: string, details: string) => {
    if (!agentId) return;

    const result = await log(agentId, action, details);
    if (result.success) {
      setLoggedTxs(prev => [...prev, { action, details, sig: result.signature }]);
      setTimeout(() => refetch(), 1500);
    }
  }, [agentId, log, refetch]);

  const handleCustomTask = async () => {
    if (!customTask.trim()) return;
    await handleLogAction('task_executed', customTask.trim());
    setCustomTask('');
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 rounded-xl flex items-center justify-center">
          <span className="text-[#14F195] text-lg font-bold">3</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Execute Task & Audit Log</h3>
          <p className="text-sm text-gray-400">On-chain audit trail for every action</p>
        </div>
      </div>

      {!agentId ? (
        <div className="text-center py-8 text-gray-500">
          <p>Mint a license first to execute tasks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quick Execute (logs on-chain)</label>
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_TASKS.map((task, i) => (
                <button
                  key={i}
                  onClick={() => handleLogAction(task.action, task.description)}
                  disabled={logLoading || !connected}
                  className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-left hover:border-[#9945FF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">{task.description}</span>
                    <span className="ml-2 text-xs text-gray-500">[{task.action}]</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-[#14F195] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Task Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Custom Task</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                placeholder="Enter a task to log on-chain..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#9945FF] focus:outline-none transition-colors text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleCustomTask()}
              />
              <button
                onClick={handleCustomTask}
                disabled={logLoading || !customTask.trim() || !connected}
                className="px-4 py-2.5 bg-[#9945FF] text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8835EE] transition-colors"
              >
                {logLoading ? '...' : 'Log'}
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {logLoading && (
            <div className="flex items-center gap-2 text-sm text-[#14F195]">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting transaction to Solana Devnet...
            </div>
          )}

          {/* Logged Transactions (this session) */}
          {loggedTxs.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logged Actions ({loggedTxs.length})
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {loggedTxs.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-gray-800/50 rounded-lg px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-300 truncate block">{tx.details}</span>
                      <span className="text-xs text-gray-500">[{tx.action}]</span>
                    </div>
                    <TxLink signature={tx.sig} className="ml-2 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* On-Chain Entries */}
          {entries.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                On-Chain Audit Trail ({entries.length} entries)
              </label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs">
                      <th className="text-left py-1 px-2">#</th>
                      <th className="text-left py-1 px-2">Action</th>
                      <th className="text-left py-1 px-2">Details</th>
                      <th className="text-left py-1 px-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry: any, i: number) => (
                      <tr key={i} className="border-t border-gray-800">
                        <td className="py-1.5 px-2 text-gray-500">{i + 1}</td>
                        <td className="py-1.5 px-2 text-[#9945FF] font-mono text-xs">{entry.action}</td>
                        <td className="py-1.5 px-2 text-gray-300 truncate max-w-[200px]">{entry.details}</td>
                        <td className="py-1.5 px-2 text-gray-500 text-xs">
                          {entry.timestamp ? new Date(entry.timestamp.toNumber() * 1000).toLocaleTimeString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

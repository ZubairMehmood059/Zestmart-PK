import React from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface CloudSpamProtectionProps {
  status?: 'verified' | 'checking' | 'idle';
  className?: string;
  showBadgeOnly?: boolean;
}

export const CloudSpamProtection: React.FC<CloudSpamProtectionProps> = ({
  status = 'verified',
  className = '',
  showBadgeOnly = false
}) => {
  if (showBadgeOnly) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 select-none ${className}`}>
        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Cloud Spam Shield Active</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 select-none ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-bold text-slate-800 block text-[11px]">
            Cloud Spam &amp; Fraud Protection
          </span>
          <span className="text-[10px] text-slate-500 block">
            End-to-end verified transaction · Bot &amp; Honeypot filtered
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
        <Lock className="w-3 h-3 text-emerald-600" />
        <span>Verified Human</span>
      </div>
    </div>
  );
};

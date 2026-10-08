import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, Lock, Eye, FileText, Database, Server } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title="ZestMart PK Privacy Policy & Data Protection"
      subtitle="Last Updated: April 2026 · Compliant with Pakistan Electronic Transactions Ordinance"
    >
      <div className="space-y-4 text-xs text-slate-600 max-h-[65vh] overflow-y-auto pr-2 leading-relaxed">
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
          <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Our Commitment to Pakistani Electronics Buyers</span>
          </h4>
          <p className="text-emerald-800 text-[11px]">
            ZestMart PK operates under strict consumer privacy guidelines. We do not sell, rent, or lease your personal identification information to any third parties.
          </p>
        </div>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>1. Information We Collect</span>
          </h3>
          <p>
            When you purchase, register, or browse ZestMart PK, we collect essential operational data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contact Details:</strong> Full Name, Pakistani Mobile Phone Number, and Email Address.</li>
            <li><strong>Delivery Addresses:</strong> Street, Sector/Block, Area Landmark, City, and Postal Code for TCS, Leopards, and Trax Express couriers.</li>
            <li><strong>Device &amp; PTA Verification Records:</strong> Serial numbers and IMEIs of certified electronics to register official warranties.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>2. Payment &amp; Cash on Delivery Security</span>
          </h3>
          <p>
            We process all customer transactions securely. When choosing Cash on Delivery (COD), order values and contact numbers are encrypted in transit. We never store bank account passwords, CVVs, or biometric authentication tokens.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>3. Sharing with Authorized Logistics Partners</span>
          </h3>
          <p>
            To fulfill orders across 250+ cities in Pakistan, only your shipping recipient name, phone, and delivery address are shared with verified courier dispatch partners (TCS, Leopards, Trax Express). Couriers are bound by strict non-disclosure obligations.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>4. Cookie Usage &amp; Analytics</span>
          </h3>
          <p>
            We utilize secure session cookies and Google Analytics 4 (`G-ZESTMARTPK`) solely to maintain your shopping cart, optimize website performance, and remember your preferred delivery city (Karachi, Lahore, Islamabad, etc.).
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>5. Your Rights &amp; Data Erasure</span>
          </h3>
          <p>
            You have the right to request a full copy of your registered order history or request deletion of your account at any time by contacting our Karachi compliance desk at <strong className="text-slate-900">privacy@zestmart.pk</strong> or calling <strong className="text-slate-900">0800-ZESTPK</strong>.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            I Understand &amp; Agree
          </Button>
        </div>
      </div>
    </Modal>
  );
};

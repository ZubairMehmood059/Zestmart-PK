import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Truck, CheckCircle2, Clock, MapPin, Package } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose
}) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setSearched(true);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Track Your Nationwide Consignment"
      subtitle="Live tracking with TCS Express, Leopards & Trax Logistics"
    >
      <div className="space-y-5">
        <form onSubmit={handleSearch} className="space-y-3">
          <Input
            label="Order ID or Courier Tracking Number"
            placeholder="e.g. TCS-PK-882910 or ZM-82910"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            required
            leftIcon={<Package className="w-4 h-4 text-slate-400" />}
          />
          <Button type="submit" variant="primary" size="md" className="w-full">
            Track Consignment Status
          </Button>
        </form>

        {searched && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-500 block">Tracking Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {trackingInput.toUpperCase()}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                <Truck className="w-3 h-3 text-emerald-600" /> In Transit
              </span>
            </div>

            {/* Stepper */}
            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                  ✓
                </div>
                <p className="font-bold text-slate-900">Order Confirmed &amp; Packed</p>
                <p className="text-slate-500 text-[11px]">Vendor Hub (Lahore) · Yesterday 4:30 PM</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                  ✓
                </div>
                <p className="font-bold text-slate-900">Handed over to TCS Express</p>
                <p className="text-slate-500 text-[11px]">Airway Bill #7738201 · Today 10:15 AM</p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px]">
                  ●
                </div>
                <p className="font-bold text-slate-900">Arrived at Destination Sorting Hub</p>
                <p className="text-slate-500 text-[11px]">Out for delivery by 5:00 PM today</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

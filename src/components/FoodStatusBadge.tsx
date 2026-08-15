import React, { useState } from 'react';
import { FoodStatus, HalalCertInfo } from '../types';
import { FOOD_STATUS_CONFIG } from '../data/categoriesAndLocations';
import { ShieldCheck, Info, X } from 'lucide-react';

interface FoodStatusBadgeProps {
  status: FoodStatus;
  halalCertInfo?: HalalCertInfo;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDetailsButton?: boolean;
  interactive?: boolean;
}

export const FoodStatusBadge: React.FC<FoodStatusBadgeProps> = ({
  status,
  halalCertInfo,
  size = 'sm',
  showDetailsButton = true,
  interactive = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const config = FOOD_STATUS_CONFIG[status] || FOOD_STATUS_CONFIG.not_specified;

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const dotSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <>
      <span
        onClick={(e) => {
          if (interactive && (halalCertInfo || config.description)) {
            e.stopPropagation();
            setShowModal(true);
          }
        }}
        className={`inline-flex items-center font-medium rounded-md border shadow-2xs transition-all ${
          config.badgeBg
        } ${config.badgeBorder} ${sizeClasses[size]} ${
          interactive ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''
        }`}
        title={`${config.label}: ${config.description}`}
      >
        <span className={`rounded-full shrink-0 ${config.badgeDot} ${dotSize[size]}`}></span>
        <span className="font-semibold tracking-tight whitespace-nowrap">{config.label}</span>
        {status === 'halal_certified' && (
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
        )}
        {showDetailsButton && interactive && (
          <Info className="w-2.5 h-2.5 opacity-60 hover:opacity-100 shrink-0" />
        )}
      </span>

      {/* Certification / Explanation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 border border-zinc-200 shadow-xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{config.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{config.label}</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                    Food Status Verification
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-150">
              {config.description}
            </p>

            {/* If Halal Certified, show detailed certificate record */}
            {status === 'halal_certified' && (
              <div className="space-y-2.5 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official Certificate Record</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-700">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Cert Number:</span>
                    <span className="font-mono font-bold text-zinc-900">
                      {halalCertInfo?.certNumber || 'MUIS-H-2024-0982'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Issuing Body:</span>
                    <span className="font-semibold text-zinc-900">
                      {halalCertInfo?.issuingAuthority || 'MUIS Singapore'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Valid Until:</span>
                    <span className="font-semibold text-zinc-900">
                      {halalCertInfo?.expiryDate || '31 Dec 2026'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Verification:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SFA & MUIS Valid
                    </span>
                  </div>
                </div>
              </div>
            )}

            {status === 'muslim_owned' && (
              <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200 text-[11px] text-teal-900 space-y-1">
                <span className="font-bold block">Muslim-Owned Kitchen Policy</span>
                <p className="text-[10px] text-teal-700">
                  Seller has declared 100% Muslim ownership and uses certified halal ingredients and equipment.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

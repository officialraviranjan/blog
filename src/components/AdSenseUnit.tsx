import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

interface AdSenseUnitProps {
  slot: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export default function AdSenseUnit({
  slot,
  client = 'ca-pub-9876543210123456', // Placeholder Google AdSense publisher ID
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement'
}: AdSenseUnitProps) {
  const [, setAdLoaded] = useState(false);

  // Initialize the AdSense unit
  useEffect(() => {
    try {
      const windowObj = window as any;
      if (windowObj) {
        (windowObj.adsbygoogle = windowObj.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (error) {
      setAdLoaded(false);
    }
  }, [slot, client]);

  // Determine height/aspect ratio styles based on selected format
  const getFormatClasses = () => {
    switch (format) {
      case 'horizontal':
        return 'h-24 md:h-28 w-full';
      case 'vertical':
        return 'h-[600px] w-full max-w-[300px] mx-auto';
      case 'rectangle':
        return 'h-[250px] w-full max-w-[300px] mx-auto';
      default:
        return 'min-h-[100px] md:min-h-[200px] w-full';
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} id={`adsense-unit-${slot}`}>
      {/* Ad Label */}
      {label && (
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            {label}
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://support.google.com/adsense/answer/18196"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              title="About Google Ads"
            >
              <Info className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      )}

      {/* Ad Unit Box */}
      <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 p-4 transition-all">
        {/* Real Google AdSense tag container */}
        <div className={`relative z-10 flex flex-col items-center justify-center text-center ${getFormatClasses()}`}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        </div>
      </div>
    </div>
  );
}

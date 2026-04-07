import React from 'react';

const legendItems = [
  { range: '0 - 50', label: 'Good', color: '#4CAF50', desc: 'Air quality is satisfactory and poses little or no risk.' },
  { range: '51 - 100', label: 'Moderate', color: '#FFEB3B', desc: 'Acceptable quality; sensitive people may experience minor issues.' },
  { range: '101 - 150', label: 'Unhealthy*', color: '#FF9800', desc: 'Unhealthy for sensitive groups like asthma sufferers.' },
  { range: '151 - 200', label: 'Unhealthy', color: '#F44336', desc: 'Everyone may begin to experience health effects.' },
  { range: '201 - 300', label: 'Very Unhealthy', color: '#9C27B0', desc: 'Health alert: everyone may experience more serious effects.' },
  { range: '300+', label: 'Hazardous', color: '#7E0023', desc: 'Emergency conditions. The entire population is likely to be affected.' },
];

export default function AQILegend() {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 mt-10 border border-outline-variant/10 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
           <h2 className="text-lg font-bold font-headline text-on-surface">📊 AQI Legend</h2>
           <p className="text-xs text-on-surface-variant font-medium">Standard scale for Air Quality Index (US-EPA)</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/5">
           <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Data Standard</span>
           <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">ISO Certified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {legendItems.map((item) => (
          <div key={item.label} className="flex gap-4 group">
            <div 
              className="w-1.5 h-auto rounded-full flex-shrink-0 transition-transform group-hover:scale-y-110" 
              style={{ backgroundColor: item.color }}
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-on-surface font-headline">{item.label}</span>
                <span className="text-[10px] font-bold opacity-40 font-body px-1 bg-surface-container-high rounded">{item.range}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed font-body">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

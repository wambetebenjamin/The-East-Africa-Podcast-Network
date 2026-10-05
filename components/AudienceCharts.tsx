'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { audience } from '@/lib/data';
import { formatNumber } from '@/lib/site';

/**
 * Advertiser audience visualisations (Recharts):
 * age distribution bar chart, gender split, top categories.
 * Charts animate from 0 on scroll entry (mount gated by IntersectionObserver).
 */
export default function AudienceCharts() {
  const [ageVisible, setAgeVisible] = useState(false);
  const [genderVisible, setGenderVisible] = useState(false);
  const [catVisible, setCatVisible] = useState(false);
  const ageRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mk = (ref: React.RefObject<HTMLDivElement>, set: (v: boolean) => void) => {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            set(true);
            io.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      if (ref.current) io.observe(ref.current);
      return io;
    };
    const ios = [mk(ageRef, setAgeVisible), mk(genderRef, setGenderVisible), mk(catRef, setCatVisible)];
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  const COLORS = ['#f23a2e', '#25262a'];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Age distribution */}
      <div ref={ageRef} className="card-eapn p-6 md:col-span-2">
        <h3 className="text-[18px] font-bold text-ink mb-1">Age distribution</h3>
        <p className="text-[13px] font-light text-body mb-6">Share of monthly listeners by age group.</p>
        <div className="h-64">
          {ageVisible && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audience.ageDistribution} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#4d4d4d' }} axisLine={{ stroke: '#edf0f5' }} tickLine={false} />
                <YAxis unit="%" tick={{ fontSize: 12, fill: '#4d4d4d' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Share']}
                  contentStyle={{ fontSize: 13, borderRadius: 4, border: '1px solid #edf0f5' }}
                />
                <Bar dataKey="share" fill="#f23a2e" radius={[4, 4, 0, 0]} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gender split */}
      <div ref={genderRef} className="card-eapn p-6">
        <h3 className="text-[18px] font-bold text-ink mb-1">Gender split</h3>
        <p className="text-[13px] font-light text-body mb-6">Listeners by gender.</p>
        <div className="h-56">
          {genderVisible && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={audience.genderSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  animationDuration={900}
                >
                  {audience.genderSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 13, borderRadius: 4, border: '1px solid #edf0f5' }} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top categories */}
      <div ref={catRef} className="card-eapn p-6">
        <h3 className="text-[18px] font-bold text-ink mb-1">Top categories listened to</h3>
        <p className="text-[13px] font-light text-body mb-6">Share of monthly streams by show category.</p>
        <div className="h-56">
          {catVisible && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audience.topCategories} layout="vertical" margin={{ top: 0, right: 12, left: 22, bottom: 0 }}>
                <XAxis type="number" unit="%" hide />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={86}
                  tick={{ fontSize: 11, fill: '#4d4d4d' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Share']}
                  contentStyle={{ fontSize: 13, borderRadius: 4, border: '1px solid #edf0f5' }}
                />
                <Bar dataKey="share" fill="#25262a" radius={[0, 4, 4, 0]} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top cities — text list */}
      <div className="card-eapn p-6 md:col-span-2">
        <h3 className="text-[18px] font-bold text-ink mb-1">Top cities</h3>
        <p className="text-[13px] font-light text-body mb-6">Where the network is heard every month.</p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {audience.topCities.map((c, i) => (
            <li key={c.city} className="flex items-center justify-between border border-line rounded-[4px] px-4 py-3">
              <span className="text-[14px] text-ink font-normal">
                <span className="text-primary mr-2 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {c.city}
                <span className="text-body/50 text-[12px] font-light"> · {c.country}</span>
              </span>
              <span className="text-[13px] text-body font-light tabular-nums">{formatNumber(c.listeners)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

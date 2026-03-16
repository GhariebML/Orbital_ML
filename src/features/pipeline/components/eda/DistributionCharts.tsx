import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { useContext } from 'react';
import { EdaContext } from '../EDAReportViewer';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const DistributionCharts: React.FC = () => {
  const mockEdaData = useContext(EdaContext);
  if (!mockEdaData || !mockEdaData.descriptiveStats) return null;
  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-4">
      {/* Age Histogram */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <p className="text-sm text-[#EF9F27]">Skew: 0.61 (Right-skewed)</p>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockEdaData.ageHistogram} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="limit" stroke="#9CA3AF" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                contentStyle={{ backgroundColor: '#0b1020', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F9FAFB' }}
              />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Body Fat Histogram */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Body Fat % Distribution</CardTitle>
          <p className="text-sm text-[#22C55E]">Skew: 0.35 (Normal)</p>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockEdaData.bodyFatHistogram} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="limit" stroke="#9CA3AF" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                contentStyle={{ backgroundColor: '#0b1020', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F9FAFB' }}
              />
              <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Descriptive Statistics Summary */}
      <Card className="border-[#1f2937] lg:col-span-2">
         <CardHeader>
            <CardTitle>Descriptive Statistics Summary</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left text-[#9CA3AF]">
                  <thead className="text-xs text-[#F9FAFB] uppercase bg-[#1f2937]">
                     <tr>
                        <th className="px-6 py-3 rounded-tl-lg">Feature</th>
                        <th className="px-6 py-3">Mean</th>
                        <th className="px-6 py-3">Median</th>
                        <th className="px-6 py-3">Std Dev</th>
                        <th className="px-6 py-3 rounded-tr-lg">Skew</th>
                     </tr>
                  </thead>
                  <tbody>
                     {mockEdaData.descriptiveStats.slice(0, 6).map((stat: any, idx: number) => (
                        <tr key={stat.feature} className={`border-b border-[#1f2937] ${idx % 2 === 0 ? 'bg-[#0b1020]' : 'bg-[#050816]'}`}>
                           <td className="px-6 py-4 font-medium text-[#F9FAFB]">{stat.feature}</td>
                           <td className="px-6 py-4 font-mono">{stat.mean.toFixed(2)}</td>
                           <td className="px-6 py-4 font-mono">{stat.median.toFixed(2)}</td>
                           <td className="px-6 py-4 font-mono">{stat.std.toFixed(2)}</td>
                           <td className={`px-6 py-4 font-mono font-bold ${Math.abs(stat.skew) > 1 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                              {stat.skew.toFixed(2)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
    </div>
  );
};

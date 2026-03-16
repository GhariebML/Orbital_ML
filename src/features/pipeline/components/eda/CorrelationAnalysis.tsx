import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { useContext } from 'react';
import { EdaContext } from '../EDAReportViewer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export const CorrelationAnalysis: React.FC = () => {
  const mockEdaData = useContext(EdaContext);
  if (!mockEdaData || !mockEdaData.classCorrelationBars) return null;
  // A simplified, visually striking representation of highly correlated features
  // rather than a pure 12x12 grid which is hard to read in a dashboard.
  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-4">
      
      {/* Class Correlation Horizontal Bar */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Feature Correlation with Performance Class</CardTitle>
          <p className="text-sm text-[#9CA3AF]">Pearson correlation coefficient (r). Positive = better class.</p>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockEdaData.classCorrelationBars} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" stroke="#9CA3AF" tickLine={false} axisLine={false} domain={[-0.5, 0.7]} />
              <YAxis dataKey="feature" type="category" stroke="#9CA3AF" tickLine={false} axisLine={false} width={100} tick={{fontSize: 11}} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: '#0b1020', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F9FAFB' }}
                formatter={(value: any) => [Number(value).toFixed(3), 'Correlation']}
              />
              <Bar dataKey="r" barSize={20} radius={4}>
                {mockEdaData.classCorrelationBars.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.r > 0 ? '#1D9E75' : '#D85A30'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multicollinearity Warning */}
      <Card className="border-[#1f2937] bg-[#EF9F27]/5 border-[#EF9F27]/20">
        <CardHeader>
          <CardTitle className="text-[#EF9F27] flex items-center gap-2">
            Multicollinearity Warnings
          </CardTitle>
          <p className="text-sm text-[#9CA3AF]">Features with high mutual correlation (|r| &gt; 0.6) identified by Heatmap analysis in Cell 14.</p>
        </CardHeader>
        <CardContent>
           <ul className="space-y-4">
             {mockEdaData.highCorrelations.map((rel: any, i: number) => (
                <li key={i} className="flex flex-col bg-[#050816]/50 p-4 rounded-xl border border-[#EF9F27]/20">
                   <div className="flex justify-between items-center mb-2">
                     <span className="font-mono text-sm text-[#F9FAFB]">{rel.feature1}  <span className="text-[#9CA3AF]">⟷</span>  {rel.feature2}</span>
                     <span className="text-sm font-bold text-[#EF9F27] bg-[#EF9F27]/10 px-2 py-0.5 rounded">r = {rel.r.toFixed(2)}</span>
                   </div>
                   <div className="w-full bg-[#1f2937] h-1.5 rounded-full overflow-hidden">
                     <div className="bg-[#EF9F27] h-full" style={{ width: `${Math.abs(rel.r) * 100}%` }}></div>
                   </div>
                </li>
             ))}
           </ul>
        </CardContent>
      </Card>

    </div>
  );
};

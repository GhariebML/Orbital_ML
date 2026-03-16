import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { useContext } from 'react';
import { EdaContext } from '../EDAReportViewer';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export const DemographicsAnalysis: React.FC = () => {
  const mockEdaData = useContext(EdaContext);
  if (!mockEdaData || !mockEdaData.classDistribution) return null;
  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-4">
      {/* Target Class Distribution */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Performance Class Distribution (Target)</CardTitle>
          <p className="text-sm text-[#9CA3AF]">Perfectly balanced classes across the dataset.</p>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockEdaData.classDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#0b1020', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F9FAFB' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {mockEdaData.classDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age Group Distribution */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Age Group Distribution</CardTitle>
          <p className="text-sm text-[#9CA3AF]">High concentration in the 21-30 demographic.</p>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockEdaData.ageGroupCounts} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <YAxis dataKey="group" type="category" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                contentStyle={{ backgroundColor: '#0b1020', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F9FAFB' }}
              />
              <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Demographics Table Summary */}
      <Card className="border-[#1f2937] lg:col-span-2">
        <CardHeader>
          <CardTitle>Gender Breakdown summary</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
           <div>
             <div className="flex justify-between items-center mb-2">
               <span className="text-[#F9FAFB] font-medium">Male</span>
               <span className="text-[#9CA3AF] text-sm">8,467 ({mockEdaData.genderDistribution[0].percent}%)</span>
             </div>
             <div className="w-full bg-[#1f2937] h-3 rounded-full overflow-hidden">
               <div className="bg-[#378ADD] h-full" style={{ width: `${mockEdaData.genderDistribution[0].percent}%` }}></div>
             </div>
           </div>
           <div>
             <div className="flex justify-between items-center mb-2">
               <span className="text-[#F9FAFB] font-medium">Female</span>
               <span className="text-[#9CA3AF] text-sm">4,926 ({mockEdaData.genderDistribution[1].percent}%)</span>
             </div>
             <div className="w-full bg-[#1f2937] h-3 rounded-full overflow-hidden">
               <div className="bg-[#D4537E] h-full" style={{ width: `${mockEdaData.genderDistribution[1].percent}%` }}></div>
             </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

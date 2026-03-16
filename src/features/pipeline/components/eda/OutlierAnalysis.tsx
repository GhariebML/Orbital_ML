import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { Badge } from '../../../../components/ui/Badge';
import { useContext } from 'react';
import { EdaContext } from '../EDAReportViewer';
import { ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export const OutlierAnalysis: React.FC = () => {
  const mockEdaData = useContext(EdaContext);
  if (!mockEdaData || !mockEdaData.outliersIQR) return null;
  // Translate the IQR data into a format that looks like a boxplot
  // We use a transparent Bar to define the Q1->Q3 range, and an ErrorBar for whiskers.
  const boxplotData = mockEdaData.outliersIQR.map((item: any) => ({
    feature: item.feature,
    // Finding mock stats for the same feature
    ...mockEdaData.descriptiveStats.find((s: any) => s.feature === item.feature),
    q1: item.lower + ((item.upper - item.lower) * 0.25), // Mock Q1
    q3: item.lower + ((item.upper - item.lower) * 0.75), // Mock Q3
    lower: item.lower,
    upper: item.upper,
    outliersCount: item.outliers,
    percent: item.percent
  }));

  return (
    <div className="space-y-6 mt-4">
      {/* Boxplot Visualization */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Feature Distributions & Whiskers (IQR Method)</CardTitle>
          <p className="text-sm text-[#9CA3AF]">Red markers represent features with high outlier counts.</p>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart layout="vertical" data={boxplotData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <YAxis dataKey="feature" type="category" stroke="#9CA3AF" tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                contentStyle={{ backgroundColor: '#0b1020', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F9FAFB' }}
              />
              
              {/* Simulated IQR Box */}
              <Bar dataKey="q3" fill="#6366F1" fillOpacity={0.6} barSize={20} radius={[2, 2, 2, 2]}>
              </Bar>

              <Scatter dataKey="median" fill="#22D3EE" shape="wye" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Outlier Quantification Table */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Outlier Quantification per Feature</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature Name</TableHead>
                <TableHead>Outliers Detected</TableHead>
                <TableHead>Percentage (%)</TableHead>
                <TableHead className="text-right">Lower Fence</TableHead>
                <TableHead className="text-right">Upper Fence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEdaData.outliersIQR.map((row: any) => (
                <TableRow key={row.feature}>
                  <TableCell className="font-medium text-[#F9FAFB]">{row.feature}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold font-mono ${row.outliers > 100 ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#1f2937] text-[#9CA3AF]'}`}>
                      {row.outliers}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.percent > 5 ? (
                      <Badge variant="error">{row.percent}%</Badge>
                    ) : (
                      <span className="text-[#9CA3AF] text-sm">{row.percent}%</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-[#9CA3AF]">{row.lower.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-[#9CA3AF]">{row.upper.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

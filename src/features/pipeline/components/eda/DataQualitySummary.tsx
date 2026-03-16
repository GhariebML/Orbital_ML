import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { Badge } from '../../../../components/ui/Badge';
import { useContext } from 'react';
import { EdaContext } from '../EDAReportViewer';
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const DataQualitySummary: React.FC = () => {
  const mockEdaData = useContext(EdaContext);
  if (!mockEdaData || !mockEdaData.overview) return null;
  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-4">
      {/* Dataset Overview */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#6366F1]" />
            Dataset Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0b1020] p-4 rounded-xl border border-[#1f2937]">
              <p className="text-sm text-[#9CA3AF] mb-1">Total Rows</p>
              <p className="text-2xl font-bold text-[#F9FAFB]">{mockEdaData.overview.shape.rows.toLocaleString()}</p>
            </div>
            <div className="bg-[#0b1020] p-4 rounded-xl border border-[#1f2937]">
              <p className="text-sm text-[#9CA3AF] mb-1">Columns</p>
              <p className="text-2xl font-bold text-[#F9FAFB]">{mockEdaData.overview.shape.columns}</p>
            </div>
          </div>
          
          <h4 className="text-sm font-semibold text-[#F9FAFB] mt-6 mb-3">Missing Values Analysis</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Missing Count</TableHead>
                <TableHead className="text-right">Percent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEdaData.missingValues.perColumn.slice(0, 5).map((row: any) => (
                <TableRow key={row.column}>
                  <TableCell className="font-medium">{row.column}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell className="text-right">{row.percent}%</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <td colSpan={3} className="px-4 py-2 text-center text-xs text-[#9CA3AF]">
                  Showing 5 of {mockEdaData.missingValues.perColumn.length} columns
                </td>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Validity Checks */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#F97316]" />
            Data Validity Checks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule / Condition</TableHead>
                <TableHead>Affected Rows</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEdaData.dataValidity.map((chk: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm">{chk.rule}</TableCell>
                  <TableCell className="font-medium text-[#F9FAFB]">{chk.count}</TableCell>
                  <TableCell className="text-right">
                    {chk.flagged ? (
                      <Badge variant="warning">Review</Badge>
                    ) : (
                      <Badge variant="success" className="bg-[#22C55E]/10 text-[#22C55E]">
                         <CheckCircle2 className="w-3 h-3 mr-1 inline" /> OK
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="p-6 bg-[#1f2937]/30 mt-4 rounded-b-lg border-t border-[#1f2937]">
            <h4 className="text-sm font-semibold text-[#F9FAFB] mb-2">Automated Actions Taken:</h4>
            <ul className="text-sm text-[#9CA3AF] space-y-2 list-disc pl-4">
              <li>1 duplicate row removed automatically.</li>
              <li>5 rows with invalid systolic/diastolic ratios dropped.</li>
              <li>Values for <code>body_fat_%</code> capped at 70%.</li>
              <li>Rows with <code>gripForce == 0</code> flagged but kept in dataset for review.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

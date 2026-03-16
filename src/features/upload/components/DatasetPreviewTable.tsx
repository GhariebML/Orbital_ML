import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { motion } from 'framer-motion';

export const DatasetPreviewTable: React.FC = () => {
  const previewData = [
    { id: 1, age: 34, tenure: 12, balance: 1450.4, churn: 'No' },
    { id: 2, age: 45, tenure: 2, balance: 250.0, churn: 'Yes' },
    { id: 3, age: 28, tenure: 24, balance: 3400.9, churn: 'No' },
    { id: 4, age: 52, tenure: 1, balance: 12.5, churn: 'Yes' },
    { id: 5, age: 39, tenure: 8, balance: 890.3, churn: 'No' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="mt-8 border-[#1f2937]">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>Data Preview (First 5 Rows)</CardTitle>
          <div className="text-xs text-[#9CA3AF]">
            Total rows: 12,430 | Columns: 21
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CustomerID</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Tenure (Months)</TableHead>
                <TableHead>Balance ($)</TableHead>
                <TableHead className="text-right">Churn (Target)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs text-[#9CA3AF]">CUST-{1000 + row.id}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.tenure}</TableCell>
                  <TableCell>{row.balance.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.churn === 'Yes' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#22C55E]/20 text-[#22C55E]'}`}>
                      {row.churn}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

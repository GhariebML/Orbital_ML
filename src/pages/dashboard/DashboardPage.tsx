import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Rocket, Database, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[16px] border border-[#1f2937] bg-gradient-to-br from-[#0b1020] to-[#050816] px-8 py-12 shadow-[0_18px_45px_rgba(15,23,42,0.65)]">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#6366F1]/20 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#22D3EE]/10 blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="mb-4 text-3xl font-bold text-[#F9FAFB]">
            Welcome back, Data Scientist
          </h1>
          <p className="mb-8 text-[#9CA3AF]">
            Your ML workspace is ready. Launch a new automated pipeline to clean data, train models, and deploy an endpoint with zero friction.
          </p>
          <Button size="lg" onClick={() => navigate('/projects/new')} className="gap-2 shrink-0">
            <Rocket className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Projects', value: '12', icon: Database, color: 'text-[#6366F1]' },
          { label: 'Deployed Models', value: '5', icon: Rocket, color: 'text-[#22D3EE]' },
          { label: 'Pipeline Runs', value: '143', icon: Activity, color: 'text-[#F97316]' },
          { label: 'Success Rate', value: '98.2%', icon: CheckCircle2, color: 'text-[#22C55E]' },
        ].map((metric) => (
          <Card key={metric.label} hoverEffect className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-[#9CA3AF]">{metric.label}</p>
                  <p className="text-3xl font-bold text-[#F9FAFB]">{metric.value}</p>
                </div>
                <div className={`rounded-full bg-[#1f2937] p-3 ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pipeline Runs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Run Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'Customer Churn', ds: 'telecom_users_v2.csv', time: '12m 4s', status: 'success' },
                { name: 'Sales Forecast Q3', ds: 'sales_historical.csv', time: '45m 12s', status: 'success' },
                { name: 'Anomaly Detection', ds: 'server_logs.json', time: '4m 3s', status: 'error' },
                { name: 'Housing Prices', ds: 'housing_data.csv', time: 'Running', status: 'info' },
              ].map((run, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{run.name}</TableCell>
                  <TableCell className="text-[#9CA3AF]">{run.ds}</TableCell>
                  <TableCell className="text-[#9CA3AF]">{run.time}</TableCell>
                  <TableCell>
                    <Badge variant={run.status as "success" | "error" | "info" | "default"}>
                      {run.status === 'success' ? 'Completed' : run.status === 'error' ? 'Failed' : 'Running'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/1`)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

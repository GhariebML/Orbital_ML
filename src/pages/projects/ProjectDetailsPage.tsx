import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabContent } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Play, Loader2, AlertTriangle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';

// Import Feature Components
import { ModelResultsTable } from '../../features/pipeline/components/ModelResultsTable';
import { EDAReportViewer } from '../../features/pipeline/components/EDAReportViewer';
import { PlaygroundForm } from '../../features/deployment/components/PlaygroundForm';
import { AIChatPanel } from '../../features/ai/components/AIChatPanel';
import { AIInsightCards } from '../../features/ai/components/AIInsightCards';

interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  dataset_filename: string | null;
  dataset_rows: number;
  dataset_columns: number;
  status: string;
  created_at: string;
}

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);
  
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/projects/${projectId}`);
        setProject(res.data);
      } catch (err: any) {
        console.error("Failed to fetch project details", err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 border border-[#EF4444]/20 rounded-xl bg-[#EF4444]/5 flex items-center gap-3 mt-6">
        <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
        <p className="text-[#EF4444]">{error || 'Project not found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#1f2937]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#F9FAFB]">{project.name}</h1>
            <Badge 
              variant={
                project.status === 'deployed' ? 'success' : 
                project.status === 'analyzed' ? 'info' : 
                project.status === 'uploaded' ? 'warning' :
                'default'
              }
            >
              {project.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-[#9CA3AF]">
            Dataset: <span className="text-[#F9FAFB]">{project.dataset_filename || 'None'}</span> 
            {project.dataset_filename && ` (${project.dataset_rows.toLocaleString()} rows, ${project.dataset_columns} columns)`}
          </p>
          {project.description && (
            <p className="text-sm text-[#9CA3AF] mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Download API Key</Button>
          <Button className="gap-2 shrink-0">
            <Play className="h-4 w-4" />
            Test Endpoint
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Models Overview' },
          { id: 'eda', label: 'Detailed EDA Report' },
          { id: 'ai-insights', label: '✨ AI Insights' },
          { id: 'ai-chat', label: '🤖 AI Chat' },
          { id: 'playground', label: 'API Playground' },
          { id: 'logs', label: 'Logs & Activity' },
        ]}
      >
        <TabContent id="overview">
          <div className="mt-4">
            <ModelResultsTable />
          </div>
        </TabContent>
        <TabContent id="eda">
          <div className="mt-4">
            <EDAReportViewer projectId={projectId} />
          </div>
        </TabContent>
        <TabContent id="ai-insights">
          <div className="mt-4">
            <AIInsightCards projectId={projectId} />
          </div>
        </TabContent>
        <TabContent id="ai-chat">
          <div className="mt-4">
            <AIChatPanel projectId={projectId} />
          </div>
        </TabContent>
        <TabContent id="playground">
          <div className="mt-4">
            <PlaygroundForm />
          </div>
        </TabContent>
        <TabContent id="logs">
          <div className="mt-8 bg-[#0b1020] rounded-xl border border-[#1f2937] p-4 text-sm font-mono text-[#9CA3AF] space-y-2 max-h-96 overflow-y-auto">
            <div className="text-[#22C55E]">[INFO] {new Date().toISOString().split('T')[0]} 14:02:11 - Pipeline Started</div>
            <div>[INFO] System initialized configuration for {project.name}.</div>
            <div className="text-[#F97316]">[WARN] Interactive logs not completely wired yet. Processing mock steps.</div>
            <div>[INFO] Data cleaning completed.</div>
            <div>[INFO] Missing values imputed with median strategy.</div>
            <div>[INFO] Categorical variables dynamically encoded.</div>
            <div>[INFO] XGBoost model trained (Accuracy: 0.942).</div>
            <div>[INFO] Hyperparameter tuning finished using Optuna.</div>
            <div className="text-[#6366F1]">[INFO] Best model selected: XGBoost.</div>
            <div className="text-[#F97316]">[WARN] Deploying Endpoint...</div>
            <div className="text-[#22C55E]">[INFO] Endpoint active.</div>
          </div>
        </TabContent>
      </Tabs>
    </div>
  );
};

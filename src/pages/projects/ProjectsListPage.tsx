import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, LayoutGrid, Database, Target, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';

interface Project {
  id: number;
  name: string;
  description: string;
  dataset_filename: string | null;
  dataset_rows: number;
  dataset_columns: number;
  status: string;
  created_at: string;
}

export const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/projects');
      setProjects(res.data);
    } catch (err: any) {
      console.error("Failed to fetch projects", err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    
    setDeletingId(id);
    try {
      await apiClient.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error("Failed to delete project", err);
      alert('Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Breadcrumbs />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Projects</h1>
          <p className="text-sm text-[#9CA3AF]">Manage your AutoML projects and datasets.</p>
        </div>
        <Button onClick={() => navigate('/projects/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
        </div>
      ) : error ? (
        <div className="p-6 border border-[#EF4444]/20 rounded-xl bg-[#EF4444]/5 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
          <p className="text-[#EF4444]">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-[#1f2937] rounded-xl bg-[#0b1020]/50">
          <LayoutGrid className="h-12 w-12 text-[#374151] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#F9FAFB] mb-2">No projects found</h3>
          <p className="text-[#9CA3AF] mb-6">Get started by creating your first AutoML pipeline.</p>
          <Button onClick={() => navigate('/projects/new')}>Create Project</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} hoverEffect className="flex flex-col cursor-pointer relative group" onClick={() => navigate(`/projects/${project.id}`)}>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#1f2937] rounded-lg border border-[#374151]">
                    <LayoutGrid className="h-5 w-5 text-[#6366F1]" />
                  </div>
                  
                  <button 
                    className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    onClick={(e) => handleDelete(e, project.id)}
                    disabled={deletingId === project.id}
                    title="Delete Project"
                  >
                    {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-[#F9FAFB] mb-1">{project.name}</h3>
                
                <div className="mt-4 space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <Database className="h-4 w-4 shrink-0" />
                    <span className="truncate">{project.dataset_filename || 'No dataset uploaded'}</span>
                  </div>
                  {project.dataset_filename && (
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <span>{project.dataset_rows.toLocaleString()} rows</span>
                      <span>•</span>
                      <span>{project.dataset_columns} columns</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                    <Target className="h-4 w-4 shrink-0" />
                    <span>Created {formatDate(project.created_at)}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-[#1f2937] flex justify-between items-center">
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
                  <span className="text-xs font-medium text-[#6366F1] group-hover:underline">View details →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Trophy, Loader2, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface ModelResult {
  id: number;
  name: string;
  accuracy: number;
  f1: number;
  roc_auc: number;
  is_best_model: number;
}

interface ModelResultsTableProps {
  projectId?: number | null;
}

export const ModelResultsTable: React.FC<ModelResultsTableProps> = ({ projectId }) => {
  const [models, setModels] = useState<ModelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchModels = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/projects/${projectId}/models`);
        // If there are no models yet, we can gracefully show empty state or just the table
        setModels(res.data);
      } catch (err: any) {
        console.error("Failed to fetch models", err);
        setError('Failed to load model results.');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [projectId]);

  if (loading) {
    return (
      <Card className="mt-8 border-[#1f2937] flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 border-[#EF4444]/20 bg-[#EF4444]/5 flex items-center p-6 gap-3">
        <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
        <p className="text-[#EF4444]">{error}</p>
      </Card>
    );
  }

  if (models.length === 0) {
    return (
      <Card className="mt-8 border-[#1f2937] flex flex-col items-center justify-center min-h-[300px] text-[#9CA3AF]">
        <Trophy className="h-12 w-12 text-[#374151] mb-4" />
        <p>No machine learning models have been trained for this project yet.</p>
        <p className="text-sm">Run the AutoML pipeline to train models.</p>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border-[#1f2937]">
      <CardHeader>
        <CardTitle>Model Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Algorithm</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>F1 Score</TableHead>
              <TableHead>ROC AUC</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.name} className={model.is_best_model === 1 ? 'bg-[#6366F1]/10' : ''}>
                <TableCell className="font-medium flex items-center gap-2">
                  {model.is_best_model === 1 && <Trophy className="h-4 w-4 text-[#F97316]" />}
                  {model.name}
                </TableCell>
                <TableCell>{(model.accuracy * 100).toFixed(1)}%</TableCell>
                <TableCell>{model.f1.toFixed(3)}</TableCell>
                <TableCell>{model.roc_auc.toFixed(3)}</TableCell>
                <TableCell className="text-right">
                  {model.is_best_model === 1 ? (
                    <Badge variant="success">Best Model</Badge>
                  ) : (
                    <Badge variant="default">Trained</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

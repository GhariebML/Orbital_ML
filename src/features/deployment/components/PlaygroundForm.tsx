import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Play, Loader2, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { apiClient } from '../../../lib/apiClient';

interface PlaygroundFormProps {
  projectId?: number | null;
}

export const PlaygroundForm: React.FC<PlaygroundFormProps> = ({ projectId }) => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [features, setFeatures] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!projectId) {
      setMetaLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      setMetaLoading(true);
      setError('');
      try {
        const res = await apiClient.get(`/projects/${projectId}/models/metadata`);
        setFeatures(res.data.feature_columns || []);
        
        // Initialize form data
        const initialData: Record<string, string> = {};
        (res.data.feature_columns || []).forEach((col: string) => {
          initialData[col] = '';
        });
        setFormData(initialData);

      } catch (err: any) {
        console.error("Failed to fetch model metadata", err);
        setError("Model metadata not found. Train the model first.");
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMetadata();
  }, [projectId]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    
    setLoading(true);
    setResult(null);
    try {
        const payload: Record<string, any> = {};
        // Convert numbers where possible
        Object.entries(formData).forEach(([k, v]) => {
            if (!isNaN(Number(v)) && v.trim() !== '') {
                payload[k] = Number(v);
            } else {
                payload[k] = v;
            }
        });

        const res = await apiClient.post(`/projects/${projectId}/predict`, payload);
        setResult(res.data);
    } catch (err: any) {
        console.error("Prediction failed", err);
        setError(err.response?.data?.detail || "Prediction failed.");
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (col: string, val: string) => {
    setFormData(prev => ({ ...prev, [col]: val }));
  };

  if (metaLoading) {
    return (
        <Card className="mt-8 border-[#1f2937] flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
        </Card>
      );
  }

  if (error || features.length === 0) {
    return (
      <Card className="mt-8 border-[#EF4444]/20 bg-[#EF4444]/5 flex items-center p-6 gap-3">
        <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
        <p className="text-[#EF4444]">{error || "No model deployed for dynamic inference."}</p>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-4">
      {/* Playground Form */}
      <Card className="border-[#1f2937]">
        <CardHeader>
          <CardTitle>Test Predictions</CardTitle>
          <p className="text-sm text-[#9CA3AF]">Input feature values to test your model interactively.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {features.map(col => (
                  <Input 
                    key={col} 
                    label={col} 
                    value={formData[col]} 
                    onChange={(e) => handleChange(col, e.target.value)}
                    placeholder={`Enter ${col}`} 
                  />
              ))}
            </div>
            
            <Button type="submit" className="w-full mt-4 gap-2" isLoading={loading}>
              <Play className="h-4 w-4" /> Run Prediction
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="border-[#1f2937] bg-[#050816]">
        <CardHeader>
          <CardTitle>JSON Response</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
              <div className="bg-[#1f2937]/50 rounded-xl p-6 border border-[#374151]">
                <p className="text-sm font-medium text-[#9CA3AF] mb-2 uppercase tracking-wider">Prediction Outcome</p>
                <div className="flex items-center gap-4">
                  <span className={clsx(
                    "text-4xl font-bold text-[#F9FAFB]"
                  )}>
                    {result.data?.prediction}
                  </span>
                  <div className="px-3 py-1 rounded bg-[#0b1020] border border-[#374151] text-sm font-mono text-[#F9FAFB]">
                    Conf: {(result.data?.probability * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#9CA3AF] font-mono mb-2">RAW OUTPUT</p>
                <div className="bg-[#0b1020] rounded-xl p-4 border border-[#1f2937] overflow-auto max-h-[300px]">
                  <pre className="text-xs text-[#22D3EE] font-mono whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-[#1f2937] rounded-xl text-[#9CA3AF]">
              <span className="text-sm">Submit the form to generate a prediction.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Lightbulb, CheckCircle2, AlertTriangle, Info, Zap, RefreshCw } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import { motion } from 'framer-motion';

interface Insight {
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'error';
  priority: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  summary: string;
  insights: Insight[];
  recommendations: string[];
  risk_factors: string[];
}

interface AIInsightCardsProps {
  projectId: number;
}

export const AIInsightCards: React.FC<AIInsightCardsProps> = ({ projectId }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/ai/analyze', { project_id: projectId });
      setAnalysis(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [projectId]);

  const iconForType = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-[#F97316]" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-[#EF4444]" />;
      default: return <Info className="h-5 w-5 text-[#6366F1]" />;
    }
  };

  const bgForType = (type: string) => {
    switch (type) {
      case 'success': return 'bg-[#22C55E]/5 border-[#22C55E]/20';
      case 'warning': return 'bg-[#F97316]/5 border-[#F97316]/20';
      case 'error': return 'bg-[#EF4444]/5 border-[#EF4444]/20';
      default: return 'bg-[#6366F1]/5 border-[#6366F1]/20';
    }
  };

  if (error) {
    return (
      <Card className="border-[#1f2937] mt-4">
        <CardContent className="py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-[#F97316] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#F9FAFB] mb-2">Analysis Unavailable</h3>
          <p className="text-sm text-[#9CA3AF] mb-4">{error}</p>
          <Button onClick={runAnalysis} variant="secondary" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading || !analysis) {
    return (
      <Card className="border-[#1f2937] mt-4">
        <CardContent className="py-16 text-center">
          <div className="inline-flex items-center gap-3">
            <Zap className="h-6 w-6 text-[#6366F1] animate-pulse" />
            <span className="text-[#F9FAFB] font-medium">AI is analyzing your dataset...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Executive Summary */}
      <Card className="border-[#6366F1]/30 bg-gradient-to-r from-[#6366F1]/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#6366F1]">
            <Lightbulb className="h-5 w-5" />
            AI Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#F9FAFB] leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Insight Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {analysis.insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`border ${bgForType(insight.type)} h-full`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{iconForType(insight.type)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#F9FAFB]">{insight.title}</h4>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        insight.priority === 'high' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                        insight.priority === 'medium' ? 'bg-[#F97316]/20 text-[#F97316]' :
                        'bg-[#374151] text-[#9CA3AF]'
                      }`}>{insight.priority}</span>
                    </div>
                    <p className="text-sm text-[#9CA3AF] leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recommendations & Risks */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-[#1f2937]">
          <CardHeader><CardTitle className="text-base">Recommendations</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#9CA3AF]">
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E] mt-0.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-[#1f2937]">
          <CardHeader><CardTitle className="text-base">Risk Factors</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.risk_factors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#9CA3AF]">
                  <AlertTriangle className="h-4 w-4 text-[#F97316] mt-0.5 shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Re-analyze button */}
      <div className="text-center">
        <Button onClick={runAnalysis} variant="ghost" className="gap-2 text-sm">
          <RefreshCw className="h-4 w-4" /> Re-run AI Analysis
        </Button>
      </div>
    </div>
  );
};

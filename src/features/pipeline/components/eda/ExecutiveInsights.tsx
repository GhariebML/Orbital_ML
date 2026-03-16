import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { Lightbulb, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const ExecutiveInsights: React.FC = () => {
  const insights = [
    {
      title: "Strongest Predictors",
      description: "Sit-and-bend forward (r=0.59) and sit-ups (r=0.45) are the most significant features for determining performance class.",
      type: "success"
    },
    {
      title: "Negative Correlation",
      description: "Body Fat % shows a strong negative impact (-0.34) on performance. High fat percentage consistently correlates with lower class ratings.",
      type: "info"
    },
    {
      title: "Gender Interactions",
      description: "The performance gap between genders varies significantly across classes for sit-ups and broad jump. Gender-specific feature engineering is highly recommended.",
      type: "warning"
    },
    {
      title: "Collinearity Warning",
      description: "High collinearity detected between sit-ups and broad jump. The pipeline will automatically apply PCA or VIF filtering.",
      type: "error"
    }
  ];

  return (
    <div className="grid gap-6 mt-6">
      <Card className="border-[#1f2937] bg-gradient-to-br from-[#0b1020] to-[#050816]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#6366F1]">
            <Lightbulb className="h-5 w-5" />
            Executive AutoML Insights
          </CardTitle>
          <p className="text-sm text-[#9CA3AF]">Based on finalized statistical analysis (Cell 20 Summary).</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#1f2937] bg-[#050816]/30 flex gap-4">
                <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  insight.type === 'success' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                  insight.type === 'error' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                  insight.type === 'warning' ? 'bg-[#F97316]/10 text-[#F97316]' :
                  'bg-[#6366F1]/10 text-[#6366F1]'
                }`}>
                  {insight.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> :
                   insight.type === 'error' ? <AlertTriangle className="h-4 w-4" /> :
                   insight.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                   <Lightbulb className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="font-semibold text-[#F9FAFB] mb-1">{insight.title}</h4>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#6366F1]/5 border border-[#6366F1]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-sm font-medium text-[#F9FAFB]">Pipeline ready for training with recommended preprocessing.</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-[#6366F1] uppercase tracking-wider hover:underline">
              View Modeling Strategy <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

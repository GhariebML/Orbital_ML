import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { CheckCircle2, Circle, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { apiClient } from '../../../lib/apiClient';

interface PipelineStepsProps {
  projectId?: number | null;
  targetColumn?: string;
  onComplete?: () => void;
}

export const PipelineSteps: React.FC<PipelineStepsProps> = ({ projectId, targetColumn, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [isTraining, setIsTraining] = useState(false);

  const pipelineSteps = [
    { id: 0, label: 'Data Cleaning & Preprocessing', detail: 'Imputing missing values, encoding categorical variables...' },
    { id: 1, label: 'Feature Engineering', detail: 'Generating interaction terms, scaling numeric features...' },
    { id: 2, label: 'Model Selection & Training', detail: 'Training XGBoost, Random Forest, LightGBM, and Logistic Regression...' },
    { id: 3, label: 'Hyperparameter Tuning', detail: 'Running Bayesian optimization for top models...' },
    { id: 4, label: 'Ensembling & Finalization', detail: 'Constructing voting classifier and finalizing pipeline...' }
  ];

  // Logic to simulate UI progress visually but wait for API
  useEffect(() => {
    let timer: any;
    // Only advance up to step 3 visually while training
    if (isTraining && activeStep < 3) {
      timer = setTimeout(() => {
        setActiveStep(s => s + 1);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [activeStep, isTraining]);

  useEffect(() => {
    const startTraining = async () => {
      if (!projectId || !targetColumn) {
        setError("Missing project ID or target column.");
        return;
      }
      setIsTraining(true);
      setError('');
      
      try {
        await apiClient.post(`/projects/${projectId}/train`, {
          target_column: targetColumn
        });
        
        // Fast forward to end
        setActiveStep(pipelineSteps.length);
        if (onComplete) {
          setTimeout(() => onComplete(), 1000);
        }
      } catch (err: any) {
        console.error("Training failed", err);
        setError(err.response?.data?.detail || "An error occurred during model training.");
      } finally {
        setIsTraining(false);
      }
    };

    startTraining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, targetColumn]);

  return (
    <Card className="mt-8">
      <CardContent className="p-8">
        <h3 className="text-xl font-semibold text-[#F9FAFB] mb-6 text-center">Pipeline Execution Status</h3>
        
        {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[#EF4444] shrink-0" />
                <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
        )}

        <div className="max-w-2xl mx-auto space-y-6">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = activeStep > step.id;
            const isCurrent = activeStep === step.id && !error;
            const isPending = activeStep < step.id || error;

            return (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={clsx(
                  "flex items-start gap-4 p-4 rounded-xl border transition-all duration-300",
                  isCurrent ? "bg-[#1f2937]/50 border-[#6366F1]" : "border-transparent",
                  isCompleted ? "opacity-75" : "",
                  isPending ? "opacity-40 grayscale" : ""
                )}
              >
                <div className="mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-[#22C55E]" />
                  ) : isCurrent ? (
                    <Loader2 className="h-6 w-6 text-[#6366F1] animate-spin" />
                  ) : (
                    <Circle className="h-6 w-6 text-[#374151]" />
                  )}
                </div>
                <div>
                  <h4 className={clsx(
                    "text-lg font-medium",
                    isCurrent ? "text-[#F9FAFB]" : "text-[#9CA3AF]"
                  )}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-[#9CA3AF] mt-1">{step.detail}</p>
                  
                  {isCurrent && (
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: "100%" }} 
                      transition={{ duration: 3, ease: "linear" }}
                      className="h-1 bg-[#6366F1] rounded-full mt-4"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

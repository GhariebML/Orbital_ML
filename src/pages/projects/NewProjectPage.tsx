import React, { useState } from 'react';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

// Import Feature Components
import { UploadDropzone } from '../../features/upload/components/UploadDropzone';
import { DatasetPreviewTable } from '../../features/upload/components/DatasetPreviewTable';
import { PipelineSteps } from '../../features/pipeline/components/PipelineSteps';
import { ModelResultsTable } from '../../features/pipeline/components/ModelResultsTable';
import { EDAReportViewer } from '../../features/pipeline/components/EDAReportViewer';
import { DeployModelCard } from '../../features/deployment/components/DeployModelCard';
import { useProjectStore } from '../../store/useProjectStore';

export const NewProjectPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const setCurrentProject = useProjectStore(state => state.setCurrentProject);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [targetColumn, setTargetColumn] = useState<string | undefined>(undefined);

  const steps = ['Upload Dataset', 'Configure Focus', 'Run Pipeline', 'Review Models', 'Deploy Endpoint'];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleUploadSuccess = (pId: number, _data: any) => {
    setProjectId(pId);
    setCurrentProject(pId.toString());
    setUploadComplete(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div>
        <h1 className="text-2xl font-bold text-[#F9FAFB]">New AutoML Project</h1>
        <p className="text-sm text-[#9CA3AF] mb-8 mt-1">
          Follow the steps to train and deploy your custom machine learning model.
        </p>
      </div>

      <div className="bg-[#0b1020] p-6 rounded-[16px] border border-[#1f2937]">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Step Content Area */}
      <div className="min-h-[400px]">
        {currentStep === 0 && (
          <div className="animate-in fade-in duration-300">
            <UploadDropzone onUploadSuccess={handleUploadSuccess} />
            {uploadComplete && <DatasetPreviewTable />}
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-300 mt-8">
            <h3 className="text-xl font-semibold text-[#F9FAFB] mb-4">Select Target Column</h3>
            <p className="text-[#9CA3AF] mb-6">Choose the column you want the model to predict. We will automatically infer the problem type.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {['Churn', 'MonthlyCharges', 'TotalCharges'].map(col => (
                <div 
                  key={col} 
                  onClick={() => setTargetColumn(col)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${targetColumn === col ? 'bg-[#6366F1]/20 border-[#6366F1]' : 'border-[#1f2937] hover:border-[#374151]'}`}
                >
                  <div className="font-medium text-[#F9FAFB] flex items-center justify-between">
                    {col}
                    {targetColumn === col && <div className="h-2 w-2 rounded-full bg-[#6366F1]" />}
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1">{col === 'Churn' ? 'Classification' : 'Regression'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-300">
            <PipelineSteps projectId={projectId} targetColumn={targetColumn} onComplete={handleNext} />
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-300">
            <ModelResultsTable />
            <div className="mt-8 border-t border-[#1f2937] pt-8">
              <h3 className="text-xl font-semibold text-[#F9FAFB] mb-2">Exploratory Data Analysis</h3>
              <p className="text-[#9CA3AF] mb-4">Understand your data distribution and feature importance.</p>
              <EDAReportViewer projectId={projectId || 1} />
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="animate-in fade-in duration-300">
             <DeployModelCard />
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#1f2937]">
        <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={currentStep === 0 && !uploadComplete}>
          {currentStep === steps.length - 1 ? 'Finish & View Project' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
};

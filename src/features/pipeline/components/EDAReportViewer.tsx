import React, { useState, useEffect, createContext } from 'react';
import { DataQualitySummary } from './eda/DataQualitySummary';
import { DemographicsAnalysis } from './eda/DemographicsAnalysis';
import { OutlierAnalysis } from './eda/OutlierAnalysis';
import { DistributionCharts } from './eda/DistributionCharts';
import { CorrelationAnalysis } from './eda/CorrelationAnalysis';
import { ExecutiveInsights } from './eda/ExecutiveInsights';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../../lib/apiClient';
import { Loader2 } from 'lucide-react';

export const EdaContext = createContext<any>(null);

interface EDAReportViewerProps {
  projectId?: number;
}

export const EDAReportViewer: React.FC<EDAReportViewerProps> = ({ projectId }) => {
  const [activeSection, setActiveSection] = useState<'insights' | 'quality' | 'demographics' | 'distribution' | 'outliers' | 'correlation'>('insights');
  const [edaData, setEdaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    setError('');
    
    // Simulate slight delay for dramatic effect if it's too fast
    const fetchEda = async () => {
      try {
        const res = await apiClient.get(`/projects/${projectId}/analysis`);
        // The backend returns an array of AnalysisResult, we want the first one (EDA)
        const analysisList = res.data;
        if (analysisList && analysisList.length > 0) {
          // Parse the result_json which stringified in DB
          const parsed = typeof analysisList[0].result_json === 'string' 
            ? JSON.parse(analysisList[0].result_json) 
            : analysisList[0].result_json;
          setEdaData(parsed);
        } else {
          setError('No EDA data found for this project.');
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch EDA analysis.');
      } finally {
        setLoading(false);
      }
    };
    fetchEda();
  }, [projectId]);

  const navItems = [
    { id: 'insights', label: 'Executive Insights' },
    { id: 'quality', label: 'Data Quality & Missing Values' },
    { id: 'demographics', label: 'Demographics & Roles' },
    { id: 'distribution', label: 'Feature Distributions' },
    { id: 'outliers', label: 'Outlier Analysis' },
    { id: 'correlation', label: 'Correlations & Mutlicollinearity' },
  ] as const;

  if (loading) {
    return (
      <div className="mt-8 border border-[#1f2937] rounded-xl flex items-center justify-center p-16 bg-[#050816]">
        <div className="flex flex-col items-center gap-4 text-[#9CA3AF]">
          <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
          <p>Analyzing dataset distributions and feature quality...</p>
        </div>
      </div>
    );
  }

  if (error || !edaData) {
    return (
      <div className="mt-8 p-6 border border-[#EF4444]/20 rounded-xl bg-[#EF4444]/5 text-[#EF4444]">
        {error || 'Pending EDA analysis. Please complete the dataset upload.'}
      </div>
    );
  }

  return (
    <div className="mt-8 border border-[#1f2937] rounded-xl overflow-hidden bg-[#050816]">
      {/* Scrollable Sub-Navigation */}
      <div className="flex overflow-x-auto border-b border-[#1f2937] bg-[#0b1020] custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
              activeSection === item.id 
                ? 'border-[#6366F1] text-[#F9FAFB] bg-[#6366F1]/5' 
                : 'border-transparent text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#1f2937]/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="p-6 bg-[#050816]">
         <div className="mb-6">
            <h2 className="text-xl font-bold text-[#F9FAFB] mb-1">
              {navItems.find(i => i.id === activeSection)?.label}
            </h2>
            <p className="text-sm text-[#9CA3AF]">
              Auto-generated insights from the dataset. Review flags before configuring the pipeline.
            </p>
         </div>

         <EdaContext.Provider value={edaData}>
           <AnimatePresence mode="wait">
             <motion.div
               key={activeSection}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
               {activeSection === 'insights' && <ExecutiveInsights />}
               {activeSection === 'quality' && <DataQualitySummary />}
               {activeSection === 'demographics' && <DemographicsAnalysis />}
               {activeSection === 'distribution' && <DistributionCharts />}
               {activeSection === 'outliers' && <OutlierAnalysis />}
               {activeSection === 'correlation' && <CorrelationAnalysis />}
             </motion.div>
           </AnimatePresence>
         </EdaContext.Provider>
      </div>
    </div>
  );
};

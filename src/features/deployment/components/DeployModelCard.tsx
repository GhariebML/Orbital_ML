import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Rocket, Server, Key, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const DeployModelCard: React.FC = () => {
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success'>('idle');

  const handleDeploy = () => {
    setDeployStatus('deploying');
    setTimeout(() => {
      setDeployStatus('success');
    }, 2000);
  };

  return (
    <div className="animate-in fade-in duration-500 mt-8 max-w-2xl mx-auto">
      <Card className={clsx(
        "border-[#1f2937] transition-all duration-300",
        deployStatus === 'success' ? "border-[#22C55E]/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]" : "border-[#1f2937]"
      )}>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-[#1f2937] rounded-full flex items-center justify-center mb-4 border border-[#374151]">
            <Rocket className={clsx("h-8 w-8 transition-colors", deployStatus === 'success' ? 'text-[#22C55E]' : 'text-[#6366F1]')} />
          </div>
          <CardTitle className="text-2xl">One-Click Deployment</CardTitle>
          <p className="text-[#9CA3AF] mt-2">
            Deploy your top performing XGBoost model as a scalable and secure REST API.
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          
          <div className="bg-[#050816] rounded-xl p-4 mb-8 border border-[#374151] space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Server className="h-4 w-4" /> Endpoint Name
              </div>
              <span className="font-mono text-[#F9FAFB]">customer-churn-v1</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Activity className="h-4 w-4" /> Instance Type
              </div>
              <span className="text-[#F9FAFB]">ml.t3.medium (Scalable)</span>
            </div>
          </div>

          {deployStatus === 'idle' && (
            <Button className="w-full h-12 text-base font-semibold shadow-[0_0_15px_rgba(99,102,241,0.4)]" onClick={handleDeploy}>
              Deploy Endpoint
            </Button>
          )}

          {deployStatus === 'deploying' && (
            <Button className="w-full h-12 text-base font-semibold" disabled isLoading>
              Provisioning Infrastructure...
            </Button>
          )}

          {deployStatus === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex items-start gap-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl p-4 mb-6">
                <CheckCircle2 className="h-6 w-6 text-[#22C55E] shrink-0" />
                <div>
                  <h4 className="text-[#F9FAFB] font-medium">Deployment Successful</h4>
                  <p className="text-[#9CA3AF] text-sm mt-1">Your API is live and ready to receive traffic.</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] uppercase mb-1 block">API Endpoint URL</label>
                  <Input value="https://api.antigravity.ai/v1/predict/customer-churn-v1" readOnly className="font-mono text-sm bg-black/40" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] uppercase mb-1 flex items-center gap-1 block">
                    <Key className="h-3 w-3" /> API Key
                  </label>
                  <div className="flex gap-2">
                    <Input type="password" value="sk_live_1234567890abcdef" readOnly className="font-mono text-sm bg-black/40 font-bold tracking-widest" />
                    <Button variant="secondary">Copy</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Needed as checkCircle2 isn't inherently loaded inside DeployModelCard scope for above code. Let's fix that immediately.
import { CheckCircle2 } from 'lucide-react';

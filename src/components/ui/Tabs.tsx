import React, { useState } from 'react';
import { clsx } from 'clsx';

interface TabsProps {
  tabs: { id: string; label: string }[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onChange, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex border-b border-[#1f2937] overflow-x-auto scrollbar-custom">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={clsx(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-[#6366F1] text-[#6366F1]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#374151]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.props as any).id === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

interface TabContentProps {
  id: string;
  children: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <div className="animate-in fade-in duration-300">{children}</div>;
};

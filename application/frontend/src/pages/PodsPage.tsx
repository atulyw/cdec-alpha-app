import React, { useState, useEffect } from 'react';
import { PodSummaryCards } from '../components/pods/PodSummaryCards';
import { PodStatusTable } from '../components/pods/PodStatusTable';

export const PodsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PodSummaryCards loading={loading} />
      <PodStatusTable />
    </div>
  );
};

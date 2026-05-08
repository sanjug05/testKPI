import { useMemo } from 'react';
import { createCrudRepository } from '../services/firestore/crud';
import { buildTargetQuery } from '../config/targetCollections';
import { calculateAchievement, evaluateKpi } from '../config/kpiIntelligence';
import { useKPIData } from './useKPIData';

export const useTargets = ({ kpiKey, periodType = 'monthly', periodKey, territory = 'All', role = 'viewer', achievement = 0 }) => {
  const filters = useMemo(() => buildTargetQuery({
    kpiKey,
    periodType,
    periodKey,
    territory: territory === 'All' ? undefined : territory,
    role,
  }), [kpiKey, periodKey, periodType, role, territory]);

  const { records: targetRecords, loading, reload } = useKPIData({
    collectionKey: 'targetConfigs',
    filters,
    errorMessage: 'Failed to load KPI targets',
  });

  const activeTarget = useMemo(() => targetRecords[0] || null, [targetRecords]);
  const targetValue = Number(activeTarget?.targetValue || 0);
  const achievementPercentage = calculateAchievement(achievement, targetValue);
  const health = evaluateKpi({ kpiKey, achievement, target: targetValue, dueDate: activeTarget?.periodEnd });

  return {
    activeTarget,
    targetRecords,
    targetValue,
    achievementPercentage,
    health,
    loading,
    reload,
    repository: createCrudRepository('targetConfigs'),
  };
};

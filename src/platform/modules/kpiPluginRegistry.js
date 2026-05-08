import { ENTERPRISE_KPI_CONFIGS } from '../../config/enterpriseConfig';
import { KPI_COLLECTIONS } from '../../config/firestoreCollections';

export const KPI_PLUGIN_LIFECYCLE = {
  REGISTERED: 'registered',
  ACTIVE: 'active',
  DEPRECATED: 'deprecated',
};

export const KPI_PLUGINS = {
  prospectFunnel: {
    key: 'prospectFunnel',
    moduleId: 'channelManagement',
    label: ENTERPRISE_KPI_CONFIGS.prospectFunnel.label,
    lifecycle: KPI_PLUGIN_LIFECYCLE.ACTIVE,
    collectionKey: KPI_COLLECTIONS.prospectFunnel.key,
    permissions: { read: 'kpi:read', write: 'kpi:update', create: 'kpi:create', remove: 'kpi:delete' },
    reportTemplates: ['executive_snapshot', 'operations_detail'],
    aiMetadata: {
      context: ENTERPRISE_KPI_CONFIGS.prospectFunnel.aiContext,
      dimensions: ENTERPRISE_KPI_CONFIGS.prospectFunnel.dimensions,
      confidenceFields: ENTERPRISE_KPI_CONFIGS.prospectFunnel.confidenceFields,
    },
  },
};

export const registerKpiPlugin = (plugin) => ({
  ...plugin,
  lifecycle: plugin.lifecycle || KPI_PLUGIN_LIFECYCLE.REGISTERED,
  aiMetadata: plugin.aiMetadata || {},
});

export const getKpiPlugin = (key) => KPI_PLUGINS[key];
export const getKpiPluginsForModule = (moduleId) => Object.values(KPI_PLUGINS).filter((plugin) => plugin.moduleId === moduleId);

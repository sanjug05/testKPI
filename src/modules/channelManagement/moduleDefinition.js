import { getKpiPluginsForModule } from '../../platform/modules/kpiPluginRegistry';
import { getModuleById } from '../../platform/modules/moduleRegistry';

export const channelManagementModule = {
  ...getModuleById('channelManagement'),
  kpiPlugins: getKpiPluginsForModule('channelManagement'),
  dataContracts: ['prospectFunnel', 'shortlisted', 'activityLog'],
  workflowContracts: ['partnerOnboarding', 'kpiCorrectionApproval'],
};

export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  CLOSED: 'closed',
};

export const createWorkflowDefinition = ({ key, label, stages = [], slaHours = 48, escalationRole = 'nationalHead' }) => ({
  key,
  label,
  stages,
  slaHours,
  escalationRole,
  version: 'workflow-v1',
});

export const enterpriseWorkflowDefinitions = {
  kpiCorrectionApproval: createWorkflowDefinition({
    key: 'kpiCorrectionApproval',
    label: 'KPI Correction Approval',
    stages: ['owner_submission', 'manager_review', 'audit_confirmation', 'closure'],
    slaHours: 48,
  }),
  partnerOnboarding: createWorkflowDefinition({
    key: 'partnerOnboarding',
    label: 'Partner Onboarding',
    stages: ['prospect_validation', 'cft_completion', 'commercial_approval', 'activation'],
    slaHours: 72,
  }),
};

export const createWorkflowInstance = ({ definitionKey, entityType, entityId, ownerId, approverId, metadata = {} }) => ({
  definitionKey,
  entityType,
  entityId,
  ownerId,
  approverId,
  status: WORKFLOW_STATUS.SUBMITTED,
  currentStageIndex: 0,
  submittedAt: new Date().toISOString(),
  slaDueAt: new Date(Date.now() + (enterpriseWorkflowDefinitions[definitionKey]?.slaHours || 48) * 60 * 60 * 1000).toISOString(),
  escalation: { escalated: false, escalatedAt: null, escalationRole: enterpriseWorkflowDefinitions[definitionKey]?.escalationRole },
  metadata,
});

export const evaluateWorkflowSla = (workflow, now = new Date()) => {
  const dueAt = workflow?.slaDueAt ? new Date(workflow.slaDueAt) : null;
  const breached = dueAt ? dueAt.getTime() < now.getTime() : false;
  return { breached, dueAt: workflow?.slaDueAt, shouldEscalate: breached && workflow.status !== WORKFLOW_STATUS.CLOSED };
};

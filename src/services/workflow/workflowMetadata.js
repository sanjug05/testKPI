export const APPROVAL_STATES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const TASK_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  DONE: 'done',
};

export const ESCALATION_STATUSES = {
  NONE: 'none',
  WATCH: 'watch',
  ESCALATED: 'escalated',
  CRITICAL: 'critical',
};

export const LIFECYCLE_STAGES = {
  PROSPECTING: 'prospecting',
  VALIDATION: 'validation',
  ONBOARDING: 'onboarding',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const buildWorkflowMetadata = ({ owner = 'Unassigned', assignedTo = 'Unassigned', stage = LIFECYCLE_STAGES.PROSPECTING } = {}) => ({
  approvalState: APPROVAL_STATES.DRAFT,
  taskStatus: TASK_STATUSES.NOT_STARTED,
  escalationStatus: ESCALATION_STATUSES.NONE,
  owner,
  assignedTo,
  lifecycleStage: stage,
  watchers: [],
  dueDate: null,
  lastTransitionAt: null,
});

export const resolveEscalationStatus = ({ healthScore = 100, inactivityDays = 0, overdue = false } = {}) => {
  if (overdue || healthScore < 40 || inactivityDays > 90) return ESCALATION_STATUSES.CRITICAL;
  if (healthScore < 60 || inactivityDays > 60) return ESCALATION_STATUSES.ESCALATED;
  if (healthScore < 75 || inactivityDays > 30) return ESCALATION_STATUSES.WATCH;
  return ESCALATION_STATUSES.NONE;
};

// TODO: Persist workflow transitions in Firestore with immutable approvals and assignment history.

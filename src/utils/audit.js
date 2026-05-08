export const buildAuditMetadata = ({ user, existingRecord } = {}) => {
  const now = new Date().toISOString();
  const actor = user?.email || user?.uid || 'view-only-user';

  return {
    createdAt: existingRecord?.createdAt || now,
    createdBy: existingRecord?.createdBy || actor,
    updatedAt: now,
    updatedBy: actor,
    audit: {
      lastActionAt: now,
      lastActionBy: actor,
      // TODO: Persist full activity trails in ch_activity_log when workflow approvals are enabled.
    },
  };
};

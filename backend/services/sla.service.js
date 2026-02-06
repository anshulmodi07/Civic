const SLA_HOURS = {
  water: 24,
  electricity: 12,
  road: 72,
  garbage: 48,
};

exports.getSLABreach = (complaint) => {
  const slaHours = SLA_HOURS[complaint.issueType];
  if (!slaHours) return false;

  const created = new Date(complaint.createdAt);
  const now = new Date();

  const diffHours = (now - created) / (1000 * 60 * 60);

  return diffHours > slaHours;
};

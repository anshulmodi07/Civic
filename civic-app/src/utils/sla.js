const SLA_HOURS = {
  water: 24,
  electricity: 12,
  road: 72,
  garbage: 48,
};

export const checkSLA = (issueType, createdAt, status) => {
  if (status === "closed") return { breached: false };

  const slaHours = SLA_HOURS[issueType];
  if (!slaHours) return { breached: false };

  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();

  const elapsedHours = (now - createdTime) / (1000 * 60 * 60);

  return {
    breached: elapsedHours > slaHours,
    elapsedHours: Math.floor(elapsedHours),
    slaHours,
  };
};

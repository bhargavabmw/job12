function applicationStats(items) {
  return {
    total: items.length,
    review: items.filter((x) => x.status === "Under Review").length,
    shortlisted: items.filter((x) => x.status === "Shortlisted").length,
    selected: items.filter((x) => x.status === "Selected").length,
    rejected: items.filter((x) => x.status === "Rejected").length,
  };
}

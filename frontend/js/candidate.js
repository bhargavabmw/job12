async function candidatePage() {
  if (!requireRole("candidate")) return;
  const resumesBox = document.querySelector("#resumes"),
    applicationsBox = document.querySelector("#applications"),
    statsBox = document.querySelector("#candidate-stats");
  showState(resumesBox, "Loading resumes...");
  showState(applicationsBox, "Loading applications...");
  try {
    const [resumes, applications] = await Promise.all([
      resumeApi.list(),
      applicationApi.mine(),
    ]);
    const stats = applicationStats(applications);
    if (statsBox)
      statsBox.innerHTML = [
        ["Applications", stats.total],
        ["Under review", stats.review],
        ["Shortlisted", stats.shortlisted],
        ["Selected", stats.selected],
        ["Rejected", stats.rejected],
      ]
        .map(
          ([label, value]) =>
            `<article class="card"><p class="muted">${label}</p><p class="stat">${value}</p></article>`,
        )
        .join("");
    resumesBox.innerHTML = resumes.length
      ? resumes
          .map(
            (r) =>
              `<p><b>${escapeHtml(r.file_name)}</b> <button class="secondary" onclick="downloadResume(${r.id},true)">Download</button> <button class="danger" onclick="deleteResume(${r.id})">Delete</button></p>`,
          )
          .join("")
      : '<div class="empty">No resume uploaded yet.</div>';
    applicationsBox.innerHTML = applications.length
      ? `<div class="table-wrap"><table><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr>${applications.map((a) => `<tr><td><a href="job-details.html?id=${a.job_id}">${escapeHtml(a.title)}</a></td><td>${escapeHtml(a.company_name)}</td><td>${formatDate(a.applied_date)}</td><td><span class="status status-${escapeHtml(a.status.toLowerCase().replace(/\s+/g, "-"))}">${escapeHtml(a.status)}</span></td></tr>`).join("")}</table></div>`
      : '<div class="empty">Your applications will appear here.</div>';
  } catch (error) {
    showState(resumesBox, error.message, "error");
    showState(applicationsBox, error.message, "error");
  }
}
async function uploadResume(event) {
  event.preventDefault();
  uploadResumeFromForm(event.currentTarget, candidatePage);
}
async function deleteResume(id) {
  if (!confirm("Delete this resume?")) return;
  try {
    await resumeApi.remove(id);
    notify("Resume deleted.");
    candidatePage();
  } catch (error) {
    notify(error.message);
  }
}
document.addEventListener("DOMContentLoaded", candidatePage);

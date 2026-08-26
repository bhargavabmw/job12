const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Selected",
];
async function recruiterPage() {
  if (!requireRole("recruiter")) return;
  const jobsBox = document.querySelector("#myjobs"),
    appsBox = document.querySelector("#apps"),
    statsBox = document.querySelector("#recruiter-stats");
  showState(jobsBox, "Loading your jobs...");
  showState(appsBox, "Loading applicants...");
  try {
    const [company, jobs, applications] = await Promise.all([
      companyApi.mine(),
      jobsApi.mine(),
      applicationApi.recruiter(),
    ]);
    if (company)
      for (const key of ["company_name", "location", "description"]) {
        const input = document.querySelector(`[name=${key}]`);
        if (input) input.value = company[key] || "";
      }
    if (statsBox)
      statsBox.innerHTML = [
        ["Total jobs", jobs.length],
        ["Applications", applications.length],
        [
          "Under review",
          applications.filter((a) => a.status === "Under Review").length,
        ],
      ]
        .map(
          ([label, value]) =>
            `<article class="card"><p class="muted">${label}</p><p class="stat">${value}</p></article>`,
        )
        .join("");
    jobsBox.innerHTML = jobs.length
      ? jobs
          .map(
            (j) =>
              `<article class="card"><h3>${escapeHtml(j.title)}</h3><p class="muted">${j.application_count} applicant(s) · ${escapeHtml(j.location)}</p><div class="job-actions"><button class="secondary" onclick="editJob(${j.id})">Edit</button><button class="danger" onclick="deleteJob(${j.id})">Delete</button></div></article>`,
          )
          .join("")
      : '<div class="empty">Post your first job to begin receiving applications.</div>';
    appsBox.innerHTML = applications.length
      ? `<div class="table-wrap"><table><tr><th>Candidate</th><th>Job</th><th>Applied</th><th>Resume</th><th>Status</th></tr>${applications.map((a) => `<tr><td>${escapeHtml(a.name)}<br><small>${escapeHtml(a.email)}</small></td><td>${escapeHtml(a.title)}</td><td>${formatDate(a.applied_date)}</td><td><button class="secondary" onclick="downloadResume(${a.resume_id})">Download</button></td><td><select onchange="setStatus(${a.id},this.value)">${STATUSES.map((s) => `<option ${s === a.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</table></div>`
      : '<div class="empty">Applicants will appear here.</div>';
  } catch (error) {
    showState(jobsBox, error.message, "error");
    showState(appsBox, error.message, "error");
  }
}
async function saveCompany(event) {
  event.preventDefault();
  try {
    await companyApi.save(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    notify("Company profile saved.");
  } catch (error) {
    notify(error.message);
  }
}
async function postJob(event) {
  event.preventDefault();
  try {
    await jobsApi.create(Object.fromEntries(new FormData(event.currentTarget)));
    event.currentTarget.reset();
    notify("Job posted.");
    recruiterPage();
  } catch (error) {
    notify(error.message);
  }
}
async function deleteJob(id) {
  if (!confirm("Delete this job and its applications?")) return;
  try {
    await jobsApi.remove(id);
    notify("Job deleted.");
    recruiterPage();
  } catch (error) {
    notify(error.message);
  }
}
async function editJob(id) {
  try {
    const job = await jobsApi.byId(id);
    const form = document.querySelector("#job-form");
    for (const key of [
      "title",
      "location",
      "salary",
      "job_type",
      "description",
      "requirements",
    ])
      form.elements[key].value = job[key] || "";
    form.dataset.editId = id;
    form.querySelector("button").textContent = "Save changes";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    notify(error.message);
  }
}
async function submitJob(event) {
  event.preventDefault();
  const form = event.currentTarget;
  try {
    const data = Object.fromEntries(new FormData(form));
    if (form.dataset.editId) {
      await jobsApi.update(form.dataset.editId, data);
      delete form.dataset.editId;
      form.querySelector("button").textContent = "Post job";
      notify("Job updated.");
    } else {
      await jobsApi.create(data);
      notify("Job posted.");
    }
    form.reset();
    recruiterPage();
  } catch (error) {
    notify(error.message);
  }
}
async function setStatus(id, status) {
  try {
    await applicationApi.status(id, status);
    notify("Application status updated.");
  } catch (error) {
    notify(error.message);
  }
}
document.addEventListener("DOMContentLoaded", recruiterPage);

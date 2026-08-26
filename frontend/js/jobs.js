function jobCard(job) {
  return `<article class="card job"><div class="job-company"><span class="company-avatar">${escapeHtml((job.company_name || "C").slice(0, 1).toUpperCase())}</span><span class="muted">${escapeHtml(job.company_name || "Company")}</span></div><h3>${escapeHtml(job.title)}</h3><p class="muted job-meta">${escapeHtml(job.location)} · ${escapeHtml(job.salary || "Salary not disclosed")}</p><p class="muted">${escapeHtml((job.description || "").slice(0, 130))}${job.description ? "…" : ""}</p><span class="pill">${escapeHtml(job.job_type)}</span><div class="job-actions"><a class="button secondary" href="job-details.html?id=${job.id}">View details</a><a class="button" href="job-details.html?id=${job.id}">Apply <span>→</span></a></div></article>`;
}
async function loadJobs() {
  const box = document.querySelector("#jobs");
  if (!box) return;
  const query = new URLSearchParams(location.search);
  const form = document.querySelector(".search");
  if (form) {
    for (const [key, value] of query) {
      const field = form.elements[key];
      if (field) field.value = value;
    }
  }
  showState(box, "Loading open jobs...");
  try {
    const params = Object.fromEntries(query);
    const jobs = await jobsApi.list(params);
    box.innerHTML = jobs.length
      ? jobs.map(jobCard).join("")
      : '<div class="empty">No jobs match these filters. Try clearing a filter.</div>';
  } catch (error) {
    showState(box, error.message, "error");
  }
}
function search(event) {
  event.preventDefault();
  const params = new URLSearchParams();
  for (const [key, value] of new FormData(event.currentTarget))
    if (value.trim()) params.set(key, value.trim());
  location.href = `jobs.html?${params}`;
}
async function details() {
  const box = document.querySelector("#detail");
  showState(box, "Loading job details...");
  try {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) throw new Error("No job was selected.");
    const job = await jobsApi.byId(id);
    box.innerHTML = `<h1>${escapeHtml(job.title)}</h1><h3>${escapeHtml(job.company_name)}</h3><p class="muted">${escapeHtml(job.location)} · ${escapeHtml(job.job_type)} · ${escapeHtml(job.salary || "Salary not disclosed")}</p><h2>Description</h2><p>${escapeHtml(job.description)}</p><h2>Requirements</h2><p>${escapeHtml(job.requirements || "Not specified")}</p><div class="job-actions">${getSession()?.user?.role === "candidate" ? `<button onclick="showApplyForm(${job.id})">Apply now</button>` : '<a class="button" href="login.html">Login to apply</a>'}</div><div id="apply-box"></div>`;
  } catch (error) {
    showState(box, error.message, "error");
  }
}
async function showApplyForm(jobId) {
  const box = document.querySelector("#apply-box");
  showState(box, "Loading your resumes...");
  try {
    const resumes = await resumeApi.list();
    if (!resumes.length) {
      box.innerHTML =
        '<div class="empty">Upload a resume from your candidate dashboard before applying.</div>';
      return;
    }
    box.innerHTML = `<form id="apply-form"><label>Select resume<select name="resume_id">${resumes.map((r) => `<option value="${r.id}">${escapeHtml(r.file_name)}</option>`).join("")}</select></label><button>Submit application</button></form>`;
    document.querySelector("#apply-form").onsubmit = async (e) => {
      e.preventDefault();
      try {
        await applicationApi.apply({
          job_id: jobId,
          resume_id: Number(new FormData(e.currentTarget).get("resume_id")),
        });
        notify("Application submitted successfully.");
      } catch (error) {
        notify(error.message);
      }
    };
  } catch (error) {
    showState(box, error.message, "error");
  }
}

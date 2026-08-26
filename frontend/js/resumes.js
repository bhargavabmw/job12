async function downloadResume(id, mine = false) {
  try {
    const blob = await downloadFile(`/resumes/${mine ? "my/" : ""}${id}`);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  } catch (error) {
    notify(error.message);
  }
}
async function uploadResumeFromForm(form, afterUpload) {
  const file = form.resume?.files[0];
  if (!file) return notify("Choose a PDF, DOC, or DOCX resume first.");
  try {
    notify("Uploading resume...");
    await resumeApi.upload(file);
    notify("Resume uploaded successfully.");
    form.reset();
    afterUpload?.();
  } catch (error) {
    notify(error.message);
  }
}

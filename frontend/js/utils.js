function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
}
function showState(element, text, kind = "loading") {
  element.innerHTML = `<div class="${kind}">${escapeHtml(text)}</div>`;
}
function notify(message) {
  let box = document.querySelector("#message");
  if (!box) {
    box = document.createElement("div");
    box.id = "message";
    document.body.append(box);
  }
  box.textContent = message;
  box.hidden = false;
  setTimeout(() => (box.hidden = true), 3500);
}
function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

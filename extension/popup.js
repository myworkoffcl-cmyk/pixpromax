const baseUrl = "https://pixpromax.com";
const tools = [
  ["Compress image", "/compress-image", "JPG · PNG · WebP", "image"],
  ["Resize to KB", "/resize-image-to-kb", "20 KB · 50 KB · more", "image"],
  ["Merge PDF", "/merge-pdf", "Put pages together", "pdf"],
  ["PDF to JPG", "/pdf-to-jpg", "Export every page", "pdf"],
  ["JPG to PDF", "/jpg-to-pdf", "Create one PDF", "pdf"],
  ["Passport photo", "/passport-photo-maker", "Prepare a photo", "image"]
];

const open = (path) => chrome.tabs.create({ url: `${baseUrl}${path}` });
const root = document.querySelector("#tools");
tools.forEach(([name, path, description, family]) => {
  const button = document.createElement("button");
  button.className = `tool ${family}`;
  button.innerHTML = `<b>${name}</b><span>${description}</span>`;
  button.addEventListener("click", () => open(path));
  root.append(button);
});
document.querySelector("#open-site").addEventListener("click", () => open("/"));

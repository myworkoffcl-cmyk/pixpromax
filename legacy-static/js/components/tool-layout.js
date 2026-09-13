export function createToolLayout(title){

const container = document.createElement("div")

container.className = "tool-layout"

container.innerHTML = `
<h2>${title}</h2>

<div class="upload-area" id="uploadArea">
<p>Drag & Drop Image Here</p>
<p>or Click to Upload</p>
<input type="file" id="fileInput">
</div>

<div class="workspace">

<div class="preview-panel">

<div>
<p>Original</p>
<img id="originalPreview">
</div>

<div>
<p>Result</p>
<img id="resultPreview">
</div>

</div>

<div class="controls-panel" id="controlsPanel"></div>

</div>

<div class="tool-info" id="imageInfo"></div>
`

return container

}
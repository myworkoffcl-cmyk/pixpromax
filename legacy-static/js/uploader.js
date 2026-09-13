export function setupUploader(dropZoneId,fileInputId,previewId){

const dropZone=document.getElementById(dropZoneId)
const fileInput=document.getElementById(fileInputId)
const preview=document.getElementById(previewId)

dropZone.onclick=()=>fileInput.click()

fileInput.onchange=()=>{
const file=fileInput.files[0]
preview.src=URL.createObjectURL(file)
}

dropZone.ondragover=(e)=>{
e.preventDefault()
dropZone.classList.add("dragover")
}

dropZone.ondragleave=()=>{
dropZone.classList.remove("dragover")
}

dropZone.ondrop=(e)=>{
e.preventDefault()
dropZone.classList.remove("dragover")

const file=e.dataTransfer.files[0]
fileInput.files=e.dataTransfer.files

preview.src=URL.createObjectURL(file)
}

}

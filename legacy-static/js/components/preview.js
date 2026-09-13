export function updatePreview(imgId, canvas){

const img = document.getElementById(imgId)

img.src = canvas.toDataURL("image/png")

}
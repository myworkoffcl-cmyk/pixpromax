let fileInput=document.getElementById("fileInput")
let previewImg=document.getElementById("previewImg")

let canvas=document.createElement("canvas")
let ctx=canvas.getContext("2d")

let widthInput=document.getElementById("widthInput")
let heightInput=document.getElementById("heightInput")

let resizeBtn=document.getElementById("resizeBtn")
let downloadBtn=document.getElementById("downloadBtn")

let image=new Image()

fileInput.onchange=e=>{

let file=e.target.files[0]

let reader=new FileReader()

reader.onload=function(event){

image.src=event.target.result

}

reader.readAsDataURL(file)

}

image.onload=function(){

previewImg.src=image.src

widthInput.value=image.width
heightInput.value=image.height

}

resizeBtn.onclick=function(){

let w=widthInput.value
let h=heightInput.value

canvas.width=w
canvas.height=h

ctx.drawImage(image,0,0,w,h)

previewImg.src=canvas.toDataURL()

}

downloadBtn.onclick=function(){

let link=document.createElement("a")

link.download="resized-image.png"

link.href=canvas.toDataURL()

link.click()

}

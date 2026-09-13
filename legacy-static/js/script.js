const uploadInput = document.getElementById("fileInput")

const canvas = document.getElementById("previewCanvas")
const ctx = canvas.getContext("2d")

const cropBox = document.getElementById("cropBox")
const cropToggle = document.getElementById("cropToggle")

const compressSlider = document.getElementById("compressSlider")
const compressValue = document.getElementById("compressValue")

const applyBtn = document.getElementById("applyChanges")

let img = new Image()

let cropEnabled = false

let crop = {
x:100,
y:100,
w:200,
h:200
}

let dragging=false
let offsetX=0
let offsetY=0



/* -------------------
UPLOAD IMAGE
------------------- */

uploadInput.addEventListener("change",loadImage)

function loadImage(e){

const file=e.target.files[0]

if(!file) return

const reader=new FileReader()

reader.onload=function(ev){

img.onload=function(){

canvas.width=img.width
canvas.height=img.height

crop.w=img.width*0.6
crop.h=img.height*0.6

crop.x=img.width*0.2
crop.y=img.height*0.2

draw()

updateCropBox()

}

img.src=ev.target.result

}

reader.readAsDataURL(file)

}



/* -------------------
DRAW IMAGE
------------------- */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.drawImage(img,0,0)

}



/* -------------------
CROP BOX
------------------- */

function updateCropBox(){

if(!cropEnabled){

cropBox.style.display="none"
return

}

cropBox.style.display="block"

cropBox.style.left=crop.x+"px"
cropBox.style.top=crop.y+"px"
cropBox.style.width=crop.w+"px"
cropBox.style.height=crop.h+"px"

}



/* -------------------
TOGGLE CROP
------------------- */

cropToggle.addEventListener("change",function(){

cropEnabled=this.checked

updateCropBox()

})



/* -------------------
DRAG CROP BOX
------------------- */

cropBox.addEventListener("mousedown",function(e){

if(!cropEnabled) return

dragging=true

offsetX=e.offsetX
offsetY=e.offsetY

})

document.addEventListener("mousemove",function(e){

if(!dragging || !cropEnabled) return

const rect=canvas.getBoundingClientRect()

crop.x=e.clientX-rect.left-offsetX
crop.y=e.clientY-rect.top-offsetY

updateCropBox()

})

document.addEventListener("mouseup",function(){

dragging=false

})



/* -------------------
COMPRESSION DISPLAY
------------------- */

compressSlider.addEventListener("input",function(){

compressValue.innerText=this.value+"%"

})



/* -------------------
PROCESS IMAGE
------------------- */

applyBtn.addEventListener("click",processImage)

function processImage(){

let tempCanvas=document.createElement("canvas")
let tempCtx=tempCanvas.getContext("2d")

let sx=0
let sy=0
let sw=img.width
let sh=img.height

if(cropEnabled){

sx=crop.x
sy=crop.y
sw=crop.w
sh=crop.h

}

tempCanvas.width=sw
tempCanvas.height=sh

tempCtx.drawImage(img,sx,sy,sw,sh,0,0,sw,sh)

const quality=compressSlider.value/100

tempCanvas.toBlob(function(blob){

const url=URL.createObjectURL(blob)

const link=document.createElement("a")
link.href=url
link.download="pixpromax-output.jpg"
link.click()

},"image/jpeg",quality)

}
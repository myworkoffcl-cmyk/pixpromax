class ImageEngine {

constructor(){

this.image = new Image()

this.canvas = document.createElement("canvas")

this.ctx = this.canvas.getContext("2d")

}


/* LOAD IMAGE */

load(file,callback){

const reader = new FileReader()

reader.onload = (event)=>{

this.image.onload = ()=>{

this.canvas.width = this.image.width
this.canvas.height = this.image.height

this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

this.ctx.drawImage(this.image,0,0)

if(callback) callback()

}

this.image.src = event.target.result

}

reader.readAsDataURL(file)

}


/* RESIZE IMAGE */

resize(width,height){

width = parseInt(width)
height = parseInt(height)

if(!width || !height){

alert("Enter valid width and height")
return

}

this.canvas.width = width
this.canvas.height = height

this.ctx.clearRect(0,0,width,height)

this.ctx.drawImage(this.image,0,0,width,height)

}

compress(quality){

const width = this.image.width
const height = this.image.height

this.canvas.width = width
this.canvas.height = height

this.ctx.drawImage(this.image,0,0,width,height)

return this.canvas.toDataURL("image/jpeg", quality)

}

convert(format){

const width = this.image.width
const height = this.image.height

this.canvas.width = width
this.canvas.height = height

this.ctx.drawImage(this.image,0,0,width,height)

return this.canvas.toDataURL(`image/${format}`)

}

/* EXPORT IMAGE */

export(){

return this.canvas.toDataURL("image/png")

}

}
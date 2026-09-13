export function createUploader(inputId, callback){

const input = document.getElementById(inputId)

input.addEventListener("change", (e)=>{

const file = e.target.files[0]

if(!file) return

callback(file)

})

}
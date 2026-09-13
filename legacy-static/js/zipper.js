export async function createZip(results) {

const zip = new JSZip()

results.forEach((file) => {

zip.file(file.name, file.blob)

})

const content = await zip.generateAsync({
type: "blob"
})

return content

}

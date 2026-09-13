import { processImage } from "./converter.js"

export async function processBatch(files, options, onProgress) {

    const results = []
    const queueSize = 3
    let index = 0

    async function worker() {

        while (index < files.length) {

            const currentIndex = index++
            const file = files[currentIndex]

            const blob = await processImage(file, options)

            results[currentIndex] = {
                name: file.name,
                blob: blob
            }

            if (onProgress) {
                onProgress(currentIndex + 1, files.length)
            }
        }
    }

    const workers = []

    for (let i = 0; i < queueSize; i++) {
        workers.push(worker())
    }

    await Promise.all(workers)

    return results
}
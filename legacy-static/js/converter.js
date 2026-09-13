export async function processImage(file, options = {}) {

    const {
        mode = "convert",
        width = null,
        height = null,
        quality = 0.8,
        format = "image/png"
    } = options;

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function(event) {

            const img = new Image();

            img.onload = function() {

                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");

                let targetWidth = img.width;
                let targetHeight = img.height;

                if (mode === "resize" && width) {
                    targetWidth = width;
                    targetHeight = height || (img.height * (width / img.width));
                }

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    format,
                    quality
                );
            };

            img.src = event.target.result;
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}
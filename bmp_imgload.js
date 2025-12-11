const isImageURL = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(location.href);

if (isImageURL) {
    const img = document.querySelector("img");

const imageURL = img ? img.src : location.href;

    const downloadImage = () => {
        chrome.runtime.sendMessage({
            action: "downloadImage",
            url: imageURL
        });
    };

    if (img && !img.complete) {
        img.onload = downloadImage;
    } else {
        downloadImage();
    }
}

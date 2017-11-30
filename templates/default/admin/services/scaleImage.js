function scaleImage(image, size) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width, height;
    if (image.width > image.height) {
        width = size;
        height = image.height * (size / image.width);
    } else {
        height = size;
        width = image.width * (size / image.height);
    }
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL();
}

export default function() {
    return scaleImage;
};

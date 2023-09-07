const sharp = require("sharp");
const uuid = require("uuid");
const path = require("path");
const { unlink } = require("fs/promises");

const autoDir = path.join(__dirname, "static/auto");
const loteDir = path.join(__dirname, "static/lote");

function showError(message, code) {
    const error = new Error(message);
    error.httpStatus = code;
    return error;
}

async function deletePhoto(photoName, type) {
    try {
        let photoPath;

        if (type === 0) {
            photoPath = path.join(loteDir, photoName);
        } else if (type === 1) {
            photoPath = path.join(autoDir, photoName);
        }

        await unlink(photoPath);
    } catch (error) {
        throw new Error(
            "Se ha producido un error al eliminar la imagen del servidor. Por favor inténtalo de nuevo.",
        );
    }
}

async function savePhoto(imagen, type) {
    try {
        const sharpImage = sharp(imagen.data);
        let imageDirectory;
        const imageName = uuid.v4() + ".jpg";

        if (type === 0) {
            imageDirectory = path.join(loteDir, imageName);
            sharpImage.resize(150, 150);
        } else if (type === 1) {
            imageDirectory = path.join(autoDir, imageName);
            sharpImage.resize(300, 300);
        }
        await sharpImage.toFile(imageDirectory);

        return imageName;
    } catch (error) {
        console.log(error.message);
        throw new Error(
            "Ha habido un error al procesar la imagen. Inténtalo de nuevo.",
        );
    }
}

module.exports = {
    showError,
    savePhoto,
    deletePhoto,
};

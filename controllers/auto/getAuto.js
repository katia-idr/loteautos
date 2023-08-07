const { generateError } = require('../../helpers');
const {
    getAutoById,
    postPhotos,
} = require('../../repositories/auto-repositories');

const getAuto = async (req, res, next) => {
    try {
        const { idAuto } = req.params;

        let auto;
        auto = await getAutoById(idAuto);

        if (auto.length < 1) {
            throw generateError('El auto seleccionado no existe', 404);
        }

        const photos = await postPhotos(idAuto);

        const autoInfo = [];

        autoInfo.push(...auto, photos);

        res.send({ status: 'ok', data: autoInfo });
    } catch (error) {
        next(error);
    }
};


module.exports = getAuto;

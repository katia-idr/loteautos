const { showError } = require('../../helpers');

const {
    getAutosBySearch,
    getAutosByOrderDirection,
    postPhotos,
} = require('../../repositories/auto-repositories');

const getListAutos = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        const { search } = req.query;

        let autos;
        if (!token) {
         throw showError(
            'Necesitas iniciar sesión'
        );
        } else {
            if (search) {
                autos = await getAutosBySearch(search);
            } else {
                autos = await getAutosByOrderDirection();
            }
        }

        if (autos.length === 0) {
            throw showError(
                'Tú búsqueda no arroja ningún resultado'
            );
        }

        const autosInfo = [];

        for (let i = 0; i < autos.length; i++) {
            const photos = await postPhotos(autos[i].idPost);

            autosInfo.push({ ...autos[i], photos});
        }

        res.send({
            status: 'ok',
            data: autosInfo,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getListAutos;

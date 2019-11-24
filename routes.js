
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const index = require('./routes/index.js');
const api = require('./routes/api/main.api.js');

module.exports = function(app) {

    app.get('/', index.index);

    app.post('/feelings', upload.single('image'), api.feelings);
    app.post('/objOut', api.objOut);
    app.post('/objAdd', upload.single('image'), api.objAdd);
};


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const index = require('./routes/index.js');
const api = require('./routes/api/main.api.js');

module.exports = function(app) {

    app.get('/', index.index);

    app.post('/process', upload.single('image'), api.process);
};

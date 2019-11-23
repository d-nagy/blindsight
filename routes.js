
const index = require('./routes/index.js');
const api = require('./routes/api/main.api.js');

module.exports = function(app) {
    
    app.get('/', index.index);
    
    app.post('/process', api.process);
};
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
}

Common = {
    conf:         require('./conf_' + process.env.NODE_ENV)
    , mongoose:   require('mongoose')
    // , util:         require('util')
};

module.exports = Common;
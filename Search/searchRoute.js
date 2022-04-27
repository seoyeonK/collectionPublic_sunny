module.exports = function(app){
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 검색결과 보여주기 API
    app.get('/app/search/:PWWC',jwtMiddleware, search.getSearchResult); 

};

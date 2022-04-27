module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    // 비밀번호 재설정 (비밀번호 찾기 후 호출되는 API)
    app.patch('/app/user/reset-password', jwtMiddleware, user.patchPassword);

};



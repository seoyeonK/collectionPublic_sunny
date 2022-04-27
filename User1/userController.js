const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var regExp = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/; //전화번호 양식
var regExpcheck = /^01([0|1|6|7|8|9])([0-9]{3,4})?([0-9]{4})$/; //전화번호 값
var blank_pattern = /^\s+|\s+$/g; //공백문자만
var blank_all = /[\s]/g; //공백도 입력
var regExpName = /^[가-힣]{2,5}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/; //이름
var regExpSpecial = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;//특수문자 사용
// var regExpID = /^[a-z]+[a-z0-9]{5,14}$/g; //ID는 영문자로 시작하는 6~15자 영문자 또는 숫자
// var regExpPW = /^[a-z]+[a-z0-9]{5,14}$/g; //PW는 영문자로 시작하는 6~15자 영문자 또는 숫자



/**
 * API Name : 비밀번호 재설정 
 * [PATCH] /app/user/reset-password/:userIdx
 * body : newPassword, checkPassword
 */

exports.patchPassword = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    
    const newPassword = req.body.newPassword;

    const checkPassword = req.body.checkPassword;



    //빈 값 체크
    if (!newPassword){
        return res.send(errResponse(baseResponse.MODI_NEW_PW_EMPTY));
    }
    else if(!checkPassword){
        return res.send(errResponse(baseResponse.MODI_CHECK_PW_EMPTY));
    }
            
    //길이 체크
    if (newPassword.length < 6 || newPassword.length > 15){
        return res.send(response(baseResponse.REGISTER_NEW_PW_LENGTH));
    }  
    else if (checkPassword.length < 6 || checkPassword.length > 15){
        return res.send(response(baseResponse.REGISTER_CHECK_PW_LENGTH));
    }  


        
    const updatePwResponse = await userService.updatePw(
        userIdx, 
        newPassword
    );

    return res.send(updatePwResponse)

}

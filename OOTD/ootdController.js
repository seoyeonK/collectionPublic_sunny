const jwtMiddleware = require("../../../config/jwtMiddleware");
const ootdProvider = require("./ootdProvider");
const ootdService = require("./ootdService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {PreSignUrl} = require('../../../config/s3Authentication');
const {logger} = require("../../../config/winston");

const regexEmail = require("regex-email");

var blank_pattern = /^\s+|\s+$/g;


/**
 * API No. 1
 * API Name : 사용자 추가 블럭 API
 * [POST] /app/ootd/new-block/:userIdx?Clothes=?&PWW=?
 */
exports.postNewBlock = async function (req, res) {
    // 1. jwt token 검증 

    const userIdx = req.verifiedToken.userIdx;


    /**jwt token 검증 성공한 다음*/

    // 2. content - 형식 체크 
    /** 
     * 2-1) 공백문자로만 이루어져 있는지 => 3029
     * 2-2) 6글자가 안넘는지 길이 체크  => 3049
     */ 
    
    const content = req.body.content;

    if(!content){
        return res.send(errResponse(baseResponse.TAG_EMPTY));
    }



    var Content = content.toString();
    if(Content.replace(blank_pattern, '' ) == "" ){
        return res.send(errResponse(baseResponse.PWWC_BLANK_TEXT));  
    }

    Content = content.toString().trim();
            
    console.log(`trimmed content : ${Content}`);

    if(Content.length > 6){            
        return res.send(errResponse(baseResponse.TAG_LENGTH));
    }


    // 3. Clothes, PWW flag Null number형 형식 체크 - Number():변수가 정의되지 않았거나 숫자로 변환할 수 없는 경우 NaN반환
    var Clothes = req.query.Clothes;  //0: Top, 1: Bottom, 2: Shoes, 3: etc
    var PWW = req.query.PWW;          //0: Place, 1: Weather, 2: Who

    console.log(`Clothes : ${Clothes}`);
    console.log(`Clothes : ${typeof(Clothes)}`);
    console.log(`PWW :  ${PWW}`);
    console.log(`PWW :  ${typeof(PWW)}`);


    //if(( (!Clothes) && (Clothes != 0)) || ( (!PWW) && (PWW !=0) ) || (typeof(Clothes) == 'undefined') || (typeof(PWW) == 'undefined')) {
    
    
    if(Clothes == "" || PWW == "" || (typeof(Clothes) == 'undefined') || (typeof(PWW) == 'undefined')){
        return res.send(errResponse(baseResponse.CLOTHES_PWW_ONE_EMPTY));       //Clothes, PWW 중 하나라도 아예 입력되지 않은 경우
    }



    Clothes = Number(Clothes);
    PWW = Number(PWW);

    
    console.log(`Number(Clothes) : ${typeof(Clothes)}`);
    console.log(`Number(PWW) :  ${typeof(PWW)}`);

    if(isNaN(Clothes) || isNaN(PWW) ){ //둘 중 하나가 숫자가 아님            
        return res.send(errResponse(baseResponse.QUERY_STRING_ERROR_TYPE));
    }

    
    // 4. Clothes, PWW flag 값 체크 
    /**     Clothes PWW
     *  4-0) 유효한 값의 범위인지 체크 => PWWC_INVALID_VALUE
     *  4-1) -1   -1   => 3028 (QUERY_STRING_EMPTY) 
     *  4-2) number number    => 3042 (QUERY_STRING_OVERFLOW)
     *  4-3) number    -1   => clothes 블럭 추가
     *  4-4) -1   number    => PWW 블럭 추가
    */

        if( (Clothes < -1) || (3 < Clothes)){//유효하지 않은 값
        return res.send(errResponse(baseResponse.PWW_INVALID_VALUE)); 
    }
    if( (PWW < -1) || (2 < PWW) ) {  //유효하지 않은 값
        return res.send(errResponse(baseResponse.PWW_INVALID_VALUE)); 
    }

    if((Clothes == -1) && (PWW == -1)){
        return res.send(errResponse(baseResponse.FLAG_EMPTY));
    }
    if((Clothes != -1) && (PWW != -1)){
        return res.send(errResponse(baseResponse.QUERY_STRING_OVERFLOW));
    }
            

    console.log(`controller Content : ${Content}`);
    const newBlockResponse = await ootdService.createNewBlock(
        userIdx,
        Clothes,
        PWW,
        Content
    );
        
    //Service : 중복확인 -> 20개 개수 확인 -> post
    

    // newBlockResponse 값을 json으로 전달
    return res.send(newBlockResponse);
    
};



exports.patchBlock = async function (req, res) {

    // 1. jwt token 검증 

    const userIdx = req.verifiedToken.userIdx;
    const content = req.body.content;


    if(!content){
        return res.send(errResponse(baseResponse.TAG_EMPTY));
    }

    var Content = content.toString();    

    if(Content.replace(blank_pattern, '' ) == "" ){
        return res.send(errResponse(baseResponse.PWWC_BLANK_TEXT));  
    }

    Content = content.toString().trim();
            
    console.log(`trimmed content : ${Content}`);

    if(Content.length > 6){            
        return res.send(errResponse(baseResponse.TAG_LENGTH));
    }

    // 3. Clothes, PWW flag Null number형 형식 체크 - Number():변수가 정의되지 않았거나 숫자로 변환할 수 없는 경우 NaN반환
    var Clothes = req.query.Clothes;  //0: Top, 1: Bottom, 2: Shoes, 3: etc
    var PWW = req.query.PWW;          //0: Place, 1: Weather, 2: Who

    console.log(`Clothes : ${Clothes}`);
    console.log(`Clothes : ${typeof(Clothes)}`);
    console.log(`PWW :  ${PWW}`);
    console.log(`PWW :  ${typeof(PWW)}`);


    

    

    //if(( (!Clothes) && (Clothes != 0)) || ( (!PWW) && (PWW !=0) ) || (typeof(Clothes) == 'undefined') || (typeof(PWW) == 'undefined')) {                
    if(Clothes == "" || PWW == "" || (typeof(Clothes) == 'undefined') || (typeof(PWW) == 'undefined')){ 
        return res.send(errResponse(baseResponse.CLOTHES_PWW_ONE_EMPTY));       //Clothes, PWW 중 하나라도 아예 입력되지 않은 경우
    }

    
    
    if( (Clothes < -1) || (3 < Clothes)){//유효하지 않은 값
        return res.send(errResponse(baseResponse.PWW_INVALID_VALUE)); 
    }
    if( (PWW < -1) || (2 < PWW) ) {  //유효하지 않은 값
        return res.send(errResponse(baseResponse.PWW_INVALID_VALUE)); 
    }

    if((Clothes == -1) && (PWW == -1)){
        return res.send(errResponse(baseResponse.FLAG_EMPTY));
    }
    if((Clothes != -1) && (PWW != -1)){
        return res.send(errResponse(baseResponse.QUERY_STRING_OVERFLOW));
    }


    console.log(`controller Content : ${Content}`);


    const deleteBlockResponse = await ootdService.deleteBlock(
        userIdx,
        Clothes,
        PWW,
        Content
    );
    return res.send(deleteBlockResponse);
    

};


exports.patchOotd = async function (req, res) {

    // 1. jwt token 검증 

    const userIdx = req.verifiedToken.userIdx;

    const date = new Date(req.query.date); 
    let pattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

    //var date_ = new Date(date);

    if(pattern.test(date)){     //yyyy-MM-dd 형식 검사
        return res.send(errResponse(baseResponse.DATE_ERROR_TYPE));  
    }


    var date_start = new Date('2010-01-01');
    var date_end = new Date('2099-12-31');

    if( (date < date_start) || (date > date_end) ){     //기준 날짜 범위 외의 날짜 검사
        return res.send(errResponse(baseResponse.DATE_INVALID_VALUE));
    }
    
    
    const deleteOotdResponse = await ootdService.deleteOotd(
        userIdx,
        date
    );
    return res.send(deleteOotdResponse);


};

exports.getPreSignUrl = async function (req,res) {
    const userIdx = req.verifiedToken.userIdx;

    try{       
        const url = await PreSignUrl();
        console.log('presignedURL return type :', typeof(url));
        return res.send(response(baseResponse.SUCCESS_S3_PRESIGNEDURL, {'preSignedUrl' : url}));
    }
    catch(err){
        logger.error(`App - getPreSignUrl Controller error\n: ${err.message}`);
        return res.send(errResponse(baseResponse.S3_ERROR));
    }
};

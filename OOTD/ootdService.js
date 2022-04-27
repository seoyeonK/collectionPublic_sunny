const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const ootdProvider = require("./ootdProvider");
const ootdDao = require("./ootdDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리





exports.createNewBlock = async function (userIdx, Clothes, PWW, Content) {
    try {    
        //1. 블럭 Content 중복 확인  
        const ContentRows = await ootdProvider.tagRedundantCheck(userIdx, Clothes, PWW, Content);
        if(ContentRows.length > 0)
            return errResponse(baseResponse.TAG_REDUNDANT);
        console.log(`중복확인 contentAdded`);

       
        const FixedContentRows = await ootdProvider.fixedRedundantCheck(Clothes, PWW, Content);
        if(FixedContentRows.length > 0)
            return errResponse(baseResponse.TAG_REDUNDANT_FIXED);
         console.log(`중복확인 contentFixed`);            


        //  2. 추가하는 블럭 20개 넘는지 체크, 20개 미만이면 추가
        const numberRows = await ootdProvider.tagNumberCheck(userIdx, Clothes, PWW);
        if (numberRows.length >= 20)
            return errResponse(baseResponse.TAG_OVERFLOW);
        console.log(`중복확인 contentAdded`);


        // 3. POST 쿼리문에 사용할 변수 값을 배열 형태로 전달
        

        
        const connection = await pool.getConnection(async (conn) => conn);

        if(PWW == -1){
            var flag;//undefined
            if(Clothes == 0) 
                flag = "Top";
            
            else if(Clothes == 1) 
                flag = "Bottom";

            else if(Clothes == 2) 
                flag = "Shoes";
            else if(Clothes == 3) 
                flag = "Etc"; 

            console.log(`service flag : ${flag}`);
            const insertNewBlockParams = [userIdx, flag, Content];
            const clothesResult = await ootdDao.insertAddedClothes(connection, insertNewBlockParams);
            connection.release();
            
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Clothes' : Content});
        }        
        else if(PWW == 0){
            insertNewBlockParams = [userIdx, Content];
            const placeResult = await ootdDao.insertAddedPlace(connection, insertNewBlockParams);
            connection.release();
            
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Place' : Content});
        }
        else if(PWW == 1){
            insertNewBlockParams = [userIdx, Content];
            const weatherResult = await ootdDao.insertAddedWeather(connection, insertNewBlockParams);
            connection.release();
      
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Weather' : Content});
        }
        else if(PWW == 2){
            insertNewBlockParams = [userIdx, Content];
            const whoResult = await ootdDao.insertAddedWho(connection, insertNewBlockParams);
            connection.release();
      
            
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Who' : Content});
        }


    } catch (err) {
        logger.error(`App - createNewBlock Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.deleteBlock = async function (userIdx, Clothes, PWW, Content) {
    try {    
        // 1. 블럭 Content 존재 확인  
        // 해당하는 블럭의 status를 블러와서 길이가 0이면 아예 존재하지 않는 경우, 내용이 inactive이면 이미 삭제된 경우
        // TAG_ALREADY_DELETED
        // TAG_NEVER_EXISTED

        const ContentRows = await ootdProvider.tagExistCheck(userIdx, Clothes, PWW, Content);
        console.log(`exist 검사 - status :`, ContentRows);

        if(ContentRows.length == 0)
            return errResponse(baseResponse.TAG_NEVER_EXISTED);
        
        else if(ContentRows[0].status == "inactive")
            return errResponse(baseResponse.TAG_ALREADY_DELETED);



        const connection = await pool.getConnection(async (conn) => conn);

        if(PWW == -1){
            var flag;//undefined
            if(Clothes == 0) 
                flag = "Top";
            
            else if(Clothes == 1) 
                flag = "Bottom";

            else if(Clothes == 2) 
                flag = "Shoes";
            else if(Clothes == 3) 
                flag = "Etc"; 

            console.log(`service flag : ${flag}`);
            const deleteNewBlockParams = [userIdx, flag, Content];
            const clothesResult = await ootdDao.deleteAddedClothes(connection, deleteNewBlockParams);
            connection.release();
        
            console.log(`삭제된 블럭 :`, clothesResult );            
            
        }        
        else if(PWW == 0){
            const deleteNewBlockParams = [userIdx, Content];
            const placeResult = await ootdDao.deleteAddedPlace(connection, deleteNewBlockParams);
            connection.release();
        
            console.log(`삭제된 블럭 :`, placeResult );            
        }
        else if(PWW == 1){
            const deleteNewBlockParams = [userIdx, Content];
            const weatherResult = await ootdDao.deleteAddedWeather(connection, deleteNewBlockParams);
            connection.release();
            
        
            console.log(`삭제된 블럭 :`, weatherResult );            
      
        }
        else if(PWW == 2){
            const deleteNewBlockParams = [userIdx, Content];
            const whoResult = await ootdDao.deleteAddedWho(connection, deleteNewBlockParams);
            connection.release();
            
        
            console.log(`삭제된 블럭 :`, whoResult );            
        }
        
        return response(baseResponse.SUCCESS_DELETE_BLOCK, {'deleted block' : Content});

    }catch (err) {
        logger.error(`App - deleteBlock Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};


exports.deleteOotd = async function (userIdx, date) {
    try {    
        
        const connection = await pool.getConnection(async (conn) => conn);

        //1. 해당 userIdx에 해당 date에 OOTD가 존재하는지 검증
        let ootdIdx = await ootdProvider.ootdExistCheck(userIdx, date);
        
        console.log(`ootd exist 검사 - ootdIdx :`, ootdIdx);
       
        if(typeof(ootdIdx)=='undefined')
            return errResponse(baseResponse.DATE_OOTD_EMPTY);

        ootdIdx = ootdIdx.ootdIdx; 
        
        //ootd 삭제 - transaction 처리
        try{
            await connection.beginTransaction();
            
            //2. ootdIdx == OOTD.ootdIdx인 OOTD.status = "inactive"로 patch
            const deleteOotdResult = await ootdDao.deleteOotdData(connection, userIdx, ootdIdx);
            console.log(`Service.ootd deleted :`, ootdIdx);

            const deleteClothesResult = await ootdDao.deleteClothesData(connection, ootdIdx);
            console.log(`Service.clothes deleted :`, ootdIdx);

            const deletePhotoResult = await ootdDao.deletePhotoData(connection, ootdIdx);
            console.log(`Service.photo deleted :`, ootdIdx);
            

            const deletePlaceResult = await ootdDao.deletePlaceData(connection, ootdIdx);
            console.log(`Service.place deleted :`, ootdIdx);

            const deleteWeatherResult = await ootdDao.deleteWeatherData(connection, ootdIdx);
            console.log(`Service.weather deleted :`, ootdIdx);

            const deleteWhoResult = await ootdDao.deleteWhoData(connection, ootdIdx);
            console.log(`Service.who deleted :`, ootdIdx);            


            await connection.commit();
            
            return response(baseResponse.SUCCESS_OOTD_DELETION); //, {'deleted ootd' : Content});
        }      
        catch(err){
            await connection.rollback();
            logger.error(`App - deleteOotd transcation error\n: ${err.message}`);
            return errResponse(baseResponse.OOTD_DELETION_RESPONSE_ERROR);
        }
        finally{            
            connection.release();            
        }      

    }
    catch (err) {
        logger.error(`App - deleteOotd Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const ootdDao = require("./ootdDao");

// Provider: Read 비즈니스 로직 처리

exports.tagRedundantCheck = async function(userIdx, Clothes, PWW, Content){
  /*    

   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      Content가 smallClass와 같은 것을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       Content가 place/weather/who와 같은 것을 배열에 저장한 후 반환
   */

    const connection = await pool.getConnection(async (conn) => conn);

    if(PWW == -1){
            
      const clothesRedundantListResult = await ootdDao.selectClothesTag(connection, userIdx, Content);
      connection.release();
      return clothesRedundantListResult;
    }
    
    else if (Clothes == -1){
      var flag;
      if(PWW == 0)
        flag = "Place";
      if (PWW == 1)
        flag = "Weather";
      if (PWW == 2)
        flag = "Who";


      console.log(`providerTRC flag : ${flag}`);
      const pwwRedundantListResult = await ootdDao.selectPwwTag(connection, userIdx, flag, Content);
      connection.release();

      return pwwRedundantListResult;
    } 
};




exports.tagNumberCheck = async function(userIdx, Clothes, PWW){
  /*
   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      active인 것들을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       active인 것들을 pwwRows에 저장한 후 배열을 반환
   */


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
      
      console.log(`providerTNC flag : ${flag}`);
      const clothesNumberListResult = await ootdDao.selectClothesNumber(connection, userIdx, flag);
      connection.release();
      
      return clothesNumberListResult;
    }

    else if (Clothes == -1){
      var flag;
      if(PWW == 0)
        flag = "Place";
      if (PWW == 1)
        flag = "Weather";
      if (PWW == 2)
        flag = "Who";

      
      console.log(`providerTNC flag : ${flag}`);
      const pwwNumberListResult = await ootdDao.selectPwwNumber(connection, userIdx, flag);
      connection.release();

      return pwwNumberListResult;
    }

};

exports.tagExistCheck = async function(userIdx, Clothes, PWW, Content){
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
    
    
    console.log(`providerTEC flag : ${flag}`);
    const clothesExistListResult = await ootdDao.selectClothesExist(connection, userIdx, flag, Content);
    connection.release();

    return clothesExistListResult;
  }
  
  else if (Clothes == -1){
    var flag;
    if(PWW == 0)
      flag = "Place";
    if (PWW == 1)
      flag = "Weather";
    if (PWW == 2)
      flag = "Who";


    console.log(`providerTEC flag : ${flag}`);
    const pwwExistListResult = await ootdDao.selectPwwExist(connection, userIdx, flag, Content);
    connection.release();

    return pwwExistListResult;
  } 


}


exports.ootdExistCheck = async function(userIdx, date){

  const connection = await pool.getConnection(async (conn) => conn);      
  const selectOotdExistParams = [userIdx, date, "active"];
  const ootdExistListResult = await ootdDao.selectOotdExist(connection, selectOotdExistParams);
  connection.release();

  return ootdExistListResult[0];
  
}




exports.fixedRedundantCheck = async function(Clothes, PWW, Content){
  /*    

   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      Content가 smallClass와 같은 것을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       Content가 place/weather/who와 같은 것을 배열에 저장한 후 반환
   */

    const connection = await pool.getConnection(async (conn) => conn);

    if(PWW == -1){
            
      const fixedClothesRedundantListResult = await ootdDao.selectFixedClothesTag(connection, Content);
      connection.release();
      return fixedClothesRedundantListResult;
    }
    
    else if (Clothes == -1){
      var pwwflag;
      if(PWW == 0)
        pwwflag = "Place";
      if (PWW == 1)
        pwwflag = "Weather";
      if (PWW == 2)
        pwwflag = "Who";


      console.log(`providerFTRC flag : ${pwwflag}`);
      const fixedPwwRedundantListResult = await ootdDao.selectFixedPwwTag(connection, pwwflag, Content);
      connection.release();

      return fixedPwwRedundantListResult;
    } 
};

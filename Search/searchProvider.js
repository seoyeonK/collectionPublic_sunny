const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");


const baseResponse = require("../../../config/baseResponseStatus");


const searchDao = require("./searchDao");
const calendarProvider = require("../Calendar/calendarProvider"); //

/* 
getSearchResult : calendarProvider 내 retrieveWeeklyList 함수 로직 이용 및 함수 이용 (credits to 녜) 

changeBlankClothes
getImageUrlKey
getImageUrl
getImageCntKey
hasImageUrl
getImageCnt
getOotd
getBigClass
getPlaces
getWeathers
getWhos
hasClothes
pushOotd

*/



exports.historyRedudantCheck = async function(connection, userIdx, PWWC, keyword, color){
 // const connection = await pool.getConnection(async (conn) => conn);
  const historyRedundantResult = await searchDao.selectOldHistory(connection, userIdx, PWWC, keyword, color);
// connection.release();
  return historyRedundantResult;
};

exports.historyNumCheck = async function (connection, userIdx, PWWC) {

 // const connection = await pool.getConnection(async (conn) => conn);
  const historyListResult = await searchDao.selectHistory(connection, userIdx, PWWC);
 // connection.release();
  console.log(`historyNumCheck : `, historyListResult.length);

  return historyListResult;
  
};



exports.getSearchResult = async function (userIdx, PWWC, keyword1, keyword2, color1, color2, startAt, endAt){
  try{
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // PWWC에 따라 Dao 쿼리문의 결과를 호출
    var searchListResult = [];


    if(PWWC == 0){          //place      
        //검색결과 가져오기
        searchListResult = await searchDao.selectSearchPlaceList(connection, userIdx, keyword1);
        console.log(`Place searchListResult length : `, searchListResult.length);     

    }


    else if(PWWC == 1){     //weather

      searchListResult = await searchDao.selectSearchWeatherList(connection, userIdx, keyword1);
      console.log(`Weather searchListResult length : `, searchListResult.length);

    }


    else if(PWWC == 2){     //who
      
      searchListResult = await searchDao.selectSearchWhoList(connection, userIdx, keyword1);
      console.log(`Who searchListResult length : `, searchListResult.length);

    }


    else if (PWWC == 3){    //color
    
      searchListResult = await searchDao.selectSearchColorList(connection, userIdx, keyword1, color1);
      console.log(`Clothes searchListResult length : `, searchListResult.length);

    }
    // connection 해제
    connection.release();

    if(searchListResult.length == 0){
      return errResponse(baseResponse.SEARCH_NOT_FOUND);
    }


    //ootd list 처리 - credits to 녜
    let ootds = [];
    var moment = require('moment');
    let img_cnt = 0;
    let imgUrlArr = [];

    for (let row of searchListResult) {
      
      // ootds 배열에 새로운 ootd row 추가 여부 결정
      let ootd = calendarProvider.getOotd(row.ootdIdx, ootds);
      // img_cnt와 distinct한 imgUrl을 저장하는 배열 초기화
      if(!ootd.ootdIdx){
        img_cnt = 0;
        imgUrlArr = [];
      }

      // ootdIdx, date, lookpoint, imageUrl 정의. 똑같을 확률 높음.
      ootd["ootdIdx"] = row.ootdIdx;
      ootd["date"] = moment(row.date).format('YYYY-MM-DD');
      ootd["lookpoint"] = row.lookpoint;

      // imageUrl key를 이어가거나 새로 추가하기
      ootd["imageUrl"] = calendarProvider.getImageUrlKey(row.ootdIdx, ootds);
      // imageUrl
      if(!ootd["imageUrl"]){
        ootd["imageUrl"] = calendarProvider.getImageUrl(row.imageUrl, row.thumbnail);
      }
      
      // imageCnt key를 이어나가거나 새로 추가하기
      ootd["imageCnt"] = calendarProvider.getImageCntKey(row.ootdIdx, ootds);
      //imageCnt
      if(!calendarProvider.hasImageUrl(imgUrlArr, row.imageUrl)){
        ootd["imageCnt"] = calendarProvider.getImageCnt(row.thumbnail, img_cnt, ootd["imageCnt"]);
        img_cnt = ootd["imageCnt"];
      }

      // place, weather, who에 접근하여 같은 것이 있는지 확인하고 넣기
      ootd["place"] = calendarProvider.getPlaces(row, ootd["place"]);
      ootd["weather"] = calendarProvider.getWeathers(row, ootd["weather"]);
      ootd["who"] = calendarProvider.getWhos(row, ootd["who"]);
      
      // bigClass 이름으로 된 key가 없을 경우 추가 및 빈 배열 value 생성
      ootd = calendarProvider.getBigClass(row.ootdIdx, ootds, ootd);

      // fixedClothes가 있을 때
      if(row.fixedBig != null) {
        // smallClass - color로 이루어진 객체 생성
        let data = { smallClass : row.fixedSmall, color : row.color};

        // 만든 smallClass - color 객체가 이미 저장되었는지 확인한 후 저장 
        if(!calendarProvider.hasClothes(ootd[row.fixedBig], data)){
          ootd[row.fixedBig].push(data);
        }
      }
      else { // addedClothes가 있을 때
        // smallClass - color로 이루어진 객체 생성
        let data = {smallClass : row.addedSmall, color : row.color};

        // 만든 smallClass - color 객체가 이미 저장되었는지 확인한 후 저장
        if(!calendarProvider.hasClothes(ootd[row.addedBig], data)){
          ootd[row.addedBig].push(data);
        }
      }      


      //startAt과 endAt이 null이 아닐 경우
      if(startAt && endAt){ 
        let test_date = new Date ( ootd["date"] );
        if( ( test_date < startAt ) || ( test_date > endAt) ){
          continue;
        }
      }

      
      if(!keyword2){                  //keyword2가 없을 때
        // 새로 만들어진 ootd를 배열에 삽입
        ootds = calendarProvider.pushOotd(ootds, ootd);

      }
      else{                           //keyword2가 있을 때
        if(PWWC == 0){
          if(ootd["place"].includes(keyword2)){           //place에 해당 keywrod2가 존재할 경우에만 결과에 추가
            ootds = calendarProvider.pushOotd(ootds, ootd);
          }
        }
        else if(PWWC == 1){
          if(ootd["weather"].includes(keyword2)){           //weather에 해당 keywrod2가 존재할 경우에만 결과에 추가
            ootds = calendarProvider.pushOotd(ootds, ootd);
          }
        }
        else if(PWWC == 2){
          if(ootd["who"].includes(keyword2)){           //who에 해당 keywrod2가 존재할 경우에만 결과에 추가
            ootds = calendarProvider.pushOotd(ootds, ootd);
          }
        }
        else if(PWWC == 3){
          let clothes = [];
          clothes.push(ootd["Top"]);
          clothes.push(ootd["Bottom"]);
          clothes.push(ootd["Shoes"]);
          clothes.push(ootd["Etc"]);

          for(let type of clothes){
            for(let {"smallClass": sm, "color" : colors} of type){
              if(sm == keyword2 && colors == color2){
                ootds = calendarProvider.pushOotd(ootds, ootd);
              }
            }
          }

        }
        
      }

      
     
    }

    // 빈 배열을 갖는 Top, Bottom, Shoes, Etc 값 변경 함수
    ootds = calendarProvider.changeBlankClothes(ootds);

    /*
    ootds
    {
      [ootdIdx]
      [date]
      [lookpoint]
      [imageUrl]
      [imageCnt]
      [place]
      [weather]
      [who]
      [Top] - {smallClass, color}
      [Bottom] - {smallClass, color}
      [Shoes] - {smallClass, color}
      [Etc] - {smallClass, color}
    }
    */

    //date처리 - startAt, endAt



    console.log('[searchProvider] getSearchResult finish');
    return ootds;

  }catch(err){
    logger.error(`App - getSearchResult Provider error\n: ${err.message} \n${JSON.stringify(err)}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

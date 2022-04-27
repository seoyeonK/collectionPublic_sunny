
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// AddedClothes 중복 체크
async function selectClothesTag(connection, userIdx, Content) {
  const selectTagParams = [userIdx, Content, "active"];// (userAdded)

  const selectClothesTagListQuery = `
        SELECT smallClass 
        FROM AddedClothes
        WHERE userIdx = ? AND smallClass = ? AND status = ?;
                `;
  const [tagRows] = await connection.query(
        selectClothesTagListQuery, 
        selectTagParams);

  return tagRows;
};

// PWW 중복 체크
async function selectPwwTag(connection, userIdx, flag, Content) {
  var selectPwwTagListQuery =``;
  if(flag == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND place = ? AND status = ?;
    `;

  }
  if(flag == "Weather"){
    selectPwwTagListQuery = `
      SELECT weather 
      FROM AddedWeather
      WHERE userIdx = ? AND weather = ? AND status = ?;
    `; 
  }
  if(flag == "Who"){
    selectPwwTagListQuery = `
      SELECT who 
      FROM AddedWho
      WHERE userIdx = ? AND who = ? AND status = ?;
    `; 
  }

  const selectTagParams = [userIdx, Content, "active"];// (userAdded)

   const [tagRows] = await connection.query(
        selectPwwTagListQuery, 
        selectTagParams);

  return tagRows;
};



async function selectClothesNumber(connection, userIdx, flag) {  

  const selectTagNumParams = [userIdx, flag, "active"];// (userAdded)

  const selectClothesNumberListQuery = `
      SELECT smallClass 
      FROM AddedClothes
      WHERE userIdx = ? AND bigClass = ? AND status = ?;
                `;
  const [tagNumRows] = await connection.query(
        selectClothesNumberListQuery, 
        selectTagNumParams);

  return tagNumRows;
};



async function selectPwwNumber(connection, userIdx, flag) {
  var selectPwwTagListQuery =``;
  if(flag == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND status = ?;
      `;

  }
  if(flag == "Weather"){
      selectPwwTagListQuery = `
        SELECT weather 
        FROM AddedWeather
        WHERE userIdx = ? AND status = ?;
      `; 
  }
  if(flag == "Who"){
      selectPwwTagListQuery = `
        SELECT who 
        FROM AddedWho
        WHERE userIdx = ? AND status = ?;
      `; 
  }

  const selectTagNumParams = [userIdx, "active"];// (userAdded)

   const [tagNumRows] = await connection.query(
        selectPwwTagListQuery, 
        selectTagNumParams);

  return tagNumRows;
};

async function insertAddedClothes(connection, insertNewBlockParams) {
  const insertClothesQuery = `
      INSERT INTO AddedClothes(userIdx, bigClass, smallClass)
      VALUES (?, ?, ?);
  `;
  const insertClothesQueryRow = await connection.query(
      insertClothesQuery,
      insertNewBlockParams
  );

  return insertClothesQueryRow[0];
}

async function insertAddedPlace(connection, insertNewBlockParams) {
  const insertPlaceQuery = `
      INSERT INTO AddedPlace(userIdx, place)
      VALUES (?, ?);
  `;
  const insertPlaceQueryRow = await connection.query(
      insertPlaceQuery,
      insertNewBlockParams
  );

  return insertPlaceQueryRow[0];
}

async function insertAddedWeather(connection, insertNewBlockParams) {
  const insertWeatherQuery = `
      INSERT INTO AddedWeather(userIdx, weather)
      VALUES (?, ?);
  `;
  const insertWeatherQueryRow = await connection.query(
      insertWeatherQuery,
      insertNewBlockParams
  );

  return insertWeatherQueryRow[0];
}

async function insertAddedWho(connection, insertNewBlockParams) {
  const insertWhoQuery = `
      INSERT INTO AddedWho(userIdx, who)
      VALUES (?, ?);
  `;
  const insertWhoQueryRow = await connection.query(
      insertWhoQuery,
      insertNewBlockParams
  );

  return insertWhoQueryRow[0];
}



//Clothes 존재 체크 
async function selectClothesExist(connection, userIdx, flag, Content) {
  const selectTagParams = [userIdx, flag, Content, "active"];// (userAdded)

  const selectClothesTagListQuery = `
        SELECT status 
        FROM AddedClothes
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ? AND status = ?;
                `;
  const [tagRows] = await connection.query(
        selectClothesTagListQuery, 
        selectTagParams);

  return tagRows;
}

// PWW 존재 체크
async function selectPwwExist(connection, userIdx, flag, Content) {
  var selectPwwExistListQuery =``;
  if(flag == "Place"){
    selectPwwExistListQuery = `
        SELECT status 
        FROM AddedPlace
        WHERE userIdx = ? AND place = ? AND status = ?
    `;

  }
  if(flag == "Weather"){
    selectPwwExistListQuery = `
      SELECT status 
      FROM AddedWeather
      WHERE userIdx = ? AND weather = ? AND status = ?
    `; 
  }
  if(flag == "Who"){
    selectPwwExistListQuery = `
      SELECT status 
      FROM AddedWho
      WHERE userIdx = ? AND who = ? AND status = ?
    `; 
  }

  const selectTagParams = [userIdx, Content, "active"];// (userAdded)

   const [tagRows] = await connection.query(
        selectPwwExistListQuery, 
        selectTagParams);

  return tagRows;
}

//

async function deleteAddedClothes(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, flag, Content];
    const updateBlockQuery = `
        UPDATE AddedClothes 
        SET status = "inactive", AddedClothes.updateAt = CURRENT_TIMESTAMP
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ?;
        `;
    const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
    return updateBlockRow[0];
}

async function deleteAddedPlace(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedPlace
      SET status = "inactive", AddedPlace.updateAt = CURRENT_TIMESTAMP
      WHERE userIdx = ? AND place = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}

async function deleteAddedWeather(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedWeather 
      SET status = 'inactive', AddedWeather.updateAt = CURRENT_TIMESTAMP
      WHERE userIdx = ? AND weather = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}

async function deleteAddedWho(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedWho
      SET status = 'inactive', AddedWho.updateAt = CURRENT_TIMESTAMP
      WHERE userIdx = ? AND who = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}



//OOTD 존재 체크 
async function selectOotdExist(connection, selectOotdExistParams) {
  const selectOotdExistQuery = `
        SELECT ootdIdx 
        FROM OOTD
        WHERE userIdx = ? AND date = ? AND status = ?;
                `;
  const [ootdRows] = await connection.query(
        selectOotdExistQuery, 
        selectOotdExistParams);

  return ootdRows;
}


async function deleteOotdData(connection, userIdx, ootdIdx){  //
  
  const deleteOotdParams = [userIdx, ootdIdx];
  const updateOotdQuery = `
      UPDATE OOTD
      SET OOTD.status = 'inactive', OOTD.updateAt = CURRENT_TIMESTAMP
      WHERE OOTD.userIdx = ? AND OOTD.ootdIdx = ?;
      `;
    const updateOotdRow = await connection.query(updateOotdQuery, deleteOotdParams);
    console.log(`Dao.ootd deleted :`, ootdIdx);

    return updateOotdRow[0];
}
async function deleteClothesData(connection, ootdIdx){  //
  const updateClothesQuery= `
      UPDATE Clothes
      SET Clothes.status = 'inactive', Clothes.updateAt = CURRENT_TIMESTAMP
      WHERE Clothes.ootdIdx = ?;
      `;
  const updateClothesRow = await connection.query(updateClothesQuery, ootdIdx);
  console.log(`Dao.clothes deleted :`, ootdIdx);
  return updateClothesRow[0];
  
}

async function deletePhotoData(connection, ootdIdx){  //
  const updatePhotoQuery= `
      UPDATE Photo, OOTD
      SET Photo.status = 'inactive', Photo.updateAt = CURRENT_TIMESTAMP
      WHERE OOTD.photoIs = ? AND Photo.ootdIdx = ? ;
      `;
  const deletePhotoParams = [0, ootdIdx]
  const updatePhotoRow = await connection.query(updatePhotoQuery, deletePhotoParams);
  console.log(`Dao.photo deleted :`, ootdIdx);

  return updatePhotoRow[0];  
}


async function deletePlaceData(connection, ootdIdx){  //
  const updatePlaceQuery= `
      UPDATE Place
      SET Place.status = 'inactive', Place.updateAt = CURRENT_TIMESTAMP
      WHERE Place.ootdIdx = ?;
      `;
  const updatePlaceRow = await connection.query(updatePlaceQuery, ootdIdx);
  console.log(`Dao.place deleted :`, ootdIdx);
  return updatePlaceRow[0];  
}

async function deleteWeatherData(connection, ootdIdx){  //
  const updateWeatherQuery= `
      UPDATE Weather
      SET Weather.status = 'inactive', Weather.updateAt = CURRENT_TIMESTAMP
      WHERE Weather.ootdIdx = ?;
      `;
  const updateWeatherRow = await connection.query(updateWeatherQuery, ootdIdx);
  console.log(`Dao.Weather deleted :`, ootdIdx);
  return updateWeatherRow[0];  
}

async function deleteWhoData(connection, ootdIdx){  //
  const updateWhoQuery= `
      UPDATE Who
      SET Who.status = 'inactive', Who.updateAt = CURRENT_TIMESTAMP
      WHERE Who.ootdIdx = ?;
      `;
  const updateWhoRow = await connection.query(updateWhoQuery, ootdIdx);
  console.log(`Dao.Who deleted :`, ootdIdx);
  return updateWhoRow[0];  
}







async function selectFixedClothesTag(connection, Content) {

  const selectFixedClothesTagListQuery = `
        SELECT smallClass 
        FROM FixedClothes
        WHERE smallClass = ?;
                `;
  const [tagRows] = await connection.query(
    selectFixedClothesTagListQuery, 
    Content);

  return tagRows;
};

// PWW 중복 체크
async function selectFixedPwwTag(connection, pwwflag, Content) {
  var selectFixedPwwTagListQuery =``;
  if(pwwflag == "Place"){
    selectFixedPwwTagListQuery = `
        SELECT place 
        FROM FixedPlace
        WHERE place = ?;
    `;

  }
  if(pwwflag == "Weather"){
    selectFixedPwwTagListQuery = `
      SELECT weather 
      FROM FixedWeather
      WHERE weather = ?;
    `; 
  }
  if(pwwflag == "Who"){
    selectFixedPwwTagListQuery = `
      SELECT who 
      FROM FixedWho
      WHERE who = ? ;
    `; 
  }

   const [tagRows] = await connection.query(
        selectFixedPwwTagListQuery, 
        Content);

  return tagRows;
};


module.exports = {
  selectClothesTag,
  selectPwwTag,
  selectClothesNumber,
  selectPwwNumber,
  insertAddedClothes,
  insertAddedPlace,
  insertAddedWeather,
  insertAddedWho,
  selectClothesExist,
  selectPwwExist,
  deleteAddedClothes,
  deleteAddedPlace,
  deleteAddedWeather,
  deleteAddedWho,
  selectOotdExist,
  deleteOotdData,
  deleteClothesData,
  deletePhotoData,
  deletePlaceData,
  deleteWeatherData,
  deleteWhoData,
  selectFixedClothesTag,
  selectFixedPwwTag,
};

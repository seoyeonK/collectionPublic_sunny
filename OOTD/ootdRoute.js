module.exports = function(app){
    const ootd = require('./ootdController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    const {response, errResponse} = require("../../../config/response");    
    const baseResponse = require("../../../config/baseResponseStatus");
    const upload = require('../../../config/Multer');

    // 1. 사용자 블럭 추가 API (JWT 검증 및 Validation )
    app.post('/app/ootd/new-block', jwtMiddleware, ootd.postNewBlock); //, jwtMiddleware, ootd.postNewBlock);
    
    
    //2. 사용자 블럭 삭제 API (JWT 검증 및 Validation)
    app.patch('/app/ootd/delete-block',jwtMiddleware, ootd.patchBlock);


    //3. OOTD 삭제 API
    app.patch('/app/ootd/deletion',jwtMiddleware, ootd.patchOotd);


    //4. S3 이미지 업로드 API
    app.post('/app/ootd/upload-photo', upload.single('image'), function(req, res)
    {   
        const Img = req.file;
        console.log('uploaded iamge : ', Img.location);
        
        res.send(response(baseResponse.SUCCESS_IMAGE_URL, {'s3 imageUrl' : Img.location}));               
    });

    //5. s3 presignedUrl 반환 API
    app.get('/app/ootd/s3-authentication',jwtMiddleware, ootd.getPreSignUrl); 

};
# Seoyeon's codes from [Collection](https://play.google.com/store/apps/details?id=com.eight.collection&pli=1) 
- Mobile application team project about OOTD (Outfit Of The) Calendar ; users can save photos of their OOTD along with **rates** and default/custom "**tags**". 
- "Tags" are related to :
   - **Color** of the outfit  
   - **Type** of the outfit  (ex: Top-windbreaker jacket, Bottom-jeans, shoes-converse low top)
   - **Places** visited in the outfit  (ex: museum, business meeting, ...)
   - Impression of the **Weather** on the day of the outfit  (ex: chilly, warm, ... )
   - **People** whom the user met with the outfit on  (ex: friends, lover, family)
      <p float="left" >
         <img src = ./readme_images/2.jpg width="20%" />
         <img src = ./readme_images/3.jpg width="20%" />
         <img src = ./readme_images/4.jpg width="20%" />
         <img src = ./readme_images/5.jpg width="20%" />
         <img src = ./readme_images/6.jpg width="20%" />
         <img src = ./readme_images/7.jpg width="20%" />
         <img src = ./readme_images/8.jpg width="20%" />
         <img src = ./readme_images/9.jpg width="20%" />
      </p>


<br><br/>
<br><br/>
# Implemented functions 
1. Provide presigned URLs to the front-end 
   - Presigned URL : Grant time-limited permission to AWS S3 service
   - Using presigned URLS, photos of the outfit will be uploaded to the granted AWS S3 bucket at the Front-end (Android-`Kotlin`)
2. Delete ootd 
   - Disable the status of the data in the Database (AWS RDS - MySQL, AWS S3) 
3. Create a custom "Tag" for later use
   - Users can create a custom "Tag" other than default "Tags" 
4. Delete custom "Tag"
   - Disable the status of the custom "Tag" in the Database (AWS RDS - MySQL)
5. Search ootd with keywords related to "Tags"
   - Users can also filter results by date
6. Reset user password 

<br><br/>
<br><br/>
# Directories 
 directories extracted from original respository (private)
```
                    			
   ├── app              				
   │    ├── OOTD            			      # OOTD domain folders
   │ 	│   ├── ootdRoute.js          	
   │ 	│   ├── ootdDao.js          	      # database queries related to OOTD
   │ 	│   ├── ootdController.js          	# request & response management
   │ 	│   ├── ootdProvider.js          	# server logic for "Read" 
   │ 	│   └── ootdService.js          	   # server logic for "Create, Update, Delete" functions   
   │    ├── Search            			   # Search domain folders
   │ 	│   ├── searchRoute.js          	
   │ 	│   ├── searchDao.js                # database queries related to search function
   │ 	│   ├── searchController.js         # request & response management
   │ 	│   ├── searchProvider.js          	# server logic for "Read"
   │ 	│   └── searchService.js          	# server logic for "Create, Update, Delete" functions   
   │    ├── User1            			      # User domain folders
   │ 	│   ├── userRoute.js          	
   │ 	│   ├── userDao.js          	      # database queries related to user functions
   │ 	│   ├── userController.js          	# request & response management
   │ 	│   ├── userProvider.js             # server logic for "Read"
   │ 	│   └── userService.js          	   # server logic for "Create, Update, Delete" functions   
```


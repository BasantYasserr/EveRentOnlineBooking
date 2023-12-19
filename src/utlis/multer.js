// import multer from 'multer'

// export const fileValidation = {
//     image: ['image/jpeg', 'image/png', 'image/gif'],
//     file: ['application/pdf', 'application/javascript', 'application/msword'],
//     video: ['video/mp4']
// }
// export const  fileUpload = (customValidation= [])=> {
//     if(!customValidation|| customValidation==[]){
//         customValidation = fileValidation.image 
//     }
//       //================================== Storage =============================
//       const storage = multer.diskStorage({})

//   //================================== File Filter =============================
//       function fileFilter(req, file, cb) {
//         if (customValidation.includes(file.mimetype)){
//             console.log('a7a erorr1');

//            return cb(null, true)
//         }else{
//             console.log('a7a erorr');
//             return cb(new Error ('Invalid Extension', {cause : 401}), false)
//         }
//     }

//     const upload = multer({fileFilter, storage})
//     return upload
// }


import multer from 'multer'


export const allowedExtensions = {
    image: ['image/png', 'image/jpeg', 'image/gif'],
    Files: ['application/pdf', 'application/javascript'],
    Videos: ['video/mp4'],
}  

export const multerCloudFunction = (allowedExtensionsArr) => {
  if (!allowedExtensionsArr) {
    allowedExtensionsArr = allowedExtensions.image
  }
  //================================== Storage =============================
  const storage = multer.diskStorage({})

  //================================== File Filter =============================
  const fileFilter = function (req, file, cb) {
    if (allowedExtensionsArr.includes(file.mimetype)) {
      
      return cb(null, true)
    }
    cb(new Error('invalid extension', { cause: 400 }), false)
  }

  const fileUpload = multer({
    fileFilter,
    storage,
  })
  return fileUpload
}

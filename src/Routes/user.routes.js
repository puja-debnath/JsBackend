import Router from "express"
import  {loginUser, logOutUser, registerUser,refreshAccessToken}  from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/register").post(
    upload.fields([      //we took fields cause its an array of files
           {
            name:"avatar",
            maxCount:1
           },
           {
            name:"coverImage",
            maxCount:1
           }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes (when user loggin in )
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/refresh-token").post(refreshAccessToken)


export default router
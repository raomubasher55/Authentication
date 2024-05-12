const express  = require('express');
const router = express();
const authController = require('../controllers/authController')
const {signupValidator, loginValidator} = require('../helper/validator');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))
// router.post('/signup', signupValidator , authController.signupUser );
// router.post('/login', loginValidator , authController.loginUser );

router.get('/mail-verification' , authController.mailVerification );
router.get('/forgetpassword' , authController.resetPassword);
router.post('/forgetpassword' , authController.updatePassword);
router.get('/resetpassword' , authController.successTesetPassword);


module.exports = router;
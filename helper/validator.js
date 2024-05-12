const { check } = require('express-validator');

exports.signupValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('mobile' , "Mobible Number should contains 10 digits ").isLength({
        min: 10 ,
        max: 10
    }),
    check('password', 'Password must be  greater than 6 character , and cotains at least one  Uppercase , one lowercase , one number and one character').not().isEmpty()
    .isStrongPassword({
        minLength:6,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
    }),
    check('image').custom((value , {req})=>{
        if(req.file.mimetype === 'image/jpeg'  || req.file.mimetype === 'image/png'){
            return (null, true); 
        }else{
            return(null ,false)
        }
    }).withMessage("Please Upload an image jpeg or PNG")
];

exports.sendMailVerificationValidator=[
    check('email', 'Enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
];
exports.passwordResetValidator=[
    check('email', 'Enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
];

exports.loginValidator = [
    check('email', 'Enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password is required').not().isEmpty()
];

exports.updateProfileValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('mobile' , "Mobible Number should contains 10 digits ").isLength({
        min: 10 ,
        max: 10
    }),
];

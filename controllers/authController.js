
const { validationResult } = require('express-validator')
const bcrypt =require('bcrypt');    
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mailer  = require('../helper/mailer')
const randomString = require('randomstring');
const passwordResetModel = require('../models/resetPassword');
const {deleteFile} = require('../helper/deleteFile');
const path = require('path')

const signupUser = async (req, res) => {
    try {
        
        //Express  validation 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }

        const {name, email , password , mobile }  =  req.body;
        const isExistUser = await userModel.findOne({email});
        if(isExistUser){
            return res.status(200).json({
                success: false,
                msg: "Email already registered"
            });
        }

        const hashPassword = await bcrypt.hash(password , 10);
       const user =  new userModel({
            name,
            email,
            password: hashPassword,
            mobile,
            image:'images/'+req.file.filename
        });
        const userData = await user.save();

        // const msg = `<p>Hi ${name}, please <a href="http://127.0.0.1:3000/mail-verification?id=${userData._id}">verify your email address</a>.</p>`;

        const msg = `
        <p>Hi ${name},</p>
        <p>Welcome to [Your Website/App Name]! We're thrilled to have you on board.</p>
        <p>To ensure the security of your account, please verify your email address by clicking the link below:</p>
        <p><a href="http://127.0.0.1:3000/mail-verification?id=${userData._id}">Verify Your Email Address</a></p>
        <p>If the above link doesn't work, you can copy and paste the following URL into your browser:</p>
        <p>http://127.0.0.1:3000/mail-verification?id=${userData._id}</p>
        <p>Please note that this link will expire in [Time Duration, e.g., 24 hours], so make sure to verify your email as soon as possible.</p>
        <p>By verifying your email, you'll unlock access to all of our features, including:</p>
        <ul>
          <li>[Feature 1]</li>
          <li>[Feature 2]</li>
          <li>[Feature 3]</li>
          <!-- Add more features as needed -->
        </ul>
        <p>If you didn't sign up for [Your Website/App Name], please disregard this email.</p>
        <p>If you have any questions or need assistance, feel free to contact us at [Your Contact Email].</p>
        <p>Best regards,<br>[Your Name]<br>[Your Position/Role]<br>[Your Website/App Name]</p>
      `;
      

        mailer.sendMailer(email , 'Mail Verification ' , msg);
        
        return res.status(200).json({
            success: true,
            msg: "Your Account is created is successfuly",
            data: userData
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        })
    }
}


//mail verification
const mailVerification = async(req,res)=>{
    try {
        if(req.query.id == undefined){
            return res.render('404')
        }   
        const userData = await userModel.findOne({_id: req.query.id});

        if(userData.isVerified == 1){
            return res.render('mail-verfication' , {message: "Your mail is already verified!"});
        }

        if(userData){
         await    userModel.findByIdAndUpdate({_id: req.query.id},{
                $set:{
                    isVerified: 1
                }
            });

            return res.render('mail-verfication' , {message: "Account is verified successfully"});
        }else{
            return res.render('mail-verfication' , {message: "User not Found"})
        }
    } catch (error) {
        console.log(error.message);
        return res.render('404');
    }
}

//send verification email API           if use verify later its account
const sendMailVerfication = async(req,res)=>{   
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const {email}  = req.body;
        const userData = await userModel.findOne({email});
        if(!userData){
            return res.status(400).json({
                success: false,
                message : "Email doesn't  Exist"    
            })
        }

        if(userData.isVerified == 1){
            return res.status(400).json({
                success: false,
                message : userData.email+"Email is already verified"    
            })
        }

        
        const msg = `
        <p>Hi ${name},</p>
        <p>Welcome to [Your Website/App Name]! We're thrilled to have you on board.</p>
        <p>To ensure the security of your account, please verify your email address by clicking the link below:</p>
        <p><a href="http://127.0.0.1:3000/mail-verification?id=${userData._id}">Verify Your Email Address</a></p>
        <p>If the above link doesn't work, you can copy and paste the following URL into your browser:</p>
        <p>http://127.0.0.1:3000/mail-verification?id=${userData._id}</p>
        <p>Please note that this link will expire in [Time Duration, e.g., 24 hours], so make sure to verify your email as soon as possible.</p>
        <p>By verifying your email, you'll unlock access to all of our features, including:</p>
        <ul>
          <li>[Feature 1]</li>
          <li>[Feature 2]</li>
          <li>[Feature 3]</li>
          <!-- Add more features as needed -->
        </ul>
        <p>If you didn't sign up for [Your Website/App Name], please disregard this email.</p>
        <p>If you have any questions or need assistance, feel free to contact us at [Your Contact Email].</p>
        <p>Best regards,<br>[Your Name]<br>[Your Position/Role]<br>[Your Website/App Name]</p>
      `;
      

        mailer.sendMailer(email , 'Mail Verification ' , msg);
        
        return res.status(200).json({
            success: true,
            msg: "Verification Link is send to your mail , please Check and verify ",
            data: userData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Reset/Forget Password
const forgetpassword = async(req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }
        const {email} = req.body;
        const userData = await userModel.findOne({email});
        if(!userData){
            return res.status(400).json({
                    success:false,
                    message: "Email doesn't Exist"
            });
        }

        const ranString = randomString.generate();
        const msg = `<p> Hi ${userData.name} , Please click <a href="http://127.0.0.1:3000/forgetpassword?token=${ranString}">here</a> to Reset Password</p>`
        await passwordResetModel.deleteMany({user_id: userData._id})
        const resetData = new   passwordResetModel({
        user_id: userData._id,
        token: ranString
       });
       await resetData.save();


       mailer.sendMailer(userData.email ,'Forget Password' , msg);

       return res.status(200).json({
        success: true,
        message: "Reset Password Link send to your mail . please  check"
       })
    } catch (error) {
        return res.status(400).json({
            succss: false,
            message: error.message
        })
    }
}


//Reset password
const resetPassword = async(req,res)=>{
    try {
        if(req.query.token == undefined){
            res.render('404');
        }
        const resetData = await passwordResetModel.findOne({token: req.query.token});
        if(!resetData){
            return res.render('404');
        }
        return res.render('resetPassword' ,{resetData})

        
    } catch (error) {
        console.log(error.message);
        return res.render('404'); 
    }
}


//updatePassword
const updatePassword = async(req ,res)=>{
    try {
        const {user_id ,  password , cpassword}  = req.body;
        const resetData = await passwordResetModel.findOne({user_id});

        if(password !== cpassword){
            return res.render('resetPassword' , {resetData , error: "Confirm password is not matched"})
        }


        const hashedPassword = await bcrypt.hash(password , 10);

         const user = await userModel.findByIdAndUpdate({_id: resetData.user_id},{
            $set:{
                password: hashedPassword
            }
        })
        await passwordResetModel.deleteMany({user_id});
        return res.redirect('/resetpassword');
    } catch (error) {
        console.log("updatepassword");
        return res.render('404')
    }
}

//success Reset password
const successTesetPassword = async(req, res)=>{
    try {
        return res.render('reset-success')
    } catch (error) {
        console.log("not success");
        return res.render('404')
    }
}

const gernateAccessToken = async(user)=>{
    const token = jwt.sign(user,process.env.ACCESS_SECRET_TOKEN , {expiresIn: "2h"});
    return token;
}

//loin user
const loginUser =async (req ,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }

       const {password , email} =  req.body;
       const userData = await userModel.findOne({email});
       if(!userData){
        return res.status(400).json({
            success: false,
            message: "Incorrect password or Email"
        });
    }

        const isMatchPassword = await bcrypt.compare(password , userData.password);
        if(!isMatchPassword){
            return res.status(400).json({
                success: false,
                message: "Incorrect Password or Email"
            });
        }
        if(userData.isVerified == 0){
            return res.status(401).json({
                success: false,
                message: "Please verify your account"
            })
        }
        const accessToken = await gernateAccessToken({user: userData});
        return res.status(200).json({
            success: true,
            message: "You logined successfully",
            user: userData,
            accessToken: accessToken,
            tokenType : "Bearer"
        })
    } catch (error) {
         return res.status(400).json({
            success: false,
            msg: error.message,
        })
    }
}

//Profile
const userProfile= async(req,res)=>{
    try {
        
        return res.status(200).json({
            success: true,
            message:"User Profile  Data",
            data: req.user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        })
    }
}

//update Profile
const updateProfile = async(req,res)=>{
    try {
        const {name ,  mobile} = req.body;

        const data = {
            name,
            mobile,
        }

        const user_id = req.user.user._id;
        if (req.file !== undefined) {
            data.image = 'image/' + req.file.filename;
            const oldUser =  await userModel.findOne({_id: user_id});
            const oldFilePath = path.join(__dirname, '../public/'+oldUser.image);
            deleteFile(oldFilePath)
        }

       const userData =  await userModel.findByIdAndUpdate({_id: user_id },{
             $set: data
        },{new:true})

        return res.status(200).json({
            success: true,
            message: "User Data updated successfully",
            data: userData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}



module.exports = {
    signupUser ,
    loginUser,
    mailVerification,
    sendMailVerfication,
    forgetpassword,
    resetPassword,
    updatePassword,
    successTesetPassword,
    userProfile,
    updateProfile
}
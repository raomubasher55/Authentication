const jwt = require('jsonwebtoken');
const blackListModel = require('../models/blackList');


const verifyToken = async(req , res ,next)=>{
    const token = req.body.token || req.query.token || req.headers['authorization'];
    if(!token){
        return res.status(403).json({
            success: false,
            message: 'A Token is required for authorization'
        })
    }

    try {
            const bearer = token.split(" ");
            const bearerToken = bearer[1];

            const blackListToken  = await blackListModel.findOne({token:bearerToken});

            if(blackListToken){
               return res.status(400).json({
                success:false,
                message:"This session is expired please try again"
            });
            }
            const decodedData = jwt.verify(bearerToken , process.env.ACCESS_SECRET_TOKEN);
            req.user = decodedData;
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid Token'
        })
    }

    return next();
}
module.exports = verifyToken;
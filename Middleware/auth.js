import JWT from 'jsonwebtoken';
import UserModel from '../Models/User.js'
const secret = "test";



const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
   
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = JWT.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = JWT.decode(token);
      const googleId = decodedData?.sub.toString();
      const user = await UserModel.findOne({ googleId });
      req.userId = user?._id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
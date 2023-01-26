import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken'
import userModel from '../Models/User.js'

const secret = "test";

//signin
export const signIn = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const oldUser = await userModel.findOne({ email });
      if (!oldUser)
        return res.status(404).json({ message: "User doesn't exist" });
  
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials" });
  
      const token = JWT.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "1h",
      });
  
      res.status(200).json({ result: oldUser, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
  };
  



//signup
export const signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await userModel.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await userModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = JWT.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};


//googlesignin

export const googleSignIn = async(req, res)=>{
  const {email, name, token , googleId} = req.body;

  try {
    const oldUser = await userModel.findOne({email});
    if(oldUser){
      const result = {_id:oldUser._id.toString(), email, name};
      return res.status(200).json({result, token})

    }
    const result = await userModel.create({
      email, name, googleId
    });
    res.status(200).json({result, token})
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error)
  }
}
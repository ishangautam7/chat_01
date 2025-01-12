const User = require("../model/userModel.js")
const Token = require("../model/tokenModel.js")
const bcrypt = require("bcryptjs");
const {generateAccessToken, generateRefreshJWT} = require("../controllers/tokenController.js")
const admin = require("firebase-admin")

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username })
        if (usernameCheck) {
            return res.json({ msg: "Username already exists", status: false })
            console.log(msg);
        }
        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.json({ msg: "Email already exists", status: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email, username, password: hashedPassword
        })
        delete user.password;
        return res.json({ status: true, user })
    }
    catch (err) {
        next(err)
    }
};


module.exports.setAvatar = async(req, res, next) =>{
    try{
        const userId = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        })
        return res.json({isSet:userData.isAvatarImageSet, image: userData.avatarImage})
    }catch(err){
        next(err);
    }
}

module.exports.getAllUsers = async(req, res, next)=>{
    try{
        const users = await User.find({_id: {$ne: req.params.id}})
        .select("email username avatarImage _id")
        .exec();
        return res.json(users)
    }catch(err){
        next(err)
    }
}

module.exports.googleLogin = async (req, res, next) => {
    const { idToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name } = decodedToken;
        let username = name.toLowerCase().replace(/\s+/g, "");
        username += Math.floor(Math.random() * 100).toString().padStart(2, "0");
        let user = await User.findOne({ firebaseUid: uid })
        
        if (!user) {
            user = new User({
                firebaseUid: uid,
                email: email,
                username: username
            })
            await user.save()
        }
        
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshJWT(user)
        
        const existingToken = await Token.findOne({ _userId: user._id })
        if (!existingToken) {
            const newToken = new Token({ _userId: user._id, refreshToken })
            await newToken.save()
        } else {
            await Token.updateOne({ _userId: user._id }, {
                $push: { refreshToken }
            })
        }
        
        return res.status(200).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
        }).json({
            status: true,
            accessToken,
            user,
        });
    } catch (err) {
        console.log(err)
        return res.status(501).json({ message: 'Server Error' })
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ msg: "No user found", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect Password", status: false });
        }
        delete user.password;
        return res.json({ status: true, user });
    } catch (err) {
        next(err);
    }
};
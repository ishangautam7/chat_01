const jwt = require("jsonwebtoken")

module.exports.generateAccessToken = (user) => {
    try{
        const {_id} = user
        const payload = {_id}
        const claims = {"expiresIn": "2hr"}
        const token = jwt.sign(payload, "29875vn9vq6n846v109nvwnuo6", claims)
        if(!token) throw Error
        return token
    }catch(err){
        throw Error(err)
    }
}

module.exports.generateRefreshJWT = (user) =>{
    try{
        const {_id} = user
        const payload = {_id}
        const claims = {"expiresIn":"2hr"}
        const token = jwt.sign(payload, "ioahdiadiowa907e0124i1243", claims)
        if(!token) throw Error
        return token
    }catch(err){
        throw Error(err)
    }

}
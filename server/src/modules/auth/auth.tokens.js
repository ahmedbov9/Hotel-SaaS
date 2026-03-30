

const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");


/**
 * @description Sign a new access token for a user
 * @param user
 * @returns JWT access token
 */
function signAccessToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role : user.role ,
            email : user.email
        },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn : env.JWT_ACCESS_EXPIRES
        }
    )
}
module.exports = {signAccessToken}
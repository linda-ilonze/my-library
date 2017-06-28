import jwt from 'express-jwt';

const getTokenFromHeader = req => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token'){
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}
const secret = 'SECRET';

export default({
    required: jwt({
        secret,
        userProperty:'payload',
        getToken:getTokenFromHeader
    }),
    optional: jwt({
        secret,
        userProperty:'payload',
        credentialsRequired:false,
        getToken:getTokenFromHeader
    })
});
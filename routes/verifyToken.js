'use strict'
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.PASS_SEC, (err, user) => {
            if (err) res.status(401).json("Token is not valid!");
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json("not authenticated")
    }
};

const authorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(401).json("not allowed do that")
        }
    })
}

const authorizationAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(401).json("not allowed do that")
        }
    })
}
module.exports = { verifyToken, authorization, authorizationAdmin };
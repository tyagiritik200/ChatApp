const jwt=require('jsonwebtoken');
const config=require('../Config/key');
var SECRET=config.SECRET;
function Authentication(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        res.status(400).json({ err: 'Unauthorized Access: Token Not Present' })
    else {
        try {
            const decoded = jwt.verify(token,SECRET)
            req.user=decoded;
            next();
        }
        catch (e) {
            res.status(400).json({ err: 'Unauthorized Access: Wrong Token' })
        }
    }

}

module.exports = Authentication;
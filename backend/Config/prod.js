module.exports = {
    MONGO_URI:process.env.MONGO_URI,
    SECRET:process.env.SECRET,
    IS_PROD: process.env.NODE_ENV === 'production', 
}
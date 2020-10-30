module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log('This user', req.user.firstName);
        return next();
    }
    res.redirect('/user/signin');
};  
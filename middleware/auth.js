const isLogin = (req, res, next) => {
    if(req.session.user === null || req.session.user === undefined) {
        req.flash('message', 'Please Login First');
        req.flash('status', 'danger')
        res.redirect('/')
    } else {
        next()
    }
}

module.exports = isLogin;
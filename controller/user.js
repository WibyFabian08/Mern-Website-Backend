const User = require('../model/User');
const bcrypt = require('bcryptjs');

exports.loginView = (req, res) => {
    res.render('index', {
        title: 'Login Page',
        message: req.flash("message"),
        status: req.flash("status"),
    });
}

exports.registerView = (req, res) => {
    res.render('register', {
        title: 'Register Page',
        message: req.flash("message"),
        status: req.flash("status"),
    });
}

exports.signIn = async (req, res) => {
    const user = await User.findOne({userName: req.body.username});
    
    if(user === null) {
        req.flash('message', 'Login Failed, Account Not Found');
        req.flash('status', 'danger');
        res.redirect('/')
    } 
    
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword) {
        req.flash('message', 'Login Failed, Wrong Password');
        req.flash('status', 'danger');
        res.redirect('/')
    } else {
        res.redirect('/admin');
    }

}

exports.signUp = async (req, res) => {
    const user = await User.findOne({userName: req.body.username});

    if(user) {
        req.flash('message', 'Register Failed, Username Already Taken');
        req.flash('status', 'danger');
        res.redirect('/register')
    } else {
        const password = await bcrypt.hash(req.body.password, 10);
    
        await User.create({
            userName: req.body.username,
            password: password
        })
    
        req.flash('message', 'Register Success Please Login');
        req.flash('status', 'success');
    
        res.redirect('/');
    }
}
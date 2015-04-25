// Renders home
exports.index = function(req, res){
	console.log("Index");
    res.render('home', { user: req.user });
};

// Renders signin
exports.signin =  function(req, res) {
    res.render('signin', { error: req.flash('error') });
};

// Local sign-in strategy
exports.login = function(passport){
	return passport.authenticate('login', { 
        successRedirect: '/',
        failureRedirect: '/signin'
    })
};

// sends the request through our local signup strategy, and if successful takes 
// user to homepage, otherwise returns then to signin page
exports.register = function(passport){
	return passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signin'
	})
}; 

// Logout
exports.logout = function(req, res) {
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username)
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
};
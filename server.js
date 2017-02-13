var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

// set the default views folder
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// register the bodyParser middleware for processing forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// register the cookie parser
// this will populate cookie information into req.cookies
app.use(cookieParser());

app.get('/',function(req,res){

	// Check if an e-mail address is set in the cookie.
	// If it is, we will redirect to the admin page.
	if(req.cookies.login && req.cookies.login.email) {
	    res.redirect('/admin');
	}
	else {
	    res.render('index.html');
	}
});


app.post('/login',function(req,res){

	// Very basic. Set the cookie e-mail and password to whatever the user has added.
	var loginInfo = {
		email: req.body.email,
		password: req.body.pass
	};

	// set the cookie with the above login info
	res.cookie('login' , loginInfo);
	res.end('done');
});

app.get('/admin',function(req,res){

	// check if the cookie is set
	if(req.cookies.login && req.cookies.login.email) {
		res.write('<h1>Hello '+req.cookies.login.email+'</h1>');
		res.write('<a href="/logout">Logout</a>');
		res.end();
	} else {
		res.write('<h1>Please login first.</h1>');
		res.write('<a href="/">Login</a>');
		res.end();
	}
});

app.get('/logout',function(req,res){
	
	// if the user logs out, destroy their cookie
	res.clearCookie('login');
	res.redirect('/');

});

app.listen(8000,function(){
	console.log("App Started on port 8000");
});
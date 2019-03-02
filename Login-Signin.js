//A Login-signin option.
//It let the user sign in and login while checking ID's from the database MYSQL
//It lets you create your own ID and Password and then Sign In with it.


var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');;

var countAd=0;
var count = 0;

var connection = mysql.createConnection({																		//connect to the MySQL database;
  host: "localhost",
  user: "newuser",
  password: "*********",
  database: "users"
});

connection.connect(function(err) {																				//connect to MySQL database
			if (err) throw err;
			console.log('Connected to database!!')
});

app.use(bodyParser());

app.get('/',function(request,response){														 					// to go to the home page via GET
	response.sendFile('home.html',{root : __dirname});
	console.log("Requested homepage via GET");
});



app.get('/login' , function(request , response){
	response.sendFile('login.html',{root : __dirname});
	console.log("Requested login page via GET");
});

app.get('/SignIn' , function(request , response){
	response.sendFile('SignIn.html',{root : __dirname});
	console.log("Requested sign in page via GET");
});



app.post('/loginCheck' , function(request,response){
	console.log("Login request");
	console.log(request.body.username);
	console.log(request.body.password);
	var resLogin = function (request){
						var qs = "SELECT COUNT(*) as Records_found FROM user WHERE username=\"" + request.body.username + "\" and password = \"" + request.body.password + "\"";
						var res = connection.query(qs, function (err, result) {
																				if (err)
																				{throw err;}
																				console.log(result);
																				countAd = result[0]['Records_found'];				
																				console.log('count: ' + countAd);	
																				if (countAd=="1"){response.writeHead(200 , {"Content-type":"text/html"});response.write('<h1>logged in</h1><br>');}
																				else{response.writeHead(200 , {"Content-type":"text/html"});response.write('<h1>log in failed</h1><br>');}
																				response.end();
																				});		
						};
	resLogin(request);
	
	
	
});



app.post('/signinCheck' , function(request,response){
	console.log("New signin request");
	console.log(request.body.username);
	console.log(request.body.password);
	console.log(request.body.name);
	console.log(request.body.Contact);
	
	var resLogin = function (request){
						var qs = "SELECT COUNT(*) as Records_found FROM user WHERE username=\"" + request.body.username + "\"";
						var res = connection.query(qs, function (err, result) {
																				if (err)
																				{throw err;}
																				console.log(result);
																				count = result[0]['Records_found'];				
																				console.log('count: ' + count);	
																				if (count=="1"){response.writeHead(200 , {"Content-type":"text/html"});response.end('<h1>Username already in use</h1><br>');}
																				else{ qs = "insert into user values('" + request.body.name + "','" +  request.body.username + "','" + request.body.password + "'," + request.body.Contact + ")";			
																					  res = connection.query(qs, function (err, result) {
																																			if (err)
																																				{throw err;}
																																			console.log('Addad a new user');
																																			response.end('Added your details. Now you can go back and login with this new username and password');																				
																																		});
																					}
																				});

								};													   
	resLogin(request);
	});



app.listen(1337 , function(){																										//to listen to any particular port
	console.log('Listening at port 1337');
});









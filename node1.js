//To create PDF Dynamically and serve them to the user in online PDF form available for download.
//Creates a HTML page that takes in the name and amount to be donated and prints a receipt, that the user has paid an amount. Also, adds the name and amount donated in the database.  


var express = require('express');
var app = express();
var fs=require('fs');
var bodyParser = require('body-parser');
var pdf = require ('pdfkit');																	//to create PDF using NODE JS
var fs = require('fs');																			// to create write streams
var myDoc = new pdf;																			//creating a new pdf document
var mysql = require('mysql');																	//need mySQL to import from the database



var con = mysql.createConnection({																//connect to the database
  host: "localhost",
  user: "newuser",
  password: "***",
  database: "Donors"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});




app.use(bodyParser());								
app.use( express.static(__dirname) );	

					

app.get('/', function (req, res){																//to get the first get request
	res.sendFile('./index.html',{root : __dirname});
	console.log('sent file');
});



var count=0, end=0;





app.post('/download', function (req, res){														// when index.html gets its post request to submit a form and print a receipt
	req.body.username=req.body.username.replace(/(\r\n|\n|\r)/gm,"\n");
	console.log(req.body.username);
	console.log(req.body.amount);
	
	con.query('select count(*) as Records_found from donor' , function (err, result) {
		if (err) throw err;
		count=result[0]['Records_found'];
	});
	
	con.query('select * from donor', function (err, result, fields) {
        if (err)
			throw err;
		else
			console.log(result);
			myDoc.pipe(fs.createWriteStream( req.body.username + '.pdf'));									//creates pdf with the name of the user
			var print=0;
			myDoc.font('Times-Roman');	
			myDoc.fontSize(30);
			myDoc.text('Dear ' + req.body.username + ',' , 50 , 50 );
			myDoc.fontSize(20);
			myDoc.text(' ');
			myDoc.text('You have paid an amount of INR ' + req.body.amount + '/- to our organisation.' );
			myDoc.fontSize(15);
			myDoc.fillColor('red');
			myDoc.text('This money will be used by us to provide free eduction to the poor children.');
			myDoc.text(' ');
			myDoc.fillColor('green');
			myDoc.text('Your contribution will be remembered and recognised, as of the following other donors:');
			var k=1;
			for(var row in result){
							myDoc.fontSize(12);
							myDoc.text( k+ '. ' +result[row]['name'] + ' donated INR ' + result[row]['amount'] + '/-' ,50 , 231 + ((row)*14.3));		
							count--;
							k++;
							if(count==0)
							{	myDoc.text(' ');
								myDoc.text(' ');
								myDoc.fillColor('black');
								myDoc.text('We Thank and appreciate you for your kindness.');
								myDoc.text('Sd/-');
								myDoc.image('abc.png', 400, 5 );
								myDoc.end();
								print=1;
								setTimeout(function(){	var data =fs.readFileSync('./'+ req.body.username + '.pdf', {root: __dirname});
											res.contentType("application/pdf");
											res.send(data);
											end=1;
											
										},3000);
								setTimeout(	function(){res.end();}, 7000);
							}
						
						}
			//myDoc.end();
	});

	con.query('insert into donor value(\"' + req.body.username + '\",' + req.body.amount + ')' , function (err, result) {
		if (err) throw err;
		console.log('New Record inserted in the table');
	});
	
	
    
});





app.listen(9080 , function(){																										//to listen to any particular port
	console.log('Listening at port 9080');
});















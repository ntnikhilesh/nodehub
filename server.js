var express=require('express');
var app=express();
var port=process.env.PORT || 8080;
var morgan=require('morgan'); //middle ware1

var cookieParser=require('cookie-parser');  //middle ware2
var session=require('express-session');  //middle ware3

var mongoose=require('mongoose');

var configDB=require('./config/database.js');
mongoose.connect(configDB.url);

app.use(morgan('dev')); //inveronment = dev
app.use(cookieParser());
app.use(session({secret:'anustringoftext',
                saveUninitialized:true,
                resave:true}))


require('./app/routes.js')(app)
//
// app.use('/',function (req,res) {
//     res.send('Our first express programme...')
//     console.log(req.cookies);
//     console.log("=======+++++================");
//     console.log(req.session);
//
//
// })

app.listen(port)



//  http=require('http');
// http.createServer(function (req,res) {
//     res.writeHead(200,{'Content-Type':'text/plain'});
//     res.end("hello India....\n");
// }).listen(1337,'127.0.0.1');
console.log("Server running at http://127.0.0.1:8080");
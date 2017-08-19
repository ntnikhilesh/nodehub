var express=require('express');
var app=express();
var port=process.env.PORT || 8080;
var morgan=require('morgan'); //middle ware1

var cookieParser=require('cookie-parser');  //middle ware2
var session=require('express-session');  //middle ware3

var mongoose=require('mongoose');

var configDB=require('./config/database.js');
mongoose.connect(configDB.url);

//body parser
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

var passport=require('passport');
var flash=require('connect-flash');
require('./config/passport')(passport);


app.set('view engine','ejs')//we can use jade engine as well

app.use(morgan('dev')); //inveronment = dev
app.use(cookieParser());
app.use(session({secret:'anustringoftext',
                saveUninitialized:true,
                resave:true}))

//use passport after above session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app,passport)
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
var express=require('express');
var app=express();
var port=process.env.PORT || 8080;
var morgan=require('morgan'); //middle ware

app.use(morgan('dev')); //inveronment = dev

app.use('/',function (req,res) {
    res.send('Our first express programme...')

})

app.listen(port)



//  http=require('http');
// http.createServer(function (req,res) {
//     res.writeHead(200,{'Content-Type':'text/plain'});
//     res.end("hello India....\n");
// }).listen(1337,'127.0.0.1');
console.log("Server running at http://127.0.0.1:8080");
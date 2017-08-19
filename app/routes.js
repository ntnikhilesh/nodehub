var User=require('./models/user.js');
module.exports=function (app) {
    app.get('/',function (req,res) {
        res.render('index.ejs')

    });

    app.get('/signup',function (req,res) {
        res.render('signup.ejs',{message:'CC'})
    })

    app.post('/signup',function (req,res ) {
        var newUser=new User();
        newUser.local.username=req.body.email
        newUser.local.password= req.body.password;
        //console.log(newUser.local.username+"   "+newUser.local.password);
        newUser.save(function (err) {
            if(err)
                throw err;

        })
        res.redirect('/');
    })

    app.get('/:username/:password',function (req,res) {
        var newUser=new User();
        newUser.local.username=req.params.username
        newUser.local.password= req.params.password;
        console.log(newUser.local.username+"   "+newUser.local.password);
        newUser.save(function (err) {
            if(err)
                throw err;

        })
        res.send("Success!");

    })
}
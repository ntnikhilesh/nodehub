var User=require('./models/user.js');
module.exports=function (app,passport) {
    app.get('/',function (req,res) {
        res.render('index.ejs')

    });

    app.get('/login',function (req,res) {
        res.render('login.ejs',{message:req.flash('loginMessage')});
    })

    app.post('/login',passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect: '/login',
        failureFlash:true
    }))

    app.get('/profile',isLoggedIn,function (req,res) {
        res.render('profile.ejs',{user:req.user});
    })
    app.get('/signup',function (req,res) {
        res.render('signup.ejs',{message:req.flash('signupMessage')})
    })


    app.post('/signup',passport.authenticate('local-signup',{
        successRedirect:'/',
        failureRedirect: '/signup',
        failureFlash:true
    }))

    // app.post('/signup',function (req,res ) {
    //     var newUser=new User();
    //     newUser.local.username=req.body.email
    //     newUser.local.password= req.body.password;
    //     //console.log(newUser.local.username+"   "+newUser.local.password);
    //     newUser.save(function (err) {
    //         if(err)
    //             throw err;
    //
    //     })
    //     res.redirect('/');
    // })

    // app.get('/:username/:password',function (req,res) {
    //     var newUser=new User();
    //     newUser.local.username=req.params.username
    //     newUser.local.password= req.params.password;
    //     console.log(newUser.local.username+"   "+newUser.local.password);
    //     newUser.save(function (err) {
    //         if(err)
    //             throw err;
    //
    //     })
    //     res.send("Success!");
    //
    // })
    //


    //fb login
    // Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
    app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
            failureRedirect: '/' }));


    app.get('/auth/google', passport.authenticate('google',{scope:['profile','email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/profile',
            failureRedirect: '/' }));


    app.get('/connect/facebook',passport.authorize('facebook',{scope:'email'}));
    app.get('/connect/google',passport.authorize('google',{scope:['profile','email']}));
    app.get('/connect/local',function (req,res) {
        res.render('connect-local.ejs',{message:req.flash('signupMessgae')});
    })

    app.post('/connect/local',passport.authenticate('local-signup',{
        successRedirect:'/profile',
        failureRedirect:'/connect/local',
        failureFlash:true
    }))
    app.get('/logout',function (req,res) {
        req.logOut();
        res.redirect('/');
    })

    app.get('/unlink/local',function (req,res) {
        var user =req.user;
        user.local.username=null;
        user.local.password=null;
        user.save(function (err) {
            if(err)
                throw err;
            res.redirect('/profile')
        });
    });

    app.get('/unlink/facebook',function (req,res) {
    var user =req.user;
    user.facebook.token=null;
    user.save(function (err) {
        if(err)
            throw err;
        res.redirect('/profile')
    })
    });

    app.get('/unlink/google',function (req,res) {
        var user =req.user;
        user.google.token=null;
        user.save(function (err) {
            if(err)
                throw err;
            res.redirect('/profile')
        })
    });
}
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}
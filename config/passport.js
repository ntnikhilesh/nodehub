var localStrategy=require('passport-local').Strategy;

var facebookStrategy=require('passport-facebook').Strategy;

var User=require('../app/models/user')

var configAuth=require('./auth')

module.exports=function (passport) {
    //it helps to redirect logedin user to home page

    passport.serializeUser(function (user,done) {
        done(null,user.id);
    })

    passport.deserializeUser(function (id,done) {
        User.findById(id,function (err,user) {
            done(err,user)
        })
    })

    passport.use('local-signup',new localStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback: true
    },
        function (req,email,password,done) {
            process.nextTick(function () {
                User.findOne({'local.username':email},function (err,user) {
                    if(err)
                        return done(err)
                    if(user) {
                        return done(null, false, req.flash('signupMessage', 'Email alerady exist'))
                    }else {
                        var newUser=new User();
                        newUser.local.username=email;
                        newUser.local.password=newUser.generateHash(password);
                        newUser.save(function (err) {
                            if(err)
                                throw err;
                            return done(null,newUser)
                        })
                    }
                })
            })
        }))

    
    passport.use('local-login',new localStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback: true
    },
        function (req,email,password,done) {
            process.nextTick(function () {
                User.findOne({'local.username':email},function (err,user) {
                    if(err)
                        return done(err)
                    if(!user)
                        return done(null,false,req.flash('loginMessage','No user found'))
                    if(user.validPassword(password))
                        return done(null,false,req.flash('loginMesssage','Invalid user'))
                    return done(null,user)
                })
            })
        }))



    passport.use(new facebookStrategy({
            clientID: configAuth.facebookAuth.clientId,
            clientSecret: configAuth.facebookAuth.clentSecret,
            callbackURL: configAuth.facebookAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
           process.nextTick(function () {
               User.findOne({'facebook.id':profile.id},function (err,user) {
                   if(err)
                       return done(err);
                   if(user)
                       return done(null,user);
                   else
                       var newUser=new User();
                   newUser.facebook.id=profile.id;
                   newUser.facebook.token=accessToken;
                   console.log(profile)
                   newUser.facebook.name=profile.displayName;
                   //newUser.facebook.email=profile.emails[0].value;

                   newUser.save(function (err) {
                       if(err)
                           throw err
                       return done(null,newUser);
                   })
               })
           })
        }
    ));
}
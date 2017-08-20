var localStrategy=require('passport-local').Strategy;

var facebookStrategy=require('passport-facebook').Strategy;

var googleStrategy=require('passport-google-oauth').OAuth2Strategy;
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
                    }
                    if(!req.user){
                        var newUser=new User();
                        newUser.local.username=email;
                        newUser.local.password=newUser.generateHash(password);
                        newUser.save(function (err) {
                            if(err)
                                throw err;
                            return done(null,newUser)
                        })
                    }else {
                        var user=req.user;
                        user.local.username=email;
                        user.local.password=user.generateHash(password);
                        user.save(function (err) {
                            if(err)
                                throw err;
                            return done(null,user)
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


    //Fb strategy

    passport.use(new facebookStrategy({
            clientID: configAuth.facebookAuth.clientId,
            clientSecret: configAuth.facebookAuth.clentSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            passReqToCallback:true
        },
        //this will execute after successful login from FB
        function(req,accessToken, refreshToken, profile, done) {
        console.log('req=====',req)

           process.nextTick(function () {
               //user is not logged in yet with any account(local or google)
                if(!req.user)
                {
                    User.findOne({'facebook.id':profile.id},function (err,user) {
                        if(err)
                            return done(err);
                        if(user)
                        {
                            if(!user.facebook.token)
                            {
                                user.facebook.token=accessToken;
                                user.facebook.name=profile.displayName;
                                user.save(function (err) {
                                    if(err)
                                        throw err
                                })
                            }
                            return done(null,user);
                        }
                        else {
                            var newUser = new User();
                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = accessToken;
                            console.log(profile)
                            newUser.facebook.name = profile.displayName;
                            //newUser.facebook.email=profile.emails[0].value;

                            newUser.save(function (err) {
                                if (err)
                                    throw err
                                return done(null, newUser);
                            })
                        }
                    })
                }

               //user is logged in already, and needs to be merged
               else {
                    var user=req.user;
                    user.facebook.id=profile.id;
                    user.facebook.token=accessToken;
                    user.facebook.name=profile.displayName;

                    user.save(function (err) {
                        if(err)
                            throw err
                        return done(null,user)
                    })
                }

           })
        }
    ));


    //Google strategy

    passport.use(new googleStrategy({
            clientID: configAuth.googleAuth.clientId,
            clientSecret: configAuth.googleAuth.clentSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            passReqToCallback:true
        },
        function(req,accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if(!req.user){
                    User.findOne({'google.id':profile.id},function (err,user) {
                        if(err)
                            return done(err);
                        if(user) {
                            if (!user.google.token) {
                                user.google.token = accessToken;
                                user.google.name = profile.displayName;
                                user.save(function (err) {
                                    if (err)
                                        throw err
                                })
                            }
                            return done(null, user);
                        }
                        else {
                            var newUser = new User();
                            newUser.google.id = profile.id;
                            newUser.google.token = accessToken;
                            console.log(profile)
                            newUser.google.name = profile.displayName;
                            //newUser.facebook.email=profile.emails[0].value;

                            newUser.save(function (err) {
                                if (err)
                                    throw err
                                return done(null, newUser);
                            })
                        }
                    })
                }else {
                    var user=req.user;
                    user.google.id=profile.id;
                    user.google.token=accessToken;
                    console.log(profile)
                    user.google.name=profile.displayName;
                    //newUser.facebook.email=profile.emails[0].value;

                    user.save(function (err) {
                        if(err)
                            throw err;
                        return done(null,user)
                    })
                }

            })
        }
    ));
}

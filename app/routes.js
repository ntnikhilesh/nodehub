var User=require('./models/user.js');
module.exports=function (app) {
    app.get('/',function (req,res) {
        res.send('hello nt')

    });

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
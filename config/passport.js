import passport from 'passport';
import localStrategy from 'passport-local';
import mongoose from 'mongoose';

const User = mongoose.model('User');


passport.use(new localStrategy({
    usernameField:'user[username]',
    passwordField: 'user[password]'
},
    function(username, password,done){
        User.findOne({username:username})
        .then(function(user){
            if(!user || !user.validPassword(password)){
                return done(null,false,{errors:{'username or password': 'is invalid'}})
            }
            return done(null,user);
        }).catch(done);
    }
))
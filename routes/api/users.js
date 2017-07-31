
import mongoose from 'mongoose';
import express from 'express';
import passport from 'passport';
import auth from '../../auth';
import user from '../../models/User';
import book from '../../models/Book';

const User = mongoose.model('User');
const Book = mongoose.model('Book');
const router = express.Router();

router.post('/',function(req,res,next){
    var user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(function(){
        return res.json({user:user.toAuthJSON()});
    }).catch(next);
});

router.get('/', auth.required, function(req, res, next){
    User.findById(req.payload.id).then(function(user){
        if(!user){return res.sendStatus(401); }

        return res.json({user:user.toProfileJSONFor()});
    }).catch(next); 
});


router.post('/login', function(req, res, next){
    if(!req.body.user.username){
        return res.status(422).json({errors: {username:"can't be blank"}});
    }

    if(!req.body.user.password){
        return res.status(422).json({errors:{password:"cant be blank"}});
    }

    passport.authenticate('local', {session: false}, function(err,user, info){
        if(err){return next(err);}

        if(user){
            user.token = user.generateJWT();
            return res.json({user:user.toAuthJSON()});
        } else{
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.post('/addBook', auth.required, function(req,res,next){
    console.log('calling add book.....');
    User.findById(req.payload.id).then(function(user){
        if(!user){return res.sendStatus(401); }
        
        if(req.body.book !== null)
        {
           // const tempBook = new Book(req.body.book);

            return Book.findOne({title: {"$eq": req.body.book.title}}, function(err,book){
                if(book !== null){
                    console.log(book);
                    return user.addBook(book._id)
                            .then(function(){
                                console.log('adding book done');
                            return res.json({user:user.toProfileJSONFor()});
                            });
                }
            })
        }
    })
});


export default router;

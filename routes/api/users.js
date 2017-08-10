
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
     
    User
    .findById(req.payload.id)
    .populate('books')
    .exec(function(err,user){
        if(err){return res.sendStatus(401); }
        console.log(req.payload.id);
        
        return res.json({user:user.toProfileJSONFor()});
    })
    .catch(next); 
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

router.delete('/deleteBook', auth.required, function(req,res,next){
    console.log("calling delete book");

    User.findById(req.payload.id)
    .exec(function(err, returnedUser){
        if(!returnedUser){return res.sendStatus(401)}
        console.log(returnedUser);
        
        if(req.body.bookId !== null){
            console.log("removing book");

            returnedUser.removeBook(req.body.bookId)
            .then(function(response){
                console.log(response);
                return res.json({message:"Book Deleted"});
            })
        }
    })
})

router.post('/addBook', auth.required, function(req,res,next){
    console.log('calling add book.....');

    console.log(req.payload.id);

    User.findById( req.payload.id)  
    .exec(function(err, returnedUser){
        console.log(returnedUser);
        if(!returnedUser){return res.sendStatus(401); }
        
        if(req.body.book !== null)
        {
            console.log("calling find book");
            Book.findOne({title: {"$eq": req.body.book.title}})
             .exec(function(err,searchedBook){

                if(searchedBook === null){
                    console.log("book does not exist, creating it");
                    
                    const book = new Book(req.body.book);
                    return book.save()
                    .then(function(savedBook){
                        //then save it for the user
                        console.log("book saved, now calling add");
                        return returnedUser.addBook(savedBook._id)
                            .then(function(addedBook){
                                console.log('adding book done');
                                return res.json({user:addedBook.toProfileJSONFor()});
                            });
                    });  
                }
                else {
                    console.log("book already exists " + searchedBook);
                    return returnedUser.addBook(searchedBook._id)
                                .then(function(addedBook){
                                    console.log('adding book done');
                                    return res.json({user:addedBook.toProfileJSONFor()});
                                });

                }


            })
        }
    }); 
});

router.get('/getBooks', auth.required, function(req,res,next){
    const ids = req.query.ids.split(',');
    console.log(ids);
    const mongooseIds = ids.map((id) => {
        return mongoose.Types.ObjectId(id);
    });
    Book.find({
        '_id': { $in:mongooseIds}
    }).then(function(books){
        return res.json({
            books: books.map(function(book){
                return book.toJSONFor()
            })
        });
    })
});

export default router;

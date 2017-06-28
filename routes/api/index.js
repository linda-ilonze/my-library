import express from 'express';
import books from './books';
import users from './users';


const router = express.Router();

router.use('/users',users);
router.use('/books', books);


//Default validation error
router.use(function(err,req,res,next){
    if(err.name === 'ValidationError'){
        return res.status(422).json({
            errors:Object.keys(err.errors).reduce(function(errors,key){
                errors[key] = err.errors[key].message;
                return errors;
            },{})
        });
    }
    return next(err);
});

export default router;
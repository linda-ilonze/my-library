import express from 'express';
import mongoose from 'mongoose';
import Book from '../../models/Book';

const router = express.Router();

router.post('/',function(req, res,next){
        const book = new Book(req.body.book);
        return book.save().then(function(){
            return res.json({book:book.toJSONFor()});
        }); 
    });

router.get('/books', function(req,res,next){
    Book.find()
    .then(function(books){
        console.log(books);
            return res.json({
                books: books.map(function(book){
                    return book.toJSONFor()
                })
            });
    })
    .catch(next);
} );


export default router;
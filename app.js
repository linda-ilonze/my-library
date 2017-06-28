import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import routes from './routes/index';
import cors from 'cors';


import books from './models/Book';
import users from './models/User';
import passportConfig from './config/passport';

const app = express();

app.use(cors());

//set up to parse body 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//set up mongoose
mongoose.connect('mongodb://admin:admin@ds141232.mlab.com:41232/my-library');
mongoose.set('debug',true);

//set up routes
app.use(routes);


//handle 404s 
app.use(function(req,res,next){
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

//start up server
var server = app.listen(2000, function(){
    console.log('Listening on port ' + server.address().port);
});
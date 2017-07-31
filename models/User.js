import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const secret = 'SECRET';

let UserSchema = new mongoose.Schema({
    username :   {type : String, lowercase : true, unique:true, required : [true,"can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index:true},
    email :      {type : String, lowercase : true, unique:true,  required : [true, "cant be null"],  match: [/\S+@\S+\.\S+/, 'is invalid'], index:true},
    books : [{type:mongoose.Schema.Types.ObjectId, ref: 'Book'}],
    bio:String,
    hash:String,
    salt:String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message:'is already taken.'});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password,this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password,this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
}


UserSchema.methods.generateJWT = function(){
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate()+ 60);

    return jwt.sign({
        id:this._id,
        username: this.username,
        exp:parseInt(exp.getTime() / 1000),
    }, secret);
};


UserSchema.methods.toAuthJSON = function(){
return {
    username:this.username,
    email: this.email,
    token:this.generateJWT()
};
};

UserSchema.methods.toProfileJSONFor = function(user){
return {
    user: this.username,
    bio:this.bio,
    books:this.books,
    email:this.email

};
};
export default mongoose.model('User', UserSchema);

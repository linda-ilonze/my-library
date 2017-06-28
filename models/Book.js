import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

var slug = require('slug');


let BookSchema = new mongoose.Schema({
    slug:{type:String,lowercase:true, unique:true},
    title:String,
    description:String,
    author:[],
    application:String,
    smallThumbnail:String,
    thumbnail: String,
    googleLink:String,
    publishedDate:Date,
    publisher:String,
    isbn :String,
    category : String,
    language:String,
    averageRating:{type:Number, min:0,max:10},
    ratingsCount:Number
},{timestamps:true});

BookSchema.plugin(uniqueValidator, {message: 'is already taken'});

 
BookSchema.methods.slugify = function(){
    this.slug = slug(this.title) + '-' + (Math.pow(36,6) | 0).toString(36);
};

BookSchema.pre('validate', function(next){
    this.slugify();

    next();
});

BookSchema.methods.toJSONFor = function(user){
    return{
        slug:this.slug,
        title:this.title,
        description:this.description,
        createdAt:this.createdAt,
        updatedAt:this.updatedAt,
        author:this.author,
        application:this.application,
        smallThumbnail:this.smallThumbnail,
        thumbnail: this.thumbnail,
        googleLink:this.googleLink,
        publishedDate:this.publishedDate,
        publisher:this.publisher,
        isbn :this.isbn,
        category : this.category,
        language:this.language,
        averageRating:this.averageRating,
        ratingsCount:this.ratingsCount
    }
};

export default mongoose.model('Book',BookSchema);


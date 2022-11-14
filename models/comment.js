const {Schema, model} = require('mongoose');
const Populate = require('../util/autopopulate');

const commentSchema = new Schema({
    content:{type:String, required:true},
    author:{ type: Schema.Types.ObjectId, ref: 'User', required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    },{timestamps: true});

// Populate the author field
commentSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))
    .pre('findOne', Populate('comments'))
    .pre('find', Populate('comments'));
    

module.exports = model('Comment', commentSchema);
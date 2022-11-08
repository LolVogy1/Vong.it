const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    content:{type:String, required:true},
    author:{ type: Schema.Types.ObjectId, ref: 'User', required: true},
    },{timestamps: true});

module.exports = model('Comment', commentSchema);
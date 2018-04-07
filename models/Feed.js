const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FeedSchema = new Schema({
    story: { type: String, required: true },
    message: { type: String },
    created_time: { type: Date, required: true },
    id_association: { type: String, required: true },
});

module.exports = mongoose.model('Feed', FeedSchema);
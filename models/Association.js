const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AssociationSchema = new Schema({
    name_fb: { type: String, required: true },
    image_url: { type: String, required: true },
});

module.exports = mongoose.model('Association', AssociationSchema);
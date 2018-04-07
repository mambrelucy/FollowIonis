const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: { type: String, required: true },
    image_url: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    id_association: { type: String, required: true },
});

module.exports = mongoose.model('Event', EventSchema);
const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    city:{
        type:String,
        required: true,
    },
    temperature:{
        type: Number,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true,
    },

    date:{
        type:Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('weather', WeatherSchema);
//user, city, fav
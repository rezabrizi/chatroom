const mongoose = require('mongoose'); 


const sessionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires: '1h'}
});


const Session = mongoose.model('Session', sessionSchema); 
export default Session; 
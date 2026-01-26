const mongoose = require('mongoose');
const { Schema } = mongoose;

const MONGODB_URL = 'mongodb://127.0.0.1:27017/teru_db';

const moodSchema = new Schema({
    utilisateur: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});
const Mood = mongoose.model('Mood', moodSchema);

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    mot_de_passe: { type: String, required: true },
    nom: { type: String, required: true },
    date_creation: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

mongoose.connect(MONGODB_URL)
    .then(async () => {
        console.log('Connected to DB. Fetching moods...');
        const moods = await Mood.find().sort({ date: -1 }).limit(5).populate('utilisateur', 'nom email');
        console.log('--- LATEST 5 MOODS ---');
        moods.forEach(m => {
            console.log(`[${m.date.toISOString()}] User: ${m.utilisateur?.nom || 'Unknown'} (x: ${m.x}, y: ${m.y})`);
        });
        console.log('----------------------');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

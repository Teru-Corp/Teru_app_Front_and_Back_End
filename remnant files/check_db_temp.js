const mongoose = require('C:/Users/theor/OneDrive - De Vinci/cours/A4/Teru/mon-premier-backend/node_modules/mongoose');
const { Schema } = mongoose;

const MONGODB_URL = 'mongodb://127.0.0.1:27017/teru_db';

// Updated Schema
const moodSchema = new Schema({
    utilisateur: { type: Schema.Types.ObjectId, ref: 'User' },
    emotion: { type: String },
    energy: { type: Number },
    connection: { type: Number },
    stress: { type: String },
    x: { type: Number },
    y: { type: Number },
    date: { type: Date, default: Date.now }
});
const Mood = mongoose.model('Mood', moodSchema);

const userSchema = new Schema({
    nom: String,
    email: String
});
const User = mongoose.model('User', userSchema);

mongoose.connect(MONGODB_URL)
    .then(async () => {
        console.log('Connected to DB. Fetching 5 latest moods...');
        const moods = await Mood.find().sort({ date: -1 }).limit(5).populate('utilisateur', 'nom');

        console.log('\n--- DATA IN DATABASE ---');
        moods.forEach(m => {
            console.log(`\n📅 Date: ${m.date.toLocaleString()}`);
            console.log(`👤 User: ${m.utilisateur?.nom || 'Unknown'}`);

            if (m.emotion) {
                console.log(`🌟 Emotion: ${m.emotion}`);
                console.log(`⚡ Energy: ${m.energy}`);
                console.log(`🔗 Connection: ${m.connection}`);
                console.log(`😰 Stress: ${m.stress}`);
            } else {
                console.log(`(Old Data): x=${m.x}, y=${m.y}`);
            }
        });
        console.log('\n------------------------');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

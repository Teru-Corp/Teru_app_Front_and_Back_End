const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/teru_db';

const { Schema } = mongoose;

const moodSchema = new Schema({
    utilisateur: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    email: { type: String, required: true, unique: true },
    mot_de_passe: { type: String, required: true },
    nom: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const DUMMY_DATA = [
    { emotion: 'Joyful', energy: 0.9, connection: 3, stress: 'peaceful', daysAgo: 0, hour: 10 },
    { emotion: 'Energetic', energy: 0.8, connection: 2, stress: 'peaceful', daysAgo: 1, hour: 14 },
    { emotion: 'Sad', energy: 0.3, connection: 1, stress: 'stressed', daysAgo: 1, hour: 20 },
    { emotion: 'Calm', energy: 0.5, connection: 2, stress: 'peaceful', daysAgo: 2, hour: 9 },
    { emotion: 'Anxious', energy: 0.6, connection: 0, stress: 'overwhelmed', daysAgo: 3, hour: 18 },
    { emotion: 'Joyful', energy: 0.85, connection: 3, stress: 'peaceful', daysAgo: 4, hour: 12 },
    { emotion: 'Sad', energy: 0.2, connection: 1, stress: 'tense', daysAgo: 5, hour: 21 },
    { emotion: 'Energetic', energy: 0.95, connection: 2, stress: 'peaceful', daysAgo: 6, hour: 8 },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'test2@test.com' });
        if (!user) {
            console.error('User test2@test.com not found! Please register it first.');
            process.exit(1);
        }

        console.log(`Found user: ${user.nom} (${user._id})`);

        for (const data of DUMMY_DATA) {
            const date = new Date();
            date.setDate(date.getDate() - data.daysAgo);
            date.setHours(data.hour, 0, 0, 0);

            await Mood.create({
                utilisateur: user._id,
                emotion: data.emotion,
                energy: data.energy,
                connection: data.connection,
                stress: data.stress,
                date: date
            });
            console.log(`Added mood: ${data.emotion} for ${date.toLocaleDateString()}`);
        }

        console.log('Dummy data added successfully!');
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();

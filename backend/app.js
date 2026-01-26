require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
const { Schema } = mongoose;

app.use(express.json());


//1) Schéma utilisateur
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  nom: { type: String, required: true },
  date_creation: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// 2) Schéma Message
const messageSchema = new Schema({
  texte: { type: String, required: true },
  utilisateur: { type: String, default: 'anonyme' },
  date: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// 3) Schéma Mood
const moodSchema = new Schema({
  utilisateur: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  emotion: { type: String, required: true },
  energy: { type: Number, required: true },
  connection: { type: Number, required: true },
  stress: { type: String, required: true },
  x: { type: Number }, // Devenu optionnel
  y: { type: Number }, // Devenu optionnel
  date: { type: Date, default: Date.now }
});
const Mood = mongoose.model('Mood', moodSchema);

// INSCRIPTION
app.post('/inscription', async (req, res) => {
  try {
    const { email, mot_de_passe, nom } = req.body;

    if (!email || !mot_de_passe || !nom) {
      return res.status(400).json({ error: 'email, mot_de_passe et nom sont obligatoires' });
    }

    const userExistant = await User.findOne({ email });
    if (userExistant) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);

    const nouvelUser = await User.create({
      email,
      mot_de_passe: motDePasseHache,
      nom
    });

    res.status(201).json({
      message: 'Utilisateur créé',
      user: { id: nouvelUser._id, email: nouvelUser.email, nom: nouvelUser.nom }
    });
  } catch (err) {
    console.error('Erreur inscription :', err);
    res.status(500).json({ error: "Erreur serveur lors de l’inscription" });
  }
});

// CONNEXION
app.post('/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ error: 'email et mot_de_passe sont obligatoires' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!motDePasseValide) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, email: user.email, nom: user.nom }
    });
  } catch (err) {
    console.error('Erreur connexion :', err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
});

const verifierToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // on garde l’id utilisateur
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};


app.post('/message', verifierToken, async (req, res) => {
  const data = req.body;
  console.log('Données reçues :', data, 'par user', req.userId);

  if (!data.texte || data.texte.trim() === "") {
    return res.status(400).json({ error: "Le champ 'texte' est obligatoire." });
  }

  try {
    const messageEnregistre = await Message.create({
      texte: data.texte,
      utilisateur: req.userId.toString()
    });

    res.json({
      message: "Message enregistré en base.",
      saved: messageEnregistre
    });
  } catch (err) {
    console.error('Erreur enregistrement MongoDB :', err);
    res.status(500).json({ error: "Erreur serveur lors de l'enregistrement." });
  }
});

// Enregistrer un mood (x, y) pour l'utilisateur connecté
// Enregistrer un mood détaillé pour l'utilisateur connecté
app.post('/mood', verifierToken, async (req, res) => {
  try {
    const { emotion, energy, connection, stress } = req.body;

    // Validation des nouveaux champs
    if (!emotion || energy === undefined || connection === undefined || !stress) {
      return res.status(400).json({ error: 'Les champs emotion, energy, connection et stress sont obligatoires' });
    }

    const mood = await Mood.create({
      utilisateur: req.userId,
      emotion,
      energy,
      connection,
      stress
    });

    res.status(201).json({
      message: 'Mood enregistré avec succès',
      mood
    });
  } catch (err) {
    console.error('Erreur enregistrement mood :', err);
    res.status(500).json({ error: 'Erreur serveur lors de l’enregistrement du mood' });
  }
});

// Mood global = moyenne de tous les moods
// Historique des moods
app.get('/history', verifierToken, async (req, res) => {
  try {
    const moods = await Mood.find({ utilisateur: req.userId })
      .sort({ date: -1 })
      .limit(50); // Limit to last 50 entries
    res.json(moods);
  } catch (err) {
    console.error('Erreur history :', err);
    res.status(500).json({ error: 'Erreur serveur pour historique' });
  }
});

app.get('/weather-stats', verifierToken, async (req, res) => {
  try {
    // Fetch last 10 moods for this user
    const moods = await Mood.find({ utilisateur: req.userId })
      .sort({ date: -1 })
      .limit(10);

    if (moods.length === 0) {
      return res.json({ temperature: null, condition: 'Clear', label: 'No Data' });
    }

    // 1. Calculate Temperature (Average Energy)
    let totalEnergy = 0;
    moods.forEach(m => totalEnergy += (m.energy || 0.5)); // Default to 0.5 if missing
    const avgEnergy = totalEnergy / moods.length;
    // Map 0.0-1.0 to 0°C - 30°C
    const temperature = Math.round(avgEnergy * 30);

    // 2. Calculate Condition
    let condition = 'Cloudy'; // Default
    let label = 'Neutral';

    // Count occurrences
    let stressCount = 0;
    let sadCount = 0;
    let happyCount = 0;

    moods.forEach(m => {
      if (m.stress === 'overwhelmed' || m.stress === 'stressed') stressCount++;
      if (m.emotion === 'Sad' || m.emotion === 'Anxious') sadCount++;
      if (m.emotion === 'Joyful' || m.emotion === 'Energetic') happyCount++;
    });

    if (stressCount >= 3) {
      condition = 'Stormy';
      label = 'Turbulent';
    } else if (sadCount >= 3) {
      condition = 'Rainy';
      label = 'Gloomy';
    } else if (happyCount >= 3) {
      condition = 'Sunny';
      label = 'Radiant';
    } else {
      condition = 'Cloudy';
      label = 'Calm';
    }

    res.json({
      temperature,
      condition,
      label
    });
  } catch (err) {
    console.error('Erreur weather-stats :', err);
    res.status(500).json({ error: 'Erreur serveur pour weather-stats' });
  }
});

app.get('/mood-global', async (req, res) => {
  try {
    const moods = await Mood.find();

    if (moods.length === 0) {
      return res.json({ message: 'Pas encore de moods', global: null });
    }

    let sommeX = 0;
    let sommeY = 0;

    moods.forEach(m => {
      // Fallback for old data without x/y? Skip them or count as 0
      sommeX += (m.x || 0);
      sommeY += (m.y || 0);
    });

    const moyenneX = sommeX / moods.length;
    const moyenneY = sommeY / moods.length;

    res.json({
      count: moods.length,
      global: { x: moyenneX, y: moyenneY }
    });
  } catch (err) {
    console.error('Erreur mood-global :', err);
    res.status(500).json({ error: 'Erreur serveur pour mood-global' });
  }
});


app.get('/', (req, res) => {
  res.send('Backend Teru fonctionne');
});


app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 }); // tri décroissant
    res.json(messages);
  } catch (err) {
    console.error('Erreur lecture MongoDB :', err);
    res.status(500).json({ error: "Erreur serveur lors de la lecture." });
  }
});



mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connecté à MongoDB');
    const HOST = process.env.HOST || '0.0.0.0';
    app.listen(PORT, HOST, () => {
      console.log(`Serveur lancé sur http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur connexion MongoDB :', err);
  });


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
  emotion: { type: String }, // Now optional, replaced by X/Y
  energy: { type: Number },  // Now optional, replaced by X/Y
  connection: { type: Number },
  stress: { type: String },
  x: { type: Number, required: true }, // Required for new grid system
  y: { type: Number, required: true }, // Required for new grid system
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
const robotController = require('./robot_controller'); // Import Robot Controller

// Initialisation Robot (Try to connect to USBs)
robotController.init();

// --- HELPER: Calculate Weather (Aggregation Logic) ---
async function calculateWeather(userId) {
  // 1. Fetch last 10 moods
  const moods = await Mood.find({ utilisateur: userId })
    .sort({ date: -1 })
    .limit(10);

  if (moods.length === 0) {
    return { temperature: 20, condition: 'Cloudy', label: 'No Data' };
  }

  // 2. Calculate Average Position
  let totalX = 0;
  let totalY = 0;
  moods.forEach(m => {
    totalX += m.x;
    totalY += m.y;
  });
  const avgX = totalX / moods.length;
  const avgY = totalY / moods.length;

  // 3. Map to Weather Condition
  // X = Feeling (-1 to 1), Y = Energy (-1 to 1)
  let condition = 'Cloudy';
  let label = 'Calm';

  if (avgX >= 0 && avgY >= 0) {
    condition = 'Sunny';
    label = 'Radiant';
  } else if (avgX >= 0 && avgY < 0) {
    condition = 'Cloudy'; // Or 'Clear'
    label = 'Calm';
  } else if (avgX < 0 && avgY < 0) {
    condition = 'Rainy';
    label = 'Gloomy';
  } else if (avgX < 0 && avgY >= 0) {
    condition = 'Stormy';
    label = 'Turbulent';
  }

  // Temperature based on Energy (avgY) mapped from [-1, 1] to [0, 30]
  const temperature = Math.round(((avgY + 1) / 2) * 30);

  return { temperature, condition, label, avgX, avgY };
}

// Enregistrer un mood détaillé pour l'utilisateur connecté
app.post('/mood', verifierToken, async (req, res) => {
  try {
    const { x, y, emotion, energy, connection, stress } = req.body;

    // Validation: x and y are now required
    if (x === undefined || y === undefined) {
      return res.status(400).json({ error: 'Les coordonnées x et y sont obligatoires' });
    }

    const mood = await Mood.create({
      utilisateur: req.userId,
      emotion,
      energy,
      connection,
      stress,
      x,
      y
    });

    // --- COMMUNITY MIRROR (Collective logic) ---
    // We calculate community stats instead of individual-only trigger
    const communityWeather = await calculateCommunityWeather();
    console.log(`[APP] Community Pulse: ${communityWeather.condition}`);

    // Update Robot based on Community (if we were to trigger it here)
    // robotController.updateRobotExpression(communityWeather);

    res.status(201).json({
      message: 'Mood enregistré avec succès',
      mood,
      communityWeather
    });
  } catch (err) {
    console.error('Erreur enregistrement mood :', err);
    res.status(500).json({ error: 'Erreur serveur lors de l’enregistrement du mood' });
  }
});

// Helper for community aggregation
async function calculateCommunityWeather() {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const moods = await Mood.find({ date: { $gte: new Date(Date.now() - ONE_DAY) } })
    .sort({ date: -1 })
    .limit(100);

  if (moods.length === 0) {
    return { temperature: 20, condition: 'Cloudy', label: 'Quiet', count: 0 };
  }

  let totalX = 0;
  let totalY = 0;
  moods.forEach(m => {
    totalX += m.x;
    totalY += m.y;
  });

  const avgX = totalX / moods.length;
  const avgY = totalY / moods.length;

  let condition = 'Cloudy';
  if (avgX >= 0 && avgY >= 0) condition = 'Sunny';
  else if (avgX >= 0 && avgY < 0) condition = 'Cloudy';
  else if (avgX < 0 && avgY < 0) condition = 'Rainy';
  else if (avgX < 0 && avgY >= 0) condition = 'Stormy';

  const temperature = Math.round(((avgY + 1) / 2) * 30);

  return { temperature, condition, count: moods.length, avgX, avgY };
}

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
    const weather = await calculateWeather(req.userId);
    res.json(weather);
  } catch (err) {
    console.error('Erreur weather-stats :', err);
    res.status(500).json({ error: 'Erreur serveur pour weather-stats' });
  }
});

// Community Weather Stats (All users)
app.get('/community-weather', async (req, res) => {
  try {
    const weather = await calculateCommunityWeather();
    res.json(weather);
  } catch (err) {
    console.error('Erreur community-weather :', err);
    res.status(500).json({ error: 'Erreur serveur pour community-weather' });
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
    const messages = await Message.find().sort({ date: -1 }).limit(20); // Limite aux 20 derniers
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


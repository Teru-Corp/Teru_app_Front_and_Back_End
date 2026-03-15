import { Platform } from 'react-native';

// Si tu es sur émulateur Android, localhost est 10.0.2.2
// Si tu es sur émulateur iOS, localhost est localhost
// Si tu es sur un vrai téléphone, utilise ton IP 10.1.224.111
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://10.1.224.111:3000', // Pour le vrai téléphone
});

export const api = {
  // Inscription
  async signup(email: string, mdp: string, nom: string) {
    const res = await fetch(`${BASE_URL}/inscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mot_de_passe: mdp, nom }),
    });
    return res.json();
  },

  // Connexion
  async login(email: string, mdp: string) {
    const res = await fetch(`${BASE_URL}/connexion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mot_de_passe: mdp }),
    });
    return res.json();
  },

  // Envoyer un mood (avec token)
  async sendMood(x: number, y: number, token: string) {
    const res = await fetch(`${BASE_URL}/mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ x, y }),
    });
    return res.json();
  },
};

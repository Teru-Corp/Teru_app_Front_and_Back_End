export const FORBIDDEN_AND_NEGATIVE = [
    // English Profanity
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'whore', 'slut', 'fag', 'faggot', 'bastard', 'douche',
    // French Profanity
    'merde', 'putain', 'connard', 'connasse', 'salope', 'pd', 'enculé', 'pute', 'bite', 'chatte', 'couilles', 'branleur',
    
    // English Negative Words & Phrases
    'hate', 'terrible', 'awful', 'ugly', 'useless', 'stupid', 'depressed', 'give up', 'i can\'t do this', 'i cant do this', 'worthless',
    // French Negative Words & Phrases
    'déteste', 'nul', 'moche', 'stupide', 'inutile', 'laisse tomber', 'je n\'en peux plus', 'n\'en peux plus'
].sort((a, b) => b.length - a.length);

export const FRIENDLY_EMOJIS = ['💖', '🌸', '✨', '🌈', '🌻'];

/**
 * Replaces bad words and negative phrases in the given text with friendly emojis.
 */
export function censorWithLove(text: string): string {
    if (!text) return text;
    let filteredText = text;
    
    FORBIDDEN_AND_NEGATIVE.forEach(word => {
        // Escape characters for regex to prevent issues with apostrophes and spaces
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Use a word boundary regex, case-insensitive
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
        if (regex.test(filteredText)) {
            filteredText = filteredText.replace(regex, () => {
                return FRIENDLY_EMOJIS[Math.floor(Math.random() * FRIENDLY_EMOJIS.length)];
            });
        }
    });

    return filteredText;
}

/**
 * Checks if a given date string represents today or yesterday.
 */
export function isRecentMessage(dateString: string): boolean {
    const messageDate = new Date(dateString);
    if (isNaN(messageDate.getTime())) return false;

    const now = new Date();
    // Create a date object for today at 00:00:00
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Create a date object for yesterday at 00:00:00
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return messageDate >= yesterday;
}

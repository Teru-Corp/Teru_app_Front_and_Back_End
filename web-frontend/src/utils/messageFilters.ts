export const FORBIDDEN_WORDS = [
    // English
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'whore', 'slut', 'fag', 'faggot', 'bastard', 'douche',
    // French
    'merde', 'putain', 'connard', 'connasse', 'salope', 'pd', 'enculé', 'pute', 'bite', 'chatte', 'couilles', 'branleur'
];

export const FRIENDLY_EMOJIS = ['💖', '🌸', '✨', '🌈', '🌻'];

/**
 * Replaces bad words in the given text with friendly emojis.
 */
export function censorWithLove(text: string): string {
    if (!text) return text;
    let filteredText = text;
    
    FORBIDDEN_WORDS.forEach(word => {
        // Use a word boundary regex, case-insensitive
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
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

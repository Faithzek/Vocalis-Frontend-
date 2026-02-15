
import { FILLER_WORDS } from '../constants';

/**
 * Implements the core rule-based cleaning requested for the Raspberry Pi environment.
 */
export const cleanSpeechArtifacts = (text: string): string => {
  let cleaned = text.toLowerCase().trim();

  // 1. Rule: Remove repetitive syllables/partial words like "ba-ba-baby" or "i..i..i want"
  // Handles patterns like "i..i..i" or "ba-ba-"
  cleaned = cleaned.replace(/(\b\w+)\-+\1/gi, '$1'); // "ba-ba-baby" -> "baby"
  cleaned = cleaned.replace(/(\b\w+)\.+\1/gi, '$1'); // "i..i..i" -> "i"
  
  // Repeatedly apply syllable collapse to catch multi-repeats
  let last;
  do {
    last = cleaned;
    cleaned = cleaned.replace(/(\b\w+)\s+\1/gi, '$1'); // "i i i" -> "i"
  } while (cleaned !== last);

  // 2. Rule: Repeated character compression (Limit to 2 max)
  // Example: "sssssnake" -> "ssnake", "goooood" -> "good"
  cleaned = cleaned.replace(/(.)\1{2,}/g, '$1$1');

  // 3. Rule: Remove filler words
  const fillerRegex = new RegExp(`\\b(${FILLER_WORDS.join('|')})\\b`, 'gi');
  cleaned = cleaned.replace(fillerRegex, '');

  // 4. Final Cleanup: Extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

/**
 * Logic to detect if the transcription seems invalid or low confidence
 */
export const checkConfidence = (text: string, rawWhisperScore: number): boolean => {
  if (rawWhisperScore < 0.5) return false;
  if (text.split(' ').length < 2) return false; // Too short to be a full thought
  if (text.endsWith('...')) return false; // Likely cut off
  return true;
};

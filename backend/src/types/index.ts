/**
 * SCORES INTERFACE
 * Defines the four specific metrics used to evaluate a candidate.
 * Each value is typically a number (0-100).
 */
export interface Scores {
  exact: number;      // How well specific technical keywords match.
  similarity: number; // How well the candidate's background aligns with the role's domain.
  impact: number;     // Measures quantifiable results (e.g., "Increased revenue by 20%").
  ownership: number;  // Level of responsibility or leadership shown in previous roles.
}

/**
 * ANALYSIS RESULT INTERFACE
 * This is the structured object returned by the Google Gemini AI.
 */
export interface AnalysisResult {
  candidateName: string;
  scores: Scores;     // Nested Scores object defined above.
  explanation: string; // A human-readable summary of why the AI gave these scores.
  /**
   * TIERING SYSTEM
   * A: Fast-track to interview.
   * B: Schedule technical screening.
   * C: Keep on file/lower priority.
   */
  tier: 'A' | 'B' | 'C';
}

/**
 * SHORTLIST RESPONSE INTERFACE
 * Extends the AnalysisResult to include a calculated average.
 * This is what the final API response looks like when sent to the frontend.
 */
export interface ShortlistResponse extends AnalysisResult {
  averageScore: number; // The mathematical mean of the four Score categories.
}
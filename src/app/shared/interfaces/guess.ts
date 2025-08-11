export interface Guess {
    raw: string; 
    letters: { char: string; state: 'absent' | 'present' | 'correct' }[];
}

export type Intent = 'SUMMARIZE' | 'EXPLAIN' | 'TEST' | 'REVISE' | 'OTHER';

export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();

  if (q.includes('summarize') || q.includes('summary') || q.includes('overview') || q.includes('tl;dr')) {
    return 'SUMMARIZE';
  }

  if (q.includes('revise') || q.includes('revision') || q.includes('revisit') || q.includes('remember') || q.includes('exam')) {
    return 'REVISE';
  }

  if (q.includes('explain') || q.includes('why') || q.includes('how') || q.includes('analogy') || q.includes('understand')) {
    return 'EXPLAIN';
  }

  if (q.includes('test') || q.includes('quiz') || q.includes('questions') || q.includes('mcq')) {
    return 'TEST';
  }

  return 'OTHER';
}

export function detectDifficulty(query: string): 'SIMPLE' | 'TECHNICAL' | 'BALANCED' {
  const q = query.toLowerCase();
  if (q.includes('simple') || q.includes('child') || q.includes('beginner') || q.includes('easy') || q.includes('5 year old') || q.includes('five year old')) {
    return 'SIMPLE';
  }
  if (q.includes('technical') || q.includes('deep') || q.includes('expert') || q.includes('advanced') || q.includes('complex')) {
    return 'TECHNICAL';
  }
  return 'BALANCED';
}

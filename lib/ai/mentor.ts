export interface ExplanationResponse {
  analogy: string;
  technical: string;
  realWorld: string;
  masterySuggestion?: string;
}

export async function generateMentorExplanation(
  concept: string,
  context: string,
  userLevel: number
): Promise<ExplanationResponse> {
  return {
    analogy: `Imagine ${concept} is like a chef in a kitchen...`,
    technical: `${concept} is defined as a mechanism where...`,
    realWorld: `In the industry, ${concept} is used to solve...`,
    masterySuggestion: "You've grasped the basics. Want to try a quick quiz on this?"
  };
}

export async function generateSummary(text: string, detailLevel: 'short' | 'detailed' | 'visual'): Promise<string> {
  return `This section covers the fundamental principles of ${text.substring(0, 20)}...`;
}

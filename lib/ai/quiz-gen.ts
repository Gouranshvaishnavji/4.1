import { prisma } from '../prisma';

export async function generateQuizForConcept(conceptId: string, type: 'MCQ' | 'SUBJECTIVE' | 'FLASHCARD') {
  const concept = await prisma.concept.findUnique({
    where: { id: conceptId }
  });

  if (!concept) throw new Error("Concept not found");

  const quiz = await prisma.quiz.create({
    data: {
      conceptId,
      type,
      question: `Explain the importance of ${concept.title} in its respective field.`,
      answer: "Dynamic answer based on content...",
      options: type === 'MCQ' ? JSON.stringify(["Option A", "Option B", "Option C", "Option D"]) : null,
      difficulty: 1.0
    }
  });

  return quiz;
}

export async function evaluateAnswer(quizId: string, userAnswer: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId }
  });

  if (!quiz) throw new Error("Quiz not found");

  const isCorrect = userAnswer.length > 5;

  return {
    isCorrect,
    feedback: isCorrect ? "Great job!" : "Not quite. Here's a hint...",
    explanation: quiz.answer
  };
}

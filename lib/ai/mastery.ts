import { prisma } from '../prisma';

export async function calculateOverallMastery(userId: string): Promise<number> {
  const progress = await prisma.progress.findMany({
    where: { userId }
  });

  if (progress.length === 0) return 0;

  const sum = progress.reduce((acc: number, p: { masteryLevel: number }) => acc + p.masteryLevel, 0);
  return sum / progress.length;
}

export async function getTopicMastery(topicId: string, userId: string): Promise<number> {
  const concepts = await prisma.concept.findMany({
    where: { topicId }
  });

  const conceptIds = concepts.map(c => c.id);
  const progress = await prisma.progress.findMany({
    where: {
      userId,
      conceptId: { in: conceptIds }
    }
  });

  if (progress.length === 0) return 0;
  const sum = progress.reduce((acc: number, p: { masteryLevel: number }) => acc + p.masteryLevel, 0);
  return sum / concepts.length;
}

export async function updateLearningPace(userId: string): Promise<void> {
  const recentSessions = await prisma.session.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  await prisma.learningProfile.update({
    where: { userId },
    data: {
      pace: recentSessions.length > 3 ? "fast" : "moderate"
    }
  });
}

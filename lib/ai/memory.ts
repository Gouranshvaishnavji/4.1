import { prisma } from '../prisma';

export interface MemoryContext {
  lastSession: {
    id: string;
    userId: string;
    summary: string | null;
    struggles: string | null;
    createdAt: Date;
  } | null;
  weakConcepts: {
    id: string;
    userId: string;
    conceptId: string;
    masteryLevel: number;
    lastReviewed: Date;
    correctCount: number;
    wrongCount: number;
  }[];
  strugglePatterns: string[];
  revisitPriority: {
    id: string;
    userId: string;
    conceptId: string;
    masteryLevel: number;
    lastReviewed: Date;
    correctCount: number;
    wrongCount: number;
  }[];
}

export async function recordLearningEvent(userId: string, conceptId: string, success: boolean): Promise<void> {
  const progress = await prisma.progress.findFirst({
    where: { userId, conceptId }
  });

  if (progress) {
    const newMastery = success
      ? Math.min(1, progress.masteryLevel + 0.1)
      : Math.max(0, progress.masteryLevel - 0.05);

    await prisma.progress.update({
      where: { id: progress.id },
      data: {
        masteryLevel: newMastery,
        correctCount: success ? { increment: 1 } : undefined,
        wrongCount: !success ? { increment: 1 } : undefined,
        lastReviewed: new Date()
      }
    });
  } else {
    await prisma.progress.create({
      data: {
        userId,
        conceptId,
        masteryLevel: success ? 0.2 : 0.0,
        correctCount: success ? 1 : 0,
        wrongCount: success ? 0 : 1
      }
    });
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  const session = await prisma.session.findFirst({
    where: {
      userId,
      createdAt: { gte: today }
    }
  });

  if (session) {
    if (!success) {
      const struggles = session.struggles ? JSON.parse(session.struggles) : [];
      if (!struggles.includes(conceptId)) struggles.push(conceptId);
      await prisma.session.update({
        where: { id: session.id },
        data: { struggles: JSON.stringify(struggles) }
      });
    }
  } else {
    await prisma.session.create({
      data: {
        userId,
        struggles: !success ? JSON.stringify([conceptId]) : JSON.stringify([])
      }
    });
  }
}

export async function getDeepMemoryContext(userId: string): Promise<MemoryContext> {
  const lastSession = await prisma.session.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const weakConcepts = await prisma.progress.findMany({
    where: { userId, masteryLevel: { lt: 0.5 } },
    take: 5
  });

  const recentSessions = await prisma.session.findMany({
    where: { userId },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const strugglePatterns: string[] = [];
  recentSessions.forEach(s => {
    if (s.struggles) {
      const ids = JSON.parse(s.struggles);
      if (ids.length > 2) strugglePatterns.push("Heavy cognitive load detected in recent sessions");
    }
  });

  return {
    lastSession,
    weakConcepts,
    strugglePatterns,
    revisitPriority: [...weakConcepts].sort((a, b) => a.masteryLevel - b.masteryLevel)
  };
}

export async function shouldRevisit(conceptId: string, userId: string): Promise<boolean> {
  const progress = await prisma.progress.findFirst({
    where: { userId, conceptId }
  });

  if (!progress) return true;

  const daysSinceLastReview = (Date.now() - progress.lastReviewed.getTime()) / (1000 * 60 * 60 * 24);

  if (progress.masteryLevel < 0.3) return true;
  if (progress.masteryLevel < 0.5 && daysSinceLastReview > 1) return true;
  if (progress.masteryLevel < 0.8 && daysSinceLastReview > 7) return true;
  if (daysSinceLastReview > 30) return true;

  return false;
}

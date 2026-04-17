import { prisma } from '../prisma';

export async function createStudyPlan(userId: string, documentId: string, days: number) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { modules: { include: { topics: true } } }
  });

  if (!document) throw new Error("Document not found");

  const plan = await prisma.studyPlan.create({
    data: {
      userId,
      title: `Mastery Plan for ${document.title}`,
      description: `Target completion in ${days} days`,
      endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    }
  });

  const allTopics = document.modules.flatMap(m => m.topics);
  const topicsPerDay = Math.ceil(allTopics.length / days);

  for (let i = 0; i < allTopics.length; i++) {
    const day = Math.floor(i / topicsPerDay);
    await prisma.task.create({
      data: {
        studyPlanId: plan.id,
        title: `Study Topic: ${allTopics[i].title}`,
        dueDate: new Date(Date.now() + day * 24 * 60 * 60 * 1000)
      }
    });
  }

  return plan;
}

export async function getRecommendedNextSteps(userId: string) {
  const weakAreas = await prisma.progress.findMany({
    where: { userId, masteryLevel: { lt: 0.6 } },
    take: 2
  });

  if (weakAreas.length > 0) {
    return {
      type: 'REVISION',
      reason: "You struggled with these concepts last time.",
      items: weakAreas
    };
  }

  return {
    type: 'NEW_CONTENT',
    reason: "You're doing great! Ready for something new?",
  };
}

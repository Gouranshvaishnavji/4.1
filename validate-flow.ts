import { prisma } from './lib/prisma';
import { extractTextFromPDF, chunkText } from './lib/pdf-processor/processor';
import { detectIntent } from './lib/ai/intent';
import { recordLearningEvent, getDeepMemoryContext } from './lib/ai/memory';
import { createStudyPlan, getRecommendedNextSteps } from './lib/ai/study-plan';

async function validate() {
  console.log("🚀 Starting Internal Validation Cycle...");

  // 1. Setup Mock User
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { email: 'test@example.com', name: 'Test User' }
  });
  console.log("✅ User created/verified");

  // 2. Mock PDF Upload & Parsing
  const text = "Operating Systems concepts including Deadlocks and Virtual Memory.";
  const chunks = await chunkText(text);
  console.log(`✅ PDF parsed into ${chunks.length} chunks`);

  const doc = await prisma.document.create({
    data: {
      title: "OS 101",
      userId: user.id,
      content: text
    }
  });

  const module = await prisma.module.create({
    data: { title: "Ch 1: Introduction", documentId: doc.id, order: 1 }
  });

  const topic = await prisma.topic.create({
    data: { title: "Deadlocks", moduleId: module.id, order: 1 }
  });

  const concept = await prisma.concept.create({
    data: { title: "Resource Allocation", topicId: topic.id }
  });
  console.log("✅ Document and hierarchy created");

  // 3. Test Intents
  const intents = ["summarize this", "explain simply", "test me", "revise for exam"];
  for (const q of intents) {
    console.log(`🔍 Query: "${q}" -> Intent: ${detectIntent(q)}`);
  }

  // 4. Test Adaptive Learning Loop
  console.log("🔄 Testing Adaptive Feedback Loop...");
  await recordLearningEvent(user.id, concept.id, false); // Failed once
  let nextSteps = await getRecommendedNextSteps(user.id);
  console.log(`📊 After 1 fail: Next Step Type = ${nextSteps.type} (${nextSteps.reason})`);

  await recordLearningEvent(user.id, concept.id, true); // Succeeded
  await recordLearningEvent(user.id, concept.id, true); // Succeeded again
  nextSteps = await getRecommendedNextSteps(user.id);
  console.log(`📊 After 2 successes: Next Step Type = ${nextSteps.type}`);

  const memory = await getDeepMemoryContext(user.id);
  console.log(`🧠 Memory Context: ${memory.strugglePatterns.length} struggle patterns detected.`);

  // 5. Test Study Plan Generation
  const plan = await createStudyPlan(user.id, doc.id, 5);
  console.log(`📅 Study Plan "${plan.title}" created with tasks.`);

  console.log("🏁 Validation Cycle Complete!");
}

validate().catch(console.error).finally(() => prisma.$disconnect());

import { FastifyInstance } from "fastify";

export default async function HealthController(fastify: FastifyInstance) {
  fastify.get("/health", async (_request, reply) => {
    reply.status(200);
    reply.send({ success: true, health: 'okay' });
  });
}

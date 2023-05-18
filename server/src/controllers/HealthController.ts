import { FastifyReply, FastifyRequest } from "fastify";

export default function HealthController(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200);
  reply.send({ success: true, health: 'okay' });
}

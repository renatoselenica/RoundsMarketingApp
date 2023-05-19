import { FastifyReply, FastifyRequest } from "fastify";

function healthCheck(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200);
  reply.send({ success: true, health: 'okay' });
}

export default {
  healthCheck
}

import { FastifyReply, FastifyRequest } from "fastify";

function getApps(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200);
  reply.send({ success: true, health: 'hello apps' });
}

function getApp(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200);
  reply.send({ success: true, health: 'hello app' });
}

function addApp(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200);
  reply.send({ success: true, health: 'okay' });
}


export default {
  getApps,
  getApp,
  addApp
}

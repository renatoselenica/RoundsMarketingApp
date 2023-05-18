import fastify from "fastify";
import HealthController from "./controllers/HealthController";

const server = fastify({ logger: true });

// Set up the Fastify error handler
server.setErrorHandler(async (error, request, reply) => {
  // Log the error to Sentry later on
  server.log.error({ error, request, reply });
});

// Routes
// These could be moved to a specific file with a handler later on and still registered before the start of the app
server.register(HealthController, { prefix: "/" });
// End Routes

server.listen({ port: 4000 }, (err, address) => {
  if (err) {
    server.log.error('There was an error in starting the server');
  }
  server.log.info(`Server listening at ${address}`);
});

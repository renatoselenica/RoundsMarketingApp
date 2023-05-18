import fastify from "fastify";
import AppsController from "./controllers/AppsController";
import HealthController from "./controllers/HealthController";

async function bootstrap() {
  const server = fastify({ logger: true });

  // Set up the Fastify error handler
  server.setErrorHandler(async (error, request, reply) => {
    // Log the error to Sentry later on
    server.log.error({ error, request, reply });
  });

  // Routes
  // The route registration can be moved to a different file and looped over without having to increase the size of the index file
  server.route({ method: "GET", url: "/health", handler: HealthController });
  server.route({ method: "GET", url: "/apps/getApps", handler: AppsController.getApps });
  server.route({ method: "GET", url: "/apps/getApp", handler: AppsController.getApp });
  server.route({ method: "POST", url: "/apps/addApp", handler: AppsController.addApp });
  // End Routes

  server.listen({ port: 4000 }, (err, address) => {
    if (err) {
      server.log.error('There was an error in starting the server');
    }
    server.log.info(`Server listening at ${address}`);
  });
}

bootstrap();

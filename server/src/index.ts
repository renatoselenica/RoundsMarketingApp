import fastify from "fastify";
import * as path from "path";
import staticServe from "@fastify/static";
import AppsController from "./controllers/AppsController";
import HealthController from "./controllers/HealthController";

async function bootstrap() {
  const server = fastify({ logger: true });
  // Set up the Fastify error handler
  server.setErrorHandler(async (error, request, reply) => {
    // Error logging can be setup with BugSnag or Sentry
    server.log.error({ error, request, reply });
  });

  // Serve Images for the front end
  server.register(staticServe, {
    root: path.join(__dirname, '..', '/public'),
  })

  // Routes
  // The route registration can be moved to a different file and looped over without having to increase the size of the index file
  server.route({ method: "GET", url: "/health", handler: HealthController });
  server.route({ method: "GET", url: "/apps/getApps", handler: AppsController.getApps });
  server.route({ method: "GET", url: "/apps/getApp/:packageName", handler: AppsController.getApp });
  server.route({ method: "POST", url: "/apps/addApp", handler: AppsController.addApp });
  server.route({ method: "POST", url: "/apps/createScreenshot", handler: AppsController.createScreenshot });
  // End Routes

  server.listen({ port: 4000 }, (err, address) => {
    if (err) {
      server.log.error('There was an error in starting the server');
    }
    server.log.info(`Server listening at ${address}`);
  });
}

bootstrap();

import fastify from "fastify";
import * as path from "path";
import staticServe from "@fastify/static";
import AppsController from "./controllers/AppsController";
import HealthController from "./controllers/HealthController";
import Scheduler from "./services/CronService";
import Validator from "./validators/Validator";

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
  server.route({ method: "GET", url: "/health", handler: HealthController.healthCheck });
  server.route({ method: "GET", url: "/apps/get-apps", handler: AppsController.getApps });
  server.route({ method: "GET", url: "/apps/get-app", preHandler: Validator.validateGetApp, handler: AppsController.getApp });
  server.route({ method: "POST", url: "/apps/add-app", preHandler: Validator.validateAddApp, handler: AppsController.addApp });
  server.route({ method: "POST", url: "/apps/create-screenshot", preHandler: Validator.validateAddScreenshot, handler: AppsController.createScreenshot });
  // End Routes

  const scheduler = new Scheduler();
  scheduler.startTask();

  server.addHook('onClose', (_instance, done) => {
    console.log('server is closing');
    done();
  });

  // detect CTRL-C and stop scheduler
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Process will exit...');
    server.close(() => {
      scheduler.stop();
      console.log('server closed');
      process.exit(0);
    });
  });

  // detect kill -15 and stop scheduler
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Process will exit...');
    server.close(() => {
      scheduler.stop();
      console.log('server closed');
      process.exit(0);
    });
  });

  server.listen({ port: 4000 }, (err, address) => {
    if (err) {
      server.log.error('There was an error in starting the server');
      scheduler.stop();
    }
    server.log.info(`Server listening at ${address}`);
  });
}

bootstrap();

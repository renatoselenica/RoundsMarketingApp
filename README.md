# Rounds Interview Marketing App

## Repository structure

- The repository is split between client folders and server folders
- The client folder contains the frontend build in Nextjs
- The server folder contains the API built in Fastify
- Fastify was used instead of express as I am slightly more familiar with it

## Getting Started

### Server set up

- Go into the server folder and run the following commands
```bash
cd server
```
```bash
npm install
````
- To set up Prisma and create a sqlite file (in case there are issues with prisma, a DB file was set up at the root of the project as a backup)
 ```bash
 npx prisma db push
 ```
- For running the project without hot reloading
 ```bash
 npm run prod:run
 ```
- For running the project with nodemon (hot reloading)
```bash
npm run start
```

### Client set up

- Go into the client folder and run the following commands
```bash
cd client
```
```bash
npm install
````
- For running the project with hot reloading
 ```bash
 npm run dev
 ```

## Walkthough and considerations

- As specified in the assignment the project is a marketing app to allow teams to monitor apps in the google play store for changes in order to prepare accordingly.
- The model of the app uses two SQL tables: Package, which keeps track of the apps to monitor, and Screenshot, which saved the screenshots for each app.
- The relation between the Package and Screenshot model is one to many. One Package can have many screenshots, but one screenshot is associated with a single package.
- Prisma is used as an ORM to add a layer of security and usability. SQLite was used as a database for practicality. For the current requirements (1 single user), SQLite can handle the amount of data and the single file structure of the DB allows for easy testing
- The system exposed 5 endpoints to be consumed
```
/health GET for a simple health check
```
```
/apps/get-apps GET total number of apps
```
```
/apps/get-app GET receive a single app data
```
```
/apps/add-app POST insert a google play url
```
```
/apps/create-screenshot POST trigger puppeteer to generate a screenshot for the given app
```
- A few considerations were taken into account when it comes to naming convetions specifically for the `get-app` endpoint.
  - The structure of the google play apps id contains `.` and `_` which are not common in REST api naming conventions for route resources.
  - This does not necessarily cause functionality issues but makes the API not very user friendly.
  - I considered doing transformations to replace the `.` and `_` with `-` however that would require multiple transformations on the frontend side to keep the path and the propper data type to send to the API in sync. Secondly, other characters might have been part of the id of the app that might need more parsing.
  - Ultimately, I decided to use the same approach that google uses. Add the id of the app as a querystring parameter. Technically this breaks REST rules as the route does not return data if the querystring is missing. However, I believe that is ok if the team working with the API is aware of the changes. Different elements might have to be taken into consideration if the API was going to be public.
- The `/apps/create-screenshot` endpoint is the only one related to the app, that does not get used by the frontend:
  - The endpoint takes a packageName (package id) in its `BODY` and creates a screenshot for that package.
  - This is given as an entry point to create screenshots from an external system.
  - The endpoint uses the `POST` method because it is writing data to the database and such it is not idempotent.
- The API also includes an internal small, in-memory scheduler.
- The scheduler is used to query the packages in the system and generate a screenshot for each one of them.
- The scheduler is practical in cases where we want to gather screenshots for all the apps without an external actor.
- The package used, `toad-scheduler`, has limited functionality but offers a simple API.
- In case an automatic scheduler like this one were to be build, a more robust solution would need to be implemented, which would also offer persistence, in cases where the API would suddenly crash. A shared memory cache like Redis can also be used in cases of a multi node system.
- The limits of this internal system are in setting up different timeframes for screenshots for different apps. A better suited library like `node-scheduler` could be used to set up custom timers for each app, however depending from the number of apps in the system, that solution could soon run into performance issues.
- An external scheduler can simplify this as it can query the API at times decided by that scheduler.
- The endpoint `apps/create-screenshot` can be triggered by the external scheduler at the timeframe of the scheduler and create the screenshot.
- A cronjob tool, or google cloud schduler can set up multiple http triggers with different urls for specific apps/
- A feature has been added on the client side, for screenshots to be zoomed in on click, making it easier for users to inspect changes in the app listings.

### Deploying the system

- There are multiple approached we can follow the deploy the system in a cloud environment.
- Many cloud providers support Docker integration, the app can be setup via a DockerFile.
- If needed to be in a multi node environment, a Kubernetes cluster can be set up for the app.
- The client and the server project can be different nodes in the cluster and dont have to operate from the same machine. Serverless tools allow for a simplified deployment of Nextjs especially.
- CI/CD using github actions or jenkins, can be set up to build and deliver the projects to the running servers, every time a PR is merged, with environments depending on the git flow choosen by the team.
- Environment variables can be set up for aspects of the system that need to be private, such as the connection string with the Databse, or easy to edit, such as the timer of the scheduler if an internal one were to exist.

## Improvements to the implementation

- While implementing the solution there were a few elements I wanted to improve, with time.
- Validations can be performed using json schemas in fastify and be integrated with a tools such as zod for better mapping of errors. Mapping response and request via the json schema increases fastifies throughput as well.
- The controlers, services, and repositories can be implemented in using a `Class` pattern even tho its just decorating in javascript, I think it offers a good structure nonetheless.
- The services and repositories should be singletons. Javascript is very memory hungry and reusing objects is very efficient when a secondary instance of those objects is not needed.
- Logging on the app can be setup globally so a logger instance is available to all Classes.
- Fetch requests in Nextjs on the clientside can be substituted with react query, or swr for more efficient error, loading states, less footguns due to UseEffect and easier functionality.
- Some data on the client side can be loaded in SSR mode from Next, without having to rely on client side fetching. `getServerSideProps` can be performed on initial requests to build and populate the HTML from the server, in order to increase performance.
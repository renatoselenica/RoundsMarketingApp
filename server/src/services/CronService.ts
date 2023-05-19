import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import AppPackageRepository from '../repositories/AppPackageRepository';
import { IPackage } from '../types/interfaces';
import { screenshot } from "../services/PuppeteerService";

class Scheduler {
  private scheduler: ToadScheduler;
  private timer: number = 1;

  constructor(timer: number) {
    this.scheduler = new ToadScheduler();
    this.timer = timer;
  }

  public startTask() {
    // promise chain is being used inside task instead of async/await to avoid memory leaks
    const task = new AsyncTask('screenshot job', () => {
      return AppPackageRepository.findAllApps().then((apps: IPackage[]) => {
        if (!apps) {
          console.log('No apps found');
          return;
        }

        console.log('Wut');
        apps.forEach((app) => {
          screenshot(app.packageUrl, app.packageName);
        });
      });
    },
      (err: Error) => {
        console.log(`Error on cron job service: ${err}`);
      }
    );

    const job = new SimpleIntervalJob({ minutes: this.timer }, task);
    this._addSimpleIntervalJob(job);
  }

  public _addSimpleIntervalJob(job: SimpleIntervalJob) {
    this.scheduler.addSimpleIntervalJob(job);
  }

  public stop() {
    this.scheduler.stop();
  }
}

export default Scheduler;

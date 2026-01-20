import { randomUUID } from "crypto";
import { PreparedPost } from "@voxhash/socialpostai-core";

export type Platform = "threads" | "bluesky";

export interface ScheduledPost {
  id: string;
  platform: Platform | "both";
  runAt: Date;
  post: PreparedPost;
}

export type PublishExecutor = (post: PreparedPost, platform: Platform) => Promise<void>;

interface ScheduledJob {
  timer: NodeJS.Timeout;
  data: ScheduledPost;
}

export class ScheduleManager {
  private jobs = new Map<string, ScheduledJob>();
  private executor: PublishExecutor;

  constructor(executor: PublishExecutor) {
    this.executor = executor;
  }

  list(): ScheduledPost[] {
    return Array.from(this.jobs.values()).map((job) => job.data);
  }

  schedule(post: PreparedPost, platform: ScheduledPost["platform"], runAt: Date, id?: string) {
    const targetId = id ?? randomUUID();
    this.cancel(targetId);

    const delay = runAt.getTime() - Date.now();
    if (delay <= 0) {
      throw new Error("runAt must be in the future");
    }

    const execute = async () => {
      this.jobs.delete(targetId);
      const platforms: Platform[] = platform === "both" ? ["threads", "bluesky"] : [platform];
      for (const p of platforms) {
        await this.executor(post, p);
      }
    };

    const timer = setTimeout(execute, delay);
    const scheduled: ScheduledPost = { id: targetId, platform, runAt, post };
    this.jobs.set(targetId, { timer, data: scheduled });
    return scheduled;
  }

  reschedule(id: string, runAt: Date) {
    const existing = this.jobs.get(id);
    if (!existing) throw new Error(`No scheduled post found for id ${id}`);
    return this.schedule(existing.data.post, existing.data.platform, runAt, id);
  }

  cancel(id: string) {
    const existing = this.jobs.get(id);
    if (!existing) return false;
    clearTimeout(existing.timer);
    this.jobs.delete(id);
    return true;
  }

  flush() {
    for (const id of Array.from(this.jobs.keys())) {
      this.cancel(id);
    }
  }
}


// This is a robust simulation of BullMQ for environments where Redis is not available.
// In a real production environment, you would import { Queue, Worker } from 'bullmq';

interface Job {
  id: string;
  data: any;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  result?: any;
  error?: string;
  progress: number;
  timestamp: number;
}

class MockQueue {
  private jobs: Map<string, Job> = new Map();
  private name: string;
  private processor: ((job: any) => Promise<any>) | null = null;

  constructor(name: string) {
    this.name = name;
    console.log(`[Queue] Initialized: ${name}`);
  }

  async add(jobName: string, data: any): Promise<{ id: string }> {
    const id = `job_${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job: Job = {
      id,
      data,
      status: 'waiting',
      progress: 0,
      timestamp: Date.now()
    };
    
    this.jobs.set(id, job);
    
    // Simulate async processing
    setTimeout(() => this.processJob(id), 100);
    
    return { id };
  }

  async getJob(id: string) {
    const job = this.jobs.get(id);
    if (!job) return null;
    
    return {
      id: job.id,
      data: job.data,
      returnvalue: job.result,
      failedReason: job.error,
      getState: async () => job.status,
      progress: job.progress
    };
  }

  // Method to register a worker processor (mimics Worker instantiation)
  process(processor: (job: any) => Promise<any>) {
    this.processor = processor;
  }

  private async processJob(id: string) {
    const job = this.jobs.get(id);
    if (!job || !this.processor) return;

    job.status = 'active';
    try {
      // Simulate processing delay for realism
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await this.processor({ data: job.data, updateProgress: (p: number) => job.progress = p });
      job.result = result;
      job.status = 'completed';
      job.progress = 100;
    } catch (error: any) {
      job.error = error.message || 'Unknown error';
      job.status = 'failed';
    }
    this.jobs.set(id, job);
  }
}

// Factory to create or retrieve queues
const queues: Record<string, MockQueue> = {};

export const getQueue = (name: string): MockQueue => {
  if (!queues[name]) {
    queues[name] = new MockQueue(name);
  }
  return queues[name];
};

export const createWorker = (name: string, processor: (job: any) => Promise<any>) => {
  const queue = getQueue(name);
  queue.process(processor);
  console.log(`[Worker] Started for queue: ${name}`);
};

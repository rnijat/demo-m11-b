module.exports = {
  apps: [
    {
      name: 'express-api', // Name for the Express server
      script: 'ts-node', // Use ts-node to run TypeScript files
      args: '--files -r tsconfig-paths/register ./src/index.ts', // Arguments for running the server
      interpreter: 'node',
      exec_mode: 'fork', // Start in fork mode for the Express server
      instances: 1, // Run only 1 instance of Express server
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'bullmq-worker', // Name for BullMQ workers
      script: 'ts-node', // Use ts-node for worker script
      args: '--files -r tsconfig-paths/register ./src/worker.ts', // Worker file path
      exec_mode: 'cluster', // Cluster mode for multiple instances
      instances: 4, // Number of worker instances
      watch: false, // Disable watching for changes
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}

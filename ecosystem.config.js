module.exports = {
  apps: [
    {
      name: 'aha-ext-server',
      script: './build/server.js', // Your entry point
      instances: 1,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

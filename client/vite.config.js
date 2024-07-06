import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { exec } from 'child_process';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Additional output options can be added here if needed
      }
    }
  },
  // Vite hook to run a script after build
  async closeBundle() {
    console.log('Running post-build script...');
    exec('node ./scripts/copy-build.mjs', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing script: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
});

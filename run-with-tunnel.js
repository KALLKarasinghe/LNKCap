import { spawn } from 'child_process';
import http from 'http';

console.log('Starting LNKcap Mobile Vite server on 0.0.0.0:5173...');

const vite = spawn('npx.cmd', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  stdio: 'inherit',
  shell: true
});

let tunnel = null;
let tunnelUrl = '';

function startTunnel() {
  console.log('Establishing secure mobile HTTPS tunnel...');
  tunnel = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-R', '80:localhost:5173',
    'nokey@localhost.run'
  ]);

  tunnel.stdout.on('data', data => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9\.\-]+lhr\.life/);
    if (match && match[0] !== tunnelUrl) {
      tunnelUrl = match[0];
      console.log('\n=====================================================================');
      console.log('  📲 PHONE HTTPS LINK (OPEN THIS ON YOUR ANDROID PHONE):');
      console.log('  ' + tunnelUrl);
      console.log('=====================================================================\n');
      console.log('1. Open the HTTPS link above in Chrome on your phone.');
      console.log('2. Tap "Install App" or "Add to Home screen" to install LNKcap directly!\n');
    }
  });

  tunnel.stderr.on('data', () => {});

  tunnel.on('close', () => {
    console.log('Tunnel connection closed. Reconnecting in 5s...');
    setTimeout(startTunnel, 5000);
  });
}

// Start tunnel after Vite starts
setTimeout(startTunnel, 2500);

process.on('SIGINT', () => {
  if (tunnel) tunnel.kill();
  if (vite) vite.kill();
  process.exit();
});

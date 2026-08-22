import app from './app.js';
import env from './config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║        🌍 GlobeTrotter API Server            ║
╠══════════════════════════════════════════════╣
║  Port:      ${String(PORT).padEnd(33)}║
║  Env:       ${String(env.NODE_ENV).padEnd(33)}║
║  Google:    ${String(env.hasGooglePlaces ? '✅ Connected' : '⚡ Fallback Mode').padEnd(33)}║
║  Amadeus:   ${String(env.hasAmadeus ? '✅ Connected' : '⚡ Fallback Mode').padEnd(33)}║
║  Frontend:  ${String(env.FRONTEND_URL).padEnd(33)}║
╚══════════════════════════════════════════════╝
  `);
});

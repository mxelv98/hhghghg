# Pluxo Security Policy

## 🛡 Security Architecture: The "Secret Case"
The Pluxo SaaS platform is built on the **"Secret Case"** principle. This means that even if the source code were fully public, the platform's core value (prediction logic) and administrative controls remain impenetrable without valid, server-side authentication and authorization.

### 🔑 Secret Management
- **Zero Hardcoding**: No API keys, database URLs, or signing secrets are present in the source code.
- **Environment Isolation**: All configuration is handled via environment variables (OS-level or via `.env.local`).
- **Startup Protection**: The backend performs a "Secret Sweep" on startup, crashing the application immediately if critical environment variables are missing.

### 🔒 Access Control (RBAC)
- **Server-Side Sovereignty**: Role validation (Admin, VIP, VUP) is enforced strictly on the backend.
- **Tier Verification**: Subscription expiration and level checks (Standard vs Elite) occur in the "Secret Case" during every sensitive request.
- **Throttling**: Rate limiting is active on all prediction and admin endpoints to prevent data scraping and brute-force attempts.

## Vulnerability Reporting
If you discover a security vulnerability, please report it via [VULNERABILITY_REPORT.md](docs/VULNERABILITY_REPORT.md) or by contacting the core team directly. Do NOT open a public GitHub issue for security flaws.

## Prohibited Actions
- Attempting to bypass the VIP validation logic.
- Scraping prediction data via rapid-fires (Automatic IP banning will occur).
- Committing real secrets to any branch of this repository.

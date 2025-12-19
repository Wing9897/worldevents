# 🚀 Deployment Guide for Judges

This guide is designed to get the World Events Dashboard running on your local machine in under 5 minutes.

## Prerequisites

- **Docker Desktop** (installed and running)
- **Git**

## ⚡ Quick Start (Recommended)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/worldevents.git
    cd worldevents
    ```

2.  **Setup Environment**
    ```bash
    # Windows (PowerShell)
    copy .env.example .env
    
    # Mac/Linux
    cp .env.example .env
    ```

3.  **Run with Docker**
    ```bash
    docker-compose up -d --build
    ```

4.  **Access the App**
    👉 [http://localhost:9333](http://localhost:9333)

## 🔧 Advanced Configuration (Optional)

You can edit `.env` to customize the experience, though default values work perfectly for a demo.

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET_KEY` | Secures user sessions | `dev_secret_key` |
| `SOCIAL_X` | Adds X (Twitter) link to sidebar | (empty) |
| `OFFICIAL_WALLETS`| Comma-separated wallet addresses to give "Official" badge | (empty) |

## ❓ Troubleshooting

**Q: The map is blank?**
A: Right-click anywhere on the map to create a new event! The database starts fresh.

**Q: Cannot login?**
A: Ensure you have the [Phantom Wallet](https://phantom.app/) extension installed in your browser.

**Q: Port 9333 is in use?**
A: Edit `docker-compose.yml` and change `"9333:80"` to `"8080:80"` or another free port.

<div align="center">
  <img src="bonkpay-frontend/src/assets/bonk.png" alt="BonkPay Logo" width="200"/>

  # ⚡ BonkPay
  <h3>
    <strong>Your Gateway to Multi-Chain Transactions</strong>
  </h3>

  <p align="center">
    Experience seamless crypto management across Ethereum and Solana chains
  </p>

  <br/>

  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white" alt="Ethereum"/>
    <img src="https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=Solana&logoColor=white" alt="Solana"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  </div>

  <br/>

  <p align="center">
    <strong>🔒 Non-Custodial</strong> &nbsp;•&nbsp;
    <strong>⚡ Fast</strong> &nbsp;•&nbsp;
    <strong>🛡️ Secure</strong> &nbsp;•&nbsp;
    <strong>🌈 Modern UI</strong>
  </p>
</div>

<div align="center">
  <h2>🎥 Watch BonkPay in Action</h2>
  
  [![BonkPay Demo](https://img.youtube.com/vi/SJ6JZ5TfxQk/maxresdefault.jpg)](https://www.youtube.com/watch?v=SJ6JZ5TfxQk)
  
  <p><em>Click the image to watch the demo video!</em></p>
</div>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%" style="padding: 20px;">
        <img width="48" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="security"/>
        <br/>
        <strong>Secure Key Generation</strong>
        <br/>
        <sub>Military-grade encryption</sub>
      </td>
      <td align="center" width="25%" style="padding: 20px;">
        <img width="48" src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/eth.svg" alt="eth"/>
        <br/>
        <strong>ETH Transactions</strong>
        <br/>
        <sub>Fast & secure transfers</sub>
      </td>
      <td align="center" width="25%" style="padding: 20px;">
        <img width="48" src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/sol.svg" alt="sol"/>
        <br/>
        <strong>SOL Transfers</strong>
        <br/>
        <sub>Lightning-quick sends</sub>
      </td>
      <td align="center" width="25%" style="padding: 20px;">
        <img width="48" src="https://raw.githubusercontent.com/primer/octicons/main/icons/graph-24.svg" alt="tracking"/>
        <br/>
        <strong>Balance Tracking</strong>
        <br/>
        <sub>Real-time updates</sub>
      </td>
    </tr>
  </table>
</div>

## 🏗️ Architecture

```mermaid
graph TD
    A[Frontend - React] --> B[Backend - Node.js]
    B --> C[MongoDB]
    B --> D[Ethereum Network]
    B --> E[Solana Network]
    style A fill:#20232A,stroke:#61DAFB,stroke-width:2px,color:#fff
    style B fill:#68A063,stroke:#3C873A,stroke-width:2px,color:#fff
    style C fill:#4DB33D,stroke:#3FA037,stroke-width:2px,color:#fff
    style D fill:#3C3C3D,stroke:#8A92B2,stroke-width:2px,color:#fff
    style E fill:#9945FF,stroke:#14F195,stroke-width:2px,color:#fff
```

## 💻 Tech Stack

<div align="center">
<table>
<tr>
<td width="50%">

### 🎨 Frontend
```javascript
{
  "framework": "React 18.2 + Vite",
  "styling": "TailwindCSS",
  "web3": {
    "ethereum": "ethers.js",
    "solana": "@solana/web3.js"
  },
  "state": "React Hooks",
  "api": "Axios"
}
```

</td>
<td width="50%">

### ⚙️ Backend
```javascript
{
  "runtime": "Node.js + Express",
  "database": "MongoDB + Mongoose",
  "security": "Bcrypt",
  "networks": {
    "eth": "Sepolia Testnet",
    "sol": "Devnet"
  }
}
```

</td>
</tr>
</table>
</div>

## 🚀 Quick Setup

<details>
<summary><b>📝 Installation Steps</b></summary>

```bash
# Clone repository
git clone https://github.com/yourusername/bonkpay.git

# Install frontend dependencies
cd bonkpay-frontend
npm install

# Install backend dependencies
cd ../bonkpay-backend
npm install

# Configure environment
cp .env.example .env

# Launch development servers
npm run dev
```
</details>

## 🔐 Security Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%" style="padding: 20px;">
        <img width="48" src="https://raw.githubusercontent.com/primer/octicons/main/icons/shield-check-24.svg" alt="wallet-security"/>
        <h3>🛡️ Wallet Security</h3>
        <ul align="left">
          <li>Non-custodial key management</li>
          <li>Encrypted storage</li>
          <li>Secure key generation</li>
        </ul>
      </td>
      <td align="center" width="50%" style="padding: 20px;">
        <img width="48" src="https://raw.githubusercontent.com/primer/octicons/main/icons/lock-24.svg" alt="transaction-security"/>
        <h3>🔒 Transaction Security</h3>
        <ul align="left">
          <li>Real-time validation</li>
          <li>Status monitoring</li>
          <li>Balance verification</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 🌐 Connect

<div align="center">
  <a href="https://twitter.com/VagabondBushido">
    <img src="https://img.shields.io/badge/Follow_@VagabondBushido-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"/>
  </a>
</div>

<br/>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:3C3C3D,50:9945FF,100:14F195&height=100&section=footer" width="100%"/>
  
  <p>
    <sub>Built with 💜 by ME</sub>
  </p>
</div>
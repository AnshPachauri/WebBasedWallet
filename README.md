# 🔐 Crypto Wallet Generator

A secure web-based application to generate and manage cryptocurrency wallets right from the browser. Built with **React**, **Vite**, **Tailwind CSS**, and **Elliptic Curve Cryptography** using the `bip39` and `elliptic` libraries.

> ⚠️ All key generation and recovery happens locally in the browser — **nothing is sent to a server**.

---

## ✨ Features

- **Generate Wallet**  
  Create a new wallet and view the generated **private and public keys**.
  
- **Import Wallet**  
  Optionally enter an existing **12-word recovery phrase** to regenerate your keys.

- **Toggle Visibility**  
  Show or hide sensitive data (mnemonic and private keys) for enhanced security.

- **Copy to Clipboard**  
  Quickly copy private keys, public keys, and recovery phrase with one click.

---

## ⚙️ Generating a Wallet

- Generates a secure 12-word **mnemonic phrase**.
- Converts the mnemonic into a **seed** using `bip39`.
- Derives a set number of **private/public key pairs** using `elliptic` (secp256k1).
- Keys and recovery phrase are displayed securely in the UI.

---

## 📥 Importing a Wallet

- Paste an existing **12-word mnemonic** to regenerate the exact keys.
- Seed and keys are derived exactly as in wallet generation.
- Mnemonic is validated before key derivation.

---

## 🛡️ Visibility Toggle

- Private keys and recovery phrase can be **masked** with asterisks.
- Toggle buttons allow **secure viewing or hiding** of sensitive data.

---

## 📋 Clipboard Copy

- Every private key, public key, and the recovery phrase has a **copy button**.
- Visual feedback is shown when copied.

---

## 🧱 Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [bip39](https://github.com/bitcoinjs/bip39)
- [elliptic](https://github.com/indutny/elliptic)
- [lucide-react](https://lucide.dev/)

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/webbasedwallet.git
cd webbasedwallet
npm install
npm run dev

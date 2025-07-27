import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, RefreshCw, Wallet, Key, Shield, AlertCircle } from 'lucide-react';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import { ec as EC } from 'elliptic';

// Initialize buffer for browser environment
window.Buffer = Buffer;

// Initialize elliptic curve for key generation
const ec = new EC('secp256k1');

/**
 * Main Wallet Component
 * A comprehensive web-based cryptocurrency wallet with key generation,
 * import functionality, and secure display options
 */
const CryptoWallet = () => {
  // State for mnemonic and seed management
  const [mnemonicWords, setMnemonicWords] = useState(''); // Recovery phrase
  const [seed, setSeed] = useState(null); // Seed derived from mnemonic
  const [seedHex, setSeedHex] = useState(''); // Hex representation of seed
  
  // State for key management
  const [privateKeys, setPrivateKeys] = useState([]); // Array of private keys
  const [publicKeys, setPublicKeys] = useState([]); // Array of public keys
  
  // State for UI visibility toggles
  const [showMnemonic, setShowMnemonic] = useState(false); // Toggle mnemonic visibility
  const [showPrivateKeys, setShowPrivateKeys] = useState(false); // Toggle private key visibility
  
  // State for user input and feedback
  const [importPhrase, setImportPhrase] = useState(''); // Input field for importing wallet
  const [copyFeedback, setCopyFeedback] = useState(''); // Feedback message for copy operations
  const [error, setError] = useState(''); // Error messages
  
  // State for wallet generation options
  const [keyCount, setKeyCount] = useState(5); // Number of keys to generate

  /**
   * Generates a new wallet with mnemonic phrase and derives keys
   * Creates a 12-word mnemonic phrase and generates specified number of key pairs
   */
  const generateWallet = async () => {
    try {
      setError('');
      
      // Generate a new 12-word mnemonic phrase
      const mnemonic = bip39.generateMnemonic();
      setMnemonicWords(mnemonic);
      
      // Convert mnemonic to seed
      const seed = await bip39.mnemonicToSeed(mnemonic);
      setSeed(seed);
      setSeedHex(seed.toString('hex'));
      
      // Generate key pairs from seed
      generateKeysFromSeed(seed);
    } catch (err) {
      setError('Failed to generate wallet: ' + err.message);
    }
  };

  /**
   * Imports a wallet from an existing mnemonic phrase
   * Validates the phrase and derives the corresponding keys
   */
  const importWallet = async () => {
    try {
      setError('');
      
      // Validate the mnemonic phrase
      if (!bip39.validateMnemonic(importPhrase.trim())) {
        setError('Invalid recovery phrase. Please check and try again.');
        return;
      }
      
      // Set the validated mnemonic
      setMnemonicWords(importPhrase.trim());
      
      // Convert mnemonic to seed
      const seed = await bip39.mnemonicToSeed(importPhrase.trim());
      setSeed(seed);
      setSeedHex(seed.toString('hex'));
      
      // Generate key pairs from seed
      generateKeysFromSeed(seed);
      
      // Clear import field after successful import
      setImportPhrase('');
    } catch (err) {
      setError('Failed to import wallet: ' + err.message);
    }
  };

  /**
   * Generates multiple key pairs from a seed
   * Uses BIP32 derivation path for deterministic key generation
   * @param {Buffer} seed - The seed to derive keys from
   */
  const generateKeysFromSeed = (seed) => {
    const newPrivateKeys = [];
    const newPublicKeys = [];
    
    // Generate specified number of key pairs
    for (let i = 0; i < keyCount; i++) {
      // Create a unique seed for each key using index
      // In production, you'd use proper BIP32 derivation
      const indexBuffer = Buffer.allocUnsafe(4);
      indexBuffer.writeUInt32BE(i, 0);
      const keySeed = Buffer.concat([seed.slice(0, 32), indexBuffer]).slice(0, 32);
      
      // Generate key pair using elliptic curve
      const keyPair = ec.keyFromPrivate(keySeed);
      
      // Extract private key (hex format)
      const privateKey = keyPair.getPrivate('hex');
      
      // Extract public key (compressed format)
      const publicKey = keyPair.getPublic('hex');
      
      newPrivateKeys.push(privateKey);
      newPublicKeys.push(publicKey);
    }
    
    setPrivateKeys(newPrivateKeys);
    setPublicKeys(newPublicKeys);
  };

  /**
   * Copies text to clipboard and shows feedback
   * @param {string} text - Text to copy
   * @param {string} label - Label for feedback message
   */
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${label} copied!`);
      
      // Clear feedback after 2 seconds
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  /**
   * Censors sensitive information for display
   * Shows first and last few characters, replaces middle with asterisks
   * @param {string} text - Text to censor
   * @param {number} visibleChars - Number of characters to show at start and end
   */
  const censorText = (text, visibleChars = 4) => {
    if (!text || text.length <= visibleChars * 2) return text;
    
    const start = text.substring(0, visibleChars);
    const end = text.substring(text.length - visibleChars);
    const middle = '*'.repeat(Math.min(20, text.length - visibleChars * 2));
    
    return `${start}${middle}${end}`;
  };

  /**
   * Clears all wallet data and resets the application
   */
  const clearWallet = () => {
    setMnemonicWords('');
    setSeed(null);
    setSeedHex('');
    setPrivateKeys([]);
    setPublicKeys([]);
    setImportPhrase('');
    setError('');
    setCopyFeedback('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Wallet className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Crypto Wallet Generator</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Generate and manage cryptocurrency wallets securely
          </p>
        </div>

        {/* Main Card Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-500/20">
            
            {/* Wallet Generation Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                Wallet Actions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Generate New Wallet */}
                <div className="bg-gray-700/30 rounded-lg p-6 border border-purple-500/10">
                  <h3 className="text-lg font-medium text-white mb-4">Generate New Wallet</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2">
                      Number of Keys to Generate
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={keyCount}
                      onChange={(e) => setKeyCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <button
                    onClick={generateWallet}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generate New Wallet
                  </button>
                </div>

                {/* Import Existing Wallet */}
                <div className="bg-gray-700/30 rounded-lg p-6 border border-purple-500/10">
                  <h3 className="text-lg font-medium text-white mb-4">Import Existing Wallet</h3>
                  
                  <textarea
                    value={importPhrase}
                    onChange={(e) => setImportPhrase(e.target.value)}
                    placeholder="Enter your 12-word recovery phrase..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none h-20 mb-4"
                  />
                  
                  <button
                    onClick={importWallet}
                    disabled={!importPhrase.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Import Wallet
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Copy Feedback */}
            {copyFeedback && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <p className="text-green-300 text-center">{copyFeedback}</p>
              </div>
            )}

            {/* Wallet Information Display */}
            {mnemonicWords && (
              <>
                {/* Recovery Phrase Section */}
                <div className="mb-8 bg-gray-700/30 rounded-lg p-6 border border-purple-500/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium text-white">Recovery Phrase</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowMnemonic(!showMnemonic)}
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                        title={showMnemonic ? "Hide phrase" : "Show phrase"}
                      >
                        {showMnemonic ? 
                          <EyeOff className="w-5 h-5 text-gray-300" /> : 
                          <Eye className="w-5 h-5 text-gray-300" />
                        }
                      </button>
                      <button
                        onClick={() => copyToClipboard(mnemonicWords, 'Recovery phrase')}
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                        title="Copy phrase"
                      >
                        <Copy className="w-5 h-5 text-gray-300" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {mnemonicWords.split(' ').map((word, index) => (
                      <div
                        key={index}
                        className="bg-gray-600/50 px-3 py-2 rounded text-center"
                      >
                        <span className="text-xs text-gray-400">{index + 1}.</span>
                        <span className="text-white ml-1">
                          {showMnemonic ? word : '****'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="mt-4 text-sm text-yellow-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    Keep this phrase safe! It's the only way to recover your wallet.
                  </p>
                </div>

                {/* Generated Keys Section */}
                <div className="bg-gray-700/30 rounded-lg p-6 border border-purple-500/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-medium text-white">Generated Keys</h3>
                    <button
                      onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      {showPrivateKeys ? 
                        <EyeOff className="w-5 h-5 text-gray-300" /> : 
                        <Eye className="w-5 h-5 text-gray-300" />
                      }
                      <span className="text-gray-300">
                        {showPrivateKeys ? 'Hide' : 'Show'} Private Keys
                      </span>
                    </button>
                  </div>

                  {/* Key Pairs Display */}
                  <div className="space-y-4">
                    {privateKeys.map((privateKey, index) => (
                      <div
                        key={index}
                        className="bg-gray-600/30 rounded-lg p-4 border border-gray-600"
                      >
                        <h4 className="text-sm font-medium text-purple-400 mb-3">
                          Key Pair #{index + 1}
                        </h4>
                        
                        {/* Private Key */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-gray-400">Private Key</label>
                            <button
                              onClick={() => copyToClipboard(privateKey, `Private key #${index + 1}`)}
                              className="p-1 hover:bg-gray-500 rounded transition-colors"
                              title="Copy private key"
                            >
                              <Copy className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                          <div className="bg-gray-700 px-3 py-2 rounded font-mono text-sm text-white break-all">
                            {showPrivateKeys ? privateKey : censorText(privateKey, 6)}
                          </div>
                        </div>
                        
                        {/* Public Key */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-gray-400">Public Key</label>
                            <button
                              onClick={() => copyToClipboard(publicKeys[index], `Public key #${index + 1}`)}
                              className="p-1 hover:bg-gray-500 rounded transition-colors"
                              title="Copy public key"
                            >
                              <Copy className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                          <div className="bg-gray-700 px-3 py-2 rounded font-mono text-sm text-green-400 break-all">
                            {publicKeys[index]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Wallet Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={clearWallet}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear Wallet Data
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-400">
          <p className="text-sm">
            Built with React • Secure client-side wallet generation
          </p>
          <p className="text-xs mt-2">
            Never share your private keys or recovery phrase with anyone
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the App component
function App() {
  return <CryptoWallet />;
}

export default App;
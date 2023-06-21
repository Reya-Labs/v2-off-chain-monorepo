import * as React from 'react';
import * as detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

// Create the WalletContext
export const WalletContext = React.createContext({});

// Create the WalletContextProvider component
export const WalletContextProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [account, setAccount] = React.useState('');
  const [signer, setSigner] = React.useState(null);
  const connect = async () => {
    if (account) {
      return;
    }
    setLoading(true);
    const externalProvider = await detectEthereumProvider();
    if (externalProvider) {
      try {
        const provider = new ethers.providers.Web3Provider(
          externalProvider as ethers.providers.ExternalProvider,
        );
        await provider.send('eth_requestAccounts', []);
        const newSigner = provider.getSigner();
        const walletAddress = await newSigner.getAddress();
        setAccount(walletAddress);
        setSigner(newSigner);
        setLoading(false);
      } catch (err) {
        setError((err as Error)?.message || JSON.stringify(err));
        setLoading(false);
        setSigner(null);
        setAccount('');
        return undefined;
      }
    } else {
      setError('Metamask not installed');
      setLoading(false);
      setSigner(null);
      setAccount('');
    }
  };

  // Define the context value
  const contextValue = {
    loading,
    connect,
    error,
    account,
    signer,
    isLoggedIn: Boolean(account),
  };

  return (
    // Provide the context value to the children components
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

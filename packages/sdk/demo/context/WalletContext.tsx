import * as React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

type WalletContextValue = {
  loading: boolean;
  connect: () => Promise<void>;
  error: string | null;
  account: string | null;
  signer: ethers.providers.JsonRpcSigner | null;
  isLoggedIn: boolean;
  provider: ethers.providers.JsonRpcProvider | null;
};

// Create the WalletContext
export const WalletContext = React.createContext<WalletContextValue>({
  loading: false,
  connect: () => Promise.resolve(),
  error: '',
  account: '',
  signer: null,
  isLoggedIn: false,
  provider: null,
});

// Create the WalletContextProvider component
export const WalletContextProvider: React.FunctionComponent = ({
  children,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [account, setAccount] = React.useState('');
  const [signer, setSigner] =
    React.useState<ethers.providers.JsonRpcSigner | null>(null);
  const [provider, setProvider] =
    React.useState<ethers.providers.JsonRpcProvider | null>(null);
  const connect = async () => {
    if (account) {
      return;
    }
    setLoading(true);
    const externalProvider = await detectEthereumProvider();
    if (externalProvider) {
      try {
        const newProvider = new ethers.providers.Web3Provider(
          externalProvider as ethers.providers.ExternalProvider,
        );
        await newProvider.send('eth_requestAccounts', []);
        const newSigner = newProvider.getSigner();
        const walletAddress = await newSigner.getAddress();
        setAccount(walletAddress);
        setProvider(newProvider);
        setSigner(newSigner);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        setSigner(null);
        setProvider(null);
        setAccount('');
        return undefined;
      }
    } else {
      setError('Metamask not installed');
      setLoading(false);
      setSigner(null);
      setProvider(null);
      setAccount('');
    }
  };

  // Define the context value
  const contextValue: WalletContextValue = {
    loading,
    connect,
    error,
    account,
    signer,
    isLoggedIn: Boolean(account),
    provider,
  };

  return (
    // Provide the context value to the children components
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

import { createContext, useEffect, useState } from "react";

export const Coincontext = createContext();

const CoincontextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });
  
  const fetchAllcoin = async () => {
    setLoading(true);
    
    const baseUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${Currency.name}`;
    
    try {
      // Use CORS proxy for development (CoinGecko free/demo API doesn't allow browser CORS)
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(baseUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Only set if response is an array (not an error object)
      if (Array.isArray(data)) {
        setAllCoin(data);
      } else {
        console.error('API returned non-array:', data);
      }
    } catch (err) {
      console.error('CORS proxy fetch failed:', err);
      
      // Fallback: Try direct API with demo key (works in production with proper CORS config)
      try {
        const response = await fetch(baseUrl, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-cg-demo-api-key': 'CG-TySVKzxCbgbJxFj3KRJD14ZN'
          }
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAllCoin(data);
        }
      } catch (fallbackErr) {
        console.error('Direct API fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllcoin();
  }, [Currency.name]);

  const contextValue = {
    allCoin,
    Currency,
    setCurrency,
    loading,
  };

  return (
    <Coincontext.Provider value={contextValue}>
      {props.children}
    </Coincontext.Provider>
  );
};

export default CoincontextProvider;

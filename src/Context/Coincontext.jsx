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
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-dem0-api-key':
            'CG-TySVKzxCbgbJxFj3KRJD14ZN'}
    };
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${Currency.name}`,options)
    .then(response => response.json())
    .then(response => {
      setAllCoin(response);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
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

import { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

import { InputWithSelect } from 'components';
import './App.css';

const API_KEY = '3ae66e45c814cec3d85720c651da34b3';
const BASE_URL = `http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

function App() {
  const { addToast } = useToasts();
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [sourceCurrency, setSourceCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [amountInSourceCurrency, setAmountInSourceCurrency] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  let targetAmount, sourceAmount;
  if (amountInSourceCurrency) {
    sourceAmount = amount;
    targetAmount = amount * exchangeRate;
  } else {
    targetAmount = amount;
    sourceAmount = amount / exchangeRate;
  }

  const handleSourceAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInSourceCurrency(true);
  };

  const handleTargetAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInSourceCurrency(false);
  };

  useEffect(() => {
    const fetchCurrencyDesc = async () => {
      setIsLoading(true);
      await fetch(
        `http://api.exchangeratesapi.io/v1/symbols?access_key=${API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          setCurrencyOptions([...Object.entries(data.symbols)]);
          setIsLoading(false);
        })
        .catch((errors) => {
          setIsLoading(false);
          addToast(
            errors?.response?.data?.message ||
              errors?.message ||
              'Something went wrong!',
            { appearance: 'error' }
          );
        });
    };
    fetchCurrencyDesc();
  }, []);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      setIsLoading(true);

      await fetch(`${BASE_URL}`)
        .then((response) => response.json())
        .then((data) => {
          const firstCurrency = Object.keys(data.rates)[0];
          setSourceCurrency(data.base);
          setTargetCurrency(firstCurrency);
          setExchangeRate(data.rates[firstCurrency]);
          setIsLoading(false);
        })
        .catch((errors) => {
          setIsLoading(false);

          addToast(
            errors?.response?.data?.message ||
              errors?.message ||
              'Something went wrong!',
            { appearance: 'error' }
          );
        });
    };
    fetchCurrencyRates();
  }, [addToast, currencyOptions]);

  useEffect(() => {
    if (sourceCurrency != null && targetCurrency != null) {
      setIsLoading(true);
      fetch(`${BASE_URL}&base=${sourceCurrency}&symbols=${targetCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          if (data.error) {
            addToast(data.error.message, { appearance: 'warning' });
          } else {
            setExchangeRate(data.rates[targetCurrency]);
          }
        })
        .catch((errors) => {
          setIsLoading(false);
          addToast(
            errors?.response?.data?.message ||
              errors?.message ||
              'Something went wrong!',
            { appearance: 'error' }
          );
        });
    }
  }, [sourceCurrency, targetCurrency]);

  return (
    <main className="App">
      <section>
        <h1>Web Currency Converter</h1>

        {isLoading ? (
          <p className="info-text">Loading ...</p>
        ) : (
          <section>
            <p className="info-text">{`1 ${sourceCurrency} equals ${exchangeRate} ${targetCurrency}`}</p>
            <small className="info-text-date">As at: {`${new Date().toUTCString()}`}</small>
          </section>
        )}
        <hr />
      </section>

      <section className="input-wrapper">
        <InputWithSelect
          label={'Source Currency'}
          amount={sourceAmount}
          currencyOptions={currencyOptions}
          selectedCurrency={sourceCurrency}
          handleInputChange={handleSourceAmountChange}
          handleCurrencyChange={(e) => setSourceCurrency(e.target.value)}
        />
        <br />
        <InputWithSelect
          label={'Target Currency'}
          amount={targetAmount}
          currencyOptions={currencyOptions}
          selectedCurrency={targetCurrency}
          handleInputChange={handleTargetAmountChange}
          handleCurrencyChange={(e) => setTargetCurrency(e.target.value)}
        />
      </section>

      <section>
        <small>
          Data provided by{' '}
          <a href="https://exchangeratesapi.io/">Exchangerates API</a> for
          Currency{' '}
        </small>
      </section>
    </main>
  );
}

export default App;

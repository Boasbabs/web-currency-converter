import { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

import { InputWithSelect } from 'components';
import { FETCH_SYMBOLS_URL, FETCH_CURRENCIES_URL } from './constants';
import styles from './App.module.scss';

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

  const fetchCurrenciesFullname = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(FETCH_SYMBOLS_URL);
      const data = await response.json();
      setCurrencyOptions(Object.entries(data.symbols));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      addToast(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong!',
        { appearance: 'error' }
      );
    }
  };

  const fetchCurrencyRates = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(FETCH_CURRENCIES_URL);
      const data = await response.json();
      const firstCurrency = Object.keys(data.rates)[0];
      setSourceCurrency(data.base);
      setTargetCurrency(firstCurrency);
      setExchangeRate(data.rates[firstCurrency]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      addToast(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong!',
        { appearance: 'error' }
      );
    }
  };

  useEffect(() => {
    fetchCurrenciesFullname();
  }, []);

  useEffect(() => {
    fetchCurrencyRates();
  }, [addToast, currencyOptions]);

  useEffect(() => {
    if (sourceCurrency != null && targetCurrency != null) {
      setIsLoading(true);
      fetch(
        `${FETCH_CURRENCIES_URL}&base=${sourceCurrency}&symbols=${targetCurrency}`
      )
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
    <main className={styles.App}>
      <section>
        <h1>Web Currency Converter</h1>

        {isLoading ? (
          <p className="info-text">Loading ...</p>
        ) : (
          <section>
            <p className="info-text">{`1 ${sourceCurrency} equals ${exchangeRate} ${targetCurrency}`}</p>
            <small className="info-text-date">
              As at: {`${new Date().toUTCString()}`}
            </small>
          </section>
        )}
        <hr />
      </section>

      <section className="">
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
        <p>
          <small>
            <strong>NOTE: </strong> 'EURO' is the only Source currency supported
            due to the API Free tier plan
          </small>
        </p>
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

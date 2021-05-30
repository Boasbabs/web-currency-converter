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
    fetch(`${BASE_URL}`)
      .then((response) => response.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([...Object.keys(data.rates)]);
        setSourceCurrency(data.base);
        setTargetCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      })
      .catch((errors) => {
        addToast(
          errors?.response?.data?.message ||
            errors?.message ||
            'Something went wrong!',
          { appearance: 'error' }
        );
      });
  }, []);

  useEffect(() => {
    if (sourceCurrency != null && targetCurrency != null) {
      fetch(`${BASE_URL}&base=${sourceCurrency}&symbols=${targetCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            addToast(data.error.message, { appearance: 'warning' });
          } else {
            setExchangeRate(data.rates[targetCurrency]);
          }
        })
        .catch((errors) => {
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
    <div className="App">
      <h1>Web Currency Converter</h1>
      <h3>{`1 ${sourceCurrency} equals ${exchangeRate} ${targetCurrency}`}</h3>
      <hr />
      <br />
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

      <small>
        Data provided by{' '}
        <a href="https://exchangeratesapi.io/">Exchangerates API</a> for
        Currency{' '}
      </small>
    </div>
  );
}

export default App;

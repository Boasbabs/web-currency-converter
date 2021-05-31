import styles from './InputWithSelect.module.scss';

const InputWithSelect = ({ amount, label, currencyOptions, selectedCurrency, handleCurrencyChange, handleInputChange }) => {

  const showCurrencyOptions = () => {
    return currencyOptions.length > 0 ? (
      currencyOptions.map((currency) => (
        <option key={currency[0]} value={currency[0]}>
          {currency[1]}
        </option>
      ))
    ) : (
      <option value="">No data</option>
    );
  };

  return (
    <div className={styles.InputWithSelect}>
      <label htmlFor="currencyAmount" className={styles.label}>
        {label}
      </label>
      <input
        name="currencyAmount"
        value={amount}
        type="number"
        aria-label="Currency Amount Field"
        className={styles.input}
        onChange={handleInputChange}
      />
      <select
        name="currencyType"
        id="currencyType"
        aria-label="Currency Type"
        className={styles.select}
        value={selectedCurrency}
        onChange={handleCurrencyChange}
      >
        {showCurrencyOptions()}
      </select>
    </div>
  );
};

export default InputWithSelect;

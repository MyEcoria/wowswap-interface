"use client";

import React, { useEffect } from "react";
import { Card, CardBody, Chip, Input, Button as NextButton } from "@nextui-org/react";
import { Button, Divider, InputNumber, Select, Tag } from "antd";
import { MdSwapCalls } from "react-icons/md";
import Decimal from "decimal.js";
import axios from "axios";

interface CryptoCurrency {
  ticker: string;
  name: string;
  image: string;
  feeless: boolean;
  hasExternalId?: boolean;
  network?: string;
}

interface CryptoData {
  [key: string]: CryptoCurrency;
}

interface OptionType {
  value: string;
  label: React.ReactNode;
  ticker?: string;
}

export const Swap = () => {
  const [fromAmount, setFromAmount] = React.useState(1);
  const [toAmount, setToAmount] = React.useState(10);
  const [fromCurrency, setFromCurrency] = React.useState("XNO");
  const [toCurrency, setToCurrency] = React.useState("WOW");
  const [toAddress, setToAddress] = React.useState("");
  const [limits, setLimits] = React.useState({ from: "XNO", to: "WOW", min: 0.01, max: 100 });
  const [disabled, setDisabled] = React.useState(false);
  const [cryptoData, setCryptoData] = React.useState<CryptoData>({});
  const [errorSwap, setErrorSwap] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.wowswap.uk/all-currencies");
        setCryptoData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (limits.min > fromAmount) {
      setFromAmount(limits.min);
    }

    if (limits.max < fromAmount) {
      setFromAmount(limits.max);
    }
  }, [fromAmount, toAmount, fromCurrency, toCurrency, limits]);

  const options: OptionType[] = Object.keys(cryptoData)
  .filter(key => cryptoData[key]) // Ensure the currency exists
  .map((key): OptionType => {
    const currency = cryptoData[key];
    return {
      value: key,
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={currency.image}
            alt={currency.name}
            style={{ width: 20, marginRight: 8 }}
          />
          {currency.ticker.toUpperCase()}
          {currency.network &&
          currency.ticker.toUpperCase() !== currency.network.toUpperCase() ? (
            <>
              <span className="pl-2" />
              <Tag>{currency.network}</Tag>
            </>
          ) : null}
        </div>
      ),
    };
  });

  useEffect(() => {
    console.log("update limits");
    console.log(fromCurrency);
    axios.get(`https://api.wowswap.uk/get-limits?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}`)
      .then(response => {
        if (response.data && response.data.min) {
          setLimits({ from: response.data.from, to: response.data.to, min: Number(new Decimal(response.data.min).times(1.05)), max: Number(new Decimal(response.data.max).times(0.95)) });
        }
      })
      .catch(error => {
        console.error('Error fetching limits:', error);
      })
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    console.log(fromAmount);
    console.log(fromCurrency);
    console.log(toCurrency);
    if (fromAmount !== 0 && fromAmount !== null) {
      axios.get(`https://api.wowswap.uk/get-estimate?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}&amount=${fromAmount}`)
        .then(response => {
          if (response.data && response.data.amountTo) {
            setToAmount(response.data.amountTo.toFixed(6));
          }
        })
        .catch(error => {
          console.error('Error fetching estimate:', error);
        })
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  const onChangeFromAmount = (value: number | null) => {
    if (value !== null && value !== 0) {
      setFromAmount(value)
    }
  };

  const onChangeToAmount = (value: number | null) => {
    if (value !== null) {
      setToAmount(value)
      axios.get(`https://api.wowswap.uk/get-estimate-reverse?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}&amount=${value}`)
        .then(response => {
          if (response.data && response.data.amountTo) {
            setFromAmount(response.data.amountTo);
          }
        })
        .catch(error => {
          console.error('Error fetching reverse estimate:', error);
        })
    }
  };

  const onSwitch = () => {
    const to = toAmount;
    const fromC = fromCurrency;
    const toC = toCurrency;

    setFromCurrency(toC);
    setToCurrency(fromC);
    setFromAmount(to);
  };

  const onFinish = async () => {
    setDisabled(true);
    if (fromCurrency && toCurrency && fromAmount && toAddress) {
      const dataToSend = {
        from: fromCurrency.toUpperCase(),
        to: toCurrency.toUpperCase(),
        amount: fromAmount,
        toAddress: toAddress
      };
      console.error(dataToSend);
      const headers = {
        'Content-Type': 'application/json',
      };

      try {
        const response = await axios.post(`https://api.wowswap.uk/create-order`, dataToSend, { headers });

        if (response.data.error || response.data.status == "error") {
          setErrorSwap(true);
        }

        if (response.data && response.data.id) {
          if (response.data.partnerId) {
            window.location.href = `/order-all/${response.data.partnerId}`;
          } else {
            window.location.href = `/order/${response.data.id}`;
          }
        } else {
          setDisabled(false);
          console.error('Error: Invalid response from server');
        }
      } catch (error) {
        setDisabled(false);
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex justify-center">
            <InputNumber
              size="large"
              min={limits.min}
              max={limits.max}
              value={fromAmount}
              controls={false}
              onChange={onChangeFromAmount}
              addonBefore={
                <Select
                  size="large"
                  showSearch
                  style={{
                    width: '150px',
                  }}
                  filterOption={(input, option) =>
                    (typeof option?.value === 'string' && option.value.toLowerCase().includes(input.toLowerCase())) ||
                    (typeof option?.ticker === 'string' && option.ticker.toLowerCase().includes(input.toLowerCase()))
                  }
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  options={options}
                  value={fromCurrency}
                  onChange={setFromCurrency}
                />
              }
            />
          </div>
          <span className="pt-2"/>
          <Button icon={<MdSwapCalls size={20}/>} className="ml-auto" onClick={onSwitch}/>
          <span className="pb-2"/>
          <InputNumber
            size="large"
            value={toAmount}
            controls={false}
            onChange={onChangeToAmount}
            disabled={toCurrency !== "XNO" && toCurrency !== "WOW"}
            addonBefore={
              <Select
                size="large"
                showSearch
                style={{
                  width: '150px',
                }}
                filterOption={(input, option) =>
                  (typeof option?.value === 'string' && option.value.toLowerCase().includes(input.toLowerCase())) ||
                  (typeof option?.ticker === 'string' && option.ticker.toLowerCase().includes(input.toLowerCase()))
                }
                placeholder="Search to Select"
                optionFilterProp="children"
                options={options}
                value={toCurrency}
                onChange={setToCurrency}
              />
            }
          />

          <Divider orientation="left" plain>
            Destination Address
          </Divider>
          <Input 
            placeholder={toCurrency !== "WOW" && toCurrency !== "XNO" ? "Your address" : toCurrency === "XNO" ? "nano_" : "WW..."} 
            size="lg" 
            value={toAddress} 
            onChange={(e) => setToAddress(e.target.value)}
          />
          { errorSwap ? (
            <><span className="pt-5" /><Chip color="danger">An error has occurred</Chip></>
          ) : (
            null
          )}
          <span className="pt-5"/>
          { disabled ? (
            <NextButton color="primary" onClick={onFinish} isDisabled>
              Loading...
              <img src="/loading.gif" alt="loading" width="40px"/>
            </NextButton>
          ) : (
            <NextButton color="primary" onClick={onFinish}>
              Swap
            </NextButton>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
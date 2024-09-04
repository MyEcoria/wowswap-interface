"use client";

import React, { useEffect } from "react";
import {Card, CardBody, Input, Button as NextButton, Select as NextSelect, SelectItem} from "@nextui-org/react";
import { Button, Divider, InputNumber, Select } from "antd";
import { MdSwapCalls } from "react-icons/md";
import axios from "axios";

const options = [
    {
        value: "xno",
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://xno.nano.org/images/xno-badge-blue.svg" alt="XNO" style={{ width: 20, marginRight: 8 }} />
                XNO
            </div>
        ),
    },
    // {
    //     value: "ban",
    //     label: (
    //         <div style={{ display: 'flex', alignItems: 'center' }}>
    //             <img src="https://banano.cc/presskit/banano-icon.svg" alt="BAN" style={{ width: 20, marginRight: 8 }} />
    //             BAN
    //         </div>
    //     ),
    // },
    // {
    //     value: "ana",
    //     label: (
    //         <div style={{ display: 'flex', alignItems: 'center' }}>
    //             <img src="https://nanswap.com/logo/ANA.png" alt="ANA" style={{ width: 20, marginRight: 8 }} />
    //             ANA
    //         </div>
    //     ),
    // },
    // {
    //     value: "xdg",
    //     label: (
    //         <div style={{ display: 'flex', alignItems: 'center' }}>
    //             <img src="https://dogenano.io/static/media/XDG.023c3302.png" alt="XDG" style={{ width: 20, marginRight: 8 }} />
    //             XDG
    //         </div>
    //     ),
    // },
    // {
    //     value: "xro",
    //     label: (
    //         <div style={{ display: 'flex', alignItems: 'center' }}>
    //             <img src="https://raw.githubusercontent.com/MyEcoria/pilium/master/assets/logo.png" alt="XRO" style={{ width: 20, marginRight: 8 }} />
    //             XRO
    //         </div>
    //     ),
    // },
    {
        value: "wow",
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://wownero.org/img/Wownero_Logo_ico.ico" alt="WOW" style={{ width: 20, marginRight: 8 }} />
                WOW
            </div>
        ),
    },
];

export const Swap = () => {
    const [fromAmount, setFromAmount] = React.useState(1);
    const [toAmount, setToAmount] = React.useState(10);
    const [fromCurrency, setFromCurrency] = React.useState("xno");
    const [toCurrency, setToCurrency] = React.useState("wow");
    const [toAddress, setToAddress] = React.useState("");
    const [limits, setLimits] = React.useState({"from": "XNO","to": "WOW","min": 0.01,"max": 100 });
    
    useEffect(() => {
        console.log("update limits");
		axios.get(`https://swap.pilou.cc/get-limits?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}`)
		  .then(response => {
			if (response.data && response.data.min) {
			  setLimits(response.data);
			}
		  })
		  .catch(error => {
			console.error('Error fetching email:', error);
		  })
	}, [fromCurrency, toCurrency]);

    useEffect(() => {
        console.log(fromAmount);
        console.log(fromCurrency);
        console.log(toCurrency);
        if (fromAmount !== 0 && fromAmount !== null) {
            axios.get(`https://swap.pilou.cc/get-estimate?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}&amount=${fromAmount}`)
            .then(response => {
                if (response.data && response.data.amountTo) {
                setToAmount(response.data.amountTo);
                }
            })
            .catch(error => {
                console.error('Error fetching email:', error);
            })
        }
	}, [fromCurrency, toCurrency, fromAmount]);

    // useEffect(() => {
	// 	axios.get(`https://swap.pilou.cc/get-estimate-reverse?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}&amount=${toAmount}`)
	// 	  .then(response => {
	// 		if (response.data && response.data.amountTo) {
	// 		  setFromAmount(response.data.amountTo);
	// 		}
	// 	  })
	// 	  .catch(error => {
	// 		console.error('Error fetching email:', error);
	// 	  })
	// }, [fromCurrency, toCurrency, toAmount]);

    const onChangeFromAmount = (value: any) => {
        if (value !== null && value !== 0) {
            setFromAmount(value)
        }
      };

    const onChangeToAmount = (value: any) => {
        setToAmount(value)
        axios.get(`https://swap.pilou.cc/get-estimate-reverse?from=${fromCurrency.toUpperCase()}&to=${toCurrency.toUpperCase()}&amount=${toAmount}`)
		  .then(response => {
			if (response.data && response.data.amountTo) {
			  setFromAmount(response.data.amountTo);
			}
		  })
		  .catch(error => {
			console.error('Error fetching email:', error);
		  })
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
        if (fromCurrency && toCurrency && fromAmount && toAddress) {
            // Créez un objet avec les données à envoyer
            const dataToSend = {
            from: fromCurrency.toUpperCase(),
            to: toCurrency.toUpperCase(),
            amount: fromAmount,
            toAddress: toAddress
            };
            console.error(dataToSend);
            // Créez un objet d'en-tête avec le type de contenu JSON
            const headers = {
            'Content-Type': 'application/json',
            };
        
            try {
            // Effectuez la requête POST avec l'en-tête JSON spécifié
            const response = await axios.post(`https://swap.pilou.cc/create-order`, dataToSend, { headers });
        
            // Vérifiez si la réponse contient un champ "success" (le token du cookie)
            if (response.data && response.data.id) {
                
                window.location.href = `/order/${response.data.id}`;
            } else {
                console.error('Error: Invalid response from server');
            }
            } catch (error) {
            console.error('Error:', error);
            }
        }
    };

  return (
    <div >
    <Card>
      <CardBody>
      <div className="flex justify-center">
      <InputNumber
        size="large" // Utilisez "lg" pour une taille plus grande
        min={limits.min} 
        max={limits.max}
        value={fromAmount.toFixed(4)}
        controls={false}
        onChange={onChangeFromAmount}
        addonBefore={
            <Select
                size="large" // Utilisez "lg" pour une taille plus grande
                showSearch
                style={{
                    width: '120px',
                }}
                placeholder="Search to Select"
                optionFilterProp="label"
                options={options}
                value={fromCurrency}
            />
        }
    />
        </div>
        <span className="pt-2"/>
        <Button icon={<MdSwapCalls size={20}/>} className="ml-auto" onClick={onSwitch}/>
        <span className="pb-2"/>
        <InputNumber
            size="large"
            value={toAmount.toFixed(4)}
            controls={false}
            onChange={onChangeToAmount}
            addonBefore={
                <Select
                    size="large" // Utilisez "lg" pour une taille plus grande
                    showSearch
                    style={{
                        width: '120px',
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    options={options}
                    value={toCurrency}
                />
            }
        />

        <Divider orientation="left" plain>
            Destination Address
        </Divider>
        <Input placeholder={toCurrency == "wow" ? "WW..." : "nano_"} size="lg" value={toAddress} onValueChange={setToAddress}/>
        <span className="pt-5"/>
        <NextButton color="primary" onClick={onFinish}>
            Swap
        </NextButton>
        </CardBody>
    </Card>
    </div>
  );
};
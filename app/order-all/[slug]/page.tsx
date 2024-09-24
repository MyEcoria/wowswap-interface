"use client";
import {
  Badge,
  Col,
  Descriptions,
  Result,
  Row,
  Steps,
  Table,
  Button,
} from "antd";
import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import axios from "axios";
import { AiOutlineWallet } from "react-icons/ai";
import { TbWorld } from "react-icons/tb";
import QRCode from "react-qr-code";
import Link from "next/link";
import BigNumber from "bignumber.js";

export default function Page({ params }: { params: { slug: string } }) {
  const data = params.slug;
  const [swapInfo, setSwapInfo] = React.useState({
    id: "d7d59d",
    fromAmount: 22.593649625267666,
    toAmount: 0.8923299652034261,
    status: "pending",
    from: "WOW",
    to: "XNO",
    payinAddress:
      "WW2bAW9RAAk1tJ9nWDn77VF23Qrx3tuA9gRrPcNob1rBawmKVt6mvDo1PoN7DUGkL3ifq38gfAq1af4MfgD13sN31xg6j9ZJe",
    payoutAddress:
      "nano_3ktmq6dpwcc694hrnjzfdykbqeuj4w5w8nut3uqm5pgwa4m9jmstoc4ntu6p",
    payinHash: "nop",
    payoutHash: "nop",
    extraId: null
  });
  const [requetStat, setRequetStat] = React.useState(false);
  const [status, setStatus] = React.useState(0);
  const [statusStep, setStatusStep] = React.useState("process");

  useEffect(() => {
    // Définir l'intervalle pour actualiser toutes les 10 secondes
    const reqInfo = () => {
      axios
        .get(`https://api.wowswap.uk/get-order-all?id=${data}`)
        .then((response) => {
          if (response.data && response.data.id) {
            console.log(response.data.status);
            setSwapInfo(response.data);

            // Mettre à jour le statut en fonction de la réponse
            if (response.data.status === "pending") {
              setStatus(0);
            } else if (
              response.data.status === "exchanging" ||
              response.data.status === "sending"
            ) {
              setStatus(2);
            } else if (response.data.status === "detected") {
              setStatus(1);
            } else if (response.data.status === "completed") {
              setStatus(3);
            } else if (response.data.status === "error") {
              setStatusStep("error");
            }

            setRequetStat(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } // 10000 millisecondes = 10 secondes

	reqInfo();
	const interval = setInterval(() => {
		reqInfo();
	  }, 10000); // 10000 millisecondes = 10 secondes

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      key: "1",
      label: "Amount to send",
      children: <p>{swapInfo.fromAmount.toFixed(7)}</p>,
    },
    {
      key: "2",
      label: "Send to address",
      children: <p>{swapInfo.payinAddress}</p>,
    },
    {
      key: "3",
      label: "Estimated price",
      children: (
        <p>
          1 {swapInfo.from} ≈{" "}
          {(swapInfo.toAmount / swapInfo.fromAmount).toFixed(4)} {swapInfo.to}
        </p>
      ),
    },
    {
      key: "4",
      label: "Destination address",
      children: <p>{swapInfo.payoutAddress}</p>,
    },
  ];

  const itemsExtraId = [
    {
      key: "1",
      label: "Amount to send",
      children: <p>{swapInfo.fromAmount.toFixed(7)}</p>,
    },
    {
      key: "2",
      label: "Send to address",
      children: <p>{swapInfo.payinAddress}</p>,
    },
    {
      key: "3",
      label: "Extra id/memo",
      children: <p>{swapInfo.extraId ? swapInfo.extraId : null}</p>,
    },
    {
      key: "4",
      label: "Estimated price",
      children: (
        <p>
          1 {swapInfo.from} ≈{" "}
          {(swapInfo.toAmount / swapInfo.fromAmount).toFixed(4)} {swapInfo.to}
        </p>
      ),
    },
    {
      key: "5",
      label: "Destination address",
      children: <p>{swapInfo.payoutAddress}</p>,
    },
  ];

  const itemsFinish = [
    {
      key: "1",
      label: "Amount sent",
      children: <p>{swapInfo.toAmount ? swapInfo.toAmount : 0}</p>,
    },
    {
      key: "2",
      label: "Sent to address",
      children: <p>{swapInfo.payoutAddress ? swapInfo.payoutAddress : 0}</p>,
    },
    {
      key: "3",
      label: "Executed price",
      children: (
        <p>
          1 {swapInfo.from} ≈{" "}
          {(swapInfo.toAmount / swapInfo.fromAmount).toFixed(4)} {swapInfo.to}
        </p>
      ),
    },
    {
      key: "4",
      label: "Block",
      children: (
        <p>
          <Link
            href={
              swapInfo.to !== "XNO" && swapInfo.to !== "WOW" && swapInfo.to !== "BAN" && swapInfo.to !== "ANA" && swapInfo.to !== "XRO" && swapInfo.to !== "XDG"
                ? swapInfo.payoutHash
                : swapInfo.to == "XNO" || swapInfo.to == "BAN" || swapInfo.to == "ANA" || swapInfo.to == "XRO" || swapInfo.to == "XDG" ? `https://nanexplorer.com/all/block/${swapInfo.payoutHash}` : `https://explorer.suchwow.xyz/tx/${swapInfo.payoutHash}`
            }
          >
            {swapInfo.payoutHash}
          </Link>
        </p>
      ),
    },
  ];

  return (
    <>
      {requetStat == true ? (
        <div>
          <Card>
            <CardHeader>
              <Steps
                size="default"
                current={status}
                status={statusStep == "process" ? "process" : "error"}
                items={[
                  {
                    title: "Waiting deposit",
                  },
                  {
                    title: "Detected",
                  },
                  {
                    title: "Sending",
                  },
                  {
                    title: "Completed",
                  },
                ]}
              />
            </CardHeader>
            <Divider className="hidden sm:block" />
            <CardBody>
              {statusStep == "error" ? (
                <div className="flex flex-col items-center">
                  <Card>
                    <CardBody>
                      Unfortunately there was an error, we have received the
                      problem and it will be resolved in less than 3 hours
                    </CardBody>
                  </Card>
                </div>
              ) : null}
            </CardBody>
            {status !== 3 ? (
              <>
                <CardBody>
                  <div className="hidden sm:block">
                    <Row>
                      <Col span={12}>
                        <Descriptions
                          bordered
                          column={1} // Affiche les éléments en colonne
                          labelStyle={{ fontWeight: "bold" }}
                          contentStyle={{ whiteSpace: "pre-wrap" }} // Préserve les retours à la ligne
                        >
                          { swapInfo.extraId !== null && swapInfo.extraId !== false ? (
                            itemsExtraId.map((item) => (
                              <Descriptions.Item
                                key={item.key}
                                label={item.label}
                              >
                                {item.children}
                              </Descriptions.Item>
                            ))
                        ) : (
                          items.map((item) => (
                            <Descriptions.Item
                              key={item.key}
                              label={item.label}
                            >
                              {item.children}
                            </Descriptions.Item>
                          ))
                        )}
                        </Descriptions>
                      </Col>
                      <Col span={12} className="pl-5">
                      { swapInfo.from.toUpperCase() == "XNO" || swapInfo.from.toUpperCase() == "WOW" ? (
                        <Card className="max-w-[90%]">
                          <CardHeader>
                            <h2 className="pl-[40%] font-bold text-1xl">
                              Pay with a wallet
                            </h2>
                          </CardHeader>
                          <Divider />
                          <CardBody>
                          {swapInfo.from.toUpperCase() === "XNO" ? (
                              <div className="flex justify-center gap-4">
                                <Link
                                  href={`nano:${swapInfo.payinAddress}?amount=${new BigNumber(swapInfo.fromAmount).multipliedBy(new BigNumber(10).pow(30)).toFixed()}`}
                                >
                                  <Button className="w-40">
                                    <AiOutlineWallet /> Natrium
                                  </Button>
                                </Link>
                                <Link
                                  href={`https://nault.cc/send?to=${swapInfo.payinAddress}&amount=${swapInfo.fromAmount}`}
                                >
                                  <Button className="w-40">
                                    <TbWorld /> Nault
                                  </Button>
                                </Link>
                              </div>
                            ) : (
                              <div className="flex justify-center gap-4">
                                <Link href={`wonero:${swapInfo.payinAddress}`}>
                                  <Button className="w-40">
                                    <AiOutlineWallet /> Cake Wallet
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      ) : (
                        null
                      )}
                        <div className="pt-5">
                          <Card className="max-w-[90%]">
                            <CardHeader>
                              <h2 className="pl-[40%] font-bold text-1xl">
                                Pay with QR Code
                              </h2>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                              {" "}
                              {/* Utilisation de flex pour aligner les boutons horizontalement */}
                              <div className="flex justify-center gap-4">
                                <QRCode
                                  value={swapInfo.payinAddress}
                                  size={160}
                                />
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="sm:hidden flex flex-col items-center">
                    {" "}
                    {/* Conteneur principal centré */}
                    <Descriptions
                      bordered
                      column={1} // Affiche les éléments en colonne
                      labelStyle={{ fontWeight: "bold" }}
                      contentStyle={{ whiteSpace: "pre-wrap" }} // Préserve les retours à la ligne
                    >
                      {items.map((item) => (
                        <Descriptions.Item key={item.key} label={item.label}>
                          {item.children}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                    {swapInfo.from == "XNO" ? (
                      <div className="flex justify-center gap-4 pt-5">
                        <Link
                          href={`nano:${swapInfo.payinAddress}?amount=${new BigNumber(swapInfo.fromAmount).multipliedBy(new BigNumber(10).pow(30)).toFixed()}`}
                        >
                          <Button className="w-35">
                            <AiOutlineWallet /> Natrium
                          </Button>
                        </Link>
                        <Link
                          href={`https://nault.cc/send?to=${swapInfo.payinAddress}&amount=${swapInfo.fromAmount}`}
                        >
                          <Button className="w-35">
                            <TbWorld /> Nault
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-4 pt-5">
                        <Link href={`wonero:${swapInfo.payinAddress}`}>
                          <Button className="w-40">
                            <AiOutlineWallet /> Cake Wallet
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardBody>
              </>
            ) : (
              <CardBody>
                <Result
                  status="success"
                  title="Transaction completed"
                  extra={[
                    <Link href="/" key={1}>
                      <Button type="primary" key="console">
                        Swap again
                      </Button>
                    </Link>,
                  ]}
                />
                <Descriptions
                  bordered
                  column={1} // Affiche les éléments en colonne
                  labelStyle={{ fontWeight: "bold" }}
                  contentStyle={{ whiteSpace: "pre-wrap" }} // Préserve les retours à la ligne
                >
                  {itemsFinish.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                      {item.children}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </CardBody>
            )}
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <img src="/loading.gif" alt="loading" />
        </div>
      )}
    </>
  );
}

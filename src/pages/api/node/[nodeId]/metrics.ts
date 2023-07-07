import { faker } from "@faker-js/faker";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { MetricsType } from "../../../../types/metrics.type";
import { PriceHistoryType } from "../../../../types/priceHistory.type";

const PRICE_HISTORY_LENGTH = 50;

const createPriceHistory = (
  startDate: number,
  endDate: number
): PriceHistoryType => {
  const priceHistory: PriceHistoryType = {
    timestamp: faker.datatype
      .datetime({
        min: new Date(startDate).getTime(),
        max: new Date(endDate).getTime(),
      })
      .getTime(),
    price: faker.datatype.number({
      max: 0.5,
      min: 0.01,
      precision: 0.01,
    }),
  };
  return priceHistory;
};

const aggregatePriceHistoryByDay = (
  priceHistory: PriceHistoryType[]
): PriceHistoryType[] => {
  const aggregatedPriceHistory: PriceHistoryType[] = [];
  priceHistory.forEach((priceHistory) => {
    const day = new Date(priceHistory.timestamp).getDate();
    const month = new Date(priceHistory.timestamp).getMonth();
    const year = new Date(priceHistory.timestamp).getFullYear();
    const timestamp = new Date(year, month, day).getTime();
    const aggregatedPriceHistoryItem = aggregatedPriceHistory.find(
      (item) => item.timestamp === timestamp
    );
    if (aggregatedPriceHistoryItem) {
      aggregatedPriceHistoryItem.price =
        (aggregatedPriceHistoryItem.price + priceHistory.price) / 2;
    } else {
      aggregatedPriceHistory.push({
        timestamp,
        price: priceHistory.price,
      });
    }
  });
  return aggregatedPriceHistory;
};

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { query, method } = req;
    await NextCors(req, res, {
      // Options
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    switch (method) {
      case "GET":
        const personalPriceHistory: PriceHistoryType[] = Array.from({
          length: PRICE_HISTORY_LENGTH,
        })
          .map(() =>
            createPriceHistory(
              parseInt(query.startDate as string),
              parseInt(query.endDate as string)
            )
          )
          .sort((a, b) => a.timestamp - b.timestamp);

        const marketPriceHistory = Array.from({
          length: PRICE_HISTORY_LENGTH,
        })
          .map(() =>
            createPriceHistory(
              parseInt(query.startDate as string),
              parseInt(query.endDate as string)
            )
          )
          .sort((a, b) => a.timestamp - b.timestamp);

        const aggregatedPersonalPriceHistory =
          aggregatePriceHistoryByDay(personalPriceHistory);
        const aggregatedMarketPriceHistory =
          aggregatePriceHistoryByDay(marketPriceHistory);

        const averagePrice =
          Math.round(
            (personalPriceHistory.reduce((acc, cur) => acc + cur.price, 0) /
              personalPriceHistory.length) *
              1000
          ) / 1000;

        const amountCommunity = faker.datatype.number({
          min: 20,
          max: 70,
        });
        const amountNetwork = 100 - amountCommunity;

        const totalAmount = faker.datatype.number({
          max: 1000000,
          min: 1000,
          precision: 100,
        });

        const metrics: MetricsType = {
          averagePrice,
          totalAmount,
          amountNetwork,
          amountCommunity,
          personalPriceHistory: aggregatedPersonalPriceHistory,
          marketPriceHistory: aggregatedMarketPriceHistory,
        };
        res.status(200).json(metrics);
        break;
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error?.message });
  }
}

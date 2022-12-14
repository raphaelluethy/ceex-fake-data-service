import { PriceHistoryType } from './priceHistory.type';

export type MetricsType = {
	averagePrice: number; // average selling or buying price
	totalAmount: number; // total amount sold/bought
	// the pricehistory should be aggregated by DAY, so ONE datapoint for each day
	personalPriceHistory: PriceHistoryType[];
	// prices from the market
	marketPriceHistory: PriceHistoryType[];
	amountCommunity: number; // kWh sold OR bought to/from community
	amountNetwork: number; // kWh sold OR bought to/from network
};

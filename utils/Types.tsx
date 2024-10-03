export interface ICoins {
    id: string
    name: string
    symbol: string
    rank: number
    high?: number
    quotes: {
        USD: {
            market_cap: number | 0
            price: number | 0
            volume_24h: number | 0
            volume_24h_change_24h: number | 0
            percent_change_15m: number | 0
            percent_change_30m: number | 0
            percent_change_1h: number | 0
            percent_change_6h: number | 0
            percent_change_12h: number | 0
            percent_change_24h: number | 0
        }
    }
}

export interface PriceChartProps {
    data: ICoins;
}
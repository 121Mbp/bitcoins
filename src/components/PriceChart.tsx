import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions, Tooltip } from 'chart.js'
import { PriceChartProps } from '../../utils/Types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
)

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
    const labels = [ '24h', '12h', '6h', '1h', '30m', '15m' ]
    const currentPrice = data.quotes?.USD.price
    const percentChange15m = data.quotes?.USD.percent_change_15m || 0
    const percentChange30m = data.quotes?.USD.percent_change_30m || 0
    const percentChange1h = data.quotes?.USD.percent_change_1h || 0
    const percentChange6h = data.quotes?.USD.percent_change_6h || 0
    const percentChange12h = data.quotes?.USD.percent_change_12h || 0
    const percentChange24h = data.quotes?.USD.percent_change_24h || 0
    const pastPrice15m = currentPrice * (1 + percentChange15m / 100)
    const pastPrice30m = currentPrice * (1 + percentChange30m / 100)
    const pastPrice1h = currentPrice * (1 + percentChange1h / 100)
    const pastPrice6h = currentPrice * (1 + percentChange6h / 100)
    const pastPrice12h = currentPrice * (1 + percentChange12h / 100)
    const pastPrice24h = currentPrice * (1 + percentChange24h / 100)

    const priceData = {
        labels,
        datasets: [
          {
            label: '(%)',
            data: [
                pastPrice24h,
                pastPrice12h,
                pastPrice6h,
                pastPrice1h,
                pastPrice30m,
                pastPrice15m,
            ],
            borderColor: 'rgba(255,255,255,1)',
            borderWidth: 2,
            pointRadius: 1,
          },
        ],
    }

    const options: ChartOptions<'line'> = {
        scales: {
            x: { display: false },
            y: { display: false }
        }
    }

    return (
        <Line data={priceData} options={options} />
    )
}

export default PriceChart
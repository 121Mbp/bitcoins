import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ICoins } from '../../utils/Types'
import { currency } from './Format'
import PriceChart from './PriceChart'

const BASE_URL = `https://api.coinpaprika.com/v1`

const TableLayout = styled.div`
    width: 100%;
    max-width: 1280px;
    min-width: 1080px;
    margin: 0 auto;
    padding: 2rem;
`

const RowTable = styled.div<{ type?: string; color?: string }>`
    position: relative;
    display: flex;
    height: ${(props) => props.type === 'head' ? `2rem`: '3.6rem'};
    margin: .8rem 0 0 0;
    color: #fff;
    background: ${(props) => props.color};
    box-shadow: 0 1px 10px rgba(0, 0, 0, .1);
    > span {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: ${(props) => props.type === 'head' ? 'center!important' : 'end'};
        font-weight: bold;
        font-size: .8rem;
        padding: 0 1.2rem;
        > img {
            width: 1.4rem;
            margin-right: .8rem;
        }
        &:nth-child(1) { width: 5%; }
        &:nth-child(2) { 
            width: 25%;
            justify-content: start;
        }
        &:nth-child(3) { width: 15%; }
        &:nth-child(4) { width: 10%; }
        &:nth-child(5) { width: 15%; }
        &:nth-child(6) { 
            width: 12%; 
            justify-content: center;
        }
        &:nth-child(7) { 
            width: 18%; 
            padding: .2rem;
            justify-content: center;
        }
    }
`

const RatePercent = styled.span<{ rate: number }>`
    color: ${(props) => props.rate > 0 ? '#0645ad' : '#e15241'}
`

const List = () => {
    const [data, setData] = useState<ICoins[]>([])
    const [item, setItem] = useState<ICoins[]>([])
    const [page, setPage] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const observerRef = useRef<HTMLDivElement | null>(null)
    const ITEMS_PER_PAGE = 10

    const fetchData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/tickers`)
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data.length === 0) {
            setLoading(true)
            fetchData()
        }
    }, [])
    
    const itemsPaging = () => {
        const start = (page - 1) * ITEMS_PER_PAGE
        const end = page * ITEMS_PER_PAGE
        const newItems = data.slice(start, end)
        setItem((prev) => [...prev, ...newItems])
        setLoading(false)
    }

    useEffect(() => {
        if (data.length > 0 && loading) {
            itemsPaging()
        }
    }, [page, data])
        
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            if (entry.isIntersecting && !loading) {
                setLoading(true)
                setPage((prev) => prev + 1)
            }
        })
        if (observerRef.current) observer.observe(observerRef.current)
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current)
        }
    }, [loading])

    return (
        <TableLayout>
            <RowTable type='head'>
                <span>#</span>
                <span>Name</span>
                <span>Market Cap</span>
                <span>Price</span>
                <span>Volume(24h)</span>
                <span>Change(24h)</span>
                <span>Price Graph(24h)</span>
            </RowTable>
            {item?.map((coin, idx) => {
                const pastPrice = coin.quotes?.USD.price * (1 + coin.quotes?.USD.percent_change_24h / 100)
                const currnetPrice = ((coin.quotes?.USD.price - pastPrice) / pastPrice) * 100
                return (
                    <RowTable color='#0E224C' key={`${coin.id}-${idx}`}>
                        <span>{coin.rank}</span>
                        <span>
                            <img src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`} alt={coin.name} />
                            {coin.name} ({coin.symbol})
                        </span>
                        <span>{currency.format(coin.quotes?.USD.market_cap)}</span>
                        <span>{currency.format(coin.quotes?.USD.price)}</span>
                        <span>{currency.format(coin.quotes?.USD.volume_24h)}</span>
                        <RatePercent rate={currnetPrice}>{`${currnetPrice.toFixed(2)}%`}</RatePercent>
                        <span><PriceChart data={coin} /></span>
                    </RowTable>
                )
            })}
            <div ref={observerRef}>Lead</div>
        </TableLayout>
    )
}

export default List;
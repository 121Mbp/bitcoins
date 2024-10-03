import { useEffect, useState } from "react"
import styled from "styled-components"

interface Coin {
    id: string
    name: string
    symbol: string
    rank: number
    high?: number
}

const nameSpace = `https://api.coinpaprika.com/v1/coins`
const TableLayout = styled.div`
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
`

const RowTable = styled.div`
    position: relative;
    display: flex;
    height: 3.2rem;
    margin: .8rem 0 0 0;
    color: #fff;
    background: ${(props) => props.color};
    box-shadow: 0 1px 10px rgba(0, 0, 0, .1);
    > span {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: .8rem;
        > img {
            width: 1.6rem;
        }
        &:nth-child(1) { 
            width: 4rem; 
            font-weight: bold;
        }
        &:nth-child(2) { width: 6rem; }
        &:nth-child(3) { width: 16rem; }
        &:nth-child(4) { width: auto; }
        &:nth-child(5) { width: 20rem; }
        &:nth-child(6) { width: 12rem; }
    }
`

const List = () => {
    const [data, setData] = useState<Coin[]>([])
    const [page, setPage] = useState<number>(1)
    const ITEMS_PER_PAGE = 10

    const fetchData = async () => {
        const response = await fetch(nameSpace)
        const result = await response.json()
        setData(result)
    }

    useEffect(() => {
        if (data.length === 0) {
            fetchData()
        }
    }, [ data ])

    const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    
    useEffect(() => {
        if(paginatedData.length > 0 && paginatedData[0]?.id) {      
            
            const marketData = async () => {
                const response = await fetch(`${nameSpace}/${paginatedData[0]?.id}/ohlcv/latest`)
                const info = await response.json()
                console.log(info)

                setData((prev: Coin[]) => {
                    return prev.map((coin, index) => {
                        if (index === 0) {
                            return { ...coin, high: info.high}
                        }
                        return coin
                    })
                })
                console.log(data)
            } 
            marketData()
        }        
    }, [])
    
    return (
        <TableLayout>
            <RowTable>
                <span>#</span>
                <span>Name</span>
                <span>Market</span>
                <span>Price</span>
                <span>Change(24h)</span>
                <span>Price Graph(7d)</span>
            </RowTable>
            {paginatedData?.map(coin => (
                <RowTable color='#0E224C' key={coin.id}>
                    <span>{coin.rank}</span>
                    <span><img src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`} alt={coin.name} /></span>
                    <span>{coin.name}</span>
                    <span>Symbol: {coin.symbol}</span>
                    <span>Price</span>
                    <span>Price</span>
                </RowTable>
            ))}
        </TableLayout>
    )
}

export default List;
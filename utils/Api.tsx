const BASE_URL = `https://api.coinpaprika.com/v1`

export const fetchCoins = async () => {
    return await fetch(`${BASE_URL}/coins.json`).then(response => response.json())
}
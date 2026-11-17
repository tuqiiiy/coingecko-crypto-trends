import { Actor, log } from 'apify';
import { gotScraping } from 'got-scraping';

await Actor.init();

const input = (await Actor.getInput()) || {};
const {
    mode = 'trending',
    limit = 50,
    proxyConfiguration,
} = input;

const proxyConfig = proxyConfiguration ? await Actor.createProxyConfiguration(proxyConfiguration) : undefined;

log.info('--- Starting CoinGecko Crypto Trends Scraper ---');
log.info(`Mode: ${mode}`);

const proxyUrl = proxyConfig ? await proxyConfig.newUrl() : undefined;

try {
    if (mode === 'topMarkets') {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${Math.min(limit, 100)}&page=1`;
        log.info(`Fetching top market coins from: ${url}`);

        const response = await gotScraping({
            url,
            proxyUrl,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'accept': 'application/json',
            },
            responseType: 'json',
            timeout: { request: 20000 },
            retry: { limit: 2 },
        });

        const coins = response.body;
        if (Array.isArray(coins)) {
            for (let i = 0; i < coins.length; i++) {
                const c = coins[i];
                const record = {
                    name: c.name || '',
                    symbol: (c.symbol || '').toUpperCase(),
                    marketCapRank: c.market_cap_rank || i + 1,
                    priceUsd: c.current_price !== undefined ? `$${c.current_price.toLocaleString()}` : null,
                    priceRaw: c.current_price || 0,
                    marketCap: c.market_cap ? `$${c.market_cap.toLocaleString()}` : null,
                    high24h: c.high_24h || null,
                    low24h: c.low_24h || null,
                    priceChange24hPercent: c.price_change_percentage_24h ? `${c.price_change_percentage_24h.toFixed(2)}%` : null,
                    logoUrl: c.image || null,
                    slug: c.id || '',
                    scrapedAt: new Date().toISOString(),
                };
                await Actor.pushData(record);
                log.info(`[${i + 1}] ${record.name} (${record.symbol}) | Price: ${record.priceUsd} | 24h: ${record.priceChange24hPercent}`);
            }
            log.info(`\n🎉 Successfully saved ${coins.length} top market coins!`);
        }
    } else {
        // Mode: trending
        const url = 'https://api.coingecko.com/api/v3/search/trending';
        log.info(`Fetching trending tokens from: ${url}`);

        const response = await gotScraping({
            url,
            proxyUrl,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'accept': 'application/json',
            },
            responseType: 'json',
            timeout: { request: 20000 },
            retry: { limit: 2 },
        });

        const trendingCoins = response.body?.coins || [];
        log.info(`Found ${trendingCoins.length} trending coins.`);

        for (let i = 0; i < trendingCoins.length; i++) {
            const item = trendingCoins[i].item || {};
            const record = {
                name: item.name || '',
                symbol: (item.symbol || '').toUpperCase(),
                marketCapRank: item.market_cap_rank || null,
                scoreRank: item.score !== undefined ? item.score + 1 : i + 1,
                priceBtc: item.price_btc ? `${item.price_btc.toFixed(8)} BTC` : null,
                priceUsd: item.data?.price ? `$${Number(item.data.price).toFixed(4)}` : null,
                priceChange24hPercent: item.data?.price_change_percentage_24h?.usd ? `${item.data.price_change_percentage_24h.usd.toFixed(2)}%` : null,
                thumb: item.thumb || null,
                largeLogo: item.large || null,
                slug: item.slug || item.id || '',
                scrapedAt: new Date().toISOString(),
            };
            await Actor.pushData(record);
            log.info(`[Rank #${record.scoreRank}] ${record.name} (${record.symbol}) | MC Rank: #${record.marketCapRank || 'N/A'}`);
        }
        log.info(`\n🎉 Successfully saved ${trendingCoins.length} trending coins!`);
    }
} catch (err) {
    log.error(`Failed to scrape CoinGecko: ${err.message}`);
}

await Actor.exit();

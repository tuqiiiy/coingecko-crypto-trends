# 🪙 CoinGecko Crypto Trends & Market Mover Scraper

Extract real-time trending cryptocurrency tokens, top market movers, USD/BTC prices, market cap ranks, and 24-hour price changes from **CoinGecko**.

---

## 🌟 Why Use CoinGecko Crypto Scraper?

Crypto markets move 24/7. This lightweight Actor provides an automated feed of the most searched, trending, and top market-cap tokens directly to JSON, CSV, or Excel.

* 🔥 **Real-Time Trending Search:** Scrape the top trending coins identified by CoinGecko's search popularity.
* 📊 **Top Market Cap Tokens:** Extract Bitcoin, Ethereum, Solana, and top 100 altcoins with live prices and 24h performance.
* 🤖 **Automated Bots & Channels:** Easily integrate with Telegram, Discord bots, or Google Sheets via webhooks.
* ⚡ **Ultra-Fast & Cost-Free:** Pure API calls that execute in under 2 seconds.

---

## 📥 Input Options

| Parameter | Type | Default | Description |
|---|---|---|---|
| `mode` | String | `"trending"` | `"trending"` (most searched tokens) or `"topMarkets"` (top market cap tokens). |
| `limit` | Integer | `50` | Number of tokens to extract in topMarkets mode (up to 100). |
| `proxyConfiguration` | Object | `null` | Optional proxy configuration. |

---

## 📤 Sample Output (JSON)

```json
{
  "name": "Solana",
  "symbol": "SOL",
  "marketCapRank": 4,
  "scoreRank": 1,
  "priceUsd": "$184.25",
  "priceChange24hPercent": "+5.42%",
  "slug": "solana",
  "scrapedAt": "2026-11-17T12:20:00.000Z"
}
```

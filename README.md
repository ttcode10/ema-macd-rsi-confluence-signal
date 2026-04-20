**Title:**
`EMA + MACD + RSI Confluence Signal`

---

**Description:**

This indicator identifies high-probability trend reversal and continuation points by requiring three independent momentum conditions to align simultaneously before printing a signal. Once a signal is printed, no duplicate is shown until the opposite side triggers — keeping your chart clean and unambiguous.

**Signal Logic**

A **BUY** label appears when the last of the following three conditions falls into place while the other two are already active:
- 9 EMA crosses above 20 EMA (bullish alignment)
- MACD line crosses above Signal line (golden cross)
- RSI crosses above its own 14-period EMA (momentum shift)

A **SELL** label appears on the mirror-image bearish confluence.

Signals alternate strictly: after a BUY, no further BUY labels appear until a SELL is confirmed, and vice versa.

**Confluence Ribbon**

The ribbon filled between the 9 EMA and 20 EMA reflects real-time signal strength across **6 conditions**:

| # | Condition | Bull | Bear |
|---|-----------|------|------|
| 1 | EMA alignment | Fast > Slow | Fast < Slow |
| 2 | MACD cross | MACD > Signal | MACD < Signal |
| 3 | RSI cross | RSI > RSI EMA | RSI < RSI EMA |
| 4 | RSI level | RSI > 50 | RSI < 50 |
| 5 | RSI EMA level | RSI EMA > 50 | RSI EMA < 50 |
| 6 | MACD histogram | Histogram > 0 | Histogram < 0 |

The ribbon fades from nearly transparent (1 condition) to solid color (all 6), giving you an at-a-glance read of how strong the current trend environment is — even between signals.

**Settings**

| Parameter | Default | Description |
|-----------|---------|-------------|
| Fast EMA | 9 | Fast EMA period |
| Slow EMA | 20 | Slow EMA period |
| MACD Fast | 12 | MACD fast length |
| MACD Slow | 26 | MACD slow length |
| MACD Signal | 9 | MACD signal smoothing |
| RSI Length | 14 | RSI period |
| RSI EMA Length | 14 | EMA applied to RSI |
| RSI Level | 50 | Midline for conditions 4 & 5 |

**How to Use**

1. Add the indicator to any chart and timeframe. Works on all assets.
2. Watch the ribbon color: green = bullish pressure building, red = bearish. The more opaque, the more conditions are aligned.
3. Wait for a **BUY** or **SELL** label — this is your signal entry bar.
4. Use the ribbon between signals to gauge whether the trend is holding or weakening.
5. Set an alert via right-click → Add Alert on the indicator for hands-free notification.

**Tips**
- Higher timeframes (15m, 1H) produce fewer but higher-quality signals.
- A strong ribbon (5–6 conditions) that precedes a label increases conviction.
- Combine with support/resistance or session levels for best results.

---

**Tags to add on TradingView:**
`ema` `macd` `rsi` `confluence` `crossover` `trend` `momentum` `signal` `ribbon` `swing`
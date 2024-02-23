function createTradingViewWidget() {
  const container = document.createElement("div");
  container.className = "stock-container";
  container.id = "tradingview-widget";
  container.style.zIndex = "1000"; // Set a higher z-index value

  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
  script.type = "text/javascript";
  script.async = true;
  script.innerHTML = `
  {
    "symbols": [
      [
        "Apple",
        "AAPL|1D|GBP"
      ],
      [
        "Google",
        "GOOGL|1D|GBP"
      ],
      [
        "Microsoft",
        "MSFT|1D|GBP"
      ],
      [
        "EASYMARKETS:OILUSD|1D|GBP"
      ],
      [
        "BITSTAMP:BTCUSD|1D"
      ],
      [
        "FX:GBPUSD|1D"
      ],
      [
        "NASDAQ:NVDA|1D"
      ],
      [
        "NASDAQ:META|1D"
      ],
      [
        "NASDAQ:TSLA|1D"
      ],
      [
        "NASDAQ:NFLX|1D"
      ],
      [
        "CRYPTOCAP:DOGE|1D"
      ],
      [
        "NASDAQ:AMD|1D"
      ],
      [
        "NYSE:MCD|1D"
      ],
      [
        "TVC:GOLD|1D"
      ]
    ],
    "chartOnly": false,
    "width": "100%",
    "height": "100%",
    "locale": "en",
    "colorTheme": "dark",
    "autosize": true,
    "showVolume": false,
    "showMA": false,
    "hideDateRanges": false,
    "hideMarketStatus": false,
    "hideSymbolLogo": false,
    "scalePosition": "right",
    "scaleMode": "Normal",
    "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
    "fontSize": "10",
    "noTimeScale": false,
    "valuesTracking": "1",
    "changeMode": "price-and-percent",
    "chartType": "candlesticks",
    "maLineColor": "#2962FF",
    "maLineWidth": 1,
    "maLength": 9,
    "gridLineColor": "rgba(255, 255, 255, 0.49)",
    "backgroundColor": "rgba(42, 46, 57, 1)",
    "widgetFontColor": "rgba(255, 255, 255, 1)",
    "lineType": 0,
    "dateRanges": [
      "1d|1",
      "1w|30",
      "1m|30",
      "3m|60",
      "12m|1D",
      "60m|1W",
      "all|1M"
    ],
    "upColor": "rgba(110, 173, 237, 1)",
    "downColor": "#f7525f",
    "borderUpColor": "rgba(110, 173, 237, 1)",
    "borderDownColor": "#f7525f",
    "wickUpColor": "rgba(110, 173, 237, 1)",
    "wickDownColor": "#f7525f"
  }`;
  
      container.appendChild(script);

      const copyright = document.createElement("div");
      copyright.className = "tradingview-widget-copyright";
      const link = document.createElement("a");
      link.href = "https://www.tradingview.com/";
      link.rel = "noopener nofollow";
      link.target = "_blank";
      const span = document.createElement("span");
      span.className = "blue-text";
      link.appendChild(span);
      copyright.appendChild(link);
    
      container.appendChild(copyright);
    
      return container;
    }
    
    // Usage in a non-React environment
    const stockContainer = document.querySelector('.stock-container');
    const tradingViewWidget = createTradingViewWidget();
    stockContainer.appendChild(tradingViewWidget);
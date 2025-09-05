export const costData = [
  {
    "country": "United States",
    "order": 0,
    "metrics": {
      "rent_monthly": { "local": {"amount": 1744.66, "currency": "USD"}, "usd": 1744.66 },
      "coffee_cappuccino": { "local": {"amount": 5.24, "currency": "USD"}, "usd": 5.24 },
      "sandwich_lunch": { "local": {"amount": 20.0, "currency": "USD"}, "usd": 20.0 },
      "haircut_mens": { "local": {"amount": 44.0, "currency": "USD"}, "usd": 44.0 },
      "overall_index_vs_us": 0
    }
  },
  {
    "country": "Brazil",
    "order": 1,
    "metrics": {
      "rent_monthly": { "local": {"amount": 1772, "currency": "BRL"}, "usd": 326.33 },
      "coffee_cappuccino": { "local": {"amount": 9.39, "currency": "BRL"}, "usd": 1.73 },
      "sandwich_lunch": { "local": {"amount": 29.81, "currency": "BRL"}, "usd": 5.49 },
      "haircut_mens": { "local": {"amount": 74, "currency": "BRL"}, "usd": 13.6 },
      "overall_index_vs_us": -61
    }
  },
  {
    "country": "Portugal",
    "order": 2,
    "metrics": {
      "rent_monthly": { "local": {"amount": 894, "currency": "EUR"}, "usd": 1046.23 },
      "coffee_cappuccino": { "local": {"amount": 1.84, "currency": "EUR"}, "usd": 2.15 },
      "sandwich_lunch": { "local": {"amount": 10.94, "currency": "EUR"}, "usd": 12.8 },
      "haircut_mens": { "local": {"amount": 15.38, "currency": "EUR"}, "usd": 18.0 },
      "overall_index_vs_us": -37
    }
  },
  {
    "country": "Spain",
    "order": 3,
    "metrics": {
      "rent_monthly": { "local": {"amount": 884, "currency": "EUR"}, "usd": 1034.47 },
      "coffee_cappuccino": { "local": {"amount": 1.97, "currency": "EUR"}, "usd": 2.3 },
      "sandwich_lunch": { "local": {"amount": 13.92, "currency": "EUR"}, "usd": 16.29 },
      "haircut_mens": { "local": {"amount": 17.09, "currency": "EUR"}, "usd": 20.0 },
      "overall_index_vs_us": -33
    }
  },
  {
    "country": "Albania",
    "order": 4,
    "metrics": {
      "rent_monthly": { "local": {"amount": 625.66, "currency": "USD"}, "usd": 625.66 },
      "coffee_cappuccino": { "local": {"amount": 1.93, "currency": "USD"}, "usd": 1.93 },
      "sandwich_lunch": { "local": {"amount": 11.91, "currency": "USD"}, "usd": 11.91 },
      "haircut_mens": { "local": {"amount": 6.5, "currency": "USD"}, "usd": 6.5 },
      "overall_index_vs_us": -39
    }
  },
  {
    "country": "Greece",
    "order": 5,
    "metrics": {
      "rent_monthly": { "local": {"amount": 456, "currency": "EUR"}, "usd": 534.0 },
      "coffee_cappuccino": { "local": {"amount": 3.35, "currency": "EUR"}, "usd": 3.92 },
      "sandwich_lunch": { "local": {"amount": 14.91, "currency": "EUR"}, "usd": 17.45 },
      "haircut_mens": { "local": {"amount": 12.82, "currency": "EUR"}, "usd": 15.0 },
      "overall_index_vs_us": -28
    }
  },
  {
    "country": "Thailand",
    "order": 6,
    "metrics": {
      "rent_monthly": { "local": {"amount": 15545, "currency": "THB"}, "usd": 481.11 },
      "coffee_cappuccino": { "local": {"amount": 68.17, "currency": "THB"}, "usd": 2.11 },
      "sandwich_lunch": { "local": {"amount": 99.84, "currency": "THB"}, "usd": 3.09 },
      "haircut_mens": { "local": {"amount": 388, "currency": "THB"}, "usd": 12.0 },
      "overall_index_vs_us": -48
    }
  }
];

// Country flag emojis
export const countryFlags = {
  "United States": "🇺🇸",
  "Brazil": "🇧🇷", 
  "Portugal": "🇵🇹",
  "Spain": "🇪🇸",
  "Albania": "🇦🇱",
  "Greece": "🇬🇷",
  "Thailand": "🇹🇭"
};

// Currency formatting functions
export const formatCurrency = (amount, currency, locale = 'en-US') => {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    EUR: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }),
    BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    THB: new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' })
  };
  
  return formatters[currency]?.format(amount) || `${currency} ${amount}`;
};


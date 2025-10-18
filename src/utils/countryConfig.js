// Multi-country compliance configuration

export const countries = {
  IN: {
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    taxName: 'GST',
    taxRates: [0, 5, 12, 18, 28],
    cashLimit: 200000,
    modules: ['gst_validator', 'cash_limit', 'tds_check'],
    regulations: {
      gst: {
        name: 'Goods and Services Tax',
        authority: 'CBIC',
        description: 'Unified indirect tax for goods and services'
      },
      cash_limit: {
        name: 'Cash Transaction Limit',
        authority: 'Income Tax Department',
        description: 'Maximum cash transaction limit per day'
      }
    }
  },
  US: {
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    taxName: 'Sales Tax',
    taxRates: [0, 5, 6, 7, 8, 9, 10],
    cashLimit: 10000,
    modules: ['sales_tax_validator', 'cash_reporting'],
    regulations: {
      sales_tax: {
        name: 'Sales Tax',
        authority: 'State Tax Departments',
        description: 'State-level consumption tax on goods and services'
      },
      cash_reporting: {
        name: 'Cash Reporting Requirement',
        authority: 'IRS',
        description: 'Form 8300 for cash transactions over $10,000'
      }
    }
  },
  UK: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    taxName: 'VAT',
    taxRates: [0, 5, 20],
    cashLimit: 15000,
    modules: ['vat_validator', 'cash_limit'],
    regulations: {
      vat: {
        name: 'Value Added Tax',
        authority: 'HMRC',
        description: 'Standard, reduced, and zero-rated VAT'
      },
      cash_limit: {
        name: 'Cash Payment Limit',
        authority: 'HMRC',
        description: 'Large cash payment restrictions'
      }
    }
  },
  EU: {
    name: 'European Union',
    flag: '🇪🇺',
    currency: 'EUR',
    currencySymbol: '€',
    taxName: 'VAT',
    taxRates: [0, 10, 20, 23],
    cashLimit: 10000,
    modules: ['vat_validator', 'gdpr_check'],
    regulations: {
      vat: {
        name: 'Value Added Tax',
        authority: 'European Commission',
        description: 'Harmonized VAT system across EU'
      },
      gdpr: {
        name: 'GDPR Compliance',
        authority: 'European Commission',
        description: 'Data protection and privacy regulations'
      }
    }
  },
  AU: {
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    taxName: 'GST',
    taxRates: [0, 10],
    cashLimit: 10000,
    modules: ['gst_validator', 'cash_limit'],
    regulations: {
      gst: {
        name: 'Goods and Services Tax',
        authority: 'ATO',
        description: '10% broad-based consumption tax'
      },
      cash_limit: {
        name: 'Cash Transaction Reporting',
        authority: 'AUSTRAC',
        description: 'Cash transactions over $10,000 must be reported'
      }
    }
  },
  CA: {
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    taxName: 'GST/HST',
    taxRates: [0, 5, 13, 15],
    cashLimit: 10000,
    modules: ['gst_hst_validator', 'cash_reporting'],
    regulations: {
      gst_hst: {
        name: 'GST/HST',
        authority: 'CRA',
        description: 'Federal and harmonized sales tax'
      },
      cash_reporting: {
        name: 'Large Cash Transaction Reporting',
        authority: 'FINTRAC',
        description: 'Report cash transactions over $10,000'
      }
    }
  },
  SG: {
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    taxName: 'GST',
    taxRates: [0, 8, 9],
    cashLimit: 20000,
    modules: ['gst_validator', 'cash_limit'],
    regulations: {
      gst: {
        name: 'Goods and Services Tax',
        authority: 'IRAS',
        description: 'Standard rate GST on most goods and services'
      },
      cash_limit: {
        name: 'Cash Transaction Limit',
        authority: 'MAS',
        description: 'Large cash transaction monitoring'
      }
    }
  }
}

// Currency conversion rates (relative to USD)
export const exchangeRates = {
  USD: 1.0,
  INR: 83.12,
  GBP: 0.79,
  EUR: 0.92,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34
}

export function convertCurrency(amount, fromCurrency, toCurrency) {
  const amountInUSD = amount / exchangeRates[fromCurrency]
  return amountInUSD * exchangeRates[toCurrency]
}

export function formatCurrency(amount, countryCode) {
  const country = countries[countryCode]
  return `${country.currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export function getCountryList() {
  return Object.entries(countries).map(([code, data]) => ({
    code,
    name: data.name,
    flag: data.flag,
    display: `${data.flag} ${data.name}`
  }))
}

export function validateTaxRate(rate, countryCode) {
  const country = countries[countryCode]
  return country.taxRates.includes(rate)
}

export function checkCashLimit(amount, countryCode) {
  const country = countries[countryCode]
  return amount <= country.cashLimit
}

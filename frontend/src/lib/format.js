export const currencyFormatter = new Intl.NumberFormat('el-GR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
})

export const formatCurrency = (value, currency = 'EUR') => {
  if (!Number.isFinite(value)) {
    return currencyFormatter.format(0)
  }

  if (!currency || currency.toUpperCase() === 'EUR') {
    return currencyFormatter.format(value)
  }

  return `${value.toFixed(2)} ${currency.toUpperCase()}`
}

export const formatMoney = formatCurrency

export const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleString('el-GR')
}

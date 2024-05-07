const formatJapanCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat('ja-JP');

  return formatter.format(amount)
}

export {
  formatJapanCurrency
}
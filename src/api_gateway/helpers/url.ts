export function accountsUrl (fullPath = '') {
  const baseUrl = process.env.ACCOUNTS_WWW_URL

  if (!fullPath || fullPath === '/') {
    return baseUrl
  }

  return `${baseUrl}${fullPath}`
}

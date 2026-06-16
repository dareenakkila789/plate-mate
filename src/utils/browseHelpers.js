export const parseDate = (value) => {
  return value ? new Date(value) : null
}

export const isWithinDays = (value, days) => {
  const date = parseDate(value)
  if (!date) return false

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const limit = new Date(today)
  limit.setDate(limit.getDate() + days)

  return date >= today && date <= limit
}

export const isExpired = (value) => {
  const date = parseDate(value)
  if (!date) return false
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay.getTime() < Date.now()
}

export const getUrgency = (value) => {
  const date = parseDate(value)
  if (!date) return null

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const diff = endOfDay.getTime() - Date.now()
  if (diff <= 0) return null // truly expired, isExpired handles this
  if (diff <= 6 * 60 * 60 * 1000) return 'lastCall'
  if (diff <= 24 * 60 * 60 * 1000) return 'expiresToday'
  return null
}

export const formatTimeRemaining = (value) => {
  const date = parseDate(value)
  if (!date) return ''

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const diffMs = endOfDay.getTime() - Date.now()
  if (diffMs <= 0) return 'Expired'

  const minutes = Math.ceil(diffMs / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours >= 24) {
    const days = Math.ceil(hours / 24)
    return `Ends in ${days} day${days === 1 ? '' : 's'}`
  }

  if (hours >= 1) {
    return `Ends in ${hours} hour${hours === 1 ? '' : 's'}`
  }

  return `Ends in ${minutes} minute${minutes === 1 ? '' : 's'}`
}
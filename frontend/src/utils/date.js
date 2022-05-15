export const printDate = (dateString) => {
  const date = new Date(dateString)

  const padding = (number) => number.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${padding(day)}/${padding(month)}/${year} ${padding(hour)}:${padding(minute)}`
}

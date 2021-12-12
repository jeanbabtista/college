const parse = () => {
  if (process.argv.length !== 4)
    throw new Error('You have to provide server port and client port')

  return [parseInt(process.argv[2]), parseInt(process.argv[3])]
}

module.exports = parse

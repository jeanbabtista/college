const createSocket = (socket, chain) => {
  socket.on('compare-chains', (secondChain) => {
    console.log('comparing chains')
  })

  return socket
}

export default createSocket

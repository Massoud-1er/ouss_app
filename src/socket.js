const users = {}
const wss = global.wss

wss.on('connection', (ws, req) => {
  let device
  global.sessionParser(req, {}, () => {
    device = req.session.device_id
    users[device] = ws
  })

  ws.on('message', (message) => {
    global.sessionParser(req, {}, () => {
      if (users[req.session._id]) {
        users[req.session._id].send(message)
        console.log('message.sent')
        // new Message({
        //   // sender: req.session.device_id,
        //   // match: req.session.match_id,
        //   content: message
        // }).save()
      }
    })
  })
})

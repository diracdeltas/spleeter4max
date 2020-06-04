outlets = 2

function log (msg, obj) {
  post(msg)
  post(JSON.stringify(obj))
  post('\n')
}

function bang () {
  log('bang')
  const clip = new LiveAPI('live_set view detail_clip')
  const filePath = clip.get('file_path')
  outlet(0, 'onFile', filePath)
}

function spleeterDone() {
  outlet(1, 'bang')
}

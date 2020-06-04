const path = require('path')
const Max = require('max-api')
Max.post(`Loaded the ${path.basename(__filename)} script`)

const tf = require('@tensorflow/tfjs-node')
Max.post('loaded tensorflow')
const fs = require('fs')
const { execSync } = require('child_process')
const { mySTFT, myISTFT } = require('./stft')

const done = () => {
  Max.outlet('spleeterDone')
}
const audioContext = require('audio-context')
const aud = {}

Max.outlet('bang')

// Use the 'addHandler' function to register a function for a particular
// message
Max.addHandlers({
  onFile: (filename) => {
    if (!filename) {
      Max.post('No audio file found.')
      done()
      return
    }
    start(filename)
  }
})

const showDir = (dir) => {
  // Since LOM has no way to load these files automatically into new tracks,
  // just open a file dialog and let the user drag-and-drop them.
  let opener
  if (process.platform === 'darwin') {
    opener = 'open'
  } else if (process.platform === 'win32') {
    opener = 'start ""'
  } else {
    Max.post(`Unsupported platform: ${process.platform}`)
  }
  execSync(`${opener} "${dir}"`)
  Max.outlet('set', `Select a clip; then press the button to start.`)
}

const start = async (filename) => {
  Max.outlet('set', 'Running, this may take a while...')
  const correctFilename = path.basename(filename).split('.').slice(0, -1).join('.')
  const outputFilename = path.join(__dirname, correctFilename)
  aud.base_name = outputFilename

  try {
    await run(filename)
  } catch (e) {
    Max.outlet('set', 'Error! See Max Console for details.')
    Max.post(`ERROR: ${e}`)
    return
  }

  showDir(outputFilename)
  done()
}

const FFT_SIZE = 4096
const PATCH_LENGTH = 512
const HOP_SIZE = 1024
const SR = 44100
const stems = 4

const run = async (filename) => {
  const model = await tf.loadLayersModel(`file://${path.resolve('model.json')}`)
  const shape = [1, PATCH_LENGTH, FFT_SIZE / 4, 2]
  const x = new Float32Array(1 * PATCH_LENGTH * (FFT_SIZE / 4) * 2) // all zero
  try {
    var tx = tf.tensor(x, shape)
    var ty = predict(model, tx)
    for (var i = 0; i < stems; i++) { ty[i].dataSync() }
  } catch (e) {
    console.error(e)
    return
  } finally {
    tf.dispose(tx)
    for (i = 0; i < stems; i++) { tf.dispose(ty[i]) }
  }
  readFile()
}

function predict (model, input) {
  return tf.tidy(() => {
    return model.predict(input)
  })
}

function readFile (filename) {
  const file = fs.readFileSync(filename)
  decode(filename, file)
}

function decode (fileName, arrayBuffer) {
  const audioCtx = audioContext.createContext({ sampleRate: SR })
  audioCtx.decodeAudioData(arrayBuffer,
    (decodedData) => {
      const source = audioCtx.createBufferSource()
      source.buffer = decodedData
      if (source.buffer.numberOfChannels !== 2) {
        Max.outlet('set', 'Audio needs 2 channels.')
        return
      }
      resample(fileName, source)
    },
    (e) => {
      Max.outlet('set', 'Error: ' + e)
    })
}

function resample (fileName, bufSrc) {
  const sourceAudioBuffer = bufSrc.buffer
  if (sourceAudioBuffer.sampleRate === SR) {
    aud.src = [sourceAudioBuffer.getChannelData(0), sourceAudioBuffer.getChannelData(1)]
    aud.size = sourceAudioBuffer.length
    setTimeout(() => { prepare(fileName) }, 10)
    return
  }
  const offlineCtx = audioContext.createContext({
    channels: sourceAudioBuffer.numberOfChannels,
    length: sourceAudioBuffer.duration * sourceAudioBuffer.numberOfChannels * SR,
    sampleRate: SR
  })
  const buffer = offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.length, sourceAudioBuffer.sampleRate)
  // Copy the source data into the offline AudioBuffer
  for (var channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
    buffer.copyToChannel(sourceAudioBuffer.getChannelData(channel), channel)
  }
  // Play it from the beginning.
  const source = offlineCtx.createBufferSource()
  source.buffer = sourceAudioBuffer
  source.connect(offlineCtx.destination)
  source.start(0)
  const validResampledLength = Math.floor(sourceAudioBuffer.duration * SR)
  offlineCtx.oncomplete = (e) => {
    // `resampled` contains an AudioBuffer resampled at SR.
    // use resampled.getChannelData(x) to get an Float32Array for channel x.
    // なぜかreasampledのdurationは倍に伸びている。謎。
    const resampled = e.renderedBuffer
    const chData0 = resampled.getChannelData(0).slice(0, validResampledLength)
    const chData1 = resampled.getChannelData(1).slice(0, validResampledLength)
    aud.src = [chData0, chData1]
    aud.size = validResampledLength
    prepare(fileName)
  }
  offlineCtx.startRendering()
}

function prepare (fileName) {
  aud.numOfPatches = Math.floor(Math.floor((aud.size - 1) / HOP_SIZE) / PATCH_LENGTH) + 1
  // STFTする
  aud.mag = [] // ch,time,freq
  aud.phase = []
  aud.mstem = []
  for (var si = 0; si < aud.stems; si++) { aud.mstem.push([[], []]) }
  for (var ch = 0; ch < 2; ch++) {
    const spec = mySTFT(aud.src[ch], FFT_SIZE, HOP_SIZE, aud.numOfPatches * PATCH_LENGTH)
    const mag = []
    const phase = []
    for (var i = 0; i < spec.length; i++) {
      const fmag = new Float32Array(FFT_SIZE / 2 + 1)
      const fphase = new Float32Array(FFT_SIZE / 2 + 1)
      for (var j = 0; j < FFT_SIZE / 2 + 1; j++) {
        fmag[j] = Math.sqrt(Math.pow(spec[i][j * 2 + 1], 2) + Math.pow(spec[i][j * 2 + 0], 2))
        fphase[j] = Math.atan2(spec[i][j * 2 + 1], spec[i][j * 2 + 0])
      }
      mag.push(fmag)
      phase.push(fphase)
    }
    aud.mag.push(mag)
    aud.phase.push(phase)
  }
  aud.src = null
  setTimeout(() => { processPatch(0) }, 10)
}

function processPatch (pIndex) {
  if (pIndex * PATCH_LENGTH * HOP_SIZE + FFT_SIZE > aud.size) {
    setTimeout(() => { postProcess() }, 10)
    return
  }
  const success = inference(aud.mag, aud.mstem, pIndex * PATCH_LENGTH)
  if (!success) {
    return
  }
  setTimeout(() => { processPatch(pIndex + 1) }, 10)
}

function inference (mag, mstem, magIndex) {
  const EPS = 1e-10
  const INF_FREQ = FFT_SIZE / 4
  const PATCH_SIZE = 1 * PATCH_LENGTH * INF_FREQ * 2
  const x = new Float32Array(PATCH_SIZE)
  let inpMagAllZero = true
  for (var i = 0; i < INF_FREQ; i++) {
    for (var j = 0; j < PATCH_LENGTH; j++) {
      const xi = (j * INF_FREQ + i) * 2
      x[xi + 0] = mag[0][magIndex + j][i]
      x[xi + 1] = mag[1][magIndex + j][i]
      inpMagAllZero &= (x[xi + 0] === 0 && x[xi + 1] === 0)
    }
  }
  let outMagAllZero = true
  const stems = aud.stems
  const shape = [1, PATCH_LENGTH, INF_FREQ, 2]
  try {
    var tx = tf.tensor(x, shape)
    var ty = predict(tx)
    const y = []
    for (var si = 0; si < stems; si++) { y.push(ty[si].dataSync()) }
    for (i = 0; i < PATCH_SIZE; i++) {
      let sum = EPS
      for (si = 0; si < stems; si++) {
        const v = y[si][i]
        sum += v * v
      }
      for (si = 0; si < stems; si++) {
        const v = y[si][i]
        y[si][i] = (v * v + (EPS / stems)) / sum
        outMagAllZero &= (v === 0)
      }
    }
    for (si = 0; si < stems; si++) {
      for (i = 0; i < PATCH_LENGTH; i++) {
        let fsmag0 = new Float32Array(INF_FREQ)
        let fsmag1 = new Float32Array(INF_FREQ)
        for (j = 0; j < INF_FREQ; j++) {
          const yi = (i * INF_FREQ + j) * 2
          const y0 = y[si][yi + 0]
          const y1 = y[si][yi + 1]
          fsmag0[j] = y0
          fsmag1[j] = y1
        }
        mstem[si][0].push(fsmag0)
        mstem[si][1].push(fsmag1)
      }
    }
  } catch (error) {
    console.error(error)
    return false
  } finally {
    try {
      tf.dispose(tx)
      for (i = 0; i < aud.stems; i++) { tf.dispose(ty[i]) }
    } catch (err2) {
      console.error(err2)
    }
  }
  if (outMagAllZero) { console.log('Inference result is null: ' + magIndex) }
  return inpMagAllZero || !outMagAllZero // true for success
}

function postProcessMag (mstem, morg, phase) {
  const nmag = [[], []]
  const nphase = [[], []]
  for (var ch = 0; ch < 2; ch++) {
    for (var i = 0; i < morg[0].length; i++) {
      const fnmag = new Float32Array(FFT_SIZE / 2 + 1)
      const fnphase = new Float32Array(FFT_SIZE / 2 + 1)
      var j = 0
      for (; j < FFT_SIZE / 4; j++) {
        fnmag[j] = mstem[ch][i][j] * morg[ch][i][j]
        fnphase[j] = phase[ch][i][j]
      }
      for (; j < FFT_SIZE / 2 + 1; j++) {
        fnmag[j] = 0
        fnphase[j] = phase[ch][i][j]
      }
      nmag[ch].push(fnmag)
      nphase[ch].push(fnphase)
    }
  }
  return [nmag, nphase]
}

function postProcess () {
  const stems = aud.stems
  aud.dst = []
  for (var si = 0; si < stems; si++) {
    aud.dst.push([new Float32Array(aud.size), new Float32Array(aud.size)])
  }
  for (si = 0; si < stems; si++) {
    const mp = postProcessMag(aud.mstem[si], aud.mag, aud.phase)
    myISTFT(aud.dst[si][0], mp[0][0], mp[1][0], FFT_SIZE, HOP_SIZE, aud.numOfPatches * PATCH_LENGTH)
    myISTFT(aud.dst[si][1], mp[0][1], mp[1][1], FFT_SIZE, HOP_SIZE, aud.numOfPatches * PATCH_LENGTH)
  }
  aud.mstem = null
  for (si = 0; si < stems; si++) {
    for (var ch = 0; ch < 2; ch++) {
      const dst = aud.dst[si][ch]
      for (var i = 0; i < aud.size; i++) {
        dst[i] /= 1.5
        if (dst[i] > 1) {
          dst[i] = 1
        } else if (dst[i] < -1) {
          dst[i] = -1
        }
      }
    }
  }
  const labels = ['vocals', 'drums', 'bass', 'other']
  fs.mkdirSync(aud.base_name)
  for (si = 0; si < stems; si++) {
    const audio = createWave(aud.dst[si])
    fs.writeFileSync(`${aud.base_name}/${labels[si]}.wav`, audio)
  }
}

// export to wav
function createWave (dst) {
  const length = dst[0].length * 2 * 2 + 44
  const buffer = new ArrayBuffer(length)
  const view = new DataView(buffer)
  let pos = 0

  // write WAVE header
  setUint32(0x46464952)                         // "RIFF"
  setUint32(length - 8)                         // file length - 8
  setUint32(0x45564157)                         // "WAVE"

  setUint32(0x20746d66)                         // "fmt " chunk
  setUint32(16)                                 // length = 16
  setUint16(1)                                  // PCM (uncompressed)
  setUint16(2) // numOfChan);
  setUint32(SR) // abuffer.sampleRate);
  setUint32(SR * 2 * 2) //abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(2 * 2) // numOfChan * 2);                      // block-align
  setUint16(16)                                 // 16-bit (hardcoded in this demo)

  setUint32(0x61746164)                         // "data" - chunk
  setUint32(length - pos - 4)                   // chunk length

  // write interleaved data
  let offset = 0
  while (pos < length) {
    for (let ch = 0; ch < 2; ch++) {             // interleave channels
      let sample = Math.max(-1, Math.min(1, dst[ch][offset])) // 必要ないはずだけど念のため clamp
      sample = ((sample < 0) ? sample * 0x8000 : sample * 0x7fff) | 0 // scale to 16-bit signed int
      view.setInt16(pos, sample, true)           // write 16-bit sample
      pos += 2
    }
    offset++                                     // next source sample
  }
  return buffer

  function setUint16 (data) {
    view.setUint16(pos, data, true)
    pos += 2
  }

  function setUint32 (data) {
    view.setUint32(pos, data, true)
    pos += 4
  }
}

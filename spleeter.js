const path = require('path')
const Max = require('max-api')
const { exec, execSync } = require('child_process')
const done = () => {
  Max.outlet('spleeterDone')
}

Max.post(`Loaded the ${path.basename(__filename)} script`)
// Docker's default path may not be in Max Node's env path
process.env.PATH = [process.env.PATH, '/usr/local/bin'].join(':')
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
    startDocker(filename)
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

const startDocker = (filename) => {
  Max.outlet('set', 'Starting Docker...')
  try {
    execSync('docker container rm spleeter')
  } catch (e) {
    Max.post(`Warning: ${e.message}`)
  }
  exec('docker pull researchdeezer/spleeter@sha256:e46b042c25781c8ef041847d9615d799b3fa76d56a653ece0d0e2585067153a2', (err) => {
    if (err) {
      Max.outlet('set', `Could not run Docker. Please read README.txt`)
      Max.post(`Error running docker pull: ${err.message}`)
      done()
    } else {
      runSpleeterDocker(filename)
    }
  })
}

const runSpleeterDocker = (filename) => {
  const env = {
    input: path.dirname(filename),
    model: path.join(__dirname, 'pretrained_models')
  }
  const cmd = `docker run --name spleeter -v "${env.input}":/input -v "${env.model}":/model -e MODEL_PATH=/model researchdeezer/spleeter:3.7 separate -i "/input/${path.basename(filename)}" -o /output -p spleeter:4stems-16kHz`
  Max.outlet('set', `Spleeter is running. This may take a minute...`)
  Max.post(cmd)

  // Calls the spleeter python process
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      Max.post(`Error running Spleeter: ${err.message}`)
      Max.outlet('set', 'Spleeter failed. Make sure Docker can access your audio files and has enough memory.')
      done()
      return
    }
    if (stderr) {
      Max.post(`Spleeter stderr: ${stderr}`)
    }
    if (stdout) {
      Max.post(`Spleeter stdout: ${stdout}`)
    }
    const correctFilename = path.basename(filename).split('.').slice(0, -1).join('.')
    const outputFilename = path.join(__dirname, correctFilename)
    Max.post('Running docker cp...')
    exec(`docker cp spleeter:"/output/${correctFilename}/" "${outputFilename}"`, (err, stdout, stderr) => {
      if (err) {
        Max.post(`Error running docker cp: ${err.message}`)
        Max.outlet('set', `Could not copy files from Docker.`)
      } else {
        showDir(outputFilename)
      }
      done()
    })
  })
}

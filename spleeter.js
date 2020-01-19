const path = require('path')
const Max = require('max-api')
const { exec } = require('child_process')
const outputDir = 'output'

let hasRun = false

const main = () => {
  Max.post(`Loaded the ${path.basename(__filename)} script`)
  // Docker's default path may not be in Max Node's env path
  process.env.PATH = [process.env.PATH, '/usr/local/bin'].join(':')
  Max.outlet('bang')
}
main()

// Use the 'addHandler' function to register a function for a particular
// message
Max.addHandlers({
  onFile: (filename) => {
    if (!filename) {
      Max.post('No audio file found.')
      return
    }
    if (hasRun) {
      return
    }
    hasRun = true
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
  exec(`${opener} "${dir}"`, (err) => {
    Max.post(`Error opening output directory: ${err.message}`)
  })
  Max.outlet('set', `Highlight a clip; then press the button to start.`)
  Max.outlet('spleeterDone')
}

const startDocker = (filename) => {
  Max.outlet('set', `Checking for Docker updates...`)
  exec('docker pull researchdeezer/spleeter:3.7', (err) => {
    if (err) {
      Max.outlet('set', `Could not run Docker. Please read README.md.`)
      Max.post(`Error running docker pull: ${err.message}`)
    } else {
      runSpleeter(filename)
    }
  })
}

const runSpleeter = (filename) => {
  const env = {
    input: path.dirname(filename),
    output: path.join(__dirname, outputDir),
    model: path.join(__dirname, 'pretrained_models')
  }
  const cmd = `docker run -v "${env.input}":/input -v "${env.output}":/output -v "${env.model}":/model -e MODEL_PATH=/model researchdeezer/spleeter:3.7 separate -i /input/"${path.basename(filename)}" -o /output -p spleeter:4stems`
  Max.outlet('set', `Spleeter is running. This may take a minute...`)

  // Calls the spleeter python process
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      Max.post(`Error running Spleeter: ${err.message}`)
      Max.outlet('set', 'Spleeter could not run :(')
    }
    if (stderr) {
      Max.post(`Spleeter stderr: ${stderr}`)
    }
    if (stdout) {
      Max.post(`Spleeter stdout: ${stdout}`)
    }
    if (!err) {
      showDir(path.join(
        __dirname,
        outputDir,
        path.basename(filename).split('.').slice(0, -1).join('.')
      ))
    }
  })
}

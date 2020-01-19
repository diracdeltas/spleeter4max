const path = require('path')
const Max = require('max-api')
const { exec } = require('child_process')
const outputDir = 'output'

let hasRun = false

const main = () => {
  Max.post(`Loaded the ${path.basename(__filename)} script`)
  // Spleeter's default pip path may not be in Max Node's env path
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
    Max.outlet('set', `Spleeter is running. This may take a minute...`)
    // Calls the spleeter python process
    exec(`spleeter separate -i "${filename}" -p spleeter:4stems -o ${outputDir}`, (err, stdout, stderr) => {
      Max.outlet('set', 'Done!')
      if (err) {
        Max.post(`Error running Spleeter: ${err.message}`)
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
        /*
        stemFilenames.forEach((name) => {
          Max.outlet('spleeterDone', path.join(
            __dirname,
            outputDir,
            path.basename(filename).split('.').slice(0, -1).join('.'),
            name))
        })
        */
      }
    })
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
  Max.outlet('set', `Select a clip and press the button to start.`)
  Max.outlet('spleeterDone')
}

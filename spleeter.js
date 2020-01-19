const path = require('path')
const Max = require('max-api')
const { exec } = require('child_process')
const outputDir = 'output'
const stemFilenames = ['bass.wav', 'drums.wav', 'other.wav', 'vocals.wav']

const main = () => {
  Max.post(`Loaded the ${path.basename(__filename)} script!`)
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
    Max.post(`onFile ${filename}`)
    // Calls the spleeter python process
    exec(`spleeter separate -i '${filename}' -p spleeter:4stems -o ${outputDir}`, (err, stdout, stderr) => {
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
        stemFilenames.forEach((name) => {
          Max.outlet('spleeterDone', path.join(
            __dirname,
            outputDir,
            path.basename(filename).split('.').slice(0, -1).join('.'),
            name))
        })
      }
    })
  }
})

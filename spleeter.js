const path = require('path')
const Max = require('max-api')

const main = () => {
  Max.post(`Loaded the ${path.basename(__filename)} script!`)
  Max.outlet('bang')
}
main()

// Use the 'addHandler' function to register a function for a particular
// message
Max.addHandlers({
  onFile: (filename) => {
    Max.post(`onFile ${filename}`)
  }
})

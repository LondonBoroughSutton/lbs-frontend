/* eslint-env jest */

const path = require('path')

const { renderSass } = require('../../../lib/jest-helpers')

const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

describe('Individual components', () => {
  it('should compile individual scss files without throwing exceptions', done => {
    const componentNames = lib.allComponents.slice()

    const getSassRenders = () => {
      return componentNames.map(name => {
        const filePath = path.join(configPaths.components, name, `_${name}.scss`)
        // Modified from the original - we do not have an elegant way of importing variables into our component file so this test pulls the variables in when testing the render
        return renderSass({
          data: `
            @import '` + path.join(configPaths.src, 'settings', '_colours.scss') + `';
            @import '` + configPaths.src + `settings/_variables.scss';
            @import '` + configPaths.src + `tools/_mixins.scss';
            @import '` + configPaths.src + `settings/_govuk-overrides.scss';
            @import '` + configPaths.src + `settings/_typography.scss';
            @import '` + configPaths.node_modules + `govuk-frontend/govuk/all.scss';
            @import '` + filePath + `'
          `
        })
      })
    }

    Promise
      .all(getSassRenders())
      .then(() => {
        done()
      })
      .catch(error => {
        throw error
      })
  })
})

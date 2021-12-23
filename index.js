const fs = require('fs')
const path = require('path')
const { chain } = require('lodash')

const ignores = [
  'utf-', 
  'e-mail',
  'gutenberg-tm',
  "'as-is'",
  "gutenberg-tm's"
]

const files = fs.readdirSync(path.join(__dirname, 'books'), 'utf8')
  .filter(file => file.endsWith('.txt'))

files.forEach(file => {
    const inputPath = path.join(__dirname, 'books', file)
    const content = fs.readFileSync(inputPath, 'utf8')
    const matches = chain(content.match(/(?=\S*['-])([a-zA-Z'-]+)/g))
      .uniq()
      .filter(word => word.includes('-') && !word.endsWith('-') && !word.startsWith('-'))
      .filter(word => !word.includes('--'))
      .filter(word => !ignores.includes(word.toLowerCase()))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .value()

    console.log("\n\n")
    console.log(file)
    console.log(matches)

    fs.writeFileSync(
      path.join(__dirname, 'hyphenated-words', file),
      matches.join('\n'),
    )
  })
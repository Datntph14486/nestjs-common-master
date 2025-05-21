const fs = require('fs')

let args = {}
process.argv.forEach((arg, idx) => {
    if (idx < 2) return
    const paramRegex = new RegExp(/^--(.+)=(.*)$/g)
    let match = paramRegex.exec(arg)
    if (match) {
        args[match[1]] = match[2]
    }
})

function build() {
    let data = JSON.parse(fs.readFileSync('./config/default.json', { encoding: 'utf8' }))

    Object.keys(args).forEach((key) => {
        let keys = key.split('.')
        let __data = data
        keys.forEach((__key, idx) => {
            if (idx >= keys.length - 1) return
            __data = data[__key]
        })
        __data[keys.at(-1)] = args[key]
    })

    fs.writeFileSync('./config/default.json', JSON.stringify(data, null, 2), { encoding: 'utf8', flag: 'w' })
}

build()

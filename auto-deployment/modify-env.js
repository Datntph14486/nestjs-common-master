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
    let data = fs.readFileSync('.env', { encoding: 'utf8' })

    Object.keys(args).forEach((key) => {
        let regex = new RegExp(`${key}=.*`, 'g')
        data = data.replace(regex, `${key}=${args[key]}`)
    })

    fs.writeFileSync('.env', data, { encoding: 'utf8', flag: 'w' })
}

build()
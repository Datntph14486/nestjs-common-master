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
    let data = fs.readFileSync('./src/environments/environment.prod.ts', { encoding: 'utf8' })

    Object.keys(args).forEach((key) => {
        let regex = new RegExp(`(${key}: *.*),{0,1}`, 'g')
        data = data.replace(regex, `${key}: '${args[key]}',`)
    })

    fs.writeFileSync('./src/environments/environment.prod.ts', data, { encoding: 'utf8', flag: 'w' })
}

build()

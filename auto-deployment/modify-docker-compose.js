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
    let content = fs.readFileSync('docker-compose.yml', { encoding: 'utf8' })

    Object.keys(args).forEach((key) => {
        if (key === 'image') {
            let imgParts = args[key].split(':')
            let tag = 'latest'
            let img = args[key]
            if (imgParts.length > 0) {
                tag = imgParts.at(-1)
                img = img.replace(`:${tag}`, '')
            }
            content = content.replace(new RegExp(`image: *${img}.*`, 'g'), `image: ${args[key]}`)
        }
    })

    fs.writeFileSync('docker-compose.yml', content, { encoding: 'utf8', flag: 'w' })
}

build()

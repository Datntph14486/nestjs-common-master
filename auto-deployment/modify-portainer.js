// node .\modify-portainer.js --portainer_host=10.100.30.100 --portainer_port=9000 --portainer_user=admin --portainer_passwd=9WTNNLs*aVBp68GiEPaUx8_v*xfwpx*c --stack=message_broker --image=rabbitmq:test

const http = require('http')

let args = {}
process.argv.forEach((arg, idx) => {
    if (idx < 2) return
    const paramRegex = new RegExp(/^--(.+)=(.*)$/g)
    let match = paramRegex.exec(arg)
    if (match) {
        args[match[1]] = match[2]
    }
})
console.log(args)

async function getJwt() {
    return new Promise((resolve, reject) => {
        let postData = JSON.stringify({
            username: args['portainer_user'],
            password: args['portainer_passwd']
        })
        let options = {
            hostname: args['portainer_host'],
            port: parseInt(args['portainer_port']),
            path: '/api/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        let request = http.request(options, (res) => {
            res.on('data', function (chunk) {
                obj = JSON.parse(chunk)
                resolve(obj.jwt)
            });
        })
        request.write(postData);
    })
}

async function getStacks() {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: args['portainer_host'],
            port: parseInt(args['portainer_port']),
            path: '/api/stacks',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        };
        let request = http.request(options, (res) => {
            let __chunk = ''
            res.on('data', function (chunk) {
                __chunk += chunk.toString()
            })
            res.on('end', function () {
                let obj = JSON.parse(__chunk)
                resolve(obj)
            });
        })
        request.write('');
    })
}

async function getStackFile(stack) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: args['portainer_host'],
            port: parseInt(args['portainer_port']),
            path: `/api/stacks/${stack['Id']}/file`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        };
        let request = http.request(options, (res) => {
            let __chunk = ''
            res.on('data', function (chunk) {
                __chunk += chunk.toString()
            })
            res.on('end', function () {
                let obj = JSON.parse(__chunk)
                resolve(obj)
            });
        })
        request.write('');
    })
}

async function updateStack(stack, fileContent) {
    return new Promise((resolve, reject) => {
        let __postData = {
            env: stack['Env'],
            prune: true,
            pullImage: false,
            stackFileContent: fileContent
        }
        let postData = JSON.stringify(__postData)
        let options = {
            hostname: args['portainer_host'],
            port: parseInt(args['portainer_port']),
            path: `/api/stacks/${stack['Id']}?endpointId=${stack['EndpointId']}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        let request = http.request(options, (res) => {
            let __chunk = ''
            res.on('data', function (chunk) {
                __chunk += chunk.toString()
            })
            res.on('end', function () {
                let obj = JSON.parse(__chunk)
                console.log(`res: ${__chunk}`)
                resolve(obj)
            });
        })
        request.write(postData);
    })
}

let jwt
async function build() {
    console.log(`login to portainer with user ${args['portainer_user']}`)
    jwt = await getJwt()
    console.log(`load available stacks`)
    let stacks = await getStacks()
    let stack = stacks.find((item) => {
        return item['Name'] === args['stack']
    })
    if (!stack) return
    console.log(`load '${args['stack']}' stack file and update`)
    let content = (await getStackFile(stack))['StackFileContent']

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
    console.log(content)
    console.log(`updating...`)
    await updateStack(stack, content)
    console.log(`done`)
}

build()

const fastify = require('fastify')({ logger: true })
var fs = require('fs');
const child_process = require('child_process')

const readOutput = async() => {
  const output = await fs.readFileSync('out.txt')
  console.log('Output:\n-------')
  console.log(output.toString())
  return output.toString()
}
fastify.post('/cr', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'POST')
  const obj = JSON.parse(request.body)
  console.log('------------COMPILE & RUN---------------')
  console.log('Code:\n-----')
  console.log(obj.code)
  console.log('Input:\n------')
  console.log(obj.input)
  console.log('Language:\n------------\n', obj.language)
  await fs.writeFileSync('in.txt', obj.input)
  try {
    if(obj.language === 'c++') {
      await fs.writeFileSync('code.cpp', obj.code)
      await child_process.execSync('del a.exe&g++ code.cpp&a<in.txt>out.txt')
      const output = await fs.readFileSync('out.txt')
      console.log('Output:\n-------')
      console.log(output.toString())
      console.log('---------------------------')
      return output.toString()
    }
    else if(obj.language === 'java') {
      await fs.writeFileSync('code.java', obj.code)
      await child_process.execSync('java code.java < in.txt > out.txt')
      const output = await fs.readFileSync('out.txt')
      console.log('Output:\n-------')
      console.log(output.toString())
      console.log('---------------------------')
      return output.toString()
    }
    return 'language not supported'
  }
  catch(err) {
    return 'error:'+err.stderr.toString() 
  }
})
fastify.post('/r', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'POST')
  const obj = JSON.parse(request.body)
  console.log('------------RUN-----------------')
  console.log('Input:\n------')
  console.log(obj.input)
  console.log('Language:\n------------\n', obj.language)
  await fs.writeFileSync('in.txt', obj.input)
  if(obj.language === 'c++') {
    await child_process.execSync('a < in.txt > out.txt')
    const output = await fs.readFileSync('out.txt')
    console.log('Output:\n-------')
    console.log(output.toString())
    console.log('---------------------------')
    return output.toString()
  }
  else if(obj.language === 'java') {
    await fs.writeFileSync('code.java', obj.code)
    await child_process.execSync('java code.java < in.txt > out.txt')
    const output = await fs.readFileSync('out.txt')
    console.log('Output:\n-------')
    console.log(output.toString())
    console.log('---------------------------')
    return output.toString()
  }
})
fastify.post('/c', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'POST')
  const obj = JSON.parse(request.body)
  console.log(  '-------------COMPILE--------------')
  console.log('Code:\n-----')
  console.log(obj.code)
  console.log('Language:\n------------\n', obj.language)
  try {
    if(obj.language === 'c++') {
      await fs.writeFileSync('code.cpp', obj.code)
      await child_process.execSync('g++ code.cpp')
      console.log('---------------------------')
      return 'compiled successfully'
    }
    return 'language not supported'
  }
  catch(err) {
    return 'error:'+err.stderr.toString()
  }
})
fastify.get('/', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'POST')
  console.log(request.body)
  return 'hello'
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
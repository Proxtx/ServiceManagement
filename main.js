import express from 'express'

const app = express()

app.use('', express.static('public'))
app.use(express.json())

app.listen(process.argv[2] ? process.argv[2] : 80)

import express, { type Application, type Request, type Response } from "express";
const app: Application = express()
const port = 3000

app.get('/', (req : Request, res : Response) => {
  res.status(200).json({ 
    message: `Server is listening on port ${port}`,
    projectName: 'Modular Pattern Server',
    version: '1.0.0'
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

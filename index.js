const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const dbUrl = "mongodb+srv://admin:IdRjwsPdB4tUgcdn@cluster0.gtqdf1g.mongodb.net"
const client = new MongoClient(dbUrl)
const dbName = "ocean-backend-exemplo-2023"

async function main() {
  console.log("Conectando ao banco de dados...")
  await client.connect()
  console.log("Banco de dados conectado com sucesso")

  const db = client.db(dbName)
  const collection = db.collection("item")


  const app = express()

  // Registrar um Middleware de JSON
  // Indica que todas as requisições podem receber
  // Body em JSON. A partir disso, o Express aplica
  // um JSON.parse para o conteúdo recebido
  app.use(express.json())

  app.get('/', function (req, res) {
    res.send('Hello World')
  })

  app.get("/oi", function (req, res) {
    res.send("Olá, mundo!")
  })

  const lista = ["Rick Sanchez", "Morty Smith", "Summer Smith"]
  //              0               1              2

  // Read All - [GET] /item
  app.get("/item", async function (req, res) {
    const itens = await collection.find().toArray()
    res.send(itens)
  })

  // Read by ID - [GET] /item/:id
  app.get("/item/:id", async function (req, res) {
    // Pegamos o ID de rota 
    const id = req.params.id 

    // Acessamos o item na lista, usando o índice corrigido
    const item = await collection.findOne({
      _id: new ObjectId(id)
    })

    // Enviamos o item como resposta do endpoint
    res.send(item)
  })

  // Create - [POST] /item
  app.post("/item", async function (req, res) {
    // Extraímos o Body da Requisição
    const item = req.body

    // Adicionamos o item recebido na collection
    await collection.insertOne(item)

    // Exibimos uma mensagem de sucesso
    res.send(item)
  })

  // Update - [PUT] /item/:id
  app.put("/item/:id", async function (req, res) {
    // Obtemos o ID do parâmetro de rota e fazemos
    // a correção de índice
    const id = req.params.id

    // Obtemos o novo item a ser atualizado
    const novoItem = req.body

    // Atualizamos o valor recebido na lista, usando
    // a posição ID para garantir que atualizamos
    // o item correto
    await collection.updateOne(
      {_id: new ObjectId(id) },
      {$set: novoItem }
    )

    // Enviamos uma mensagem de sucesso
    res.send(novoItem)
  })

  // Delete - [DELETE] /item/:id
  app.delete("/item/:id", async function (req, res) {
    // Obtemos o ID do Parâmetro de rota
    const id = req.params.id 

    // Removemos o item da lista
    await collection.deleteOne(
      {_id: new ObjectId(id)}
    )

    // Exibimos uma mensagem de sucesso
    res.send("Item removido com sucesso!")
  })

  app.listen(3000)
}

main()
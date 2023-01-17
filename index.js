const express = require('express')
const app = express()
const cors = require('cors')

let notes = [

    {
        id: 1,
        content:"Css on tyyli muotoilua",
        date:" 2022-11-23T11:22:40.0982",
        important: true
    },
    {
        id: 2,
        content:"Selain pystyy suorittamaan ainoastaan javascript-koodia",
        date:" 2022-11-23T11:22:50.0007",
        important: false
    },
    {
        id: 3,
        content:"PHP-ohjelmointi käytetään back-end ohjelmoinnissa",
        date:" 2022-11-23T11:24:09.0313",
        important: true
    },
    {
        id: 4,
        content:"Tietokannat on englanniksi password",
        date:" 2022-11-23T11:44:39.0000",
        important: false
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))



app.get('/', (req, res) => {
    res.send('<h1>Terve Luka</h1>')
})

const generateld = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0
  return maxId + 1
  }

  app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    const note = {
        id: generateld(),
        content: body.content,
      date: new Date(),
      important: body.important || false
  }

  notes = notes.concat(note)

  response.json(note)

  })

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id) 
  
  //vastataan statuskoodilla 204
  response.status(204).end()
})


app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if(note) {
        response.json(note)
    } else {
       response.status(404).end()
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3000

app.listen(PORT,() => {

console.log(`Palvelin käynnissä portissa ${PORT}`)

})
const notesRouter = require('express').Router()
const Note = require('../models/note')


//Fetching all notes
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find ({})
    response.json(notes)
})

//Fetching particular note by id  (after applying express-async-errors library)
notesRouter.get('/:id', async (request, response, next) => {
 
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json (note)
    }else {
      response.status(404).end()
    }
  
})


//Adding new note (after applying express-async-errors library)
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

    const savedNote = await note.save()
    response.json(savedNote)
})


//Deleting exiting note (after applying express-async-errors library)
notesRouter.delete('/:id', async (request, response, next) => {
   await Note.findByIdAndRemove(request.params.id)
      response.status(204).end()
})


//Updating notes
notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})



module.exports = notesRouter
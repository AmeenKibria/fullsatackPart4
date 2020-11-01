const notesRouter = require('express').Router()
const Note = require('../models/note')


//Fetching all notes
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes.map(note => note.toJSON()))
})


//Fetching particular note by id  (after applying express-async-errors library)
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note.toJSON())
  } else {
    response.status(404).end()
  }
})

//Adding new note (after applying express-async-errors library)
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote.toJSON())
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
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})



module.exports = notesRouter
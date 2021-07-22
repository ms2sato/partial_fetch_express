const path = require('path')
const express = require('express')
const app = express()
const { partialRenderer } = require('../../build/index')

const port = 3000

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
app.use(express.static(path.join(__dirname, "./public")))
app.use(express.urlencoded({ extended: false }))

app.use(partialRenderer())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', usersRouter())

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function usersRouter() {
  const router = express.Router()

  let titleCounter = 0
  const messages = [
    'test1',
    'test2'
  ]

  /* GET users listing. */
  router.get("/", (
    _req,
    res
  ) => {
    res.render('user', { titleCounter: titleCounter++, messages })
  })

  router.get('/time', (
    req,
    res
  ) => {
    res.partials()
      .inner('#output', '/user/time.pug')
      .send()
  })

  router.get('/title', (
    req,
    res
  ) => {
    res.partials()
      .replace('#title', '/user/title.pug', { titleCounter: titleCounter++ })
      .send()
  })

  router.get('/multi', (
    req,
    res
  ) => {
    res.partials()
      .inner('#output', '/user/time.pug')
      .replace('#title', '/user/title.pug', { titleCounter: titleCounter++ })
      .send()
  })

  router.post('/messages', (
    req,
    res
  ) => {
    const message = req.body.message
    if (!message || message.length === 0) {
      return res.partials()
        .replace('form', '/user/form.pug', {
          message, err: { errors: [{ message: 'message required' }] }
        })
        .send()
    }

    messages.push(message)

    // return res.redirect('/users')

    res.partials()
      .appendChild('ul.messages', '/user/message.pug', { message })
      .replace('form', '/user/form.pug')
      .send()
  })

  return router
}
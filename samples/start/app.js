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

sampleRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function sampleRoutes(router) {
  let titleCounter = 0
  const messages = [
    'test1',
    'test2'
  ]

  /* GET users listing. */
  router.get("/", (_req, res) => {
    res.render('index', { titleCounter: titleCounter++, messages })
  })

  router.get('/time', (_req, res) => {
    res.partials()
      .inner('#output', '/sample/time.pug')
      .send()
  })

  router.get('/title', (_req, res) => {
    res.partials()
      .replace('#title', '/sample/title.pug', { titleCounter: titleCounter++ })
      .send()
  })

  router.get('/multi', (_req, res) => {
    res.partials()
      .inner('#output', '/sample/time.pug')
      .replace('#title', '/sample/title.pug', { titleCounter: titleCounter++ })
      .send()
  })

  router.post('/messages', (req, res) => {
    const message = req.body.message
    if (!message || message.length === 0) {
      return res.partials()
        .replace('form', '/sample/form.pug', {
          message, err: { errors: [{ message: 'message required' }] }
        })
        .send()
    }

    messages.push(message)

    // return res.redirect('/')

    res.partials()
      .appendChild('ul.messages', '/sample/message.pug', { message })
      .replace('form', '/sample/form.pug')
      .send()
  })
}
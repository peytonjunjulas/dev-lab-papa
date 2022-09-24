const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();


MongoClient.connect('mongodb+srv://admin:admin123@cluster0.iruvlka.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true})
  .then(client => {
    console.log('connected db')
    const db = client.db('papa-db')
    const quotesCollection = db.collection('books')

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());
    app.use(express.static('public'));


app.get('/', (req,res)=>{
    db.collection('books').find().toArray()
      .then(results => {
        res.render('index.ejs', { books: results })
      })
      .catch(error => console.error(error))
})

app.post('/books', (req,res) =>{
    quotesCollection.insertOne(req.body)
    .then(result => {
      res.redirect('/')
    })
    .catch(error => console.error(error));
})

// app.listen(3000, function() {
//     console.log('listen on 3000')
// })
app.listen(process.env.PORT || 3000,
  () => console.log("server running..."));

    app.put('/books', (req, res) => {
    quotesCollection.findOneAndUpdate(
      { book: 'Percy Jackson' },
      {
        $set: {
          book: req.body.book,
          author: req.body.author
        }
      },
      {
        upsert: true
      }
    )
      .then(result => res.json('Success'))
      .catch(error => console.error(error))
  })

  app.delete('/books', (req, res) => {
    quotesCollection.deleteOne(
      { book: req.body.book }
    )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No fav book to delete')
        }
        res.json('Deleted favorite book')
      })
      .catch(error => console.error(error))
  })

})
.catch(error => console.error(error))
const express = require('express')
const db = require('./dbConnectExec.js')

const app = express();

app.get("/hi", (req,res)=>{
    res.send("hello world")
})

app.get("/books", (req,res)=>{
    //get data from database
    db.executeQuery(`SELECT *
    FROM book
    LEFT JOIN genre
    ON genre.GenrePK = book.GenreFK`)
    .then((result)=>{
        res.status(200).send(result)
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send()
    })
})

app.get("/books/:pk", (req, res)=>{
    var pk = req.params.pk
    // console.log("my PK: ", pk)

    var myQuery = `SELECT *
    FROM book
    LEFT JOIN genre
    ON genre.GenrePK = book.GenreFK
    WHERE bookPK = ${pk}`

    db.executeQuery(myQuery)
    .then((books)=>{
        // console.log("Books: ", books)

        if(books[0]){
            res.send(books[0])
        }
        else{
            res.status(404).send('bad request')
        }
    })
    .catch((err)=>{
        console.log("Error in /books/pk", err)
        res.status(500).send()
    })
})

app.listen(5000,()=>{
    console.log("app is running on port 5000")
})


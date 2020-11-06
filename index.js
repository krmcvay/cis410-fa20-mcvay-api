const express = require('express')
const bcrypt = require('bcryptjs')

const db = require('./dbConnectExec.js')


const app = express();
app.use(express.json())

app.get("/hi", (req,res)=>{
    res.send("hello world")
})

app.post("/customers", async (req, res)=>{
    // res.send("creating customer")

    // console.log("request body", req.body)

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNumber = req.body.phoneNumber;
    var email = req.body.email;
    var password = req.body.password;

    if(!firstName || !lastName || !phoneNumber || !email || !password){
        return res.status(400).send("bad request")
    }

    firstName = firstName.replace("'","''")
    lastName = lastName.replace("'","''")

    var emailCheckQuery = `SELECT email
    FROM customer
    WHERE email = '${email}'`

    var existingCustomer = await db.executeQuery(emailCheckQuery)

    // console.log("exisiting customer", existingCustomer)
    if(existingCustomer[0]){
        return res.status(409).send('Please enter a different email.')
    }

    var hashedPassword = bcrypt.hashSync(password)

    var insertQuery = `INSERT INTO customer(FirstName,LastName,PhoneNumber,Email,Password)
    VALUES('${firstName}','${lastName}','${phoneNumber}','${email}','${hashedPassword}')`

    db.executeQuery(insertQuery)
    .then(()=>{res.status(201).send()})
    .catch((err)=>{
        console.log("Error in POST /customers", err)
        res.status(500).send()
    })

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


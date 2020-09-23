const express = require('express');
const app = express();
const mognoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"

app.use(express.json());

mognoClient.connect(url,(err,db) => {
    if(err){
        console.log("Error while connecting to mongo", err);
    }
    else{

        const myDb = db.db('myDbs')
        const collection = myDb.collection('user')

        app.post('/signup' , (req, res) => {
            const newUser = {
                name :req.body.name,
                email :req.body.email,
                password :req.body.password
            }

            const query = {email: newUser.email }

            collection.findOne(query , (err,result) => {
                if(result == null){
                    collection.insertOne(newUser, (err,result) => {
                        res.status(200).send();
                    })
                }
                else{
                    res.status(400).send();
                }
            })
        })

        app.post('/login' , (req, res) => {
            const query = {
                email: req.body.email,
                password: req.body.password
            }
            console.log(req.body.email , req.body.password)
            collection.findOne(query,(err,result) => {
                if(result != null){
                    const objToSend = {
                        name: result.name,
                        email: result.email
                    }

                    res.status(200).send(JSON.stringify(objToSend))
                }
                else{
                    res.status(400).nsend()
                }
            })
        })
    }
})

app.listen(3000, () =>{
    console.log("listening on port 3000");
})
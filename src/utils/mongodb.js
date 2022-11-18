// CRUD create read update delete

// RUN /Users/ys/mongodb/bin/mongod.exe --dbpath=/Users/ys/mongodb-data

// const mongodb = require("mongodb")
// const MongoClient = mongodb.MongoClient
// const ObjectId = mongodb.ObjectId

const { MongoClient, ObjectId } = require("mongodb")

const id = new ObjectId()
console.log(id)
console.log(id.getTimestamp())

const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database.")
    }

    const db = client.db(databaseName)

    /*db.collection("users").findOne({ _id: new ObjectId("63117f9f15b59b75d86977dd") }, (error, user) => {
        if (error) {
            return console.log("Unable to fetch.")
        }
        console.log(user)
    })*/

    db.collection("tasks").findOne({ _id: new ObjectId("631a30229fd2bc061e0e5661")}, (error, task) => {
        console.log(task)
    })
    /**
    db.collection("users").find({ age : 29 }).toArray((error, users) => {
        console.log(users)
    })
    const cursor = async () => {
        db.collection("users").find({ age : 29 })
        const count = await cursor.countDocuments()
        console.log(count)
    }
    **/
   db.collection("tasks").find({ completed : false }).toArray((error, tasks) => {
    console.log(tasks)
   })

    /*db.collection("tasks").insertOne({description: "Buy groceries", completed: false}, (error, task) => {
    if (error) {
        console.log(error)
        return
    }
    console.log(task)
   }) */
})
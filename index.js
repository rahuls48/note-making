const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5000;
const path = require("path");

app.use(cors());
app.use(express.json());


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"client/build")));
}

//show todos
app.get("/todos", async(req,res)=>{
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
});

//Create
app.post("/todos", async (req,res)=>{
    
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) values($1) RETURNING *", 
            [description]
            );

        res.json(newTodo.rows[0]);
    
    
});

 
//show specific todo
app.get("/todos/:id", async(req,res)=>{
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id =$1",[
        id
    ]);
    res.json(todo.rows[0]);

});

//updating the todo list based on id
app.put("/todos/:id", async (req, res)=>{
    const { id } = req.params;
    const {description} = req.body;
    const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2",
    [description, id]
    );
    res.json("Todo was updated")

});

//deleting a todo from list 
app.delete("/todos/:id", async(req, res)=>{
    const {id} = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    res.json("Todo was deleted");
});

app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`);
});
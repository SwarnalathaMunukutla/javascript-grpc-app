const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:5040", grpc.credentials.createInsecure());
const text = process.argv[2];

client.createTodo({
    "id": -10,
    "text": text
}, (err, response) => {
    console.log("Recieved from server"+ JSON.stringify(response) + JSON.stringify(err));
});

client.readTodos(null, (err, response) => {
    console.log("read the todos from the server" + JSON.stringify(response));
    if(response.items){
    response.items.forEach(a => console.log(a.text));
    }
})

// const call = client.readTodoStreams();
// call.on("data", item => {
//     console.log("recived item from server" + JSON.stringify(item) );
// })

// call.on("end", e => console.log("server done!"));
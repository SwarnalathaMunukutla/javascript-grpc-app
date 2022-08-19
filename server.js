const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("localhost:5040", grpc.ServerCredentials.createInsecure());

server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodoStreams: readTodoStreams,
});
server.start();

const todos = [];
function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text,
  };
  todos.push(todoItem);
  callback(null, todoItem);
}

function readTodos(call, callback) {
  callback(null, { items: todos });
}

function readTodoStreams(call, callback) {
  todos.forEach((item) => {
    call.write(item);
    call.end();
  });
}

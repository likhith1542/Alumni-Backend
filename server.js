const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const users = require("./routes/api/users");
const events=require("./routes/api/events");
const galleries=require("./routes/api/galleries");
const forms=require("./routes/api/forms");
const posts=require("./routes/api/posts");
const conversations=require("./routes/api/conversations");
const messages=require("./routes/api/messages")
const news=require("./routes/api/news")
const jobs=require("./routes/api/jobs")
const notifications=require("./routes/api/notifications")

const server = require("http").createServer();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
io.on("connection", (socket) => {
  
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});


var cors = require('cors')

mongoose.set('useFindAndModify', false);


const app = express();
app.use(cors())
// Bodyparser middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));


  app.get('/', (req, res) => {
    res.sendStatus(200)
  })
  

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/events",events);
app.use("/api/galleries",galleries);
app.use("/api/forms",forms);
app.use("/api/posts",posts);
app.use("/api/conversations",conversations);
app.use("/api/messages",messages);
app.use("/api/news",news);
app.use("/api/jobs",jobs);
app.use("/api/notifications",notifications);

const port = require("./config/keys").PORT; 
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

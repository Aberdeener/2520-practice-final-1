const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const database = require("./database.json");
const fs = require("fs").promises;

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/people/:id", (req, res) => {
  res.render("people", {
    ...getUserFromDatabase(req.params.id),
  });
});

app.get("/create", (req, res) => {
  res.render("createcard");
});

app.post("/create", (req, res) => {
  const newUser = {
    id: database.users.length + 1,
    fullName: req.body.fullName,
    aboutMe: req.body.aboutMe,
    knownTechnologies: req.body.knownTechnologies ?? [],
    githubUrl: req.body.githubUrl,
    twitterUrl: req.body.twitterUrl,
    favoriteBooks: req.body.favoriteBooks?.split(","),
    favoriteArtists: req.body.favoriteArtists?.split(","),
  }

  database.users.push(newUser);

  fs.writeFile(
      "./database.json",
      JSON.stringify(database, null, 2),
  ).then(_ => res.redirect(`/people/${newUser.id}`));
});

app.get("/:id/photos", (req, res) => {
  const id = req.params.id;
});

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});

const getUserFromDatabase = id => {
  for (const user of database.users) {
    if (user.id == id) {
      return user;
    }
  }
  return null;
}

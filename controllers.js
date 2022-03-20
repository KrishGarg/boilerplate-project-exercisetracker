const { Router } = require("express");
const {
  addExercise,
  createUser,
  getAllUsers,
  getUserExercises,
} = require("./db");

const router = Router();

router.get("/users", async (req, res) => {
  const users = await getAllUsers();
  return res.json(users);
});

router.post("/users", async (req, res) => {
  const user = await createUser(req.body.username);
  return res.json(user);
});

router.post("/users/:id/exercises", async (req, res) => {
  const { id } = req.params;
  const { description, duration, date } = req.body;
  const userExercise = await addExercise(id, description, duration, date);
  return res.json(userExercise);
});

router.get("/users/:id/logs", async (req, res) => {
  const { id } = req.params;
  const userExercises = await getUserExercises(id, req.query);
  return res.json(userExercises);
});

module.exports = router;

const { Deta } = require("deta");
const {
  EXERCISES_BASE_NAME,
  USER_BASE_NAME,
  RESPONSE_MODELS,
} = require("./constants");
const { sortExercises } = require("./helper");

const deta = Deta();

const users = deta.Base(USER_BASE_NAME);
const exercises = deta.Base(EXERCISES_BASE_NAME);

const createUser = async (username) => {
  const user = await users.put({
    username,
  });
  return RESPONSE_MODELS.USER(user.key, user.username);
};

const getAllUsers = async () => {
  let res = await users.fetch();
  let allItems = res.items;

  while (res.last) {
    res = await users.fetch({}, { last: res.last });
    allItems = allItems.concat(res.items);
  }

  return RESPONSE_MODELS.USERS(
    allItems.map(({ key, username }) => RESPONSE_MODELS.USER(key, username))
  );
};

const addExercise = async (userId, desc, duration, date) => {
  if (typeof duration !== "number") {
    duration = parseInt(duration);
  }

  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  const exercise = await exercises.put({
    userId,
    description: desc,
    duration,
    date: date.getTime(),
  });

  const user = await users.get(userId);

  return RESPONSE_MODELS.USER_WITH_EXERCISE(
    RESPONSE_MODELS.USER(user.key, user.username),
    RESPONSE_MODELS.EXERCISE(
      exercise.description,
      exercise.duration,
      new Date(exercise.date)
    )
  );
};

const getUserExercises = async (userId, { from, to, limit }) => {
  let queryObj = {
    userId,
  };

  let allExercisesRes = await exercises.fetch(queryObj);
  let allExercises = allExercisesRes.items;

  while (allExercisesRes.last) {
    allExercisesRes = await exercises.fetch(queryObj, {
      limit,
      last: allExercisesRes.last,
    });
    allExercises = allExercises.concat(allExercisesRes.items);
  }

  const user = await users.get(userId);
  const sortedExercises = sortExercises(allExercises);

  if (limit) {
    limit = parseInt(limit);
  }

  let finalExercises = [];

  for (let i = 0; i < sortedExercises.length; i++) {
    let { description, duration, date } = sortedExercises[i];
    date = new Date(date);

    // limitting
    let howManyAlreadyDone = finalExercises.length;
    if (howManyAlreadyDone >= limit) {
      break;
    }

    // filter
    if (from && !to) {
      const fromDate = new Date(from);
      if (fromDate.toString() !== "Invalid Date") {
        if (+date < +fromDate) {
          // we break because the list is sorted in decending order
          break;
        }
      }
    }

    if (to && !from) {
      const toDate = new Date(to);
      if (toDate.toString() !== "Invalid Date") {
        if (+date > +toDate) {
          continue;
        }
      }
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (
        fromDate.toString() !== "Invalid Date" &&
        toDate.toString() !== "Invalid Date"
      ) {
        if (+date < +fromDate || +date > +toDate) {
          continue;
        }
      }
    }

    // map
    let exercise = RESPONSE_MODELS.EXERCISE(description, duration, date);
    finalExercises.push(exercise);
  }

  return RESPONSE_MODELS.LOGS(
    user.key,
    user.username,
    allExercises.length,
    finalExercises
  );
};

module.exports = {
  createUser,
  getAllUsers,
  addExercise,
  getUserExercises,
};

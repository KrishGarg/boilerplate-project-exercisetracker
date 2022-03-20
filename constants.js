const RESPONSE_MODELS = {
  EXERCISE: (description, duration, date) => ({
    description,
    duration,
    date: date.toDateString(),
  }),
  USER: (userId, username) => ({
    username,
    _id: userId,
  }),
  USER_WITH_EXERCISE: (userObj, exerciseObj) => ({
    ...userObj,
    ...exerciseObj,
  }),
  USERS: (userArr) => userArr, // just to keep a consistent interface
  LOGS: (userId, username, count, logObjArr) => ({
    username,
    count,
    _id: userId,
    log: logObjArr,
  }),
};

module.exports = {
  USER_BASE_NAME: "exercises-users",
  EXERCISES_BASE_NAME: "exercises",
  RESPONSE_MODELS,
};

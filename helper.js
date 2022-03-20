const sortExercises = (exercises) => {
  // Sorting in descending order of dates
  return exercises.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return +dateB - +dateA;
  });
};

module.exports = {
  sortExercises,
};

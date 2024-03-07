// Take an array and return a new array whose elements are in random order of the first one
export function shuffle(inputArray) {
  let array = [...inputArray];
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}


// Return a new array which shuffle the elements of the input array execpt the first element.
export function shuffleFromPositionOne(inputArray) {
  let array = shuffle(inputArray.slice(1));
  array.unshift(inputArray[0]);
  return array;
}
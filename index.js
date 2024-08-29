const cards = [
  "🍎",
  "🍎",
  "🍌",
  "🍌",
  "🍇",
  "🍇",
  "🍓",
  "🍓",
  "🍒",
  "🍒",
  "🍍",
  "🍍",
  "🍉",
  "🍉",
  "🥭",
  "🥭",
];

cards.sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById("game-board");
let firstCard, secondCard;
let lockBoard = false;

cards.forEach((card) => {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.dataset.card = card;
  cardElement.addEventListener("click", flipCard);
  gameBoard.appendChild(cardElement);
});

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flipped");
  this.textContent = this.dataset.card;
  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.card === secondCard.dataset.card;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    firstCard.textContent = "";
    secondCard.textContent = "";

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

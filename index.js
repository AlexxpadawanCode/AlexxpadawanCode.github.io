let selectedBox = null;
let currentPlayer = "white";

document.querySelectorAll(".box").forEach((box) => {
  box.addEventListener("click", () => {
    if (!selectedBox) {
      // Première sélection : choisir la pièce à déplacer
      if (box.querySelector("i")) {
        selectedBox = box; // Sélectionner la case
      }
    } else {
      // Deuxième sélection : choisir la destination
      movePiece(selectedBox, box);
      selectedBox = null; // Réinitialiser après le mouvement
    }
  });
});

function movePiece(fromBox, toBox) {
  if (isValidMove(fromBox, toBox)) {
    const movingPiece = fromBox.querySelector("i");

    // Vérifier s'il y a une pièce sur la case de destination
    const targetPiece = toBox.querySelector("i");
    if (targetPiece) {
      // Si une pièce ennemie est présente, elle est capturée (retirée du plateau)
      toBox.removeChild(targetPiece);
    }

    // Déplacer la pièce sur la case cible
    toBox.appendChild(movingPiece);
    fromBox.innerHTML = ""; // Vider la case de départ

    // Changer le tour du joueur
    currentPlayer = currentPlayer === "white" ? "black" : "white";
  } else {
    alert("Mouvement invalide !");
  }
}

function isValidMove(fromBox, toBox) {
  const fromPiece = fromBox.querySelector("i");

  // Si la case de départ est vide, le mouvement est invalide
  if (!fromPiece) {
    return false;
  }

  const pieceClasses = fromPiece.classList;
  const isWhitePiece = pieceClasses.contains("fa-regular");
  const isBlackPiece = pieceClasses.contains("fa-solid");

  // Vérifier si le joueur essaie de déplacer une pièce de la bonne couleur
  if (
    (currentPlayer === "white" && !isWhitePiece) ||
    (currentPlayer === "black" && !isBlackPiece)
  ) {
    return false; // Le joueur essaie de déplacer une pièce qui n'est pas la sienne
  }

  // Identifier les positions dans la grille
  const fromIndex = Array.from(fromBox.parentNode.children).indexOf(fromBox);
  const toIndex = Array.from(toBox.parentNode.children).indexOf(toBox);

  // Calculer les positions
  const fromRow = Math.floor(fromIndex / 8);
  const fromCol = fromIndex % 8;
  const toRow = Math.floor(toIndex / 8);
  const toCol = toIndex % 8;

  // Récupérer la pièce à déplacer
  const piece = fromBox.querySelector("i").classList;

  if (
    (piece.contains("fa-regular") && piece.contains("fa-chess-pawn")) ||
    (piece.contains("fa-solid") && piece.contains("fa-chess-pawn"))
  ) {
    return isValidPawnMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  } else if (
    (piece.contains("fa-regular") && piece.contains("fa-chess-rook")) ||
    (piece.contains("fa-solid") && piece.contains("fa-chess-rook"))
  ) {
    return isValidRookMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  } else if (
    (piece.contains("fa-regular") && piece.contains("fa-chess-knight")) ||
    (piece.contains("fa-solid") && piece.contains("fa-chess-knight"))
  ) {
    return isValidKnightMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  } else if (
    (piece.contains("fa-regular") && piece.contains("fa-chess-bishop")) ||
    (piece.contains("fa-solid") && piece.contains("fa-chess-bishop"))
  ) {
    return isValidBishopMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  } else if (
    (piece.contains("fa-regular") && piece.contains("fa-chess-queen")) ||
    (piece.contains("fa-solid") && piece.contains("fa-chess-queen"))
  ) {
    return isValidQueenMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  } else if (
    (piece.contains("fa-regular") && piece.contains("fa-chess-king")) ||
    (piece.contains("fa-solid") && piece.contains("fa-chess-king"))
  ) {
    return isValidKingMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  }

  return false; // Par défaut, le mouvement est invalide
}

function isValidPawnMove(fromRow, fromCol, toRow, toCol, fromBox, toBox) {
  const isWhite = fromBox.querySelector("i").classList.contains("fa-regular");
  const direction = isWhite ? -1 : 1; // Les pions blancs se déplacent vers le haut (direction = -1), les pions noirs vers le bas (direction = 1)

  // Déplacement d'une case vers l'avant
  if (
    toCol === fromCol &&
    toRow === fromRow + direction &&
    !toBox.querySelector("i")
  ) {
    return true;
  }

  // Déplacement initial de deux cases vers l'avant
  if (
    toCol === fromCol &&
    fromRow === (isWhite ? 6 : 1) &&
    toRow === fromRow + 2 * direction &&
    !toBox.querySelector("i")
  ) {
    const intermediateRow = fromRow + direction;
    const intermediateBox =
      fromBox.parentNode.children[intermediateRow * 8 + fromCol];
    if (!intermediateBox.querySelector("i")) {
      return true;
    }
  }

  // Capture en diagonale
  if (
    Math.abs(toCol - fromCol) === 1 &&
    toRow === fromRow + direction &&
    toBox.querySelector("i")
  ) {
    const targetPiece = toBox.querySelector("i").classList;
    // Vérifier que la pièce capturée est de l'autre couleur
    if (
      (isWhite && targetPiece.contains("fa-solid")) ||
      (!isWhite && targetPiece.contains("fa-regular"))
    ) {
      return true;
    }
  }

  // Si aucune condition n'est remplie, le mouvement est invalide
  return false;
}

function isValidRookMove(fromRow, fromCol, toRow, toCol, fromBox, toBox) {
  if (fromRow !== toRow && fromCol !== toCol) {
    return false; // Si le mouvement n'est pas dans une ligne ou une colonne, il est invalide
  }

  // Vérifier qu'il n'y a pas d'obstacles entre la position de départ et la position d'arrivée
  // Déplacement vertical
  if (fromCol === toCol) {
    const start = Math.min(fromRow, toRow);
    const end = Math.max(fromRow, toRow);
    for (let row = start + 1; row < end; row++) {
      const intermediateBox = fromBox.parentNode.children[row * 8 + fromCol];
      if (intermediateBox.querySelector("i")) {
        return false; // Si une pièce est trouvée sur le chemin, le mouvement est invalide
      }
    }
  }

  // Déplacement horizontal
  if (fromRow === toRow) {
    const start = Math.min(fromCol, toCol);
    const end = Math.max(fromCol, toCol);
    for (let col = start + 1; col < end; col++) {
      const intermediateBox = fromBox.parentNode.children[fromRow * 8 + col];
      if (intermediateBox.querySelector("i")) {
        return false; // Si une pièce est trouvée sur le chemin, le mouvement est invalide
      }
    }
  }

  // Si la case de destination contient une pièce, vérifier que c'est une pièce de l'autre couleur
  const targetPiece = toBox.querySelector("i");
  if (targetPiece) {
    const isWhite = fromBox.querySelector("i").classList.contains("fa-regular");
    const targetIsWhite = targetPiece.classList.contains("fa-regular");
    if (isWhite === targetIsWhite) {
      return false; // Si la pièce cible est de la même couleur, le mouvement est invalide
    }
  }

  // Si toutes les conditions sont remplies, le mouvement est valide
  return true;
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol, fromBox, toBox) {
  // Calculer la différence de déplacement
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Vérifier que le mouvement correspond à un mouvement en "L"
  const isLShape =
    (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

  if (!isLShape) {
    return false; // Si ce n'est pas un mouvement en "L", il est invalide
  }

  // Vérifier si la case de destination contient une pièce de la même couleur
  const targetPiece = toBox.querySelector("i");
  if (targetPiece) {
    const isWhite = fromBox.querySelector("i").classList.contains("fa-regular");
    const targetIsWhite = targetPiece.classList.contains("fa-regular");
    if (isWhite === targetIsWhite) {
      return false; // Si la pièce cible est de la même couleur, le mouvement est invalide
    }
  }

  // Si toutes les conditions sont remplies, le mouvement est valide
  return true;
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol, fromBox, toBox) {
  // Calculer la différence de déplacement en ligne et en colonne
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Le fou doit se déplacer en diagonale, donc la différence de ligne et de colonne doit être égale
  if (rowDiff !== colDiff) {
    return false;
  }

  // Vérifier qu'il n'y a pas d'obstacles sur le chemin
  const rowDirection = toRow > fromRow ? 1 : -1; // Déterminer la direction du déplacement en ligne
  const colDirection = toCol > fromCol ? 1 : -1; // Déterminer la direction du déplacement en colonne

  let currentRow = fromRow + rowDirection;
  let currentCol = fromCol + colDirection;

  // Parcourir toutes les cases entre la case de départ et la case d'arrivée
  while (currentRow !== toRow && currentCol !== toCol) {
    const intermediateBox =
      fromBox.parentNode.children[currentRow * 8 + currentCol];

    // Si une pièce est trouvée sur le chemin, le mouvement est invalide
    if (intermediateBox.querySelector("i")) {
      return false;
    }

    // Avancer vers la case suivante dans la direction diagonale
    currentRow += rowDirection;
    currentCol += colDirection;
  }

  // Vérifier si la case d'arrivée contient une pièce de la même couleur
  const targetPiece = toBox.querySelector("i");
  if (targetPiece) {
    const isWhite = fromBox.querySelector("i").classList.contains("fa-regular");
    const targetIsWhite = targetPiece.classList.contains("fa-regular");
    if (isWhite === targetIsWhite) {
      return false; // Si la pièce cible est de la même couleur, le mouvement est invalide
    }
  }

  // Si toutes les conditions sont remplies, le mouvement est valide
  return true;
}

function isValidQueenMove(fromRow, fromCol, toRow, toCol, fromBox, toBox) {
  // Calculer la différence de déplacement en ligne et en colonne
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Vérifier si le déplacement est en ligne droite (comme une tour)
  if (fromRow === toRow || fromCol === toCol) {
    return isValidRookMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  }

  // Vérifier si le déplacement est en diagonale (comme un fou)
  if (rowDiff === colDiff) {
    return isValidBishopMove(fromRow, fromCol, toRow, toCol, fromBox, toBox);
  }

  // Si ni un mouvement en ligne droite ni un mouvement en diagonale, c'est un mouvement invalide
  return false;
}

function isValidKingMove(fromRow, fromCol, toRow, toCol, fromBox, toBox) {
  // Calculer la différence de déplacement en ligne et en colonne
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Le roi ne peut se déplacer que d'une case dans n'importe quelle direction
  if (rowDiff <= 1 && colDiff <= 1) {
    // Vérifier que la case de destination n'est pas occupée par une pièce de la même couleur
    const fromPiece = fromBox.querySelector("i").classList;
    const toPiece = toBox.querySelector("i");

    // Si la case de destination est vide, c'est un mouvement valide
    if (!toPiece) {
      return true;
    }

    // Si la case de destination contient une pièce, vérifier si elle est de l'autre couleur
    const isWhite = fromPiece.contains("fa-regular");
    const targetPiece = toPiece.classList;

    // Si la pièce est de l'autre couleur, c'est une capture valide
    if (
      (isWhite && targetPiece.contains("fa-solid")) ||
      (!isWhite && targetPiece.contains("fa-regular"))
    ) {
      return true;
    }
  }

  // Si le roi essaie de se déplacer de plus d'une case ou de capturer une pièce de la même couleur, c'est invalide
  return false;
}

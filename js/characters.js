const characterStyles = {
  // Main Pandava Characters
  Bhima: {
    pieceType: "Rook",
    side: "Pandava",
    modelKey: "bhima_rook",
    color: [255, 200, 100], // Golden
    baseSize: 60,
  },
  Yudhishthira: {
    pieceType: "King",
    side: "Pandava",
    modelKey: "yudhishthira_king",
    color: [255, 255, 200], // Light gold
    baseSize: 70,
  },
  Arjuna: {
    pieceType: "Knight",
    side: "Pandava",
    modelKey: "arjuna_knight",
    color: [200, 255, 200], // Light green
    baseSize: 55,
  },
  Nakula: {
    pieceType: "Bishop",
    side: "Pandava",
    modelKey: "nakula_bishop",
    color: [200, 200, 255], // Light blue
    baseSize: 50,
  },
  Sahadeva: {
    pieceType: "Bishop",
    side: "Pandava",
    modelKey: "sahadeva_bishop",
    color: [255, 200, 255], // Light magenta
    baseSize: 50,
  },
  Draupadi: {
    pieceType: "Queen",
    side: "Pandava",
    modelKey: "draupadi_queen",
    color: [255, 150, 150], // Rose
    baseSize: 65,
  },

  // Main Kaurava Characters
  Duryodhana: {
    pieceType: "King",
    side: "Kaurava",
    modelKey: "duryodhana_king",
    color: [150, 50, 50], // Dark red
    baseSize: 70,
  },
  Dushasana: {
    pieceType: "Rook",
    side: "Kaurava",
    modelKey: "dushasana_rook",
    color: [120, 60, 60], // Darker red
    baseSize: 55,
  },
  Karna: {
    pieceType: "Knight",
    side: "Kaurava",
    modelKey: "karna_knight",
    color: [150, 100, 50], // Bronze
    baseSize: 55,
  },
  Shakuni: {
    pieceType: "Bishop",
    side: "Kaurava",
    modelKey: "shakuni_bishop",
    color: [80, 80, 120], // Dark blue
    baseSize: 50,
  },

  // Special Characters
  Krishna: {
    pieceType: "Special",
    side: "Pandava",
    modelKey: "krishna_advisor",
    color: [100, 150, 255], // Divine blue
    baseSize: 60,
  },
  Hidimbi: {
    pieceType: "Queen",
    side: "Pandava",
    modelKey: "hidimbi_queen",
    color: [100, 200, 100], // Forest green
    baseSize: 55,
  },
  Hidimba: {
    pieceType: "Pawn",
    side: "Kaurava",
    modelKey: "hidimba_pawn",
    color: [80, 120, 80], // Dark green
    baseSize: 40,
  },

  // Default style for characters not explicitly defined
  default: {
    pieceType: "Pawn",
    side: "Neutral",
    modelKey: "pawn_generic",
    color: [128, 128, 128],
    baseSize: 40,
  },
};

// This file will now primarily define the 'look' of each character's chess piece.
// The actual board positions and game state will be managed by story.js and sketch.js.

// Example of how one might access this:
// let bhimaPieceDetails = characterStyles["Bhima"];
// console.log(bhimaPieceDetails.pieceType); // Outputs: "King"
// console.log(bhimaPieceDetails.color); // Outputs: [255, 255, 255]

// Note: 'modelKey' is a placeholder for if/when 3D models are used.
// 'color' can be used for simple p5.js primitive rendering (e.g., fill(bhimaPieceDetails.color))
// 'side' helps in distinguishing teams (e.g., "Pandava" vs "Kaurava")

// The actual list of characters and their piece assignments will need to be
// carefully considered to align with the narrative and the chess metaphor.
// The list above is illustrative.

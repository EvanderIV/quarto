

window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

let isMobileUser = window.mobileAndTabletCheck();

let zoom = false;

let selectedPiece = document.getElementById("selected-piece");
let selectedText = document.getElementById("selected-text");
let selectedContainer = document.getElementById("selected");
let piecesContainer = document.getElementById("pieces");
let pieces = document.getElementsByClassName("piece");
let spots = document.getElementsByClassName("spot");
let pSuper = document.getElementById("pieces-superdiv");
let bSuper = document.getElementById("board-superdiv");
let gameBoard = document.getElementById("spots");

let gameOver = false;

function Piece(id) {
    if (id === undefined || isNaN(id)) {
        this.empty = true;
        this.hole = false;
        this.tall = false;
        this.black = false;
        this.round = false;
        return;
    }
    this.empty = false;
    this.hole = (id > 7);
    this.tall = (id % 8 > 3);
    this.black = (id % 2 === 1);
    this.round = (id % 4 > 1);
}

const getPieceId = (element) => {
    const lastChild = element.children[element.children.length - 1];
    return lastChild && lastChild.id ? parseInt(lastChild.id.substr(12)) : undefined;
};

let bSUPER_SCALE_MOD = 1.0;

let Board = {
    spot00: "",
    spot10: "",
    spot20: "",
    spot30: "",
    spot01: "",
    spot11: "",
    spot21: "",
    spot31: "",
    spot02: "",
    spot12: "",
    spot22: "",
    spot32: "",
    spot03: "",
    spot13: "",
    spot23: "",
    spot33: "",

    evaluate: function () {
        // Check rows
        if (this.areSimilar(0, 5, 10, 15)) return true;
        if (this.areSimilar(3, 6, 9, 12)) return true;
        for (let i = 0; i < 16; i += 4) {
            if (this.areSimilar(i, i + 1, i + 2, i + 3)) return true;
        }
        for (let i = 0; i < 4; i++) {
            if (this.areSimilar(i, i + 4, i + 8, i + 12)) return true;
        }
    },
    pull: function() {
        

        this.spot00 = new Piece(getPieceId(gameBoard.children[0]));
        this.spot10 = new Piece(getPieceId(gameBoard.children[1]));
        this.spot20 = new Piece(getPieceId(gameBoard.children[2]));
        this.spot30 = new Piece(getPieceId(gameBoard.children[3]));
        this.spot01 = new Piece(getPieceId(gameBoard.children[4]));
        this.spot11 = new Piece(getPieceId(gameBoard.children[5]));
        this.spot21 = new Piece(getPieceId(gameBoard.children[6]));
        this.spot31 = new Piece(getPieceId(gameBoard.children[7]));
        this.spot02 = new Piece(getPieceId(gameBoard.children[8]));
        this.spot12 = new Piece(getPieceId(gameBoard.children[9]));
        this.spot22 = new Piece(getPieceId(gameBoard.children[10]));
        this.spot32 = new Piece(getPieceId(gameBoard.children[11]));
        this.spot03 = new Piece(getPieceId(gameBoard.children[12]));
        this.spot13 = new Piece(getPieceId(gameBoard.children[13]));
        this.spot23 = new Piece(getPieceId(gameBoard.children[14]));
        this.spot33 = new Piece(getPieceId(gameBoard.children[15]));
    },
    areSimilar: function(p0, p1, p2, p3) {
        const pieces = [
            new Piece(getPieceId(gameBoard.children[p0])),
            new Piece(getPieceId(gameBoard.children[p1])),
            new Piece(getPieceId(gameBoard.children[p2])),
            new Piece(getPieceId(gameBoard.children[p3]))
        ];
        
        for (let piece in pieces) {
            if (pieces[piece].empty) return false;
        }

        // Check each attribute for winning condition
        return (pieces.every(p => p.hole) || pieces.every(p => !p.hole)) ||
               (pieces.every(p => p.tall) || pieces.every(p => !p.tall)) ||
               (pieces.every(p => p.black) || pieces.every(p => !p.black)) ||
               (pieces.every(p => p.round) || pieces.every(p => !p.round));
    }
}







let lastSelectedPiece;

let selectingSpot = false;

function selectPiece(element) {
    if (isMobileUser && !selectingSpot && zoom) {
        pSuper.style.height = "60%";
        bSuper.style.height = "40%";
        bSuper.style.scale = 1.0 * bSUPER_SCALE_MOD;
        selectedContainer.style.marginTop = "0";
        zoom = false;
        return;
    }
    if (element.classList.toString().includes("taken") || gameOver) return;
    selectedPiece.src = ("./assets/" + element.id + ".png");
    selectedPiece.style.marginLeft = "-50vmin";
    selectedText.style.marginLeft = "-10vmin";
    selectedContainer.style.width = "100vmin";
    selectedContainer.style.marginLeft = "0";
    piecesContainer.style.marginLeft = "50vmin";
    for (let piece = 0; piece < pieces.length; piece++) {
        pieces[piece].style.height = "15vmin";
    }
    lastSelectedPiece = element;
    if (!selectingSpot) {
        nextTurnAnim();
    }
    selectingSpot = true;
    for (let spot = 0; spot < spots.length; spot++) {
        if (!spots[spot].classList.toString().includes("taken")) {
            spots[spot].classList.add("selecting");
        }
    }
    if (isMobileUser) {
        pSuper.style.height = "40%";
        bSuper.style.height = "60%";
        bSuper.style.scale = 1.25 * bSUPER_SCALE_MOD;
    }
}

function selectSpot(element) {
    if (isMobileUser && !selectingSpot) {
        if (zoom) {
            pSuper.style.height = "60%";
            bSuper.style.height = "40%";
            bSuper.style.scale = 1.0 * bSUPER_SCALE_MOD;
            selectedContainer.style.marginTop = "0";
        }
        else {
            pSuper.style.height = "10%";
            bSuper.style.height = "90%";
            bSuper.style.scale = 1.25 * bSUPER_SCALE_MOD;
            selectedContainer.style.marginTop = "50vmin";
        }
        zoom = !zoom;
        return;
    }
    if (element.children[0].classList.toString().includes("taken") || !selectingSpot || gameOver) return;
    //selectedPiece.src = ("./assets/" + element.id + ".png");
    selectedPiece.style.marginLeft = "25vmin";
    selectedText.style.marginLeft = "75vmin";
    selectedContainer.style.width = "0";
    selectedContainer.style.marginLeft = "-50vmin";
    piecesContainer.style.marginLeft = "0";
    for (let piece = 0; piece < pieces.length; piece++) {
        if (isMobileUser && (window.innerHeight / window.innerWidth > 16.01 / 9)) {
            pieces[piece].style.height = "30vmin";
        }
        else {
            pieces[piece].style.height = "25vmin";
        }
    }
    selectingSpot = false;
    for (let spot = 0; spot < spots.length; spot++) {
        spots[spot].classList.remove("selecting");
    }
    element.children[0].classList.add("taken");
    let pieceMarker = document.createElement("img");
    pieceMarker.src = ("./assets/" + lastSelectedPiece.id + ".png");
    pieceMarker.classList.add("board-piece");
    pieceMarker.id = ("board_" + lastSelectedPiece.id);
    element.appendChild(pieceMarker);
    lastSelectedPiece.classList.add("taken");
    if (isMobileUser) {
        pSuper.style.height = "60%";
        bSuper.style.height = "40%";
        bSuper.style.scale = 1.0 * bSUPER_SCALE_MOD;
    }    let board = Board;
    board.pull();
    if (board.evaluate()) {
        gameOver = true;
        ribbonText.textContent = "GAME OVER";
        gameOverAnim();
        // Disable further moves
        selectingSpot = false;
    }
}

let ribbon = document.getElementById("turn-ribbon");
let ribbonText = document.getElementById("turn-text");

function nextTurnAnim() {
    ribbon.style.marginLeft = "0";
    ribbonText.style.marginLeft = "10vmin";
    ribbonText.style.transition = "all 0.5s linear";
    setTimeout(() => {
        ribbonText.style.marginLeft = "-10vmin";
    }, 32);
    setTimeout(() => {
        ribbonText.style.marginLeft = "-25vmin";
        ribbonText.style.transition = "all 0.2s ease";
        ribbon.style.marginLeft = "-200%";
    }, 500);
    setTimeout(() => {
        ribbon.style.transition = "none";
    }, 800);
    setTimeout(() => {
        ribbon.style.marginLeft = "200%";
        ribbonText.style.marginLeft = "25vmin";
    }, 850);
    setTimeout(() => {
        ribbon.style.transition = "all 0.2s ease";
    }, 900);
}

function gameOverAnim() {
    ribbon.style.marginLeft = "0";
    ribbonText.style.marginLeft = "0";
    ribbonText.style.transition = "all 0.0s linear";
    setTimeout(() => {
        ribbonText.style.marginLeft = "0";
    }, 32);
    setTimeout(() => {
        ribbonText.style.transition = "all 0.2s ease";
        ribbon.style.marginLeft = "-200%";
    }, 1500);
    setTimeout(() => {
        ribbon.style.transition = "none";
    }, 1800);
    setTimeout(() => {
        ribbon.style.marginLeft = "200%";
        ribbonText.style.marginLeft = "25vmin";
    }, 1850);
    setTimeout(() => {
        ribbon.style.transition = "all 0.2s ease";
    }, 1900);
}





if (window.innerWidth < window.innerHeight) isMobileUser = true;


if (isMobileUser) {
    document.getElementById("main").style.flexDirection = "column";
    ribbon.style.height = "20vmin";
    ribbonText.style.fontSize = "15vmin";
    ribbonText.style.marginTop = "15.5vmin";
    pSuper.style.marginTop = "auto";
    pSuper.style.marginBottom = "0";
    pSuper.style.height = "60%";
    bSuper.style.height = "40%";
    selectedContainer.style.height = "100%"
    pSuper.style.justifySelf = "flex-end";
    piecesContainer.style.width = "100%";
    piecesContainer.style.height = "100%";
    piecesContainer.style.borderRadius = "5vmin 5vmin 0 0";
    if (window.innerHeight / window.innerWidth < 16.01 / 9) {
        console.log("Mobile user with < 16:9 aspect ratio: " + (window.innerHeight / window.innerWidth));
        bSUPER_SCALE_MOD = 0.89;
        bSuper.style.scale = bSUPER_SCALE_MOD;
        for (let piece = 0; piece < pieces.length; piece++) {
            pieces[piece].style.height = "25vmin";
        }
    }
}



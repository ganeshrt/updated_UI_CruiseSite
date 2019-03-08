
// To avoid Ctrl+U and ctrl+C on website

document.onkeydown = function (e) {
    if (e.ctrlKey &&
        (e.keyCode === 67 ||
         e.keyCode === 86 ||
         e.keyCode === 85 ||
         e.keyCode === 117)) {
        alert('Sorry\nNo Ctrl+' + String.fromCharCode(e.keyCode) + ' is allowed. Be creative!');
        return false;
    } else {
        return true;
    }
};


// TO avoid rigth click on website
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);


function increament() {
    document.getElementById('num').stepUp(1);

}

function decrement() {
    document.getElementById('num').stepUp(-1);

}
let btn = document.getElementById("greetBtn");
let input = document.getElementById("username");
let greeting = document.getElementById("greeting");
btn.onclick = function () {
    if (input.value !== "") {
        greeting.innerText = "Hello, " + input.value;
    }
};
let boxes = document.getElementsByClassName("box");
for (let i = 0; i < boxes.length; i++) {
    boxes[i].onclick = function () {
        this.style.backgroundColor = this.dataset.color;
        this.style.color = "white";
    };
}
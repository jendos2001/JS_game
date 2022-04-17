function store(){
    const input = document.getElementById("input");
    const name = input.value;
    localStorage.setItem("gamer_name", name);
    document.location.href = ("./main.html");

}
function read() {
    if(localStorage.hasOwnProperty("gamer_name")){
        let name = localStorage.getItem("gamer_name");
        let input = document.getElementById("input");
        input.value = name;
    }
}
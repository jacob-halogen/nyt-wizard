(() => {
    const previousElement = document.getElementById("NYT-wizard-activator");
    if (previousElement)
    {
        previousElement.remove();
    }

    function startSolver()
    {
        let solver;
        const currURLText = document.URL;
        const currURLObj = new URL(currURLText);
        const currURL = currURLObj.origin + currURLObj.pathname;
        if (currURL.includes("wordle")) solver = new WordleHandler();
        else if (currURL.includes("spelling-bee")) solver = new SpellingBeeHandler();
        else if (currURL.includes("pips")) solver = new PipsHandler();

        console.log(solver.getData());
    }

    var activator = document.createElement("div");
    activator.id = "NYT-wizard-activator";
    activator.style.position = "fixed";
    activator.style.width = "calc(100% - 20px)";
    activator.style.height = "75px";
    activator.style.bottom = "10px";
    activator.style.right = "10px";
    activator.style.left = "10px";
    activator.style.background = "Purple";
    activator.style.display = "flex";
    activator.style.alignItems = "center";
    activator.style.justifyContent = "center";
    activator.style.gap = "25px";
    activator.style.border = "5px solid GoldenRod";
    activator.style.borderRadius = "5px";
    activator.style.zIndex = 100;

    var text = document.createElement("p");
    text.textContent = "NYT Wizard";
    text.style.color = "GoldenRod";
    text.style.fontWeight = "bold";
    
    var button = document.createElement("button");
    button.addEventListener("click", startSolver);
    button.textContent = "Solve!";
    button.style.color = "GoldenRod";
    button.style.border = "2px solid GoldenRod";
    button.style.backgroundColor = "Purple";
    button.style.fontWeight = "bold";
    button.style.padding = "15px 25px";

    activator.appendChild(text);
    activator.appendChild(button);
    document.body.appendChild(activator);
})();
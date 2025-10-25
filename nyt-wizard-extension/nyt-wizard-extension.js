(() => {
    const previousElement = document.getElementById("NYT-wizard-activator");
    if (previousElement)
    {
        previousElement.remove();
    }

    async function startSolver()
    {
        let data;
        const currURLText = document.URL;
        const currURLObj = new URL(currURLText);
        const currURL = currURLObj.origin + currURLObj.pathname;
        if (currURL.includes("wordle")) data = W_getData();
        else if (currURL.includes("spelling-bee")) data = SB_getData();
        else if (currURL.includes("pips")) data = await P_getData();

        console.log(data);
    }

    function W_getData()
    {
        const squares = document.getElementsByClassName("Tile-module_tile__UWEHN");
        const data = [];
        let letterNo = 0;
        let currentWord = [];

        for (let square of squares) 
        {
            if (letterNo === 5)
            {
                letterNo = 0;
                data.push(currentWord);
                currentWord = [];
            }

            letterNo++;
            const letter = square.textContent;
            const state = square.getAttribute("data-state");
            if (state === "empty") continue;
            currentWord.push([letter, state]);
        }

        data.push(currentWord);

        const jsonData = JSON.stringify(data);
        W_inputData("tests");
        return jsonData;
    }

    function W_inputData(guess)
    {
        const keyElements = document.getElementsByClassName("Key-module_key__kchQI");
        const keys = Object.assign({}, ...Array.from(keyElements).map((k) => ({[k.getAttribute("data-key")]: k})));

        for(letter of guess)
        {
            keys[letter].click();
        }

        keys["↵"].click();
    }

    function SB_getData()
    {
        const letterElements = document.getElementsByClassName("hive-cell outer");
        const letters = [];
        
        for (let element of letterElements)
        {
            letters.push(element.lastChild.textContent);
        }

        const centerElement = document.getElementsByClassName("hive-cell center");
        const centerLetter = centerElement[0].lastChild.textContent;

        const data = {"letters": letters, "center": centerLetter};
        const jsonData = JSON.stringify(data);
        
        SB_inputData(["flat"]);
        return jsonData;
    }

    function SB_inputData(words)
    {
        for (let word of words)
        {
            for (let letter of word)
            {
                injectFunction(clickHex, letter);
            }
            injectFunction(clickBeeSubmit);
        }
    }

    async function P_getData()
    {
        const dateElement = document.getElementById("portal-game-date").firstChild;
        const dateString = dateElement.textContent;
        const d = new Date(dateString)
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const convertedDate = `${year}-${month}-${day}`;

        const url = "https://www.nytimes.com/svc/pips/v1/" + convertedDate + ".json";
        
        const response = await fetch(url);
        let data = await response.json();
        data = JSON.parse(JSON.stringify(data));
        let biggestX = 0;
        let biggestY = 0;
        for (let region of data.easy.regions)
        {
            region.coords = region.indices;
            delete region.indices;

            for (let co of region.coords)
            {
                if (co[0] > biggestX) biggestX = co[0];
                if (co[1] > biggestY) biggestY = co[1];
            }
        }
        data.easy.board = [biggestX + 1, biggestY + 1];
        biggestX = 0;
        biggestY = 0;
        for (let region of data.medium.regions)
        {
            region.coords = region.indices;
            delete region.indices;

            for (let co of region.coords)
            {
                if (co[0] > biggestX) biggestX = co[0];
                if (co[1] > biggestY) biggestY = co[1];
            }
        }
        data.medium.board = [biggestX + 1, biggestY + 1];
        biggestX = 0;
        biggestY = 0;
        for (let region of data.hard.regions)
        {
            region.coords = region.indices;
            delete region.indices;

            for (let co of region.coords)
            {
                if (co[0] > biggestX) biggestX = co[0];
                if (co[1] > biggestY) biggestY = co[1];
            }
        }
        data.hard.board = [biggestX + 1, biggestY + 1];

        delete data.printDate
        delete data.editor
        delete data.easy.id
        delete data.easy.constructors
        delete data.easy.solution
        delete data.medium.id
        delete data.medium.constructors
        delete data.medium.solution
        delete data.hard.id
        delete data.hard.constructors
        delete data.hard.solution

        P_inputData(null);

        return data;
    }

    function P_inputData(layout)
    {
        injectFunction(clickDomino, 2);
    }

    function injectFunction(fn, ...args) {
        const script = document.createElement('script');
        script.textContent = `(${fn})(${args.map(a => JSON.stringify(a)).join(',')});`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    function clickDomino(id) {
        const domino = document.getElementById("domino-" + id + "-first");
        if (!domino) return;
        console.log(domino);

        const rect = domino.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        domino.dispatchEvent(new MouseEvent('mousedown', options));
        domino.dispatchEvent(new MouseEvent('mouseup', options));
        domino.dispatchEvent(new MouseEvent('click', options));
    }

    function clickHex(letter) {
        const hexElements = document.getElementsByClassName("hive-cell");
        const hexes = Object.assign({}, ...Array.from(hexElements).map((h) => ({[h.lastChild.textContent]: h.firstChild})));
        
        const el = hexes[letter];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        el.dispatchEvent(new MouseEvent('mousedown', options));
        el.dispatchEvent(new MouseEvent('mouseup', options));
        el.dispatchEvent(new MouseEvent('click', options));
    }

    function clickBeeSubmit() {
        const el = document.getElementsByClassName("hive-action__submit")[0];
        
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        el.dispatchEvent(new MouseEvent('mousedown', options));
        el.dispatchEvent(new MouseEvent('mouseup', options));
        el.dispatchEvent(new MouseEvent('click', options));
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
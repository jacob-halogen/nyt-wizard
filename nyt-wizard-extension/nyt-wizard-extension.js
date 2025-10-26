(() => {
    const previousElement = document.getElementById("NYT-wizard-activator");
    if (previousElement)
    {
        previousElement.remove();
    }

    async function startSolver()
    {
        const apiURL = "http://localhost:3000/";
        let data;
        const currURLText = document.URL;
        const currURLObj = new URL(currURLText);
        const currURL = currURLObj.origin + currURLObj.pathname;
        if (currURL.includes("wordle/")) 
        {
            data = W_getData();
            const solved = await fetch(apiURL + "wordle/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({data})
            });
            W_inputData((await solved.text()).toString());
        }
        else if (currURL.includes("spelling-bee")) 
        {
            data = SB_getData();
            const solved = await fetch(apiURL + "spelling-bee/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({data})
            });
            SB_inputData((await solved.text()).replaceAll(" ", ""));
        }
        else if (currURL.includes("pips")) 
        {
            data = await P_getData();
        }
        else if (currURL.includes("sudoku"))
        {
            data = S_getData();
            //console.log(JSON.stringify(data));
            const solved = await fetch(apiURL + "sudoku/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({data})
            });
            //const temp_output = [["5","6","3","3","5","7","2","8","4"],["8","5","6","1","2","3","7","6","5"],["7","2","6","4","5","6","2","3","3"],["6","3","4","5","6","7","8","9","8"],["7","6","5","5","2","2","6","1","2"],["2","8","4","9","1","2","3","1","3"],["9","8","8","7","4","5","4","3","3"],["1","9","2","8","7","6","9","3","4"],["1","9","2","3","1","2","3","4","3"]];
            S_inputData(data, (await solved.text()));
        }
        else if (currURL.includes("strands"))
        {
            data = ST_getData();
            const solved = await fetch(apiURL + "strands/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({data})
            });
            ST_inputData(await solved.text());
        }

        console.log(data);
    }

    async function T_inputData()
    {
        const tiles = document.getElementsByClassName("tls-tile");
        for (let tile of tiles) {
            for (let other_tile of tiles) {
                T_clickTile(tile);
                T_clickTile(other_tile);
                await sleep(10)
            }
        }
    }
    function T_clickTile(tile)
    {
        const rect = tile.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };
        tile.dispatchEvent(new MouseEvent('click', options));
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

        //W_inputData("tests");
        return JSON.stringify(data);
    }

    function W_inputData(guess)
    {
        const keyElements = document.getElementsByClassName("Key-module_key__kchQI");
        const keys = Object.assign({}, ...Array.from(keyElements).map((k) => ({[k.getAttribute("data-key")]: k})));

        for(letter of guess)
        {
            //console.log(letter);
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

        return jsonData;
    }

    async function SB_inputData(words)
    {
        words.replaceAll("[", "");
        words.replaceAll("'", "");
        words = words.split(",");
        for (let word of words)
        {
            for (let letter of word)
            {
                injectFunction(clickHex, letter);
                await sleep(100);
            }
            injectFunction(clickBeeSubmit);
            await sleep(1000);
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

        P_displayData(null);

        return data;
    }

    function P_displayData(layout)
    {
        
    }

    function S_getData()
    {
        const data = [];
        const cells = document.getElementsByClassName("su-cell");
        let cellNo = 0;
        let currentRow = [];
        
        for (let cell of cells)
        {
            if (cellNo === 9)
            {
                cellNo = 0;
                data.push(currentRow);
                currentRow = [];
            }

            cellNo++;
            const number = cell.getElementsByClassName("su-cell__value");
            if (number && number.length > 0)
            {
                currentRow.push(number[0].getAttribute("data-number"));
            }
            else
            {
                currentRow.push("");
            }
        }

        data.push(currentRow);

        return data;
    }

    async function S_inputData(inputGrid, outputGrid)
    {
        //outputGrid = Array.from(outputGrid);
        outputGrid = eval(outputGrid);
        for (let row in outputGrid)
        {
            //console.log("row - " + row);
            for (let column in outputGrid[row])
            {
                //console.log("col - " + column);
                if (inputGrid[row][column] === "")
                {
                    injectFunction(clickSudokuCell, parseInt(row*9)+parseInt(column));
                    injectFunction(clickSudokuNumber, outputGrid[row][column]);
                    await sleep(100);
                }
            }
        }
    }

    function ST_getData()
    {
        const data = [];
        const letterButtons = document.getElementsByClassName("styles-module_strandsBtn__xobCT styles-module_item__ZXXc7");
        let letterNo = 0;
        let currentRow = [];

        for (let bar of letterButtons)
        {
            if (letterNo === 6)
            {
                letterNo = 0;
                data.push(currentRow);
                currentRow = [];
            }
            
            letterNo++;
            currentRow.push({ 
                "id": bar.id.split("-")[1],
                "letter": bar.textContent.toLowerCase()
            });
        }

        data.push(currentRow);

        return data;
    }

    async function ST_inputData(words)
    {
        words = words.replaceAll("(", "[");
        words = words.replaceAll(")", "]");
        words = eval(words);
        //const letterButtons = document.getElementsByClassName("styles-module_strandsBtn__xobCT styles-module_item__ZXXc7");
        //const buttons = Object.assign({}, ...Array.from(letterButtons).map((b) => ({[b.id.split("-")[1]]: b})));
        
        console.log(words);
        for (let word of words)
        {
            let lastLetter;
            for (let letter_id of word[1])
            {
                injectFunction(clickStrandsLetter, letter_id);
                await sleep(50);
                lastLetter = letter_id;
            }
            injectFunction(clickStrandsLetter, lastLetter);
            await sleep(250);
        }
    }

    function sleep(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function injectFunction(fn, ...args) {
        const script = document.createElement('script');
        script.textContent = `(${fn})(${args.map(a => JSON.stringify(a)).join(',')});`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    function clickStrandsLetter(id)
    {
        console.log("button-" + id);
        const el = document.getElementById("button-" + id);
        console.log(el);
        
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        el.dispatchEvent(new MouseEvent('mousedown', options));
        el.dispatchEvent(new MouseEvent('mouseup', options));
        el.dispatchEvent(new MouseEvent('click', options));
    }

    function clickSudokuCell(id)
    {
        const el = document.getElementsByClassName("su-cell");

        let correctCell;
        for (let e of el)
        {
            if (e.getAttribute("data-cell") == id){
                correctCell = e;
                break;
            }
        }
        //console.log(correctButton);
        
        const rect = correctCell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        correctCell.dispatchEvent(new MouseEvent('mousedown', options));
        correctCell.dispatchEvent(new MouseEvent('mouseup', options));
        correctCell.dispatchEvent(new MouseEvent('click', options));
    }

    function clickSudokuNumber(number)
    {
        //console.log(number);
        const el = document.getElementsByClassName("su-keyboard__svg");

        let correctButton;
        for (let e of el)
        {
            if (e.getAttribute("data-candidate") == number){
                correctButton = e.parentNode.parentNode;
                break;
            }
        }
        //console.log(correctButton);
        
        const rect = correctButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        correctButton.dispatchEvent(new MouseEvent('mousedown', options));
        correctButton.dispatchEvent(new MouseEvent('mouseup', options));
        correctButton.dispatchEvent(new MouseEvent('click', options));
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

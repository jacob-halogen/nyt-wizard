class WordleHandler
{
    getData()
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
        
        return jsonData;
    }

    inputData(guess)
    {
        const keyElements = document.getElementsByClassName("Key-module_key__kchQI");
        const keys = Object.assign({}, ...Array.from(keyElements).map((k) => ({[k.getAttribute("data-key")]: k})));

        for(letter of guess)
        {
            keys[letter].click();
        }

        keys["↵"].click();
    }
}
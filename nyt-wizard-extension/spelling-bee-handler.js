class SpellingBeeHandler
{
    getData()
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

    inputData(words)
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

    injectFunction(fn, ...args) {
        const script = document.createElement('script');
        script.textContent = `(${fn})(${args.map(a => JSON.stringify(a)).join(',')});`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    clickHex(letter) {
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

    clickBeeSubmit() {
        const el = document.getElementsByClassName("hive-action__submit")[0];
        
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const options = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        el.dispatchEvent(new MouseEvent('mousedown', options));
        el.dispatchEvent(new MouseEvent('mouseup', options));
        el.dispatchEvent(new MouseEvent('click', options));
    }
}
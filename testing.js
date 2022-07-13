const Jimp = require("jimp");
const fs = require("fs");

function marginalize(text, margin) {
    let output = [];
    if ((text.length) >= margin) {
        let words = text.split(' ');
        let wordcount = 0;
        while (true) {
            let line = "";
            while (wordcount < words.length) {
                if (line.length <= margin && (line.length + words[wordcount].length) <= margin) {
                    line += words[wordcount] + " ";
                    wordcount += 1;
                } else {
                    break;
                }
            }
            output.push(line);
            if (wordcount == words.length) {
                break;
            }
        }
        return output;
    } else {
        output.push(text);
        return output;
    }
}

async function addText(lines) {
    const image = await Jimp.read("assets/spooderman.jpg");
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    for (let i = 0; i < lines.length; i++) {
        image.print(font, 50, 150 + (i*36), lines[i]);
    }
    image.write("output.jpg");
};

fs.readFile('./assets/texts.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        const texts = data.split('|');
        const text = texts[Math.floor(Math.random()*texts.length)];
        console.log(text);
        const lines = marginalize(text, 33);
        console.log("FINAL TEXT:\n" + lines);
        addText(lines);
    }
});
import { writeFileSync } from 'fs';
import { NekoMap, Vector2 } from '../core/NekoMap.js';
import { createInterface } from 'readline/promises';
import { stdin, stdout } from 'process';

let pos = [ 1, 1 ];

const map = new NekoMap();

const reader = createInterface({
    input: stdin,
    output: stdout,
});

reader.on('line', async x => {
    const newPos = [...pos];
    switch (x) {
        case 'up': {
            newPos[1]--;
            break;
        }
        case 'right': {
            newPos[0]++;
            break;
        }
        case 'left': {
            newPos[0]--;
            break;
        }
        case 'down': {
            newPos[1]++;
            break;
        }
    }

    if (map.canMoveTo(newPos as unknown as Vector2)) {
        pos = newPos;
        console.log('MOVED');
        writeFileSync('output.png', await map.render(pos as unknown as Vector2));
    } else {
        console.log('COLLIDE');
    }
});

map.render(pos as unknown as Vector2).then(x => writeFileSync('output.png', x));
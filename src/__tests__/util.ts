import { Util } from '../structures/util/Util.js';

interface Data {
    id: number
    name: string
    desc: string
}

const datas: Data[] = [
    {
        id: 1,
        desc: 'hello',
        name: 'ruben',
    },
    {
        id: 2,
        desc: 'test',
        name: 'lynn',
    },
    {
        id: 3,
        desc: 'test',
        name: 'pablo',
    },
];

console.log(
    Util.searchMany(
        datas,
        'n',
        [
            'id',
            'name',
        ],
    ),
);
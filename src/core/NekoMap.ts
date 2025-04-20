import { Collection } from 'discord.js';
import { createCanvas, Image, loadImage } from '@napi-rs/canvas';
import { resolve } from 'path';
import jsonMap from '../map/data.json' with { type: 'json' };

export type Vector2 = readonly [ x: number, y: number ]

export class NekoMap {
    private static readonly _TileSize = 16;
    private static readonly _TileOffset = NekoMap._TileSize / 2;
    private static readonly _CameraZoom = 4;
    private static readonly _Player = resolve('src', 'map', 'player.png');
    private static readonly _Path = resolve('src', 'map', 'data.png');
    private static readonly _CanvasVector = [
        NekoMap._CameraZoom * 3 * NekoMap._TileSize + NekoMap._TileSize,
        NekoMap._CameraZoom * 2 * NekoMap._TileSize + NekoMap._TileSize,
    ] as Vector2;
    private static readonly _MapOffset: Vector2 = [
        NekoMap._CanvasVector[0] / 2 - NekoMap._TileOffset,
        NekoMap._CanvasVector[1] / 2 - NekoMap._TileOffset,
    ];
    private static readonly _TileCount: Vector2 = [
        NekoMap._CanvasVector[0] / NekoMap._TileSize,
        NekoMap._CanvasVector[1] / NekoMap._TileSize,
    ];
    private static readonly _CollisionLayer = jsonMap.layers.find(x => x.name === 'collision')!;

    private readonly _cache = new Collection<string, Image>();

    public constructor() {
    }

    public canMoveTo(pos: Vector2) {
        if (this._isCollidable(pos)) {
            return false;
        }

        return true;
    }

    public async render(pos: Vector2) {
        const canvasPos = this._convertToRealPositions(pos);
        const canvas = createCanvas(...NekoMap._CanvasVector);
        const ctx = canvas.getContext('2d');

        const map = await this.load(NekoMap._Path);
        const player = await this.load(NekoMap._Player);

        ctx.drawImage(
            map, 
            canvasPos[0] * NekoMap._TileSize + NekoMap._MapOffset[0],
            canvasPos[1] * NekoMap._TileSize + NekoMap._MapOffset[1],
        );

        ctx.drawImage(player, NekoMap._MapOffset[0], NekoMap._MapOffset[1], NekoMap._TileSize, NekoMap._TileSize);

        return canvas.toBuffer('image/png');
    }

    private async _traverse(canvasPos: Vector2, fn: (tileIndex: Vector2) => void | Promise<void>) {
        const xOffset = Math.floor(NekoMap._TileCount[0] / 2);
        const yOffset = Math.floor(NekoMap._TileCount[1] / 2);

        for (let x = canvasPos[0] - xOffset; x <= canvasPos[0] + xOffset;x++) {
            if (x < 0) {
                continue;
            }

            for (let y = canvasPos[1] - yOffset; y <= canvasPos[1] + yOffset;y++) {
                if (y < 0) {
                    continue;
                }

                await fn([ x, y ]);
            }
        }
    }

    private _tileToWorldPosition(tileIndex: Vector2) {
        return [ tileIndex[0] * NekoMap._TileSize, tileIndex[1] * NekoMap._TileSize ] as Vector2;
    }

    private _tileToLayerIndex(tileIndex: Vector2) {
        return tileIndex[0] + tileIndex[1] * NekoMap._CollisionLayer.width;
    }

    private _isCollidable(tileIndex: Vector2) {
        const tileType = NekoMap._CollisionLayer.data[this._tileToLayerIndex(tileIndex)];
        return tileType !== 0;
    }

    private _convertToRealPositions(vec: Vector2) {
        return [ -vec[0], -vec[1] ] as Vector2;
    }

    private async load(imgPath: string) {
        const existing = this._cache.get(imgPath);
        if (existing) {
            return existing;
        }

        const img = await loadImage(imgPath);
        this._cache.set(imgPath, img);

        return img;
    }
}
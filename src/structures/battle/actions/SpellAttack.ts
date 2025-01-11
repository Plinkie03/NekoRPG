import { Hit } from "./Hit.js";

export class SpellAttack extends Hit {
    public constructor(...params: ConstructorParameters<typeof Hit>) {
        super(...params)
        this.setAttackerVisibility()
    }

    public static new(...params: [...Parameters<typeof Hit["from"]>, multiplier: number ]) {
        return new this(...params)
    }
}
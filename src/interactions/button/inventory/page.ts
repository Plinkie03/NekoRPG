import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";
import { DisplayInventoryResponse } from "../../../structures/static/responses/DisplayInventoryResponse.js";

export enum ActionType {
    Back,
    Next,
    Stay
}

export default new DiscordInteractionHandler({
    id: 1,
    ownerOnly: true,
    type: DiscordInteractionType.Button,
    args: [
        {
            name: "user",
            type: ArgType.User,
            description: emptyString,
            required: true
        },
        {
            name: "page",
            type: ArgType.Integer,
            description: emptyString,
            required: true
        },
        {
            name: "action",
            type: ArgType.Enum,
            enum: ActionType,
            description: emptyString,
            required: true
        }
    ],
    async execute(payload) {
        const [, page, action ] = payload.args

        return DisplayInventoryResponse.from(
            payload.instance,
            payload.extras,
            action === ActionType.Back ? page - 1 : action === ActionType.Next ? page + 1 : page 
        )
    },
})
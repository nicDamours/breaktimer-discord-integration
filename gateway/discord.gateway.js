const BaseApiGateway = require("./api.js");


class DiscordGateway extends BaseApiGateway {
    /**
     * @return {Promise<number>}
     */
    async getCurrentUserId() {
        const { data: currentUser } = await this.get('users/@me');
        return currentUser.id
    }
}
module.exports = DiscordGateway;

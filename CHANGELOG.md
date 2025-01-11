# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.4.1](https://github.com/Plinkie03/NekoRPG/compare/v1.4.0...v1.4.1) (2025-01-11)


### Features

* **Iron:** Add full iron set ([af214c9](https://github.com/Plinkie03/NekoRPG/commit/af214c912f2530a7929e236ed9886460be073d26))


### Bug Fixes

* **Action:** Not executing deeper hierarchies ([e05cded](https://github.com/Plinkie03/NekoRPG/commit/e05cdedfdc0b11d33fa2e7424b595e1bd98714f8))
* **Berserk:** Listen for spell attacks ([a1a20a1](https://github.com/Plinkie03/NekoRPG/commit/a1a20a1e81030210f10f2c60978622611543ade1))
* **NekoResourceCache#getValidId:** Giving duplicated ids ([c3b6daa](https://github.com/Plinkie03/NekoRPG/commit/c3b6daa7cbc435759511ed88be7a6f9322b06882))
* **NekoResourceCache:** loading a lot of instances when filtering ([64b80b4](https://github.com/Plinkie03/NekoRPG/commit/64b80b4c1e2665f979e359f6ece0b3bea6b433e4))
* **Passives:** Certain passives were triggering for non players ([9fe1e96](https://github.com/Plinkie03/NekoRPG/commit/9fe1e96a3f7d77e1856cf01b2863f0f27f373310))
* **Rarity:** Remove test multiplier ([69e03cd](https://github.com/Plinkie03/NekoRPG/commit/69e03cdcb900d7f4dfb5c44d923ffed98a407f1c))
* Revert some Util#reply usages ([3a1b918](https://github.com/Plinkie03/NekoRPG/commit/3a1b9186eeab361a9c9ccdd1d032c2eb1141e281))
* **Util#reply:** Account for modal updates in messages ([e01a079](https://github.com/Plinkie03/NekoRPG/commit/e01a079d640875aa6edb1d0c49f56d8f05114c8a))


### Chores

* **ChallengeCommand:** disable ([6935700](https://github.com/Plinkie03/NekoRPG/commit/6935700d120a32dcdfed8fef56eb651556ca6dd4))
* Change most Player#give calls to Player#giveSimple ([d76364b](https://github.com/Plinkie03/NekoRPG/commit/d76364b218c9ea776d5a316e086b5518767c4ad6))
* **Command:** Add #disabled property ([4c8ac66](https://github.com/Plinkie03/NekoRPG/commit/4c8ac667bb7545de51a7c351210a2a990910e6dd))
* **FightCommand:** Rename to hunt ([dddd49f](https://github.com/Plinkie03/NekoRPG/commit/dddd49ff4344d9435f74130db929238a548a11ec))
* **Fight:** Now supports summons, added summon spell ([4fc6e54](https://github.com/Plinkie03/NekoRPG/commit/4fc6e547ef4e3f95130dbbad570e073f4f703c15))
* **IronSword:** Recipe modified ([79e2827](https://github.com/Plinkie03/NekoRPG/commit/79e2827b52150a7f3f1e61c5a3fcff1df2c0cf7c))
* **ItemPassive:** Made constants for certain action types and gear types ([49a51c1](https://github.com/Plinkie03/NekoRPG/commit/49a51c1f385a90d8fa3e36a3b5a93ad1ee2cb877))
* **Passives:** Add some new passives ([a451a9a](https://github.com/Plinkie03/NekoRPG/commit/a451a9ac06e177891adbd4716d4e289613a91a01))
* **Passives:** Now append triggers to actions ([9585913](https://github.com/Plinkie03/NekoRPG/commit/9585913a7d225ae8d9692e0c89bdc8e200a3898b))
* **PlayerInventoryItem:** Now have random passives ([1a4ed29](https://github.com/Plinkie03/NekoRPG/commit/1a4ed29c7d844f9c869b4474b8cbb3ce929a66c9))
* Restrict action limit to 1 day ([22eef3e](https://github.com/Plinkie03/NekoRPG/commit/22eef3edf9a0f0bf55872287ae54149afaa217e4))


### Code Refactoring

* **Actions:** Created SpellCast and SpellAttack for spells ([9f51704](https://github.com/Plinkie03/NekoRPG/commit/9f517042119cf5002a2ec82e91884149970071de))
* **EntityModdedStats:** Make unique method for steps ([662291b](https://github.com/Plinkie03/NekoRPG/commit/662291b2168075a15183bccd1e22df73d53d5e38))
* **Game:** Cache in its own class ([902ed06](https://github.com/Plinkie03/NekoRPG/commit/902ed06f4fa994519dab0c09c353d8b90406596e))
* **Monster#give:** Now Monster#loot ([b767caf](https://github.com/Plinkie03/NekoRPG/commit/b767caf9df4691419ebc40f4ffd618fe4a15d505))
* Move command responses of actions to the responses folder ([35797e9](https://github.com/Plinkie03/NekoRPG/commit/35797e9941a85f251542394cde92d38a77ba56f9))
* **Replies:** Migrate to Util#reply ([af36cb4](https://github.com/Plinkie03/NekoRPG/commit/af36cb4433c513f162bb85b538cccf87aa96b6e7))
* **Rewards:** Can now resolve items in RewardData#items ([769c1cb](https://github.com/Plinkie03/NekoRPG/commit/769c1cb17f51f9d3cf782db942bbf013d75cec17))

## [1.4.0](https://github.com/Plinkie03/NekoRPG/compare/v1.3.0...v1.4.0) (2025-01-04)


### Features

* **Command:** Add info/monster ([9fb6f0d](https://github.com/Plinkie03/NekoRPG/commit/9fb6f0d0dfddf5b2c98036ea9de5daec77458698))


### Bug Fixes

* **Fight:** Not properly using spells ([e2ff45a](https://github.com/Plinkie03/NekoRPG/commit/e2ff45a1a3a1683c7763eccfd9042f47f9542edb))
* **InventoryItem#equipSpell:** Not awaiting async code ([80015e0](https://github.com/Plinkie03/NekoRPG/commit/80015e00eccada9bc22d2efafcd50b6db0680fa4))
* **Node#finish,Item#craft:** Incorrectly giving rewards ([6cc7937](https://github.com/Plinkie03/NekoRPG/commit/6cc793791279d26bd32b0fdd21ac1f2ef5ff519c))
* **Util:** Util#reply did not respect replied interactions ([82d28bc](https://github.com/Plinkie03/NekoRPG/commit/82d28bcd55139bf4e7a259ad7e3787dc39d9aa6e))


### Chores

* Add a lot of new items and nodes, along with emojis ([dd6d375](https://github.com/Plinkie03/NekoRPG/commit/dd6d375b03ae51b0aa7da0f7be27832cb8bf691f))
* **ArrowRain:** No longer inflicts poison ([a8c5cf9](https://github.com/Plinkie03/NekoRPG/commit/a8c5cf9549832b83a2fde15f93da0a7e56b0a94c))
* **ArrowRain:** Now have a price ([3816192](https://github.com/Plinkie03/NekoRPG/commit/3816192e7603f103bbd8d1fd95cd88f93fea264e))
* Update discord.js ([e6a4839](https://github.com/Plinkie03/NekoRPG/commit/e6a4839f5c7e039cd54b0af6e4f8965380c92472))
* **WoodenChest:** Edit drop to spell ([d0a78a9](https://github.com/Plinkie03/NekoRPG/commit/d0a78a9c2e9b488feab41fd829a6e04382a807b9))


### Code Refactoring

* **ItemEmbed:** Use options ([b773405](https://github.com/Plinkie03/NekoRPG/commit/b77340518d4d3c707a24ab04601c645177f960e0))
* **Responses:** Move info responses to its own folder ([9d33c3e](https://github.com/Plinkie03/NekoRPG/commit/9d33c3ef6872e88945b96283286d0a3e1c01d2ff))

## [1.3.0](https://github.com/Plinkie03/NekoRPG/compare/v1.2.0...v1.3.0) (2025-01-03)


### Features

* **InventoryItem:** Add open option for lootboxes ([a8a2978](https://github.com/Plinkie03/NekoRPG/commit/a8a2978b32ec938c0b71575e968e5decce9674fc))
* **Item:** Add lootboxes ([9a86307](https://github.com/Plinkie03/NekoRPG/commit/9a863072c6f44bed465af840923769a853843f80))


### Bug Fixes

* **Item:** Disallow equipping materials ([d63527a](https://github.com/Plinkie03/NekoRPG/commit/d63527a8e3a325a9ade701b93e1dc83decb37444))
* **ProfileEmbed:** Incorrect naming for titles ([6a11939](https://github.com/Plinkie03/NekoRPG/commit/6a11939a774a30db3d125618336a9b9ed5bf05d3))
* **Util:** Util#createActionRows malfunction ([6fb52bc](https://github.com/Plinkie03/NekoRPG/commit/6fb52bcc7fef054769d6ffb45908cfcc42c29d15))


### Chores

* **Slime:** Remove spells ([8255f11](https://github.com/Plinkie03/NekoRPG/commit/8255f115818b5ec916e90f9f09832f355e16189c))
* update release script ([bd0ad8a](https://github.com/Plinkie03/NekoRPG/commit/bd0ad8a7c823b91af4843ef79e2542644ebf574b))
* **WoodenChest:** Add emoji ([f1c4fa9](https://github.com/Plinkie03/NekoRPG/commit/f1c4fa98ef5a0589dd6a567a4757b0d43ec930e8))


### Code Refactoring

* move profile command to individual categories ([6f0426d](https://github.com/Plinkie03/NekoRPG/commit/6f0426d54c798e00283aa600acd2fbbeb18c7388))
* **Player:** getPlayer no longer exists, replaced with getPlayerBy(Id|User) ([f8a3a96](https://github.com/Plinkie03/NekoRPG/commit/f8a3a966d670183207998c889daad8dd8264311b))
* **Responses:** No longer require pages to positioning ([b67e1fe](https://github.com/Plinkie03/NekoRPG/commit/b67e1fe6eb4c2c75d9ce3a26bdaca95fcc7daf26))

## [1.2.0](https://github.com/Plinkie03/NekoRPG/compare/v1.1.0...v1.2.0) (2025-01-02)


### Features

* added info/node command ([55ddf14](https://github.com/Plinkie03/NekoRPG/commit/55ddf149779d487e99567140d88d43f18b8afe8b))
* Added profile command ([1542b56](https://github.com/Plinkie03/NekoRPG/commit/1542b56bdae9bcd6c5434f4ebf2eaf48ad03aeb8))

## 1.1.0 (2025-01-02)


### Chores

* initial commit. ([d7b521e](https://github.com/Plinkie03/NekoRPG/commit/d7b521ebd4fc3ca9e1d98355ab75460d95cd910b))
* modify release script ([09bf5c1](https://github.com/Plinkie03/NekoRPG/commit/09bf5c12513014b8add216b486c475435ebf198b))
* modify release script again ([a9a6939](https://github.com/Plinkie03/NekoRPG/commit/a9a693970344c7a5f46e332992ec9afea924b299))
* **release:** 1.0.0 ([76508ec](https://github.com/Plinkie03/NekoRPG/commit/76508ecddae0e91270797bb850f27666766b540d))
* **release:** 1.0.0 ([ffcfce3](https://github.com/Plinkie03/NekoRPG/commit/ffcfce3f0a12b8744ca83f867c3ccb5cc9785778))
* **release:** 1.0.1 ([ea6b237](https://github.com/Plinkie03/NekoRPG/commit/ea6b237cbc1a77a3ae94c89622793d4999c61b5d))


### Code Refactoring

* move embeds to its own folder ([02a27ca](https://github.com/Plinkie03/NekoRPG/commit/02a27ca783de40d7b624141f6f19a1802714f553))
* move errors to its own folder ([7fd2bfb](https://github.com/Plinkie03/NekoRPG/commit/7fd2bfb8a5c749a36518c2acb745cf18f9866233))
* move responses to its own folder ([29e5856](https://github.com/Plinkie03/NekoRPG/commit/29e58568e6d158e38e03fffda1cd07a33608a081))

## [1.0.1](https://github-lynnux/Lynnux-useless-codes/NekoRPG/compare/v1.0.0...v1.0.1) (2025-01-01)


### Chores

* initial commit. ([d7b521e](https://github-lynnux/Lynnux-useless-codes/NekoRPG/commit/d7b521ebd4fc3ca9e1d98355ab75460d95cd910b))
* **release:** 1.0.0 ([76508ec](https://github-lynnux/Lynnux-useless-codes/NekoRPG/commit/76508ecddae0e91270797bb850f27666766b540d))

# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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

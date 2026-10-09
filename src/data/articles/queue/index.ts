import { mlbbQueueArticles } from "./mlbb-queue";
import { freefireQueueArticles } from "./freefire-queue";
import { robloxQueueArticles } from "./roblox-queue";
import { minecraftQueueArticles } from "./minecraft-queue";
import { genshinQueueArticles } from "./genshin-queue";
import { eafcQueueArticles } from "./eafc-queue";
import { battleroyaleQueueArticles } from "./battleroyale-queue";
import { gearQueueArticles } from "./gear-queue";
import { kidstechQueueArticles } from "./kidstech-queue";
import { productivityQueueArticles } from "./productivity-queue";

export const queuedArticles = [
  ...mlbbQueueArticles,
  ...freefireQueueArticles,
  ...robloxQueueArticles,
  ...minecraftQueueArticles,
  ...genshinQueueArticles,
  ...eafcQueueArticles,
  ...battleroyaleQueueArticles,
  ...gearQueueArticles,
  ...kidstechQueueArticles,
  ...productivityQueueArticles,
];

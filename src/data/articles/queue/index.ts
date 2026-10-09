import { mlbbQueueArticles } from "./mlbb-queue";
import { freefireQueueArticles } from "./freefire-queue";
import { robloxQueueArticles } from "./roblox-queue";
import { minecraftQueueArticles } from "./minecraft-queue";
import { genshineafcQueueArticles } from "./genshineafc-queue";

export const queuedArticles = [
  ...mlbbQueueArticles,
  ...freefireQueueArticles,
  ...robloxQueueArticles,
  ...minecraftQueueArticles,
  ...genshineafcQueueArticles,
];

import { LevelEnum } from "./enum";

export function levelUp(currentLevel: LevelEnum): LevelEnum | string {
  const levels = Object.values(LevelEnum);
  const currentIndex = levels.indexOf(currentLevel);

  if (currentIndex === -1) {
    return 'Invalid level';
  }

  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1] as LevelEnum;
  } else {
    return 'Maximum level reached';
  }
}

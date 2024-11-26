import * as migration_20241126_064338_migration from './20241126_064338_migration';

export const migrations = [
  {
    up: migration_20241126_064338_migration.up,
    down: migration_20241126_064338_migration.down,
    name: '20241126_064338_migration'
  },
];

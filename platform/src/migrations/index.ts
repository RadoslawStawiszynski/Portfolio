import * as migration_20260616_194548_typed_block_fields from './20260616_194548_typed_block_fields';

export const migrations = [
  {
    up: migration_20260616_194548_typed_block_fields.up,
    down: migration_20260616_194548_typed_block_fields.down,
    name: '20260616_194548_typed_block_fields'
  },
];

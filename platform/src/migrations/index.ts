import * as migration_20260616_194548_typed_block_fields from './20260616_194548_typed_block_fields';
import * as migration_20260616_195812_add_todos from './20260616_195812_add_todos';

export const migrations = [
  {
    up: migration_20260616_194548_typed_block_fields.up,
    down: migration_20260616_194548_typed_block_fields.down,
    name: '20260616_194548_typed_block_fields'
  },
  {
    up: migration_20260616_195812_add_todos.up,
    down: migration_20260616_195812_add_todos.down,
    name: '20260616_195812_add_todos'
  },
];

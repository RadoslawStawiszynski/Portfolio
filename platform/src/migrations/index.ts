import * as migration_20260616_194548_typed_block_fields from './20260616_194548_typed_block_fields';
import * as migration_20260616_195812_add_todos from './20260616_195812_add_todos';
import * as migration_20260817_181605_faza4_invite_system_schema from './20260817_181605_faza4_invite_system_schema';
import * as migration_20260928_202820_education_description from './20260928_202820_education_description';
import * as migration_20260928_203201_skills_localized from './20260928_203201_skills_localized';

export const migrations = [
  {
    up: migration_20260616_194548_typed_block_fields.up,
    down: migration_20260616_194548_typed_block_fields.down,
    name: '20260616_194548_typed_block_fields',
  },
  {
    up: migration_20260616_195812_add_todos.up,
    down: migration_20260616_195812_add_todos.down,
    name: '20260616_195812_add_todos',
  },
  {
    up: migration_20260817_181605_faza4_invite_system_schema.up,
    down: migration_20260817_181605_faza4_invite_system_schema.down,
    name: '20260817_181605_faza4_invite_system_schema',
  },
  {
    up: migration_20260928_202820_education_description.up,
    down: migration_20260928_202820_education_description.down,
    name: '20260928_202820_education_description',
  },
  {
    up: migration_20260928_203201_skills_localized.up,
    down: migration_20260928_203201_skills_localized.down,
    name: '20260928_203201_skills_localized'
  },
];

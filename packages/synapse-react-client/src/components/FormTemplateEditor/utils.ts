import {
  FormTemplateField,
  FormTemplateStep,
} from '@sage-bionetworks/synapse-client'

export { moveItem } from '@/utils/functions/ArrayUtils'

/** Label for the per-step control that binds an unbound field into that step. */
export const BIND_FIELD_LABEL = 'Bind field'

let nextUiKeySeq = 0

/**
 * A step as the draft holds it: the properties it shows, by `schemaPath`, in order. The slot
 * settings for each of those properties live apart from the step, in `FieldSettingsByPath`.
 *
 * `uiKey` is a client-only stable identity, used as a React key and drag-and-drop sortable id.
 * Steps have no natural unique field (unlike fields, whose identity is their `schemaPath`), so the
 * editor tracks one here. It never leaves this component tree; `toFormTemplateSteps` drops it.
 */
export type EditableFormTemplateStep = Omit<FormTemplateStep, 'fields'> & {
  uiKey: string
  fieldPaths: string[]
}

/** Everything a `FormTemplateField` slot carries apart from the property it binds. */
export type FieldSettings = Omit<FormTemplateField, 'schemaPath'>

/** Each property's slot settings, keyed by `schemaPath`. */
export type FieldSettingsByPath = Record<string, FieldSettings>

/** The slot settings of a property that has none of its own yet. */
export const DEFAULT_FIELD_SETTINGS: FieldSettings = {
  uiDefinition: {},
  isPublic: false,
}

export function fieldSettingsFor(
  fieldSettings: FieldSettingsByPath,
  schemaPath: string,
): FieldSettings {
  return fieldSettings[schemaPath] ?? DEFAULT_FIELD_SETTINGS
}

/** Create a new empty step with a fresh identity. */
export function createEditableStep(): EditableFormTemplateStep {
  return {
    title: 'New Step',
    description: '',
    fieldPaths: [],
    uiKey: `step-${nextUiKeySeq++}`,
  }
}

/**
 * Split steps loaded from outside the editor into the draft's step structure and the slot
 * settings of each bound property. Lossless because a property binds to at most one slot.
 */
export function toEditableSteps(steps: FormTemplateStep[]): {
  steps: EditableFormTemplateStep[]
  fieldSettings: FieldSettingsByPath
} {
  const fieldSettings: FieldSettingsByPath = {}
  const editableSteps = steps.map(({ fields, ...step }) => {
    for (const { schemaPath, ...settings } of fields) {
      fieldSettings[schemaPath] = settings
    }
    return {
      ...step,
      fieldPaths: fields.map(f => f.schemaPath),
      uiKey: `step-${nextUiKeySeq++}`,
    }
  })
  return { steps: editableSteps, fieldSettings }
}

/** Join the draft's steps with their properties' slot settings into the steps a template stores. */
export function toFormTemplateSteps(
  steps: EditableFormTemplateStep[],
  fieldSettings: FieldSettingsByPath,
): FormTemplateStep[] {
  return steps.map(({ uiKey: _uiKey, fieldPaths, ...step }) => ({
    ...step,
    fields: fieldPaths.map(schemaPath => ({
      schemaPath,
      ...fieldSettingsFor(fieldSettings, schemaPath),
    })),
  }))
}

'use client';

import { useId } from 'react';

import {
  CONTENT_FIELDS,
  fieldDefault,
  PROJECT_CONTENT,
  PROJECT_FIELDS,
} from '@/constants/admin-fields';

import type { Field } from '@/constants/admin-fields';
import type { InputMap, ProjectInput, ProjectTemplate, SiteData } from '@/types/admin';

type FieldValues = InputMap & { site: SiteData };
type ContentFieldsProps<K extends keyof FieldValues> = {
  kind: K;
  value: FieldValues[K];
  onChange: (value: FieldValues[K]) => void;
  editing?: boolean;
  disabled?: boolean;
};
type FieldEditorProps = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
};
function replaceProperty(value: Record<string, unknown>, key: string, next: unknown) {
  const updated = { ...value };
  if (next === undefined) delete updated[key];
  else updated[key] = next;
  return updated;
}
function FieldEditor({ field, value, onChange, disabled }: FieldEditorProps) {
  const id = useId();
  if (field.fields || field.item) {
    if (field.optional && value === undefined) {
      return (
        <div className="admin-field">
          <button
            type="button"
            className="admin-button admin-button-secondary"
            disabled={disabled}
            onClick={() => onChange(fieldDefault(field))}
          >
            {field.label} 추가
          </button>
        </div>
      );
    }
    const items = Array.isArray(value) ? value : [];
    const objectValue = (value ?? {}) as Record<string, unknown>;
    const move = (index: number, offset: number) => {
      const next = [...items];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      onChange(next);
    };
    return (
      <fieldset className="admin-card admin-field" disabled={disabled}>
        <legend>
          {field.label}
          {field.item ? ` (${items.length}/${field.maxItems})` : ''}
        </legend>
        {field.optional && (
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => onChange(undefined)}
          >
            {field.label} 제거
          </button>
        )}
        {field.fields &&
          Object.entries(field.fields).map(([key, child]) => (
            <FieldEditor
              key={key}
              field={child}
              value={objectValue[key]}
              disabled={disabled}
              onChange={(next) => onChange(replaceProperty(objectValue, key, next))}
            />
          ))}
        {field.item && (
          <>
            {items.map((item, index) => (
              <div key={index} className="admin-card">
                <FieldEditor
                  field={field.item!}
                  value={item}
                  disabled={disabled}
                  onChange={(next) =>
                    onChange(items.map((current, i) => (i === index ? next : current)))
                  }
                />
                <div className="admin-actions">
                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    disabled={index === 0 || disabled}
                    aria-label={`${field.label} ${index + 1}번 위로 이동`}
                    onClick={() => move(index, -1)}
                  >
                    위로
                  </button>
                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    disabled={index === items.length - 1 || disabled}
                    aria-label={`${field.label} ${index + 1}번 아래로 이동`}
                    onClick={() => move(index, 1)}
                  >
                    아래로
                  </button>
                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    disabled={disabled}
                    aria-label={`${field.label} ${index + 1}번 삭제`}
                    onClick={() => onChange(items.filter((_, i) => i !== index))}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="admin-button admin-button-secondary"
              disabled={disabled || items.length >= (field.maxItems ?? 100)}
              onClick={() => onChange([...items, fieldDefault(field.item!)])}
            >
              {field.label} 추가
            </button>
          </>
        )}
      </fieldset>
    );
  }
  const required = !field.optional && !field.nullable && field.type !== 'textarea';
  const normalize = (next: string) =>
    next === '' && field.nullable ? null : next === '' && field.optional ? undefined : next;
  return (
    <div className="admin-field">
      <label htmlFor={id}>
        {field.label}
        {required && field.type !== 'checkbox' ? ' *' : ''}
      </label>
      {field.type === 'checkbox' ? (
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
      ) : field.type === 'select' ? (
        <select
          id={id}
          className="admin-input"
          value={String(value ?? '')}
          required={required}
          disabled={disabled}
          onChange={(event) => onChange(normalize(event.target.value))}
        >
          {field.optional && <option value="">기본값 사용</option>}
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          id={id}
          className="admin-input"
          rows={4}
          value={String(value ?? '')}
          maxLength={field.maxLength}
          disabled={disabled}
          aria-describedby={field.hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(normalize(event.target.value))}
        />
      ) : (
        <input
          id={id}
          className="admin-input"
          type={field.type ?? 'text'}
          value={typeof value === 'number' ? value : String(value ?? '')}
          required={required}
          maxLength={field.maxLength}
          pattern={field.pattern}
          min={field.type === 'number' ? 0 : undefined}
          max={field.type === 'number' ? 100000 : undefined}
          step={field.type === 'number' ? 1 : undefined}
          disabled={disabled}
          aria-describedby={field.hint ? `${id}-hint` : undefined}
          onChange={(event) =>
            onChange(
              field.type === 'number'
                ? event.target.value === ''
                  ? ''
                  : Number(event.target.value)
                : normalize(event.target.value),
            )
          }
        />
      )}
      {field.hint && (
        <small id={`${id}-hint`} className="admin-hint">
          {field.hint}
        </small>
      )}
    </div>
  );
}
function hasContent(value: unknown): boolean {
  if (typeof value === 'string') return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && typeof value === 'object' && Object.values(value).some(hasContent);
}
export function ContentFields<K extends keyof FieldValues>({
  kind,
  value,
  onChange,
  editing = false,
  disabled = false,
}: ContentFieldsProps<K>) {
  const fields = CONTENT_FIELDS[kind].fields!;
  const objectValue = value as unknown as Record<string, unknown>;
  const project = kind === 'projects' ? (value as ProjectInput) : undefined;
  const change = (key: string, next: unknown) => {
    if (key === 'template' && project && next !== project.template) {
      if (
        hasContent(project.content) &&
        !window.confirm('템플릿을 변경하면 기존 상세 콘텐츠가 초기화됩니다. 변경할까요?')
      )
        return;
      onChange({
        ...project,
        template: next,
        content: structuredClone(PROJECT_CONTENT[next as ProjectTemplate]),
      } as FieldValues[K]);
    } else {
      onChange(replaceProperty(objectValue, key, next) as FieldValues[K]);
    }
  };
  return (
    <div className="admin-fields">
      {Object.entries(fields).map(([key, field]) => (
        <FieldEditor
          key={key}
          field={field}
          value={objectValue[key]}
          disabled={disabled || (editing && key === 'slug')}
          onChange={(next) => change(key, next)}
        />
      ))}
      {project && (
        <FieldEditor
          key={project.template}
          field={PROJECT_FIELDS[project.template]}
          value={project.content}
          disabled={disabled}
          onChange={(content) => onChange({ ...project, content } as FieldValues[K])}
        />
      )}
    </div>
  );
}

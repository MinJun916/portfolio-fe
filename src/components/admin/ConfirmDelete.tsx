'use client';

import { AlertDialog } from 'radix-ui';

export default function ConfirmDelete({
  title,
  pending,
  onConfirm,
}: {
  title: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger
        className="admin-button-secondary admin-button-danger"
        disabled={pending}
      >
        삭제
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="admin-dialog-overlay" />
        <AlertDialog.Content className="admin-card admin-dialog">
          <AlertDialog.Title className="text-lg font-semibold">
            콘텐츠를 삭제할까요?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-sm text-stone-600">
            ‘{title}’ 콘텐츠가 영구 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel className="admin-button admin-button-secondary">
              취소
            </AlertDialog.Cancel>
            <AlertDialog.Action
              className="admin-button admin-button-destructive"
              onClick={onConfirm}
            >
              영구 삭제
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

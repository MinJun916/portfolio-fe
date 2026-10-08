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
        className="admin-button admin-button-secondary text-red-700"
        disabled={pending}
      >
        삭제
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-60 bg-black/30" />
        <AlertDialog.Content className="admin-card fixed top-1/2 left-1/2 z-60 w-[min(28rem,calc(100%_-_2rem))] -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-xl">
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
            <AlertDialog.Action className="admin-button bg-red-700" onClick={onConfirm}>
              영구 삭제
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

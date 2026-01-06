import Modal from './Modal/Modal.tsx';

interface ConfirmBoxProps {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmBox({
                                       title,
                                       description,
                                       confirmText = 'Підтвердити',
                                       cancelText = 'Скасувати',
                                       onConfirm,
                                       onCancel,
                                   }: ConfirmBoxProps) {
    return (
        <Modal title={title} onClose={onCancel} width="sm">
            {description && (
                <div className="text-sm text-gray-600">
                    {description}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <button
                    onClick={onCancel}
                    className="px-3 py-2 border rounded"
                >
                    {cancelText}
                </button>

                <button
                    onClick={onConfirm}
                    className="px-3 py-2 bg-green-600 text-white rounded"
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}

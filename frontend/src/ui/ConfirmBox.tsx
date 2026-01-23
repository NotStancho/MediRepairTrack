import Modal from './Modal/Modal.tsx';
import Button from './Button';

interface ConfirmBoxProps {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'default' | 'primary' | 'secondary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmBox({
                                       title,
                                       description,
                                       confirmText = 'Підтвердити',
                                       cancelText = 'Скасувати',
                                       confirmVariant = 'primary',
                                       onConfirm,
                                       onCancel,
                                   }: ConfirmBoxProps) {
    return (
        <Modal title={title} onClose={onCancel} width="sm">
            {description && (
                <div className="text-sm text-ink-muted">
                    {description}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    onClick={onCancel}
                    variant="secondary"
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    variant={confirmVariant}
                >
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
}

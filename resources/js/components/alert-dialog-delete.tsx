import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AlertDialogDelete: React.FC<{ open: boolean; handleCancel: () => void; handleDelete: () => void }> = ({ open, handleCancel, handleDelete }) => {
    return (
        <AlertDialog open={open} onOpenChange={handleCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn chắc chắn muốn xóa?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Đồng ý</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogDelete;

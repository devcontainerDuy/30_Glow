import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AlertDialogDelete: React.FC<{ open: boolean; cancel: () => void; handle: () => void }> = ({ open, cancel, handle }) => {
    return (
        <AlertDialog open={open} onOpenChange={cancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn chắc chắn muốn xóa?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancel}>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handle}>Đồng ý</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogDelete;

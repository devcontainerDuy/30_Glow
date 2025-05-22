import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDistricts, getProvinces, getWards } from '@/services/getMaps.service';
import type { District, Provinces, Ward } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type AddressSelectProps = {
    label: string;
    id: string;
    placeholder: string;
    items?: { id: number; name: string }[] | null;
    onValueChange: (value: string) => void;
    disabled?: boolean;
};

const AddressSelect = ({ label, id, placeholder, items, onValueChange, disabled }: AddressSelectProps) => (
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={id} className="text-right">
            {label}
        </Label>
        <Select onValueChange={onValueChange} disabled={disabled || !items}>
            <SelectTrigger className="col-span-3">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {items?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                    </SelectItem>
                ))}

                {!items?.length && (
                    <SelectItem value="0" disabled>
                        Không có dữ liệu
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    </div>
);

type DialogMapsProps<T> = {
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
};

export function DialogMaps<T extends { address?: string }>({ data, setData }: DialogMapsProps<T>) {
    const [open, setOpen] = useState(false);
    const [provinces, setProvinces] = useState<Provinces | null>(null);
    const [districts, setDistricts] = useState<District[] | null>(null);
    const [wards, setWards] = useState<Ward[] | null>(null);
    const [street, setStreet] = useState('');
    const [selected, setSelected] = useState({
        province: null as string | null,
        district: null as string | null,
        ward: null as string | null,
    });

    const { province: selectedProvince, district: selectedDistrict, ward: selectedWard } = selected;

    const addressParts = useMemo(
        () => ({
            province: provinces?.data.find((p) => p.id.toString() === selectedProvince)?.name || '',
            district: districts?.find((d) => d.id.toString() === selectedDistrict)?.name || '',
            ward: wards?.find((w) => w.id.toString() === selectedWard)?.name || '',
        }),
        [provinces, districts, wards, selectedProvince, selectedDistrict, selectedWard],
    );

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setProvinces(await getProvinces());
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (id: string) => {
        try {
            setSelected({ province: id, district: null, ward: null });
            setWards(null);
            setDistricts((await getDistricts(Number(id))).data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách quận/huyện:', error);
        }
    };

    const handleDistrictChange = async (id: string) => {
        try {
            setSelected((prev) => ({ ...prev, district: id, ward: null }));
            setWards((await getWards(Number(id))).data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phường/xã:', error);
        }
    };

    const handleSaveAddress = () => {
        if (!street || !selectedWard) {
            toast.error('Vui lòng nhập đầy đủ địa chỉ');
            return;
        }
        setData({ ...data, address: `${street}, ${addressParts.ward}, ${addressParts.district}, ${addressParts.province}` });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Input className="text-left" id="address" placeholder="Nhập địa chỉ" value={data.address} readOnly />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
                    <DialogDescription>Chỉnh sửa địa chỉ người dùng</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <AddressSelect
                        label="Tỉnh/Thành phố"
                        id="provinces"
                        placeholder="Chọn tỉnh/thành phố"
                        items={provinces?.data}
                        onValueChange={handleProvinceChange}
                    />

                    <AddressSelect
                        label="Quận/Huyện"
                        id="district"
                        placeholder="Chọn quận/huyện"
                        items={districts}
                        onValueChange={handleDistrictChange}
                        disabled={!selectedProvince}
                    />

                    <AddressSelect
                        label="Phường/Xã"
                        id="ward"
                        placeholder="Chọn phường/xã"
                        items={wards}
                        onValueChange={(id) => setSelected((prev) => ({ ...prev, ward: id }))}
                        disabled={!selectedDistrict}
                    />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="street" className="text-right">
                            Địa chỉ cụ thể
                        </Label>
                        <Input
                            id="street"
                            placeholder="Nhập địa chỉ cụ thể"
                            className="col-span-3"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" onClick={handleSaveAddress} disabled={!street || !selectedWard}>
                        Lưu địa chỉ
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

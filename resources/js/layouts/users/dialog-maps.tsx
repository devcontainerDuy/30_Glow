import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDistricts, getProvinces, getWards } from '@/services/getMaps.service';
import type {  District, Provinces, UserForm, Ward } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';



export function DialogMaps({ data, setData }: { data: UserForm; setData: (key: keyof UserForm, value: string) => void }) {
    const [open, setOpen] = useState(false);
    const [provinces, setProvinces] = useState<Provinces | null>(null);
    const [districts, setDistricts] = useState<District[] | null>(null);
    const [wards, setWards] = useState<Ward[] | null>(null);
    const [street, setStreet] = useState<string | null>(null);
    
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedWard, setSelectedWard] = useState<string | null>(null);

    const provinceName = useMemo(() => provinces?.data.find((p) => p.id.toString() === selectedProvince)?.name || '', [provinces, selectedProvince]);
    const districtName = useMemo(() => districts?.find((d) => d.id.toString() === selectedDistrict)?.name || '', [districts, selectedDistrict]);
    const wardName = useMemo(() => wards?.find((w) => w.id.toString() === selectedWard)?.name || '', [wards, selectedWard]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (id: string) => {
        try {
            setSelectedProvince(id);
            setSelectedDistrict(null);
            setSelectedWard(null);
            setWards(null);

            const districtsData = await getDistricts(Number(id));
            setDistricts(districtsData.data); // districtsData.data should be District[]
        } catch (error) {
            console.error('Lỗi khi lấy danh sách quận/huyện:', error);
        }
    };

    const handleDistrictChange = async (id: string) => {
        try {
            setSelectedDistrict(id);
            setSelectedWard(null);

            const wardsData = await getWards(Number(id));
            setWards(wardsData.data); // wardsData.data should be Ward[]
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phường/xã:', error);
        }
    };

    const handleSaveAddress = () => {
        if (!street || !selectedWard) {
            toast.error('Vui lòng nhập đầy đủ địa chỉ');
            return;
        }

        const fullAddress = `${street}, ${wardName}, ${districtName}, ${provinceName}`;
        setData('address', fullAddress);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Input id="address" placeholder="Nhập địa chỉ" value={data.address} readOnly />
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
                        onValueChange={setSelectedWard}
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
                            value={street as string}
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

export function AddressSelect({
    label,
    id,
    placeholder,
    items,
    onValueChange,
    disabled = false,
}: {
    label: string;
    id: string;
    placeholder: string;
    items?: { id: number; name: string }[] | null;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}) {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={id} className="text-right">
                {label}
            </Label>
            <Select onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger className="col-span-3">
                    <SelectValue id={id} placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {items?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search, Pencil, Trash2, Eye, QrCode } from 'lucide-react';
import { toast } from 'sonner';

type ProductWithUMKM = {
    id: number;
    name: string;
    unique_code: string;
    status: string;
    umkm_profiles: {
        name: string;
    } | null;
};

export default function ProductList({ initialProducts }: { initialProducts: ProductWithUMKM[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.unique_code.toLowerCase().includes(search.toLowerCase()) ||
        product.umkm_profiles?.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;

            setProducts(products.filter(p => p.id !== id));
            toast.success('Product deleted successfully!');
            router.refresh();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm sm:text-base">Manage your product catalog and QR codes.</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/products/create">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8 bg-white text-gray-900 border-gray-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm text-gray-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-900 font-semibold whitespace-nowrap">Product Name</TableHead>
                                <TableHead className="text-gray-900 font-semibold whitespace-nowrap">UMKM</TableHead>
                                <TableHead className="text-gray-900 font-semibold whitespace-nowrap">Unique Code</TableHead>
                                <TableHead className="text-gray-900 font-semibold whitespace-nowrap">Status</TableHead>
                                <TableHead className="text-right text-gray-900 font-semibold whitespace-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium text-gray-900 whitespace-nowrap">{product.name}</TableCell>
                                        <TableCell className="text-gray-700 whitespace-nowrap">{product.umkm_profiles?.name || 'Unknown'}</TableCell>
                                        <TableCell>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800 border border-gray-200 whitespace-nowrap">{product.unique_code}</code>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white border-gray-200">
                                                    <DropdownMenuLabel className="text-gray-900">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
                                                        <Link href={`/product/${product.unique_code}`} target="_blank">
                                                            <Eye className="mr-2 h-4 w-4" /> View Public Page
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
                                                        <Link href={`/admin/products/${product.id}/qr`}>
                                                            <QrCode className="mr-2 h-4 w-4" /> Generate QR
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-200" />
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={loading}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

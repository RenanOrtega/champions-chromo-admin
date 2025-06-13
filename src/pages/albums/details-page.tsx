"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateAlbum, getAlbumById } from "@/services/album";
import { getSchoolById } from "@/services/school";
import { type AlbumUpdateInput, albumUpdateForm } from "@/types/album";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Save, School, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ImageUploader } from "@/components/image-uploader";
import axios from "axios";

export default function DetailsPage() {
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Query para buscar os dados do álbum
    const { data: album, isLoading, error } = useQuery({
        queryKey: ['album', albumId],
        queryFn: () => getAlbumById(albumId!),
        enabled: !!albumId,
    });

    // Query para buscar os dados da escola
    const { data: school, isLoading: isLoadingSchool } = useQuery({
        queryKey: ['school', album?.schoolId],
        queryFn: () => getSchoolById(album!.schoolId),
        enabled: !!album?.schoolId,
    });

    // Mutation para atualizar o álbum
    const mutation = useMutation({
        mutationFn: (data: AlbumUpdateInput) => updateAlbum(albumId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            queryClient.invalidateQueries({ queryKey: ['album', albumId] });
            toast.success("Álbum atualizado com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao atualizar o álbum");
        }
    });

    const form = useForm<z.infer<typeof albumUpdateForm>>({
        resolver: zodResolver(albumUpdateForm),
        defaultValues: {
            name: "",
            coverImage: "",
            totalStickers: 0,
            hasA4: false,
            hasLegend: false,
            hasCommon: false,
            commonPrice: 1,
            legendPrice: 5,
            a4Price: 15
        },
    });

    // Atualiza o form quando os dados do álbum são carregados
    useEffect(() => {
        if (album) {
            form.reset({
                name: album.name,
                coverImage: album.coverImage,
                totalStickers: album.totalStickers,
                hasA4: album.hasA4,
                hasLegend: album.hasLegend,
                hasCommon: album.hasCommon,
                a4Price: album.a4Price,
                commonPrice: album.commonPrice,
                legendPrice: album.legendPrice
            });
        }
    }, [album, form]);

    const onSubmit = async (values: AlbumUpdateInput) => {
        startTransition(async () => {
            if (selectedFile) {
                const uploadedUrl = await uploadImage(selectedFile);
                values.coverImage = uploadedUrl;
            }
            mutation.mutate(values);
        });
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "album_upload");
        formData.append("folder", "figurinhas");

        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dshyu21tz/image/upload",
            formData
        );

        return response.data.secure_url;
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoSchool = () => {
        navigate(`/schools/${album?.schoolId}`)
    }

    const handleRemoveCurrentImage = () => {
        form.setValue("coverImage", "");
        setSelectedFile(null);
    };

    if (isLoading || isLoadingSchool) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Carregando...</div>
                </div>
            </div>
        );
    }

    if (error || !album) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">Erro ao carregar o álbum</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Button>
                <h1 className="text-2xl font-bold">Detalhes do Álbum</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            Editar Álbum
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Nome do álbum" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Seção de upload/preview da imagem */}
                                <div className="space-y-4">
                                    <FormLabel>Capa do Álbum</FormLabel>

                                    {form.watch("coverImage") && !selectedFile ? (
                                        // Mostra a imagem atual do álbum
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={form.watch("coverImage")}
                                                alt="Capa atual"
                                                className="w-12 h-12 object-cover rounded-lg border"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Imagem atual</p>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCurrentImage}
                                                    className="text-xs text-red-600 hover:text-red-800 underline cursor-pointer"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Mostra o uploader quando não há imagem ou foi removida
                                        <ImageUploader
                                            onFileSelect={setSelectedFile}
                                        />
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="totalStickers"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total de figurinhas</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    placeholder="Quantidade total de figurinhas"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Características</h3>
                                    <FormField
                                        control={form.control}
                                        name="hasCommon"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm font-medium">
                                                        Figurinhas Comuns
                                                    </FormLabel>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        Álbum contém figurinhas comuns
                                                    </p>
                                                    <FormField
                                                        control={form.control}
                                                        name="commonPrice"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Preço</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        placeholder="Preço da figurinha comum"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hasLegend"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm font-medium">
                                                        Figurinhas Legend
                                                    </FormLabel>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        Álbum contém figurinhas legends
                                                    </p>
                                                    <FormField
                                                        control={form.control}
                                                        name="legendPrice"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Preço</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        placeholder="Preço da figurinha legend"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hasA4"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm font-medium">
                                                        Figurinhas A4
                                                    </FormLabel>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        Álbum contém figurinhas em formato A4
                                                    </p>
                                                    <FormField
                                                        control={form.control}
                                                        name="a4Price"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Preço</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        placeholder="Preço da figurinha A4"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isPending || mutation.isPending}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isPending || mutation.isPending ? "Salvando..." : "Salvar alterações"}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGoBack}
                                        disabled={isPending || mutation.isPending}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="w-5 h-5" />
                                Informações da Escola
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Nome da Escola</h4>
                                    <p className="font-medium">{school?.name || 'Não informado'}</p>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Endereço</h4>
                                        {school?.city && school?.state && (
                                            <p className="text-sm text-muted-foreground">
                                                {school.city} - {school.state}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleGoSchool}>Ver escola</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
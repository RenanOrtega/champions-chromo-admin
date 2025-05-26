"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateAlbum, getAlbumById } from "@/services/album";
import { getSchoolById } from "@/services/school";
import { type AlbumCreateInput, type AlbumUpdateInput, albumUpdateForm } from "@/types/album";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Save, School, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function DetailsPage() {
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();

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
            });
        }
    }, [album, form]);

    const onSubmit = async (values: AlbumCreateInput) => {
        startTransition(async () => {
            mutation.mutate(values);
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoSchool = () => {
        navigate(`/schools/${album?.schoolId}`)
    }
    
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
            <div className="flex gap-6">
                <div className="flex-1">
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
                                    <FormField
                                        control={form.control}
                                        name="coverImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Link da imagem</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="URL da imagem de capa" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                                        <p className="text-sm text-muted-foreground">
                                                            Álbum contém figurinhas comuns
                                                        </p>
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
                                                        <p className="text-sm text-muted-foreground">
                                                            Álbum contém figurinhas legends
                                                        </p>
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
                                                        <p className="text-sm text-muted-foreground">
                                                            Álbum contém figurinhas em formato A4
                                                        </p>
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
                </div>

                <div className="w-96">
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
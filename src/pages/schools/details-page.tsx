"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Save, BookOpen, Book } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getSchoolById, updateSchool } from "@/services/school";
import { schoolUpdateForm, type SchoolUpdateInput } from "@/types/school";
import { getAlbumsBySchoolId } from "@/services/album";

export default function DetailsPage() {
    const { schoolId } = useParams<{ schoolId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();

    const { data: school, isLoading, error } = useQuery({
        queryKey: ['school', schoolId],
        queryFn: () => getSchoolById(schoolId!),
        enabled: !!schoolId,
    });

    const { data: albums, isLoading: isLoadingAlbums } = useQuery({
        queryKey: ['albums', 'schoolId', schoolId],
        queryFn: () => getAlbumsBySchoolId(schoolId!),
        enabled: !!schoolId,
    });

    // Mutation para atualizar o álbum
    const mutation = useMutation({
        mutationFn: (data: SchoolUpdateInput) => updateSchool(schoolId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schools'] });
            queryClient.invalidateQueries({ queryKey: ['school', schoolId] });
            toast.success("Escola atualizada com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao atualizar o escola");
        }
    });

    const form = useForm<z.infer<typeof schoolUpdateForm>>({
        resolver: zodResolver(schoolUpdateForm),
        defaultValues: {
            name: "",
            city: "",
            state: ""
        },
    });

    useEffect(() => {
        if (school) {
            form.reset({
                name: school.name,
                city: school.city,
                state: school.state
            });
        }
    }, [school, form]);

    const onSubmit = async (values: SchoolUpdateInput) => {
        startTransition(async () => {
            mutation.mutate(values);
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoAlbum = (albumId: string) => {
        navigate(`/albums/${albumId}`)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Carregando...</div>
                </div>
            </div>
        );
    }

    if (error || !school) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">Erro ao carregar a escola</div>
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
                <h1 className="text-2xl font-bold">Detalhes da Escola</h1>
            </div>
            <div className="flex gap-6">
                <div className="flex-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                Editar Escola
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
                                                    <Input {...field} placeholder="Nome da escola" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Estado da escola" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cidade</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Cidade da escola" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                <BookOpen className="w-5 h-5" />
                                Álbuns desta Escola
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingAlbums ? (
                                <div className="text-sm text-muted-foreground">Carregando álbuns...</div>
                            ) : !albums || albums.length === 0 ? (
                                <div className="text-sm text-muted-foreground">Nenhum álbum encontrado</div>
                            ) : (
                                <div className="space-y-2">
                                    {albums.map((album: any) => (
                                        <div
                                            key={album.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <Book />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{album.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {album.totalStickers} figurinhas
                                                </p>
                                            </div>
                                            <Button onClick={() => handleGoAlbum(album.id)}>
                                                Ver detalhes
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="pt-2 mt-4 border-t">
                                        <p className="text-xs text-muted-foreground text-center">
                                            Total: {albums.length} álbum{albums.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
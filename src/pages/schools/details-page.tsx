"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Save, BookOpen, Book, AlertTriangle, Palette } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getSchoolById, updateSchool } from "@/services/school";
import { schoolUpdateForm, type SchoolUpdateInput } from "@/types/school";
import { getAlbumsBySchoolId } from "@/services/album";

// Cores pré-definidas para o fundo do aviso
const warningColors = [
    { name: "Amarelo", value: "#fef3c7", text: "#92400e" },
    { name: "Vermelho", value: "#fecaca", text: "#991b1b" },
    { name: "Laranja", value: "#fed7aa", text: "#c2410c" },
    { name: "Azul", value: "#bfdbfe", text: "#1e40af" },
    { name: "Verde", value: "#bbf7d0", text: "#166534" },
    { name: "Roxo", value: "#e9d5ff", text: "#7c3aed" },
    { name: "Cinza", value: "#e5e7eb", text: "#374151" },
];

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
            state: "",
            warning: "",
            bgWarningColor: "#fef3c7"
        },
    });

    useEffect(() => {
        if (school) {
            form.reset({
                name: school.name,
                city: school.city,
                state: school.state,
                warning: school.warning || "",
                bgWarningColor: school.bgWarningColor || "#fef3c7"
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

    const warningValue = form.watch("warning");
    const bgWarningColorValue = form.watch("bgWarningColor");

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Carregando...</div>
                </div>
            </div>
        );
    }

    if (error || !school) {
        return (
            <div className="container mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">Erro ao carregar a escola</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Voltar</span>
                </Button>
                <h1 className="text-xl sm:text-2xl font-bold">Detalhes da Escola</h1>
            </div>

            <div className="space-y-6">
                {/* Preview do Aviso */}
                {warningValue && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertTriangle className="w-5 h-5" />
                                Preview do Aviso
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="p-4 rounded-md"
                                style={{
                                    backgroundColor: bgWarningColorValue,
                                    color: warningColors.find(c => c.value === bgWarningColorValue)?.text || "#374151"
                                }}
                            >
                                <p className="font-medium text-sm sm:text-base">{warningValue}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Layout responsivo: stack no mobile, grid no desktop */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        {/* Seção de Aviso */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <AlertTriangle className="w-5 h-5" />
                                    Mensagem de Aviso
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="warning"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mensagem</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Digite a mensagem de aviso que será exibida para os usuários desta escola..."
                                                            rows={4}
                                                            className="resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="bgWarningColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Palette className="w-4 h-4" />
                                                        Cor de Fundo
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                                            {warningColors.map((color) => (
                                                                <button
                                                                    key={color.value}
                                                                    type="button"
                                                                    onClick={() => field.onChange(color.value)}
                                                                    className={`
                                                                        p-2 sm:p-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer
                                                                        ${field.value === color.value
                                                                            ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                                                                            : 'border-gray-300 hover:border-gray-400'
                                                                        }
                                                                    `}
                                                                    style={{
                                                                        backgroundColor: color.value,
                                                                        color: color.text
                                                                    }}
                                                                >
                                                                    <span className="text-xs sm:text-sm font-medium">{color.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Formulário de Dados Básicos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Save className="w-5 h-5" />
                                    Editar Escola
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                                        
                                        {/* Grid responsivo para Estado e Cidade */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isPending || mutation.isPending}
                                                className="flex items-center gap-2 w-full sm:w-auto"
                                            >
                                                <Save className="w-4 h-4" />
                                                {isPending || mutation.isPending ? "Salvando..." : "Salvar alterações"}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleGoBack}
                                                disabled={isPending || mutation.isPending}
                                                className="w-full sm:w-auto"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar de Álbuns - se move para baixo no mobile */}
                    <div className="w-full lg:w-96">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
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
                                                <Book className="w-5 h-5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{album.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {album.totalStickers} figurinhas
                                                    </p>
                                                </div>
                                                <Button 
                                                    onClick={() => handleGoAlbum(album.id)}
                                                    size="sm"
                                                    className="flex-shrink-0"
                                                >
                                                    <span className="hidden sm:inline">Ver detalhes</span>
                                                    <span className="sm:hidden">Ver</span>
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
        </div>
    );
}
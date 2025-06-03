import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAlbum } from "@/services/album";
import { albumCreateForm, type AlbumCreateInput } from "@/types/album";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";

interface CreateFormProps {
    schoolId: string
}

export function CreateForm({ schoolId }: CreateFormProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const mutation = useMutation({
        mutationFn: (data: AlbumCreateInput) => createAlbum(data, schoolId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] })
            toast.success("Álbum criado com sucesso!")
            form.reset()
            setSelectedFile(null) // Limpar arquivo selecionado
        },
        onError: () => {
            toast.error("Erro ao criar Álbum")
        }
    })

    const form = useForm<z.infer<typeof albumCreateForm>>({
        resolver: zodResolver(albumCreateForm),
        defaultValues: {
            name: "",
            coverImage: "",
            totalStickers: 0,
            hasA4: false,
            hasLegend: false,
            hasCommon: false,
        },
    })

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

    const onSubmit = async (values: AlbumCreateInput) => {
        startTransition(async () => {
            try {
                let coverImageUrl = values.coverImage;

                // Se há um arquivo selecionado, fazer upload primeiro
                if (selectedFile) {
                    toast.loading("Enviando imagem...");
                    coverImageUrl = await uploadImage(selectedFile);
                    toast.dismiss();
                }

                // Criar o álbum com a URL da imagem
                const albumData = {
                    ...values,
                    coverImage: coverImageUrl
                };

                mutation.mutate(albumData);
            } catch (error) {
                toast.dismiss();
                toast.error("Erro ao enviar imagem!");
                console.error("Upload error:", error);
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ }) => (
                        <FormItem>
                            <FormLabel>Capa do Álbum</FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    <ImageUploader
                                        onFileSelect={setSelectedFile}
                                    />
                                </div>
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
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="hasCommon"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="leading-none">
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="leading-none">
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="leading-none">
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
                <Button disabled={isPending} type="submit">
                    {isPending ? "Criando..." : "Criar"}
                </Button>
            </form>
        </Form>
    )
}
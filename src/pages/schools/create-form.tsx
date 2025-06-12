import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSchool } from "@/services/school";
import { schoolCreateForm, type SchoolCreateInput } from "@/types/school";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { ImageUploader } from "@/components/image-uploader";

export function CreateForm() {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const mutation = useMutation({
        mutationFn: (data: SchoolCreateInput) => createSchool(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schools"] })
            toast.success("Escola criada com sucesso!")
            form.reset();
            setSelectedFile(null) // Limpar arquivo selecionado
        },
        onError: () => {
            toast.error("Erro ao criar Escola")
        }
    })

    const form = useForm<z.infer<typeof schoolCreateForm>>({
        resolver: zodResolver(schoolCreateForm),
        defaultValues: {
            name: "",
            city: "",
            state: "",
            shippingCost: 0
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

    const onSubmit = async (values: SchoolCreateInput) => {
        startTransition(async () => {
            try {
                let imageUrl = values.imageUrl;

                // Se há um arquivo selecionado, fazer upload primeiro
                if (selectedFile) {
                    toast.loading("Enviando imagem...");
                    imageUrl = await uploadImage(selectedFile);
                    toast.dismiss();
                }

                // Criar o álbum com a URL da imagem
                const schoolData = {
                    ...values,
                    imageUrl: imageUrl
                };

                mutation.mutate(schoolData);
            } catch (error) {
                toast.dismiss();
                toast.error("Erro ao enviar escola!");
                console.error("Upload error:", error);
            }
        })
    }

    return (
        <div className="space-y-4">
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
                        name="imageUrl"
                        render={({ }) => (
                            <FormItem>
                                <FormLabel>Capa da Escola</FormLabel>
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
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shippingCost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frete</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="Frete"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isPending || mutation.isPending} type="submit" className="w-full">
                        {(isPending || mutation.isPending) ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Criando...
                            </>
                        ) : (
                            "Criar Escola"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
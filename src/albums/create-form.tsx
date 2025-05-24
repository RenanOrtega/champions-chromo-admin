import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAlbum } from "@/services/album";
import { albumCreateForm, type AlbumCreateInput } from "@/types/album";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateFormProps {
    schoolId: string
}

export function CreateForm({schoolId}: CreateFormProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();

    const mutation = useMutation({
        mutationFn: (data: AlbumCreateInput) => createAlbum(data, schoolId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums']})
        }
    })

    const form = useForm<z.infer<typeof albumCreateForm>>({
        resolver: zodResolver(albumCreateForm),
        defaultValues: {
            name: "",
            coverImage: "",
            totalStickers: 0
        },
    })

    const onSubmit = async (values: AlbumCreateInput) => {
        startTransition(async () => {
            mutation.mutate(values);
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
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link imagem</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                <Button disabled={isPending} type="submit">Criar</Button>
            </form>
        </Form>
    )
}
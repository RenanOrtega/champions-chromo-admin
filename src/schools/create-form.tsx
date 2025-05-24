import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSchool } from "@/services/school";
import { schoolCreateForm, type SchoolCreateInput } from "@/types/school";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function CreateForm() {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();

    const mutation = useMutation({
        mutationFn: (data: SchoolCreateInput) => createSchool(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schools"] })
        }
    })

    const form = useForm<z.infer<typeof schoolCreateForm>>({
        resolver: zodResolver(schoolCreateForm),
        defaultValues: {
            name: "",
            city: "",
            state: "",
        },
    })

    const onSubmit = async (values: SchoolCreateInput) => {
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
                <Button disabled={isPending} type="submit">Criar</Button>
            </form>
        </Form>
    )
}
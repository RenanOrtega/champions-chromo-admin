import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createCupom } from "@/services/cupom";
import { cupomCreateForm, type CupomCreateInput } from "@/types/cupom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function CreateForm() {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();

    const mutation = useMutation({
        mutationFn: (data: CupomCreateInput) => createCupom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cupoms'] })
            toast.success("Cupom criado com sucesso!")
            form.reset()
        },
        onError: () => {
            toast.error("Erro ao criar Cupom")
        }
    })

    const form = useForm<z.infer<typeof cupomCreateForm>>({
        resolver: zodResolver(cupomCreateForm),
        defaultValues: {
            code: "",
            isActive: false,
            minPurchaseValue: 0,
            type: "",
            usageLimit: 0,
            value: 0,
        },
    })

    const selectedType = form.watch("type");

    const onSubmit = async (values: CupomCreateInput) => {
        startTransition(async () => {
            mutation.mutate(values);
        })
    }

    return (
        <Form {...form}>
            <div className="max-h-[70vh] overflow-y-auto pr-2">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Tipo do Cupom</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-2 rounded-md border p-2">
                                            <RadioGroupItem value="percent" id="percent" />
                                            <FormLabel htmlFor="percent" className="text-sm cursor-pointer">
                                                Porcentagem
                                            </FormLabel>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md border p-2">
                                            <RadioGroupItem value="fixed" id="fixed" />
                                            <FormLabel htmlFor="fixed" className="text-sm cursor-pointer">
                                                Fixo
                                            </FormLabel>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md border p-2">
                                            <RadioGroupItem value="freeShipping" id="freeShipping" />
                                            <FormLabel htmlFor="freeShipping" className="text-sm cursor-pointer">
                                                Frete Grátis
                                            </FormLabel>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo Value - aparece apenas para 'fixed' e 'percent' */}
                    {(selectedType === "fixed" || selectedType === "percent") && (
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {selectedType === "fixed" ? "Valor (R$)" : "Porcentagem (%)"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            {...field} 
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="minPurchaseValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor Mín. (R$)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            {...field} 
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="usageLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Limite de Uso</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            {...field} 
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm">
                                    Cupom Ativo
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button disabled={isPending} type="submit" className="w-full">
                        Criar
                    </Button>
                </form>
            </div>
        </Form>
    )
}
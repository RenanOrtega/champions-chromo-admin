import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { loginSchema, type LoginFormInput } from "@/types/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/use-auth"
import { useNavigate } from "react-router"
import { useState } from "react"
export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const auth = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    
    const form = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormInput) => {
        const success = await auth.login(values.username, values.password);
        if (success) {
            navigate('/');
        } else {
            setError('Usuário ou senha inválidos');
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Digite seu usuário abaixo para acessar sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usuário</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite seu usuário" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Digite sua senha" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Entrar
                            </Button>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
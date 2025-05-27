import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { getMetrics } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Album, School } from "lucide-react";
import { Link } from "react-router";

export default function HomePage() {
    const { user } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['metrics'],
        queryFn: getMetrics,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Carregando métricas...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg text-red-500">Erro ao carregar métricas</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <span className="text-2xl font-bold">Bom dia, {user?.username}</span>
            <span className="text-sm text-gray-600 mb-10">Administrador</span>
            <div className="flex flex-col gap-7">
                <div className="flex gap-5">
                    <Card className={cn("w-[300px]")}>
                        <CardHeader>
                            <CardTitle><School width={30} height={30} /></CardTitle>
                            <CardDescription>Total de Escolas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data?.schoolsCount}

                        </CardContent>
                        <CardFooter>
                            <Link to="/schools">
                                <Button variant="outline"><School /> Ver Escolas</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                    <Card className={cn("w-[300px]")}>
                        <CardHeader>
                            <CardTitle><Album width={30} height={30} /></CardTitle>
                            <CardDescription>Total de Álbuns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data?.albumsCount}
                        </CardContent>
                        <CardFooter>
                            <Link to="/albums">
                                <Button variant="outline" className="w-full">
                                    <School /> Ver Álbuns
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
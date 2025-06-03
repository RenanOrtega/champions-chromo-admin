import { useState } from "react";
import { Input } from "./ui/input";
import { ImageUp } from "lucide-react";

export function ImageUploader({
    onFileSelect
}: {
    onFileSelect: (file: File | null) => void;
}) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setPreview(null);
            onFileSelect(null);
            return;
        }

        // Criar preview local
        setPreview(URL.createObjectURL(file));
        // Passar o arquivo para o componente pai
        onFileSelect(file);
    };

    return (
        <div className="space-y-3">
            {!preview ? (
                <label className="flex items-center justify-center w-full h-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <div className="flex items-center space-x-2">
                        <ImageUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Selecionar imagem</span>
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            ) : (
                <div className="flex items-center space-x-3">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Imagem selecionada</p>
                        <button
                            type="button"
                            onClick={() => {
                                setPreview(null);
                                onFileSelect(null);
                            }}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                        >
                            Remover
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
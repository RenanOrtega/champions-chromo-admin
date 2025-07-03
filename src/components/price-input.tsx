import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

interface PriceInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const PriceInput = ({ value, onChange, disabled = false, className = "" }: PriceInputProps) => {
    const [displayValue, setDisplayValue] = useState('');

    const formatNumberToDisplay = (num: number) => {
        if (num === 0) return '';
        return num.toString().replace('.', ',');
    };

    const parseDisplayValue = (str: string) => {
        if (!str || str.trim() === '') return 0;
        const cleanStr = str.trim().replace(',', '.');
        const parsed = parseFloat(cleanStr);
        return isNaN(parsed) ? 0 : parsed;
    };

    useEffect(() => {
        setDisplayValue(formatNumberToDisplay(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const regex = /^[0-9]*[,.]?[0-9]*$/;

        if (regex.test(inputValue) || inputValue === '') {
            setDisplayValue(inputValue);
            const numericValue = parseDisplayValue(inputValue);
            onChange(numericValue);
        }
    };

    const handleBlur = () => {
        const numericValue = parseDisplayValue(displayValue);
        setDisplayValue(formatNumberToDisplay(numericValue));
    };

    return (
        <Input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={className}
        />
    );
};

export default PriceInput;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, PRESETS, startOfDay, toInputDate, type DateRangeValue, type PeriodPreset } from "@/lib/date-range";

type Props = {
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
};

export function DateRangeFilter({ value, onChange }: Props) {
    const invalidRange =
        value.preset === "custom" &&
        !!value.customFrom &&
        !!value.customTo &&
        value.customFrom > value.customTo;

    const selectPreset = (preset: PeriodPreset) => {
        if (preset === "custom" && !value.customFrom && !value.customTo) {
            // Começa o personalizado com os últimos 30 dias para não ficar vazio
            const today = startOfDay(new Date());
            onChange({ preset, customFrom: toInputDate(addDays(today, -29)), customTo: toInputDate(today) });
            return;
        }
        onChange({ ...value, preset });
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                {PRESETS.map(preset => (
                    <Button
                        key={preset.value}
                        size="sm"
                        variant={value.preset === preset.value ? "default" : "outline"}
                        onClick={() => selectPreset(preset.value)}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>

            {value.preset === "custom" && (
                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="period-from">De</Label>
                        <Input
                            id="period-from"
                            type="date"
                            className="w-44"
                            value={value.customFrom}
                            max={value.customTo || undefined}
                            onChange={e => onChange({ ...value, customFrom: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="period-to">Até</Label>
                        <Input
                            id="period-to"
                            type="date"
                            className="w-44"
                            value={value.customTo}
                            min={value.customFrom || undefined}
                            onChange={e => onChange({ ...value, customTo: e.target.value })}
                        />
                    </div>
                    {invalidRange && (
                        <span className="text-sm text-red-500 pb-2">A data inicial deve ser anterior à final.</span>
                    )}
                </div>
            )}
        </div>
    );
}

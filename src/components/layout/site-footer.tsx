"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCityPreference } from "@/hooks/use-city-preference";
import {
  allTurkeyCityValue,
  cityOptions,
  type CitySelectValue,
} from "@/lib/cities";

export function SiteFooter() {
  const { selectedCityValue, setSelectedCityValue } = useCityPreference();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={selectedCityValue}
          onValueChange={(value) =>
            setSelectedCityValue(value as CitySelectValue)
          }
        >
          <SelectTrigger
            size="sm"
            className="w-full bg-background text-foreground sm:w-44"
            aria-label="Etkinlik şehri"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={allTurkeyCityValue}>Tüm Türkiye</SelectItem>
            {cityOptions.map((city) => (
              <SelectItem key={city.id} value={`${city.id}`}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-1 sm:items-end">
          <p>Etkinlikleri keşfet ve yerini ayır.</p>
          <p className="font-medium text-foreground">Event Labs</p>
        </div>
      </div>
    </footer>
  );
}

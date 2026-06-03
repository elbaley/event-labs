import { useCallback, useEffect, useState } from "react";
import {
  allTurkeyCityValue,
  parseCityId,
  toCitySelectValue,
  type CityId,
  type CitySelectValue,
} from "@/lib/cities";

const cityPreferenceStorageKey = "event-labs.city-id";
const cityPreferenceEventName = "event-labs:city-preference-change";

function readStoredCityId(): CityId | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return parseCityId(
    window.localStorage.getItem(cityPreferenceStorageKey) ?? undefined,
  );
}

function writeStoredCityId(cityId: CityId | undefined) {
  if (cityId === undefined) {
    window.localStorage.removeItem(cityPreferenceStorageKey);
  } else {
    window.localStorage.setItem(cityPreferenceStorageKey, `${cityId}`);
  }

  window.dispatchEvent(new Event(cityPreferenceEventName));
}

export function useCityPreference() {
  const [selectedCityId, setSelectedCityId] = useState<CityId | undefined>();

  useEffect(() => {
    function syncPreference() {
      setSelectedCityId(readStoredCityId());
    }

    syncPreference();
    window.addEventListener(cityPreferenceEventName, syncPreference);
    window.addEventListener("storage", syncPreference);

    return () => {
      window.removeEventListener(cityPreferenceEventName, syncPreference);
      window.removeEventListener("storage", syncPreference);
    };
  }, []);

  const setSelectedCityValue = useCallback((value: CitySelectValue) => {
    const cityId =
      value === allTurkeyCityValue ? undefined : parseCityId(value);

    setSelectedCityId(cityId);
    writeStoredCityId(cityId);
  }, []);

  return {
    selectedCityId,
    selectedCityValue: toCitySelectValue(selectedCityId),
    setSelectedCityValue,
  };
}

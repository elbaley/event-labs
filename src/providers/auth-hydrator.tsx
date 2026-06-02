import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth } from "@/store/slices/authSlice";

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}

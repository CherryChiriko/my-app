import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDecks, selectDeckStatus } from "../../slices/deckSlice";

export default function DecksLoader({ session, authLoading }) {
  const dispatch = useDispatch();
  const status = useSelector(selectDeckStatus);

  useEffect(() => {
    if (!authLoading && session && status === "idle") {
      dispatch(fetchDecks());
    }
  }, [authLoading, session, status, dispatch]);

  return null;
}

import {useContext, useEffect} from "react";
import ajax from "./ajax";
import {Context} from "../index";

export default function useAsync(path, actionFn) {
  const {state, dispatch} = useContext(Context);
  useEffect(() => {
    ajax(path).then(response => {
      dispatch(actionFn(response))
    });
  }, []);

  return {state, dispatch}
}


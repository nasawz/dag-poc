import * as api from '../api'
import useSWR, { mutate } from "swr";


export function useTreeNodes() {
    const KEY = `TreeNodes`;
    const { data }: any = useSWR(KEY, null, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      initialData: null,
    });
  
    const getTreeNodes = async () => {
      const res = await api.getTreeNodes()
      console.log(res);
      
    //   const data = api.parseRes(res);
    //   mutate(KEY, data.data, false);
      return res.data;
    };

  
    return {
      data,
      getTreeNodes,
    };
  }
  
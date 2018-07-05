import { HTTP, TIPS } from "@/libs";

export function getOpernList() {
  TIPS.loading('获取列表')
  return HTTP.get('opern').then((res) => {
    TIPS.loaded()
    return res
  })
}
import { enumToObject } from "src/common/utils";

export enum PLUGIN_ROUTE_NAME {
  WinboxPage = 10000,
  RivePage,
  MdPage,
  PdfPage,
  MusicPage,
  ShikitorPage,
}

export const PLUGIN_ROUTE_ID = enumToObject(PLUGIN_ROUTE_NAME);

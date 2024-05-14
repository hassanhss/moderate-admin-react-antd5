import antd from "./default";
import pluginThemeMap from "plugins/config/themes";

const themeMap = {
	antd,
	...pluginThemeMap,
};

export type ThemeMapkey = keyof typeof themeMap;
export default themeMap;

import { ConfigProvider, theme as antdTheme } from "antd";
import React, { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { useFlat } from "src/service";
import themeMap from "src/theme";

const ThemeProvider = (props: React.PropsWithChildren) => {
	const { children } = props;
	const { themeMode, settingData, setCurrentTheme, currentTheme } =
		useFlat("appStore");
	// 监听设备的主题
	const isSysDark = useMediaQuery(
		{
			query: "(prefers-color-scheme: dark)",
		},
		undefined,
		(isSystemDark: boolean) => {
			const newValue = isSystemDark ? "dark" : "light";
			if (themeMode == "auto") {
				setCurrentTheme(newValue);
			}
		},
	);

	// 如果是auto，那么就跟随系统
	const isDark = useMemo(() => {
		const isDarkValue =
			themeMode == "auto" ? isSysDark : currentTheme == "dark";
		setCurrentTheme(isDarkValue ? "dark" : "light");
		return isDarkValue;
	}, [isSysDark]);

	const themePlan =
		themeMap[settingData!?.paletteSet![isDark ? "dark" : "light"]]?.(
			isDark,
		) || themeMap.antd(isDark);
	const themeConfig = {
		algorithm: isDark ? [antdTheme.darkAlgorithm] : [],
		...themePlan,
	};
	return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};
export default ThemeProvider;

import {StyleSheet} from "react-native";

import {SettingsSelectorItem} from "../SettingsItem";
import SettingsSection from "../SettingsSection";

import {AppSettings, useAppData} from "@/context/AppDataContext";

interface SponsorBlockSelection {
  key: string;
  label: string;
}

const options: {[key: string]: SponsorBlockSelection} = {
  enabled: {key: "enabled", label: "Enabled"},
  disabled: {key: "disabled", label: "Disabled"},
};

export default function SponsorBlockSelector() {
  const {appSettings, updateSettings} = useAppData();

  const onPress = (type: SponsorBlockSelection) => {
    updateSettings({sponsorBlockEnabled: type.key === "enabled"});
  };

  return (
    <SettingsSection style={styles.container} sectionTitle={"SponsorBlock"}>
      {Object.values(options).map(v => (
        <SettingsSelectorItem
          key={v.key}
          label={v.label}
          selected={parseSelection(appSettings).key === v.key}
          onPress={() => onPress(v)}
        />
      ))}
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "#111111",
  },
});

export function parseSelection(appSettings: AppSettings) {
  return appSettings.sponsorBlockEnabled ? options["enabled"] : options["disabled"];
}

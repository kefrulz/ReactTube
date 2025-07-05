import {useNavigation} from "@react-navigation/native";
import {Icon} from "@rneui/base";
import React, {forwardRef, useCallback, useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity, TVFocusGuideView} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {NativeStackProp} from "./types";

import {useAccountContext} from "@/context/AccountContext";
import {useAppStyle} from "@/context/AppStyleContext";

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  hideDrawer: SharedValue<boolean>;
}

export default function Drawer({open, onOpen, onClose, hideDrawer}: Props) {
  const account = useAccountContext();

  useEffect(() => {
    openDrawer.value = open;
  }, [open]);

  const openDrawer = useSharedValue(open);

  const style = useAnimatedStyle(() => {
    return {
      height: "100%",
      width: withTiming(hideDrawer.value ? 0 : openDrawer.value ? 300 : 150),
      paddingStart: withTiming(hideDrawer.value ? 0 : 40),
    };
  });

  const navigation = useNavigation<NativeStackProp>();

  const navigationWrapper = useCallback(
    (fkt: () => void) => {
      return () => {
        onClose();
        fkt();
      };
    },
    [onClose],
  );

  return (
    <TVFocusGuideView autoFocus>
      <Animated.View style={[styles.container, style]}>
        <DrawerItem
          title={"Home"}
          onFocus={() => onOpen()}
          start
          onPress={navigationWrapper(() =>
            // @ts-ignore
            navigation.navigate("Home", {screen: "HomeFeed"}),
          )}
          open={open}
          iconTitle={"home"}
        />
        <DrawerItem
          title={"Trending"}
          onFocus={() => onOpen()}
          onPress={navigationWrapper(() =>
            // @ts-ignore
            navigation.navigate("Home", {screen: "TrendingScreen"}),
          )}
          open={open}
          iconTitle={"trending-up"}
        />
        <DrawerItem
          title={"Search"}
          onFocus={() => onOpen()}
          onPress={() => navigation.navigate("Search")}
          open={open}
          iconTitle={"search"}
        />
        {account?.loginData?.accounts?.length > 0 ? (
          <>
            <DrawerItem
              title={"Subscriptions"}
              onFocus={() => onOpen()}
              onPress={() =>
                // @ts-ignore TODO: fix
                navigation.navigate("Home", {screen: "SubscriptionScreen"})
              }
              open={open}
              iconTitle={"subscriptions"}
            />
            <DrawerItem
              title={"History"}
              onFocus={() => onOpen()}
              onPress={() =>
                // @ts-ignore TODO: fix
                navigation.navigate("Home", {screen: "HistoryScreen"})
              }
              open={open}
              iconTitle={"history"}
            />
            <DrawerItem
              title={"Library"}
              onFocus={() => onOpen()}
              onPress={() =>
                // @ts-ignore TODO: fix
                navigation.navigate("Home", {screen: "LibraryScreen"})
              }
              open={open}
              iconTitle={"library"}
              iconType={"ionicon"}
            />
            <DrawerItem
              title={"MyYoutube"}
              onFocus={() => onOpen()}
              onPress={() =>
                // @ts-ignore TODO: fix
                navigation.navigate("Home", {screen: "MyYoutubeScreen"})
              }
              open={open}
              iconTitle={"youtube-tv"}
              iconType={"material-community"}
            />
          </>
        ) : (
          <DrawerItem
            title={"Login"}
            onFocus={() => onOpen()}
            onPress={() => navigation.navigate("LoginScreen")}
            open={open}
            iconTitle={"login"}
          />
        )}
        <DrawerItem
          bottom
          title={"Settings"}
          onFocus={() => onOpen()}
          onPress={() => navigation.navigate("SettingsScreen")}
          open={open}
          iconTitle={"settings"}
        />
      </Animated.View>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingStart: 40,
    backgroundColor: "#1C1C1E",
  },
});

interface ItemProps {
  title: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  start?: boolean;
  bottom?: boolean;
  iconTitle?: string;
  iconType?: string;
  open: boolean;
}

const DrawerItem = forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ItemProps
>(
  (
    {title, onFocus, onBlur, onPress, start, bottom, iconTitle, iconType, open},
    ref,
  ) => {
    const {style} = useAppStyle();
    const [focus, setFocus] = useState(false);

    const textStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(open ? 1 : 0),
      };
    });

    return (
      <TouchableOpacity
        style={[
          itemStyles.container,
          start || bottom
            ? {flex: 1, justifyContent: start ? "flex-end" : "flex-start"}
            : {},
        ]}
        onPress={onPress}
        onFocus={() => {
          setFocus(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocus(false);
          onBlur?.();
        }}>
        <Animated.View
          style={itemStyles.viewContainer}
          entering={FadeIn}
          exiting={FadeOut}>
          {iconTitle ? (
            <Icon name={iconTitle} type={iconType} color={"white"} size={30} />
          ) : null}
          {open ? (
            <Animated.Text
              numberOfLines={1}
              style={[itemStyles.text, {color: style.textColor}, textStyle]}>
              {title}
            </Animated.Text>
          ) : null}
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

const itemStyles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 0,
  },
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    paddingStart: 15,
    fontFamily: "System",
  },
});

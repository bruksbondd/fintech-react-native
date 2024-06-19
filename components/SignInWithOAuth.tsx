import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Alert, Button, Text, TouchableOpacity } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

type SignInWithOAuthProps = {
  strategy: "oauth_google" | "oauth_apple";
};

const SignInWithOAuth = ({ strategy }: SignInWithOAuthProps) => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: strategy });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      if (err) {
        Alert.alert("Error", err as any);
      }
    }
  }, []);

  return (
    <TouchableOpacity
      
      onPress={onPress}
      style={[
        defaultStyles.pillButton,
        {
          flexDirection: "row",
          gap: 16,
          marginTop: 20,
          backgroundColor: "#fff",
        },
      ]}
    >
      {strategy === "oauth_apple" ? (
        <Ionicons name="logo-google" size={24} color={"#000"} />
      ) : (
        <Ionicons name="logo-apple" size={24} color={"#000"} />
      )}
      <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
        Continue with email
      </Text>
    </TouchableOpacity>
  );
};
export default SignInWithOAuth;

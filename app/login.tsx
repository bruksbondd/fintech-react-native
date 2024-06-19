import SignInWithOAuth from "@/components/SignInWithOAuth";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

const Page = () => {
  const [type, setType] = useState("phone");
  const [countryCode, setCountryCode] = useState("+38");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signIn, setActive, isLoaded  } = useSignIn();

  const onSignIn = async (type: SignInType) => {
    if (!isLoaded) {
      return;
    }
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });
        const firstPhoneFactor: any = supportedFirstFactors.find(
          (factor: any) => {
            return factor.strategy === "phone_code";
          }
        );

        const { phoneNumberId } = firstPhoneFactor;

        await signIn!.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });

        router.push({
          pathname: "/verify/[phone]",
          params: { phone: fullPhoneNumber, signin: "true" },
        });
      } catch (err) {
        console.log("error", JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code === "form_identifier_not_found") {
            Alert.alert("Error", err.errors[0].message);
          }
        }
      }
    }
    if (type === SignInType.Email) {
      try {
       
        const completeSignIn = await signIn!.create({
          identifier: email,
        });
        // This is an important step,
        // This indicates the user is signed in
        await setActive({ session: completeSignIn.createdSessionId });

        router.push({
          pathname: "/verify/[phone]",
          params: { phone: email, signin: "true" },
        });
      } catch (err) {
        console.log("error", JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code === "form_identifier_not_found") {
            Alert.alert("Error", err.errors[0].message);
          }
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>

        {type === "phone" ? (
          <View>
            <Text style={defaultStyles.descriptionText}>
              Enter the phone number associated with your account
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Country code"
                placeholderTextColor={Colors.gray}
                value={countryCode}
                onChangeText={setCountryCode}
              />
              <TextInput
                style={[styles.input, { flex: 5 }]}
                placeholder="Mobile number"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <TouchableOpacity
              style={[
                defaultStyles.pillButton,
                phoneNumber !== "" ? styles.enabled : styles.disabled,
                { marginBottom: 20 },
              ]}
              onPress={() => onSignIn(SignInType.Phone)}
            >
              <Text style={defaultStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={defaultStyles.descriptionText}>
              Enter the email associated with your account
            </Text>
            <View style={styles.inputContainer}>
            
              <TextInput
                autoCapitalize="none"
                style={[styles.input, { flex: 1 }]}
                placeholder="Email"
                placeholderTextColor={Colors.gray}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={[
                defaultStyles.pillButton,
                email !== "" ? styles.enabled : styles.disabled,
                { marginBottom: 20 },
              ]}
              onPress={() => onSignIn(SignInType.Email)}
            >
              <Text style={defaultStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>

        {type === "phone" ? (
          <TouchableOpacity
            onPress={() => setType("email")}
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
            <Ionicons name="mail" size={24} color={"#000"} />
            <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
              Continue with email
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setType("phone")}
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
            <Ionicons name="mail" size={24} color={"#000"} />
            <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
              Continue with phone number
            </Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity
          onPress={() => onSignIn(SignInType.Google)}
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
          <Ionicons name="logo-google" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with email
          </Text>
        </TouchableOpacity> */}

        <SignInWithOAuth strategy={"oauth_google"} />

        <SignInWithOAuth strategy={"oauth_apple"} />

        {/* <TouchableOpacity
          onPress={() => onSignIn(SignInType.Apple)}
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
          <Ionicons name="logo-apple" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with email
          </Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
export default Page;

import React from "react";
import { View } from "react-native";
import { COLORS } from "../../theme";
import { Button } from "../Button";
import { styles } from './styles';
import { useAuth } from '../../hook/auth';

export function SignInBox(){
  const { signIn, isSigningIn } = useAuth();
  return (
    <View style={styles.container}>
      <Button
        color={COLORS.BLACK_SECONDARY}
        backgroundColor={COLORS.YELLOW}
        title="ENTRAR COM GITHUB"
        icon="github"
        onPress={signIn}
        isLoading={isSigningIn}
      />
    </View>
  );
}
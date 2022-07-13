import { ConnectButton as RainbowConnectButton} from "@rainbow-me/rainbowkit";
import {
  Box,
  Button,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useAccount } from 'wagmi';
import { useEffect } from "react";
import useLogInWallet from "hooks/useLogInWallet";

const styles = {
  loginButton: {
    padding: 2,
    width: "100%",
  },
  buttonContainer: {
    opacity: 0,
    pointerEvents: "none",
    userSelect: "none"
  }
};

const CustomButton = ({
  clickHandler,
  content,
  isDisabled
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(450));

  return (
    <Button
    size={isMobile ? "medium" : "large"}
    variant="contained"
    onClick={clickHandler}
    sx={styles.loginButton}
    disabled={isDisabled}
  >
      {content}
    </Button>
  );
}

export default function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { startSupertrueLoginFlow, isLoggedIn } = useLogInWallet();

  useEffect(()=> {
    if (isConnected && !isLoggedIn) startSupertrueLoginFlow(address);
  }, [
    isConnected,
    isLoggedIn,
    startSupertrueLoginFlow,
    address,
  ]);

  const isDisabled = isConnected || isConnected && isLoggedIn;
  const buttonContent = "Log in with Web3 wallet";

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
      return (
        <Box styles={!mounted && styles.buttonContainer}>
          {(() => {
            if (!mounted || !account || !chain) {
              return (
                <CustomButton
                  isDisabled={isDisabled}
                  clickHandler={openConnectModal}
                  content={buttonContent}
                />
              );
            }

            if (chain.unsupported) {
              return (
                <CustomButton
                  isDisabled={isDisabled}
                  clickHandler={openChainModal}
                  content="Wrong network"
                />
              );
            }

            return (
              <CustomButton
                isDisabled={isDisabled}
                clickHandler={openAccountModal}
                content={buttonContent}
              />
            );
            })()}
          </Box>
        );
      }}
    </RainbowConnectButton.Custom>
  )
};
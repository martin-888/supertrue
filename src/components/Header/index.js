import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import {
  Box,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import useLogInWallet from "../../hooks/useLogInWallet";
import { useAppContext } from "contexts/app";
import logo from "./logo.png";

const ME_QUERY = gql`
  query me {
    me {
      id
      address
      collection {
        id
        name
        artistId
        username
      }
    }
  }
`;

const pages = [
  { name: "Posts", url: "/account/posts" },
  { name: "NFTs", url: "/account/nfts" },
  { name: "Settings", url: "/account/settings" },
];

const MenuLinkItem = ({ to, onClick, title, sx }) => (
  <MenuItem
    to={to}
    component={Link}
    onClick={onClick}
    sx={{ display: "flex", justifyContent: "flex-end" }}
  >
    <Typography
      textTransform="uppercase"
      sx={{
        textAlign: "center",
        display: "flex",
        justifyContent: "flex-end",
        ...(sx || {}),
      }}
    >
      {title}
    </Typography>
  </MenuItem>
);

const Header = () => {
  const { magic } = useAppContext();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down(450));
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout } = useLogInWallet();

  const address = localStorage.getItem("address");
  const { data } = useQuery(ME_QUERY);
  const me = data?.me;
  const isLoggedIn = me?.address && address === me.address;
  const { address: connectedAddress } = useAccount();

  useEffect(() => {
    if (isLoggedIn && address !== connectedAddress?.toLowerCase()) {
      magic.user.isLoggedIn().then(isLoggedInViaMagic => {
        if (!isLoggedInViaMagic) logout();
      });
    }
  }, [isLoggedIn, address, connectedAddress, logout]);

  const renderMenu = () => {
    const currentPathStrings = location.pathname.split("/");

    if (!isLoggedIn) {
      return (
        <Button
          size={isMobile ? "medium" : "large"}
          variant="contained"
          href="/account/login"
        >
          Log In
        </Button>
      );
    }

    if (!me?.collection) {
      return (
        <>
          {!isMobile && (
            <Button
              variant="outlined"
              size="medium"
              href="/account/new"
              sx={{ marginRight: "1em" }}
            >
              Create Profile
            </Button>
          )}

          <IconButton
            onClick={(e) => setAnchorElUser(e.currentTarget)}
            sx={{ p: 0 }}
          >
            <AccountCircle
              style={{ width: "38px", height: "38px", color: "#111" }}
            />
          </IconButton>
          <Menu
            sx={{ mt: "45px", justifyContent: "flex-end" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={!!anchorElUser}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography
                textTransform="uppercase"
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                  opacity: 0.5,
                }}
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </Typography>
            </MenuItem>
            {isMobile && (
              <MenuLinkItem
                to="/account/new"
                title="Create Profile"
                onClick={() => setAnchorElUser(null)}
                sx={{ justifyContent: "flex-end" }}
              />
            )}
            <MenuLinkItem
              to="/account/nfts"
              title="NFTs"
              onClick={() => setAnchorElUser(null)}
            />
            <MenuItem sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography
                onClick={async () => {
                  magic.user
                    .isLoggedIn()
                    .then(async (isLoggedIn) => {
                      if (isLoggedIn) {
                        await magic.user.logout();
                        localStorage.removeItem("token");
                        localStorage.removeItem("address");
                      }
                    })
                    .then(() => logout());
                }}
                textTransform="uppercase"
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </>
      );
    }

    return (
      <>
        <IconButton
          onClick={(e) => setAnchorElUser(e.currentTarget)}
          sx={{ p: 0 }}
        >
          <AccountCircle
            style={{ width: "38px", height: "38px", color: "#111" }}
          />
        </IconButton>
        <Menu
          sx={{ mt: "45px", justifyContent: "flex-end" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={!!anchorElUser}
          onClose={() => setAnchorElUser(null)}
        >
          <MenuItem sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography
              textTransform="uppercase"
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "flex-end",
                opacity: 0.5,
              }}
            >
              {address.slice(0, 6)}...{address.slice(-4)}
            </Typography>
          </MenuItem>
          <MenuItem
            to={`/${me.collection.username}`}
            component={Link}
            onClick={() => setAnchorElUser(null)}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              textTransform="uppercase"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {me.collection.name}
            </Typography>
          </MenuItem>
          {pages.map((setting) => (
            <MenuLinkItem
              key={setting.name}
              to={setting.url}
              title={setting.name}
              onClick={() => setAnchorElUser(null)}
            />
          ))}
          <MenuItem sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography
              onClick={logout}
              textTransform="uppercase"
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      style={{ boxShadow: "none", paddingTop: 5, marginBottom: 40 }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{
              mr: 1,
              display: {
                xs: "flex",
                fontSize: "3rem",
              },
            }}
          >
            <Link to="/" style={{ display: "flex" }}>
              <Box
                underline="none"
                sx={{
                  width: isMobile ? 153 : 180,
                  height: isMobile ? 17 : 20,
                  display: "inline-block",
                  background: `url(${logo})`,
                  textDecoration: "none",
                  backgroundSize: "contain",
                }}
              />
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            {location.pathname !== "/account/login" && renderMenu()}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

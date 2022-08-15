import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "@remix-run/react";
import { gql, useQuery } from "@apollo/client";
import { AccountCircle } from "@mui/icons-material";
import { useAccount } from "wagmi";
import {
  Box,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Container,
  Button,
  AppBar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useAppContext } from "~/contexts/app";
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

type MenuLinkItemPros = {
  to: any;
  onClick: any;
  title: any;
  sx?: any;
};

const MenuLinkItem = ({ to, onClick, title, sx }: MenuLinkItemPros) => (
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

type HeaderProps = {
  address?: string;
};

const Header = ({ address }: HeaderProps) => {
  const { magic } = useAppContext();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const account = useAccount();
  const isMobile = useMediaQuery(theme.breakpoints.down(450));
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!address);

  const isLoginLogoutPage =
    location.pathname.indexOf("/account/login") !== -1 ||
    location.pathname.indexOf("/account/logout") !== -1;

  const { data } = useQuery(ME_QUERY);
  const me = data?.me;

  useEffect(() => {
    // logout when addresses don't match
    magic.user.isLoggedIn().then(async (loggedIn) => {
      if (loggedIn) {
        const metadata = await magic.user.getMetadata();
        setIsLoggedIn(address === metadata?.publicAddress?.toLowerCase());
      } else {
        setIsLoggedIn(
          !!(address && address === account?.address?.toLowerCase())
        );
      }

      if (isLoginLogoutPage) {
        return;
      }

      if (loggedIn) {
        const metadata = await magic.user.getMetadata();

        if (address !== metadata?.publicAddress?.toLowerCase()) {
          navigate("/account/logout");
        }
      } else if (account.address?.toLowerCase() !== address) {
        navigate("/account/logout");
      }
    });
  }, [account?.address, address]);

  const renderMenu = () => {
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
                {address!.slice(0, 6)}...{address!.slice(-4)}
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
            <MenuLinkItem
              to="/account/logout"
              title="Logout"
              onClick={() => setAnchorElUser(null)}
            />
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
              {address!.slice(0, 6)}...{address!.slice(-4)}
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
          <MenuItem
            to={`/account/logout`}
            component={Link}
            onClick={() => setAnchorElUser(null)}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
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
            {location.pathname === "/account/login/callback" ? (
              <Box style={{ display: "flex" }}>
                <Box
                  sx={{
                    width: isMobile ? 153 : 180,
                    height: isMobile ? 17 : 20,
                    display: "inline-block",
                    background: `url(${logo})`,
                    textDecoration: "none",
                    backgroundSize: "contain",
                  }}
                />
              </Box>
            ) : (
              <Link to="/" style={{ display: "flex" }}>
                <Box
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
            )}
          </Typography>
          <Box sx={{ flexGrow: 0 }}>{!isLoginLogoutPage && renderMenu()}</Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

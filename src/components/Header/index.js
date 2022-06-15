import React, { useMemo } from "react";
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import useLogInWallet from "../../hooks/useLogInWallet";

import logo from "./logo.png";

const ME_QUERY = gql`
  query me($address: ID!) {
    dbMe {
        id
        address
    }
    me: user(id: $address) {
      collection {
        name
        artistId
      }
    }
  }
`;

const pages = [
  { name: "Edit Profile", url: "/profile" },
  { name: "Post", url: "/post" },
];

const Logo = () => {
  return (
    <Link to="/">
      <Box
        underline="none"
        sx={{
          width: 180,
          height: 20,
          display: "inline-block",
          background: `url(${logo})`,
          textDecoration: "none",
          backgroundSize: "contain",
        }}
      />
    </Link>
  );
};

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(450));
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { login, logging, logout } = useLogInWallet();

  const address = localStorage.getItem("address");
  const { data } = useQuery(ME_QUERY, {
    variables: { address },
    skip: !address,
  });

  const me = useMemo(
    () => ({
      ...data?.dbMe,
      ...data?.me,
    }),
    [data]
  );

  const isLoggedIn = address && me?.address && address === me.address;

  const renderMenu = () => {
    if (!isLoggedIn) {
      return (
        <Button
          size={"large"}
          variant="contained"
          onClick={login}
          disabled={logging}
        >
          Connect Wallet
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
              href={"/new"}
              sx={{ marginRight: "1em" }}
            >
              Create Profile
            </Button>
          )}

          <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
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
            <MenuItem
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Typography
                textTransform="uppercase"
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                  opacity: 0.5
                }}
              >
                {address.slice(0,6)}...{address.slice(-4)}
              </Typography>
            </MenuItem>
            {isMobile && (
              <MenuItem
                to={`/new`}
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
                  Create Profile
                </Typography>
              </MenuItem>
            )}
            <MenuItem
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
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
    }

    return (
      <>
        <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
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
          <MenuItem
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              textTransform="uppercase"
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "flex-end",
                opacity: 0.5
              }}
            >
              {address.slice(0,6)}...{address.slice(-4)}
            </Typography>
          </MenuItem>
          <MenuItem
            to={`/s/${me.collection.artistId}`}
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
            <MenuItem
              key={setting.name}
              to={setting.url}
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
                {setting.name}
              </Typography>
            </MenuItem>
          ))}
          <MenuItem
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
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
            <Logo />
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            {renderMenu()}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

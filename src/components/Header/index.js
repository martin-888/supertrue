import React from "react";
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
import { useLocation } from "react-router-dom";

import useLogInWallet from "../../hooks/useLogInWallet";
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
      }
    }
  }
`;

const pages = [
  { name: "Posts", url: "/posts" },
  { name: "NFTs", url: "/nfts" },
  { name: "Settings", url: "/settings" },
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
        ...(sx || {})
      }}
    >
      {title}
    </Typography>
  </MenuItem>
);

const Header = ({magic}) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down(450));
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout } = useLogInWallet();

  const address = localStorage.getItem("address");
  const { data } = useQuery(ME_QUERY);

  const me = data?.me;
  const isLoggedIn = me?.address && address === me.address;

  const renderMenu = () => {
    if (!isLoggedIn) {
      return (
        <Button
          size={isMobile ? "medium" : "large"}
          variant="contained"
          href="/login"
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
              href="/new"
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
              <MenuLinkItem
                to="/new"
                title="Create Profile"
                onClick={() => setAnchorElUser(null)}
                sx={{ justifyContent: "flex-end" }}
              />
            )}
            <MenuLinkItem
              to="/nfts"
              title="NFTs"
              onClick={() => setAnchorElUser(null)}
            />
            <MenuItem
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
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
            <MenuLinkItem
              key={setting.name}
              to={setting.url}
              title={setting.name}
              onClick={() => setAnchorElUser(null)}
            />
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
            {location.pathname !== "/login" && renderMenu()}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

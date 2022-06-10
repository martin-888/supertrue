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
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";

import useWeb3Modal from "../../hooks/useWeb3Modal";
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
      }
    }
  }
`;

//SearchBar
// import { styled, alpha } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';

// const pages = ['Products', 'Pricing', 'Blog'];
const pages = [
  // {name:'Artists', url:'/'},
  // {name:'New Artist', url:'/artist/new'},
  // {name:'Search', url:'/search'},
  // {name:'Gallery', url:'/gallery'},
];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const settings = [
  { name: "Artist Profile", url: "/profile" },
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
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { account, logoutOfWeb3Modal } = useWeb3Modal();
  const { login, loggingIn, loginError } = useLogInWallet();

  const address = localStorage.getItem("address");
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
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

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /* Possible Search Stuff   https://mui.com/components/app-bar/
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        },
    }));
*/

  const logout = async () => {
    await logoutOfWeb3Modal();
    localStorage.removeItem("token");
    localStorage.removeItem("address");
  }

  return (
    <AppBar
      position="static"
      color="transparent"
      style={{ boxShadow: "none", paddingTop: 5 }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{
              mr: 12,
              display: {
                xs: "none",
                md: "flex",
                fontSize: "3rem",
              },
            }}
          >
            <Logo />
          </Typography>

          {/*
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          */}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="false"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link key={page.name} to={page.url}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Logo />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link key={page.name} to={page.url} underline="none">
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{ mx: 1, px: 2, py: 1.5, display: "block" }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!isLoggedIn ? (
              <Button
                size={"large"}
                variant="contained"
                onClick={login}
                disabled={loggingIn}
              >
                Connect Wallet
              </Button>
            ) : !me?.collection ? (
              <>
                <Button size="large" href={"/new-artist"}>
                  Artist Sign Up
                </Button>
                {/*TODO show menu with logout button*/}
              </>
            ) : (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
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
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Typography
                    textTransform="uppercase"
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      pl: "16px",
                      pr: "16px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {me?.collection?.name}
                  </Typography>
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      to={setting.url}
                      component={Link}
                      onClick={handleCloseUserMenu}
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
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

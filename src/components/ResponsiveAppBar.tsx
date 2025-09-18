import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import zIndex from "@mui/material/styles/zIndex";
import BiotechIcon from "@mui/icons-material/Biotech";
import { useRecoilState } from "recoil";
import { atomCrntIsDebug, atomCrntScrollY } from "../atoms/atoms";
import { StepState } from "../common/interface";
import { makeHSLRandomColor } from "../common/utils";

const pages = ["Intro", "Learn", "Contact"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ResponsiveAppBar() {
  // DomContents 랑 ResponsiveAppBar 의 Dom 의 Z-index 을 올려서
  //  3D 물체에 가려지지 않게 만들어야함
  const [, setCrntScrollY] = useRecoilState<StepState>(atomCrntScrollY);
  const [crntIsDebug, setCrntIsDebug] =
    useRecoilState<boolean>(atomCrntIsDebug);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [bgColor, setBgColor] = React.useState<null | string>(null);

  React.useEffect(() => {
    setBgColor(makeHSLRandomColor(true));
  }, []);

  const toggleDebug = () => {
    setCrntIsDebug(!crntIsDebug);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event: any, page: string) => {
    let scrollY = 0;

    switch (page) {
      case "Intro":
        break;
      case "Learn":
        scrollY = window.innerHeight + 1;
        break;
      case "Contact":
        scrollY = window.innerHeight * 2.0;
        break;
    }
    setCrntScrollY(scrollY);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2,
        backgroundColor: bgColor,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BiotechIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Code137.5
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={(e: any) => handleCloseNavMenu(e, page)}
                >
                  <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <BiotechIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Code137.5
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={(e: any) => handleCloseNavMenu(e, page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box>
            <Button
              onClick={toggleDebug}
              sx={
                crntIsDebug
                  ? {
                      my: 2,
                      color: "black",
                      display: "block",
                      backgroundColor: "white",
                    }
                  : {
                      my: 2,
                      color: "#999",
                      display: "block",
                      backgroundColor: "#777",
                    }
              }
            >
              Debug Mode
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

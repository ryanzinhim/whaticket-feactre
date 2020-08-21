import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MainListItems from "./MainListItems";
import AccountCircle from "@material-ui/icons/AccountCircle";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import openSocket from "socket.io-client";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		height: "100vh",
	},

	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: "0 8px",
		minHeight: "48px",
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: "none",
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: "hidden",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: {
		minHeight: "48px",
	},
	content: {
		flex: 1,
		overflow: "auto",
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
}));

const MainDrawer = ({ appTitle, children }) => {
	const { handleLogout } = useContext(AuthContext);
	const classes = useStyles();
	const [open, setOpen] = useState(true);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const menuOpen = Boolean(anchorEl);
	const drawerState = localStorage.getItem("drawerOpen");

	const history = useHistory();
	const userId = +localStorage.getItem("userId");
	const { ticketId } = useParams();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (!("Notification" in window)) {
			console.log("This browser doesn't support notifications");
		} else {
			Notification.requestPermission();
		}
	}, []);

	useEffect(() => {
		if (drawerState === "0") {
			setOpen(false);
		}
	}, [drawerState]);

	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
		socket.emit("joinNotification");

		socket.on("appMessage", data => {
			if (data.action === "create") {
				if (
					(ticketId &&
						data.message.ticketId === +ticketId &&
						document.visibilityState === "visible") ||
					(data.ticket.userId !== userId && data.ticket.userId)
				)
					return;
				showDesktopNotification(data);
			}
		});

		return () => {
			socket.disconnect();
		};
	}, [history, ticketId, userId]);

	const showDesktopNotification = ({ message, contact, ticket }) => {
		const options = {
			body: `${message.body} - ${format(new Date(), "HH:mm")}`,
			icon: contact.profilePicUrl,
			tag: ticket.id,
		};
		let notification = new Notification(
			`${i18n.t("tickets.notification.message")} ${contact.name}`,
			options
		);

		notification.onclick = function (event) {
			event.preventDefault(); //
			window.open(`/chat/${ticket.id}`, "_self");
		};

		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") {
				notification.close();
			}
		});

		document.getElementById("sound").play();
	};

	const handleDrawerOpen = () => {
		setOpen(true);
		localStorage.setItem("drawerOpen", 1);
	};
	const handleDrawerClose = () => {
		setOpen(false);
		localStorage.setItem("drawerOpen", 0);
	};

	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className={classes.root}>
			<Drawer
				variant="permanent"
				classes={{
					paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
				}}
				open={open}
			>
				<div className={classes.toolbarIcon}>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List>
					<MainListItems />
				</List>
				<Divider />
			</Drawer>
			<AppBar
				position="absolute"
				className={clsx(classes.appBar, open && classes.appBarShift)}
				color={process.env.NODE_ENV === "development" ? "secondary" : "primary"}
			>
				<Toolbar variant="dense" className={classes.toolbar}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						className={clsx(
							classes.menuButton,
							open && classes.menuButtonHidden
						)}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						component="h1"
						variant="h6"
						color="inherit"
						noWrap
						className={classes.title}
					>
						{appTitle}
					</Typography>
					<IconButton color="inherit">
						<Badge badgeContent={0} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton>

					<div>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={menuOpen}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>Profile</MenuItem>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />

				{children ? children : null}
			</main>
			<audio id="sound" preload="auto">
				<source src={require("../../assets/sound.mp3")} type="audio/mpeg" />
				<source src={require("../../assets/sound.ogg")} type="audio/ogg" />
				<embed hidden={true} autostart="false" loop={false} src="./sound.mp3" />
			</audio>
		</div>
	);
};

export default MainDrawer;